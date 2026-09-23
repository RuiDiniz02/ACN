import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import nodemailer from 'nodemailer';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
export const RECIPIENTS = Object.freeze(['marketing@motofil.com']);
const MIME = {'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.jpg':'image/jpeg','.png':'image/png','.webp':'image/webp','.svg':'image/svg+xml','.ttf':'font/ttf','.woff2':'font/woff2','.mp4':'video/mp4','.webm':'video/webm'};
const emailPattern = /^[^\s@<>\r\n]+@[^\s@<>\r\n]+\.[^\s@<>\r\n]+$/;
export function validateContact(data) {
  if (!data || typeof data !== 'object' || Array.isArray(data)) return null;
  const limits = {name:100,company:160,email:254,phone:40,message:5000,website:200};
  const clean = {};
  for (const [key,max] of Object.entries(limits)) {
    if (data[key] !== undefined && typeof data[key] !== 'string') return null;
    const value = (data[key] ?? '').trim();
    if (value.length > max || /\0/.test(value)) return null;
    if (key !== 'message' && /[\r\n]/.test(value)) return null;
    clean[key] = value;
  }
  if (!clean.name || !emailPattern.test(clean.email) || clean.message.length < 4) return null;
  clean.language = data.language === 'en' ? 'en' : 'pt';
  return clean;
}
export function makeMessage(data, from) {
  return {from, to:[...RECIPIENTS], replyTo:data.email, subject:'ACN | Pedido de contacto / Contact enquiry',
    text:`Nome / Name: ${data.name}\nEmpresa / Company: ${data.company || '—'}\nEmail: ${data.email}\nTelemóvel / Mobile: ${data.phone || '—'}\nIdioma / Language: ${data.language}\n\n${data.message}`};
}
function smtpTransport(env) {
  if (!env.SMTP_HOST || !env.SMTP_USER || !env.SMTP_PASS || !env.MAIL_FROM) return null;
  return nodemailer.createTransport({host:env.SMTP_HOST,port:Number(env.SMTP_PORT || 587),secure:env.SMTP_SECURE === 'true',requireTLS:env.SMTP_SECURE !== 'true',auth:{user:env.SMTP_USER,pass:env.SMTP_PASS},connectionTimeout:8000,greetingTimeout:8000,socketTimeout:15000});
}
export function createApp({env=process.env,transport=smtpTransport(env),rateLimit=5}={}) {
  const attempts = new Map();
  function json(res,status,payload) { res.writeHead(status,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store'}); res.end(JSON.stringify(payload)); }
  return http.createServer(async (req,res) => {
    res.setHeader('X-Content-Type-Options','nosniff');
    res.setHeader('Referrer-Policy','strict-origin-when-cross-origin');
    res.setHeader('Content-Security-Policy',"default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self'; font-src 'self'; media-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'none'; form-action 'self'");
    let pathname;
    try { pathname = decodeURIComponent(new URL(req.url,'http://localhost').pathname); } catch { return json(res,400,{ok:false}); }
    if (pathname === '/api/contact') {
      if (req.method !== 'POST') {res.setHeader('Allow','POST'); return json(res,405,{ok:false});}
      const allowedOrigin = env.PUBLIC_ORIGIN || `http://${req.headers.host}`;
      if (req.headers.origin && req.headers.origin !== allowedOrigin) return json(res,403,{ok:false});
      if (!(req.headers['content-type'] || '').startsWith('application/json')) return json(res,415,{ok:false});
      const now = Date.now();
      for (const [key,entry] of attempts) if (now-entry.start > 600000) attempts.delete(key);
      // Direct peer only: never trust client-supplied X-Forwarded-For headers.
      const key = req.socket.remoteAddress;
      const entry = attempts.get(key) || {start:now,count:0};
      if (entry.count >= rateLimit) {res.setHeader('Retry-After','600'); return json(res,429,{ok:false});}
      entry.count++; attempts.set(key,entry);
      const chunks = []; let bytes = 0;
      try {
        for await (const chunk of req) {bytes += chunk.length; if (bytes > 32768) {json(res,413,{ok:false}); req.resume(); return;} chunks.push(chunk);}
        const data = validateContact(JSON.parse(Buffer.concat(chunks).toString('utf8')));
        if (!data) return json(res,400,{ok:false});
        if (data.website) return json(res,400,{ok:false});
        if (!transport) return json(res,503,{ok:false,code:'MAIL_NOT_CONFIGURED'});
        const result = await transport.sendMail(makeMessage(data,env.MAIL_FROM));
        const accepted = new Set((result.accepted || []).map(address => String(address).toLowerCase()));
        if (!RECIPIENTS.every(address => accepted.has(address))) return json(res,502,{ok:false});
        return json(res,200,{ok:true});
      } catch (error) {
        if (error instanceof SyntaxError) return json(res,400,{ok:false});
        // Avoid logging visitor data, SMTP credentials or transport error objects.
        console.error('Contact delivery failed.'); return json(res,502,{ok:false});
      }
    }
    if (!['GET','HEAD'].includes(req.method)) {res.setHeader('Allow','GET, HEAD'); return json(res,405,{ok:false});}
    const relative = pathname === '/' ? 'index.html' : pathname.replace(/^\//,'');
    const allowed = ['index.html','styles.css','content.js','app.js'].includes(relative) || /^(img|logos|_ds)\/[\w\-./ ]+$/.test(relative);
    if (!allowed || relative.split('/').some(part => part === '..' || part.startsWith('.')) || relative.includes('\\')) return json(res,404,{ok:false});
    const file = path.resolve(ROOT,relative);
    if (!file.startsWith(ROOT+path.sep)) return json(res,404,{ok:false});
    try {
      const data = await readFile(file);
      res.writeHead(200,{'Content-Type':MIME[path.extname(file)] || 'application/octet-stream','Cache-Control':'no-cache'});
      res.end(req.method === 'HEAD' ? undefined : data);
    } catch {json(res,404,{ok:false});}
  });
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const port = Number(process.env.PORT || 4173); const host = process.env.HOST || '127.0.0.1';
  createApp().listen(port,host,() => console.log(`ACN preview: http://${host}:${port}`));
}
