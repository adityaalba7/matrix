import axios from 'axios';
async function run() {
  const login = await axios.post('http://localhost:5000/api/auth/login', { email: 'aditya@example.com', password: 'password123' }).catch(e => e.response);
  if (!login?.data) console.log(login.data);
  const token = login.data.data.access_token;
  console.log("Token:", token);

  const start = await axios.post('http://localhost:5000/api/study/quiz/start', {
    source_type: 'topic', subject: 'DBMS', difficulty: 'medium', total_questions: 1
  }, { headers: { Authorization: 'Bearer ' + token } }).catch(e => e.response);
  console.log("Start Response:", start.data);

  if(!start.data.data) return;
  const session = start.data.data.session_id;
  const q = start.data.data.questions[0];

  const ans = await axios.post(`http://localhost:5000/api/study/quiz/${session}/answer`, {
    question_text: q.question_text,
    correct_answer: q.correct_answer,
    user_answer: q.options[0],
    is_correct: q.options[0] === q.correct_answer,
    concept_tag: q.concept_tag
  }, { headers: { Authorization: 'Bearer ' + token } }).catch(e => e.response);
  console.log("Answer Response:", ans.data);
}
run();
