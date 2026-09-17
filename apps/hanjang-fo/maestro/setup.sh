#!/usr/bin/env bash
set -euo pipefail

API=${API_URL:-http://localhost:5500}
HERE=$(cd "$(dirname "$0")" && pwd)

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

EXAM_TITLE="E2E 모의고사"
EXAM_ID=$(admin GET "/admin/exams" | jq -r --arg t "$EXAM_TITLE" '.[] | select(.title==$t) | .examPaperId' | head -1)

if [ -z "$EXAM_ID" ]; then
  EXAM_ID=$(admin POST /admin/exams "$(jq -n --arg t "$EXAM_TITLE" \
    '{title:$t, round:"E2E", subject:"독서", year:2026, timeLimitSec:600}')" | jq -r .examPaperId)
  echo "created exam $EXAM_ID"
fi

QCOUNT=$(admin GET "/admin/exams/$EXAM_ID/questions" | jq 'length')
if [ "$QCOUNT" -eq 0 ]; then
  for n in 1 2; do
    admin POST /admin/questions "$(jq -n --arg id "$EXAM_ID" --argjson n "$n" \
      '{examPaperId:$id, number:$n, prompt:("E2E 문항 " + ($n|tostring) + "번: 알맞은 것을 고르세요"),
        choices:["E2E 선택지 " + ($n|tostring) + "-A","E2E 선택지 " + ($n|tostring) + "-B","E2E 선택지 " + ($n|tostring) + "-C","E2E 선택지 " + ($n|tostring) + "-D"],
        answer:("E2E 선택지 " + ($n|tostring) + "-A")}')" > /dev/null
  done
  echo "added questions"
fi

for eid in $(admin GET "/admin/exams" | jq -r '.[].examPaperId'); do
  if [ "$eid" != "$EXAM_ID" ]; then
    admin PATCH "/admin/exams/$eid/publish" '{"published":false}' > /dev/null
  fi
done
admin PATCH "/admin/exams/$EXAM_ID/publish" '{"published":true}' > /dev/null
echo "exam $EXAM_ID published"

seed_quiz() {
  local type=$1 prompt=$2 answer=$3
  shift 3
  local choices
  choices=$(jq -cn '$ARGS.positional' --args "$@")
  local qid
  qid=$(admin GET "/admin/quizzes" | jq -r --arg p "$prompt" '.[] | select(.prompt==$p) | .quizId')
  if [ -z "$qid" ]; then
    qid=$(admin POST /admin/quizzes "$(jq -n --arg t "$type" --arg p "$prompt" --arg a "$answer" --argjson c "$choices" \
      '{type:$t, prompt:$p, choices:$c, answer:$a}')" | jq -r .quizId)
    echo "created quiz $qid ($type)"
  fi
  admin PATCH "/admin/quizzes/$qid/publish" '{"published":true}' > /dev/null
  echo "published quiz $qid ($type)"
}

# reset: unpublish all existing quizzes so only seeded ones appear in today's set
for qid in $(admin GET "/admin/quizzes" | jq -r '.[].quizId'); do
  admin PATCH "/admin/quizzes/$qid/publish" '{"published":false}' > /dev/null
done

seed_quiz ox "E2E OX: 지구는 둥글다" "O" "O" "X"
seed_quiz cloze "E2E 빈칸: 한국의 수도는?" "서울" "서울" "부산" "대구" "인천" "광주"

node "$HERE/mint-tokens.mjs"
echo "setup done"
