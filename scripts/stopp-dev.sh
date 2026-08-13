#!/usr/bin/env bash
# Stopper dev-serveren på en gitt port — og BARE den.
#
# Bakgrunn: `lsof -ti:PORT` lister alle prosesser som har porten åpen, ikke
# bare serveren som lytter. Har du en nettleserfane på localhost:PORT, er
# nettleseren en av dem. Et `kill` på den treffer en Chrome Helper, og et kill
# på dens forelder tar hele nettleseren med alle faner. Det har skjedd.
#
# Derfor:
#   1. kun prosesser med tilstanden LISTEN
#   2. kun hvis kommandonavnet ser ut som node/next
#   3. aldri forelderen til noe som helst
#   4. logg hva som skal drepes før det skjer
#
# Bruk: ./scripts/stopp-dev.sh 3000

set -euo pipefail
port="${1:?bruk: stopp-dev.sh <port>}"

# -sTCP:LISTEN er det som skiller serveren fra klientene som er koblet til den.
# macOS leverer bash 3.2, som mangler `mapfile` — derfor denne varianten.
pids=()
while IFS= read -r p; do
  [ -n "$p" ] && pids+=("$p")
done < <(lsof -tiTCP:"$port" -sTCP:LISTEN 2>/dev/null || true)

if [ ${#pids[@]} -eq 0 ]; then
  echo "Ingen lytter på port $port."
  exit 0
fi

for pid in "${pids[@]}"; do
  komm=$(ps -o comm= -p "$pid" 2>/dev/null | sed 's|.*/||')
  full=$(ps -o command= -p "$pid" 2>/dev/null | cut -c1-100)

  case "$komm" in
    node|next-server*|npm|bun|deno) ;;
    *)
      echo "NEKTER å drepe pid $pid ($komm) — ser ikke ut som en dev-server."
      echo "  $full"
      continue
      ;;
  esac

  echo "Dreper pid $pid ($komm) på port $port:"
  echo "  $full"
  kill "$pid" 2>/dev/null || true
done

# Gi den et øyeblikk på å avslutte pent før vi eventuelt tvinger.
sleep 2
for pid in "${pids[@]}"; do
  if kill -0 "$pid" 2>/dev/null; then
    komm=$(ps -o comm= -p "$pid" 2>/dev/null | sed 's|.*/||')
    case "$komm" in
      node|next-server*|npm|bun|deno)
        echo "pid $pid svarte ikke på SIGTERM — sender SIGKILL."
        kill -9 "$pid" 2>/dev/null || true
        ;;
    esac
  fi
done

echo "Ferdig. Port $port:"
lsof -iTCP:"$port" -sTCP:LISTEN 2>/dev/null || echo "  ledig"
