#!/usr/bin/env bash
# UC-013: cria a branch do caso de uso e uma branch por task (nome do integrante na frente).
# BASE padrão: feature/uc-001-cadastrar-conta (precisa ter a T00 integrada). Se o UC-001 já está na main: BASE=main
# Uso (na raiz do repositório, em quem tem permissão de push):
#   bash trabalho-final/scripts/criar-branches-uc-013.sh            # cria tudo
#   bash trabalho-final/scripts/criar-branches-uc-013.sh matheus    # só as branches do Matheus
#   bash trabalho-final/scripts/criar-branches-uc-013.sh --dry-run  # mostra o que faria
set -euo pipefail

BASE="${BASE:-feature/uc-001-cadastrar-conta}"
INTEGRACAO="feature/uc-013-criar-pedido-desculpa"

# integrante/TNN-slug
BRANCHES=(
  "isabella/P01-dominio-pedido"
  "isabella/P02-servico-criar-rascunho"
  "isabella/P03-testes-servico"
  "carolina/P04-repositorios-sqlite"
  "carolina/P05-endpoint-pedidos"
  "carolina/P06-endpoints-apoio"
  "matheus/P07-formulario-pedido"
  "matheus/P08-validacao-destinatario-cancelar"
  "matheus/P09-testes-formulario"
  "gabriela/P10-cliente-api-hook"
  "gabriela/P11-pagina-criar-pedido"
  "gabriela/P12-testes-integracao-api"
  "isabella/P13-documentacao-final"
)

DRY=0
FILTRO=""
for arg in "$@"; do
  case "$arg" in
    --dry-run) DRY=1 ;;
    *) FILTRO="$arg" ;;
  esac
done

run() { if [ "$DRY" -eq 1 ]; then echo "[dry-run] $*"; else "$@"; fi; }

git rev-parse --is-inside-work-tree >/dev/null 2>&1 || { echo "Rode dentro do repositório atividades_aps."; exit 1; }
cd "$(git rev-parse --show-toplevel)"
git remote get-url origin >/dev/null 2>&1 || { echo "Remote 'origin' não configurado."; exit 1; }

if ! git diff --quiet HEAD; then
  echo "Há alterações em arquivos já versionados. Faça commit ou stash antes."; exit 1
fi

run git fetch origin

# 1) Branch do caso de uso, com a documentação e o template de PR
if git show-ref --verify --quiet "refs/heads/$INTEGRACAO"; then
  echo "Branch $INTEGRACAO já existe localmente; reaproveitando."
  run git checkout "$INTEGRACAO"
else
  run git checkout -b "$INTEGRACAO" "origin/$BASE"
fi

if [ -n "$(git status --porcelain trabalho-final .github 2>/dev/null)" ]; then
  run git add trabalho-final .github
  run git commit -m "docs(repo): plano, especificação do UC-013, contrato da API e backlog do Jira"
fi
run git push -u origin "$INTEGRACAO"

# 2) Uma branch por task, a partir da branch do caso de uso
for b in "${BRANCHES[@]}"; do
  dono="${b%%/*}"
  if [ -n "$FILTRO" ] && [ "$FILTRO" != "$dono" ]; then continue; fi
  if git show-ref --verify --quiet "refs/heads/$b"; then
    echo "Já existe: $b"
  else
    run git branch "$b" "$INTEGRACAO"
  fi
  run git push -u origin "$b"
done

run git checkout "$INTEGRACAO"
echo
echo "Pronto. Cada integrante agora faz:"
echo "  git fetch origin && git checkout <sua-branch>"
echo "e abre o PR da sua branch para $INTEGRACAO."
