<!--
Título do PR: [PNN][CSC-xx] Nome da task
Base: feature/uc-013-criar-pedido-desculpa (só o PR final da P13 vai para a main)
-->

## Task
- Task: PNN — <nome da task>
- Jira: [CSC-xx](https://uem-team-rgets2wn.atlassian.net/browse/CSC-xx)
- Responsável: <integrante>
- Revisor: <integrante> (ver o painel em `Trabalho Final/docs/plano-uc-013.md`)

## O que foi feito
<!-- Resumo curto das mudanças, em tópicos. -->
-

## Critérios de aceite / cenários cobertos
<!-- Ex.: CA-013.1 / CT-013.1, fluxo A5, E1... -->
-

## Como testar
```bash
cd "Trabalho Final/backend"    # ou "Trabalho Final/frontend"
npm install
npm test
npm run lint
```

## Evidências
<!-- Saída dos testes, prints ou GIF. -->

## Checklist (Definition of Done)
- [ ] Critérios de aceite da task verificados
- [ ] `npm test` passando
- [ ] `npm run lint` passando
- [ ] Commits no formato `tipo(escopo): descrição [PNN] [CSC-xx]`
- [ ] Nenhuma senha, token ou `.env` no PR
- [ ] Documentação atualizada (se mudou contrato ou comportamento)
- [ ] Item do Jira em "Em análise", com o link deste PR
