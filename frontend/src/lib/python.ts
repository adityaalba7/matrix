import axios from 'axios';

const pythonApi = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: { 'Content-Type': 'application/json' },
});

export const predictScore = async (userId: number, subject: string, days: number = 14) => {
  const { data } = await pythonApi.post('/predict-score/', { user_id: userId, subject, days });
  return data;
};

export const startDebate = async (topic: string, userArgument: string, subject?: string) => {
  const { data } = await pythonApi.post('/debate/', { topic, user_argument: userArgument, subject });
  return data;
};

export const teachBack = async (topic: string, userExplanation: string, subject?: string) => {
  const { data } = await pythonApi.post('/teach-back/', { topic, user_explanation: userExplanation, subject });
  return data;
};

export const getNightOwl = async (userId: number) => {
  const { data } = await pythonApi.get('/night-owl/', { params: { user_id: userId } });
  return data;
};

export const panicMode = async (userId: number, subject: string, numQuestions: number = 10) => {
  const { data } = await pythonApi.post('/panic/', { user_id: userId, subject, num_questions: numQuestions });
  return data;
};

export const getMindMap = async (topic: string) => {
  const { data } = await pythonApi.post('/mind-map/', { topic });
  return data;
};
