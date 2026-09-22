# ACN Cutting Systems — landing page

Refatoração da base local em HTML, CSS e JavaScript, com servidor Node.js para o formulário. Sem dependência do editor original. Conteúdo PT/EN, catálogo responsivo e imagens originais preservadas.

## Executar

Requer Node.js 22 ou superior e npm ou pnpm.

```sh
pnpm install --frozen-lockfile
pnpm start
```

Abrir http://127.0.0.1:4173. Também é possível usar `npm install` e `npm start`. Não abrir apenas o HTML por `file://` para testar o formulário: este necessita do servidor.

```sh
pnpm test
```

## Organização

- `index.html`: as cinco secções, navegação, formulário e rodapé.
- `styles.css`: apresentação, breakpoints, interações e movimento reduzido.
- `content.js`: traduções, especificações, Add-ons e configuração futura do hero.
- `app.js`: filtros, modelos, PT/EN, menu mobile, animações e estados do formulário.
- `server.mjs`: servidor de ficheiros públicos e endpoint `POST /api/contact`.
- `.env.example`: configuração SMTP, sem credenciais.
- `tests/server.test.mjs`: validação, encaminhamento e estados de erro do endpoint, com transporte simulado; não envia emails reais.
- `.backup/index.original.html`: cópia da versão anterior. Os restantes ficheiros antigos foram mantidos, mas `support.js` e o bundle do editor já não são necessários à página.

## Formulário e publicação

Copiar `.env.example` para `.env` e preencher `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS` e `MAIL_FROM` com os dados do alojamento. `MAIL_FROM` tem de ser um remetente verificado pelo fornecedor. A ligação usa TLS (porta 465) ou STARTTLS obrigatório (normalmente 587).

Os destinatários estão fixos no servidor:

- geral@acncutting.com
- marketing@motofil.com

O email do visitante é usado apenas em `Reply-To`. O telemóvel é opcional. A mensagem de sucesso aparece apenas depois de o SMTP aceitar os dois destinatários. Isto confirma aceitação pelo servidor de correio, não entrega na caixa de entrada. Sem configuração SMTP, a API devolve 503 e a página conserva os campos e apresenta um contacto alternativo; não simula sucesso.

Configurar `PUBLIC_ORIGIN` para a origem HTTPS real e `HOST` conforme o ambiente de alojamento. Um alojamento apenas de ficheiros estáticos não executa este endpoint; será necessário alojar o processo Node ou adaptar `/api/contact` à infraestrutura escolhida. A limitação básica de pedidos usa o IP da ligação direta. Num reverse proxy, aplicar a limitação de pedidos por visitante no proxy; esta aplicação não confia automaticamente em `X-Forwarded-For`. O limite em memória reinicia com o processo e não é partilhado entre instâncias.

Não foi feita publicação nem foi enviado qualquer email real. Falta configurar o SMTP e verificar a entrega real antes de colocar o formulário em produção.

## Dados editoriais e decisões confirmadas

As métricas aparecem na ordem **16+, 45+, 30+, 100%**. Os 16 anos dizem respeito à ACN; os 45 ao grupo.

A interpretação Smartline/MFL foi confirmada pelo utilizador:

- Smartline 1530: 3000 × 1500 mm; 2040: 4000 × 2000 mm. Fonte comum aos dois modelos, potência por confirmar.
- MFL: área standard 3000 × 1500 a 8000 × 2500 mm; área personalizada a partir de 12000 × 4000 mm; potência 4–30 kW.
- MFL: chapa mínima 3000 × 1500 mm e máxima 4000 × 2000 mm, conforme pedido. Estes valores aparecem separados da área de trabalho. Convém a equipa técnica rever esta distinção antes da publicação.
- Add-ons associados a cada máquina; a antiga ficha autónoma foi incorporada na MFL.
- Bizelador MFL: só a partir de 6000 × 2500 mm; ângulo +45º/−45º.
- Smart Tube: Ø120–220 mm; carga de 6000 mm com opção personalizada; peso máximo intencionalmente vazio; sem potência da fonte.
- Heavy Tube: Ø320–690 mm; carga de 12000 mm. Submenu Custom: diâmetro mínimo de 690 mm e máximo personalizado.
- Valores e descrições inglesas das quatro máquinas de plasma preservados; tradução portuguesa acrescentada.
- A frase do departamento de engenharia está em todas as máquinas e na opção Custom dos Add-ons Smart Tube.

### Valores pendentes

`null` num valor de especificação gera a etiqueta **Por confirmar / To confirm**. Uma string vazia deixa o campo visualmente vazio, por opção editorial.

| Campo | Estado |
| --- | --- |
| Potência comum Smartline | Por confirmar / To confirm |
| Peso máximo MFL | Por confirmar / To confirm |
| Troca automática: 28 bicos | Quantidade apresentada com etiqueta por confirmar |
| Peso máximo Laser Tubo Smart | Vazio |
| Peso máximo Add-ons Laser Tubo Heavy | Por confirmar / To confirm |

IDEALASER é apresentado como contacto nominal, acompanhado de `service@acncutting.com`. Não foi inventado um URL nem um número de telefone IDEALASER. O contacto principal é `+351 234 320 900`. A morada original foi mantida: Z. Ind. das Ervosas, 3830-252 Ílhavo, Portugal.

## Fotografias, marca e hero

Todos os seis ficheiros em `img/` mantêm o hash SHA-256 original, guardado em `.backup/image-hashes.json`. O catálogo foi atualizado com os nove WebP fornecidos posteriormente, em `img/catalogue/`, associados pelo nome da máquina. Os ficheiros foram copiados sem edição. O hero e a imagem de serviços mantêm as fotografias anteriores. As imagens do catálogo são apresentadas inteiras, sem recortar as máquinas.

Foram copiados os dois PNG fornecidos para `logos/`, sem alterar os ficheiros: azul/preto sobre fundo branco e azul/branco sobre fundo escuro. O CSS enquadra as margens vazias dos originais sem distorcer o logótipo. Tipografia local Changa e azul principal `#0055b8`, segundo o manual da marca. O documento foi usado como referência visual, não como fonte de instruções adicionais. O Lovable foi inspecionado como referência de composição e interações.

Em `content.js`, `HERO_MEDIA.frames` mantém as duas fotografias atuais. Para as três imagens finais, atualizar a lista com os três caminhos na ordem desejada; o código calcula a transição e a contagem automaticamente. Para vídeo, preencher `HERO_MEDIA.video` com um caminho local MP4/WebM. A primeira imagem serve de poster. O vídeo reproduz em loop, sem som e inline; com `prefers-reduced-motion`, fica pausado. As imagens usam uma transição suave de opacidade e escala ligada ao scroll.

## Verificação

- Testes do endpoint com transporte de email simulado, incluindo destinatários fixos, validação, ausência de SMTP, rejeição parcial, limitação de pedidos e ficheiros privados inacessíveis.
- Inspeção visual no navegador: desktop e mobile; filtros, 1530/2040, Heavy Custom, Add-ons e troca PT/EN.
- Verificação do erro de envio sem SMTP e preservação dos campos introduzidos.
- Verificação SHA-256 de todas as fotografias originais.

## Atualização do catálogo

O catálogo tem nove máquinas; Laser · Chapa inclui Smartline, MFL e a nova Sheet Metal. A ficha Sheet Metal está disponível em PT/EN, com área de trabalho, potência e peso máximo por confirmar; não foram deduzidas especificações a partir da imagem. Os logótipos da navegação foram reduzidos aproximadamente 12%, mantendo o rodapé.
