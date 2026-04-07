import api from './api';

export const startQuiz = async (payload: { source_type: string; subject: string; difficulty: string; total_questions: number }) => {
  const { data } = await api.post('/study/quiz/start', payload);
  return data.data;
};

export const answerQuestion = async (sessionId: string, payload: { question_text: string; correct_answer: string; user_answer: string; is_correct: boolean; concept_tag: string }) => {
  const { data } = await api.post(`/study/quiz/${sessionId}/answer`, payload);
  return data.data;
};

export const endQuiz = async (sessionId: string, time_taken_seconds: number) => {
  const { data } = await api.post(`/study/quiz/${sessionId}/end`, { time_taken_seconds });
  return data.data;
};

export const getPerformance = async () => {
  const { data } = await api.get('/study/performance');
  return data.data;
};

export const getWeakTopics = async () => {
  const { data } = await api.get('/study/weak-topics');
  return data.data;
};

export const getStreak = async () => {
  const { data } = await api.get('/study/streak');
  return data.data;
};
