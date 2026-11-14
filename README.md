# Quest Quiz

Site de missões em forma de quiz: complete quests, acerte perguntas e acumule pontos para subir de nível. Feito só com HTML, CSS e JavaScript (sem dependências). O progresso fica salvo no navegador (`localStorage`).

## Como rodar
Abra o `index.html` no navegador.

## Publicar no GitHub Pages
1. Crie um repositório no GitHub e envie estes arquivos:
   ```
   git init && git add . && git commit -m "Primeira versão"
   git branch -M main
   git remote add origin https://github.com/SEU-USUARIO/quest-quiz.git
   git push -u origin main
   ```
2. No repositório: **Settings → Pages → Branch: main / root → Save**.
3. O site ficará em `https://SEU-USUARIO.github.io/quest-quiz/`.

## Criar suas próprias missões
Edite a lista `QUESTS` no topo do `script.js`. Cada pergunta tem o texto (`q`), as opções (`o`) e o índice da resposta certa (`a`, começando em 0). Pontos e níveis também são configuráveis ali.
