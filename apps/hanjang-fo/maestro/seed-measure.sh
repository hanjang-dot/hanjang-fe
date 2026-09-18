#!/usr/bin/env bash
set -euo pipefail

API=${API_URL:-http://localhost:5501}
STATIC=${STATIC_URL:-http://localhost:5699}
HERE=$(cd "$(dirname "$0")" && pwd)

node "$HERE/fixtures/gen-png.mjs"

PGPASSWORD=${PGPASSWORD:-postgres} psql \
  -h "${PGHOST:-localhost}" -p "${PGPORT:-5432}" -U "${PGUSER:-postgres}" \
  -d "${PGDATABASE:-hanjang}" <<'SQL' > /dev/null
DELETE FROM answer WHERE "examSessionId" IN
  (SELECT "examSessionId" FROM "examSession" WHERE "userId"='e2e00000-0000-4000-8000-0000000000e2');
DELETE FROM stroke WHERE "examSessionId" IN
  (SELECT "examSessionId" FROM "examSession" WHERE "userId"='e2e00000-0000-4000-8000-0000000000e2');
DELETE FROM "examSession" WHERE "userId"='e2e00000-0000-4000-8000-0000000000e2';
SQL
echo "cleared e2e sessions"

ADMIN_TOKEN=$(curl -sf -X POST "$API/admin/login" \
  -H 'content-type: application/json' \
  -d "$(jq -n --arg p "${ADMIN_PASSWORD:-hanjang-root-dev}" \
    '{loginId:"root", password:$p}')" | jq -r .accessToken)

admin() {
  curl -sf -X "$1" "$API$2" \
    -H "authorization: Bearer $ADMIN_TOKEN" \
    -H 'content-type: application/json' \
    ${3:+-d "$3"}
}

EXAMS=$(admin GET "/admin/exams")

exam_id() {
  echo "$EXAMS" | jq -r --arg t "$1" '.[] | select(.title==$t) | .examPaperId' | head -1
}

LONG_TITLE="E2E 긴지문 모의고사"
LONG_ID=$(exam_id "$LONG_TITLE")
if [ -z "$LONG_ID" ]; then
  LONG_ID=$(admin POST /admin/exams "$(jq -n --arg t "$LONG_TITLE" \
    '{title:$t, round:"E2E", subject:"독서", year:2026, timeLimitSec:1800}')" | jq -r .examPaperId)
  echo "created $LONG_TITLE $LONG_ID"
fi

LONG_QCOUNT=$(admin GET "/admin/exams/$LONG_ID/questions" | jq 'length')
if [ "$LONG_QCOUNT" -eq 0 ]; then
  admin POST /admin/questions "$(jq -n --arg id "$LONG_ID" --arg img "$STATIC/passage-tall.png" \
    '{examPaperId:$id, number:1, passageImageUrl:$img,
      prompt:"E2E 긴지문 문항 1번: 알맞은 것을 고르세요",
      choices:["E2E 긴지문 선택지 1-A","E2E 긴지문 선택지 1-B","E2E 긴지문 선택지 1-C","E2E 긴지문 선택지 1-D"],
      answer:"E2E 긴지문 선택지 1-A"}')" > /dev/null
  admin POST /admin/questions "$(jq -n --arg id "$LONG_ID" \
    '{examPaperId:$id, number:2,
      prompt:"E2E 긴지문 문항 2번: 알맞은 것을 고르세요",
      choices:["E2E 긴지문 선택지 2-A","E2E 긴지문 선택지 2-B","E2E 긴지문 선택지 2-C","E2E 긴지문 선택지 2-D"],
      answer:"E2E 긴지문 선택지 2-A"}')" > /dev/null
  echo "added long-passage questions"
fi
admin PATCH "/admin/exams/$LONG_ID/publish" '{"published":true}' > /dev/null

created=0
for n in $(seq 1 200); do
  TITLE=$(printf "E2E 회차 %03d" "$n")
  eid=$(exam_id "$TITLE")
  if [ -z "$eid" ]; then
    eid=$(admin POST /admin/exams "$(jq -n --arg t "$TITLE" --arg c "$STATIC/cover.png?i=$n" \
      '{title:$t, round:"E2E", subject:"목록", year:2026, timeLimitSec:600, coverImageUrl:$c}')" | jq -r .examPaperId)
    created=$((created + 1))
  fi
  admin PATCH "/admin/exams/$eid/publish" '{"published":true}' > /dev/null
done
echo "bulk exams ensured (created $created)"
echo "seed-measure done"
