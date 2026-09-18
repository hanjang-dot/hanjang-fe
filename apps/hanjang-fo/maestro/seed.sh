#!/usr/bin/env bash
# Seeds the dev BE with a published exam + questions and published quizzes.
# Requires hanjang-be on :5500 and postgres on :5432 (dev defaults).
# Prints the E2E user id on stdout as E2E_USER_ID=<uuid>.
set -euo pipefail

API="${API_URL:-http://localhost:5500}"
PSQL="psql postgresql://postgres:postgres@localhost:5432/hanjang -At"

ADMIN_TOKEN=$(curl -sf -X POST "$API/admin/login" \
  -H 'content-type: application/json' \
  -d '{"loginId":"root","password":"hanjang-root-dev"}' | node -e 'let d="";process.stdin.on("data",c=>d+=c).on("end",()=>console.log(JSON.parse(d).accessToken))')

auth=(-H "Authorization: Bearer $ADMIN_TOKEN" -H 'content-type: application/json')

EXAM_TITLE="2026학년도 E2E 모의고사"

EXAM_ID=$(curl -sf "${auth[@]}" "$API/admin/exams" | \
  node -e 'let d="";process.stdin.on("data",c=>d+=c).on("end",()=>{const l=JSON.parse(d);const e=l.find(x=>x.title==="2026학년도 E2E 모의고사");console.log(e?e.examPaperId??e.examId??e.id??"":"")})')

if [ -z "$EXAM_ID" ]; then
  EXAM_ID=$(curl -sf -X POST "$API/admin/exams" "${auth[@]}" \
    -d "{\"title\":\"$EXAM_TITLE\",\"round\":\"E2E\",\"subject\":\"공통\",\"year\":2026,\"timeLimitSec\":1800}" | \
    node -e 'let d="";process.stdin.on("data",c=>d+=c).on("end",()=>{const e=JSON.parse(d);console.log(e.examPaperId??e.examId??e.id)})')
fi

add_question() {
  curl -sf -X POST "$API/admin/questions" "${auth[@]}" -d "$1" >/dev/null
}

EXISTING_Q=$(curl -sf "${auth[@]}" "$API/admin/exams/$EXAM_ID/questions" | node -e 'let d="";process.stdin.on("data",c=>d+=c).on("end",()=>console.log(JSON.parse(d).length))')
if [ "$EXISTING_Q" = "0" ]; then
  add_question "{\"examPaperId\":\"$EXAM_ID\",\"number\":1,\"prompt\":\"다음 중 조선시대의 왕은?\",\"choices\":[\"세종대왕\",\"나폴레옹\",\"워싱턴\",\"처칠\"],\"answer\":\"세종대왕\"}"
  add_question "{\"examPaperId\":\"$EXAM_ID\",\"number\":2,\"prompt\":\"1 더하기 1은?\",\"choices\":[\"1\",\"2\",\"3\",\"4\"],\"answer\":\"2\"}"
  add_question "{\"examPaperId\":\"$EXAM_ID\",\"number\":3,\"prompt\":\"대한민국의 수도는?\",\"choices\":[\"부산\",\"서울\",\"대전\",\"인천\"],\"answer\":\"서울\"}"
fi

curl -sf -X PATCH "$API/admin/exams/$EXAM_ID/publish" "${auth[@]}" -d '{"published":true}' >/dev/null

add_quiz() {
  curl -sf -X POST "$API/admin/quizzes" "${auth[@]}" -d "$1" >/dev/null
}

QUIZ_COUNT=$(curl -sf "${auth[@]}" "$API/admin/quizzes" | node -e 'let d="";process.stdin.on("data",c=>d+=c).on("end",()=>console.log(JSON.parse(d).length))')
if [ "$QUIZ_COUNT" = "0" ]; then
  add_quiz '{"type":"ox","prompt":"지구는 태양 주위를 돈다","choices":["O","X"],"answer":"O"}'
  add_quiz '{"type":"cloze","prompt":"대한민국의 수도는 ___이다","choices":["서울","도쿄","베이징","하노이"],"answer":"서울"}'
  add_quiz '{"type":"word","prompt":"apple","choices":["사과","바나나","포도","복숭아"],"answer":"사과","direction":"en-ko"}'
fi

for QID in $(curl -sf "${auth[@]}" "$API/admin/quizzes" | node -e 'let d="";process.stdin.on("data",c=>d+=c).on("end",()=>JSON.parse(d).forEach(q=>console.log(q.quizId)))'); do
  curl -sf -X PATCH "$API/admin/quizzes/$QID/publish" "${auth[@]}" -d '{"published":true}' >/dev/null
done

$PSQL -c "INSERT INTO users (\"userId\", email, password) VALUES (gen_random_uuid(), 'e2e@hanjang.dev', 'e2e') ON CONFLICT (email) DO NOTHING" >/dev/null
E2E_USER_ID=$($PSQL -c "SELECT \"userId\" FROM users WHERE email = 'e2e@hanjang.dev'")

echo "E2E_USER_ID=$E2E_USER_ID"
echo "EXAM_ID=$EXAM_ID"
