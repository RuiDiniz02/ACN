import test from 'node:test';
import assert from 'node:assert/strict';
import {once} from 'node:events';
import {createApp,RECIPIENTS,validateContact} from '../server.mjs';

const valid = {name:'Teste ACN',email:'qa@example.com',company:'Test',phone:'',message:'Pedido de teste local.',language:'pt'};
async function withServer(options,run) {
  const server = createApp(options); server.listen(0,'127.0.0.1'); await once(server,'listening');
  const base = `http://127.0.0.1:${server.address().port}`;
  const post = (data=valid,headers={}) => fetch(`${base}/api/contact`,{method:'POST',headers:{'Content-Type':'application/json',...headers},body:JSON.stringify(data)});
  try {await run({base,post});} finally {server.closeAllConnections(); await new Promise(resolve => server.close(resolve));}
}
test('validates optional phone, malformed email, lengths and header injection',() => {
  assert.equal(validateContact(valid).phone,'');
  assert.equal(validateContact({...valid,email:'invalid'}),null);
  assert.equal(validateContact({...valid,email:'a@b.com\r\nBcc: other@b.com'}),null);
  assert.equal(validateContact({...valid,name:'a'.repeat(101)}),null);
  assert.equal(validateContact({...valid,message:'  '}),null);
  assert.equal(validateContact({...valid,phone:123}),null);
});
test('routes to the fixed marketing recipient and ignores submitted recipient overrides', async () => {
  let captured;
  await withServer({env:{MAIL_FROM:'web@acncutting.com'},transport:{sendMail:async message => {captured=message; return {accepted:[...RECIPIENTS]};}}},async({post}) => {
    const res = await post({...valid,to:'attacker@example.com',phone:'+351 900 000 000'});
    assert.equal(res.status,200); assert.deepEqual(await res.json(),{ok:true});
      assert.deepEqual(captured.to,['marketing@motofil.com']);
    assert.equal(captured.replyTo,'qa@example.com'); assert.equal(captured.from,'web@acncutting.com');
    assert.match(captured.text,/\+351 900 000 000/);
  });
});
test('does not claim success without SMTP or after partial rejection',async() => {
  await withServer({env:{},transport:null},async({post}) => {assert.equal((await post()).status,503);});
    await withServer({env:{},transport:{sendMail:async()=>({accepted:[]})}},async({post}) => {assert.equal((await post()).status,502);});
});
test('blocks spam, cross-origin posts, invalid data and excess attempts',async() => {
  let sends=0;
  await withServer({env:{PUBLIC_ORIGIN:'https://acn.example'},rateLimit:2,transport:{sendMail:async()=>{sends++;return {accepted:RECIPIENTS};}}},async({post}) => {
    assert.equal((await post(valid,{Origin:'https://other.example'})).status,403);
    assert.equal((await post({...valid,website:'spam.example'})).status,400);
    assert.equal((await post({...valid,email:'invalid'})).status,400);
    assert.equal((await post()).status,429); assert.equal(sends,0);
  });
});
test('serves public assets but never source, credentials or backups',async() => {
  await withServer({env:{},transport:null},async({base}) => {
    for (const file of ['/', '/content.js', '/styles.css', '/img/smartline-1530.png']) assert.equal((await fetch(base+file)).status,200);
    for (const file of ['/.env','/server.mjs','/.backup/index.original.html','/node_modules/nodemailer/package.json','/img/../server.mjs']) assert.equal((await fetch(base+file)).status,404);
    assert.equal((await fetch(base+'/api/contact')).status,405);
  });
});
