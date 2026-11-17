#!/usr/bin/env bash
# UC-013: cria (ou atualiza) a branch de integração e uma branch por task (nome do integrante na frente).
# A branch de integração nasce da main (BASE). As branches de task nascem da branch de integração.
#
# Uso (na raiz do repositório, por quem tem permissão de push):
#   bash "Trabalho Final/scripts/criar-branches-uc-013.sh" --dry-run   # mostra o que faria
#   bash "Trabalho Final/scripts/criar-branches-uc-013.sh"             # cria/atualiza tudo
#   bash "Trabalho Final/scripts/criar-branches-uc-013.sh" matheus     # só as branches do Matheus
#
# Segurança: o script nunca usa --force e nunca apaga branch. Se uma branch de task já existe no
# remoto, ela só é atualizada quando o avanço é fast-forward (a branch não tem commits próprios).
# Se ela divergiu, o script avisa e não mexe nela.
set -euo pipefail

BASE="${BASE:-main}"
INTEGRACAO="feature/uc-013-criar-pedido-desculpa"

# integrante/PNN-slug
BRANCHES=(
  "isabella/T00-estrutura-repositorio"
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
existe_remoto() { git show-ref --verify --quiet "refs/remotes/origin/$1"; }

git rev-parse --is-inside-work-tree >/dev/null 2>&1 || { echo "Rode dentro do repositório atividades_aps."; exit 1; }
cd "$(git rev-parse --show-toplevel)"
git remote get-url origin >/dev/null 2>&1 || { echo "Remote 'origin' não configurado."; exit 1; }

if ! git diff --quiet HEAD; then
  echo "Há alterações em arquivos já versionados. Faça commit ou stash antes."; exit 1
fi

git fetch origin

# 1) Branch de integração (a partir da main)
if existe_remoto "$INTEGRACAO"; then
  echo "Branch de integração já existe no remoto: $INTEGRACAO"
  REF_INTEGRACAO="origin/$INTEGRACAO"
else
  echo "Criando $INTEGRACAO a partir de origin/$BASE"
  run git branch "$INTEGRACAO" "origin/$BASE"
  run git push -u origin "$INTEGRACAO"
  REF_INTEGRACAO="$INTEGRACAO"
fi

# 2) Uma branch por task, a partir da branch de integração
for b in "${BRANCHES[@]}"; do
  dono="${b%%/*}"
  if [ -n "$FILTRO" ] && [ "$FILTRO" != "$dono" ]; then continue; fi

  if existe_remoto "$b"; then
    if [ "$(git rev-parse "origin/$b")" = "$(git rev-parse "$REF_INTEGRACAO")" ]; then
      echo "Em dia:      $b"
    elif git merge-base --is-ancestor "origin/$b" "$REF_INTEGRACAO"; then
      echo "Atualizando: $b (fast-forward até $INTEGRACAO)"
      run git push origin "$REF_INTEGRACAO:refs/heads/$b"
    else
      echo "ATENÇÃO:     $b já tem commits próprios (diverge de $INTEGRACAO); não foi alterada."
    fi
  else
    echo "Criando:     $b"
    run git push origin "$REF_INTEGRACAO:refs/heads/$b"
  fi
done

echo
echo "Pronto. Cada integrante agora faz:"
echo "  git fetch origin && git switch <sua-branch>"
echo "e abre o PR da sua branch para $INTEGRACAO."
