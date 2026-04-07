import api from './api';

export const startInterviewSession = async (domain: string, round_type: string) => {
  const { data } = await api.post('/interview/sessions', { domain, round_type, total_questions: 4 });
  return data.data;
};

export const submitInterviewAnswer = async (
  sessionId: number | string, 
  question_text: string, 
  answer_text: string, 
  question_index: number
) => {
  const { data } = await api.post(`/interview/sessions/${sessionId}/answer`, {
    question_text,
    answer_text,
    question_index
  });
  return data.data;
};

export const endInterviewSession = async (sessionId: number | string) => {
  const { data } = await api.post(`/interview/sessions/${sessionId}/end`);
  return data.data;
};

export const sendSalaryNegotiation = async (message: string) => {
  const { data } = await api.post('/interview/salary-roleplay/message', { message });
  return data.data;
};

export const getInterviewPerformance = async () => {
  try {
    const { data } = await api.get('/interview/performance');
    return data.data.performance;
  } catch (err) {
    return null;
  }
};

export const getInterviewFillerStats = async () => {
  try {
    const { data } = await api.get('/interview/filler-stats');
    return data.data;
  } catch (err) {
    return null;
  }
};
