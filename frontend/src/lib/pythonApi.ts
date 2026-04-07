import axios from 'axios';

// The Python FastAPI server runs on port 8000 by default and handles AI-only tools.
export const pythonApi = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const requestRoastResume = async (resumeText: string, targetRole: string, intensity: string) => {
  const response = await pythonApi.post('/roast/roast', {
    resume_text: resumeText,
    target_role: targetRole,
    roast_intensity: intensity,
  });
  return response.data;
};

export const requestCGPAEstimate = async (cgpa: number, tier: string, branch: string, graduation_year: number, skills: string[]) => {
  const response = await pythonApi.post('/cgpa/estimate', {
    cgpa,
    college_tier: tier,
    branch,
    graduation_year,
    skills,
    internships: 0,
    projects: 2,
    location_preference: "India",
  });
  return response.data;
};

export const requestCodeMentor = async (code_snippet: string, language: string, error_message: string) => {
  const response = await pythonApi.post('/code/mentor', {
    code_snippet,
    language,
    error_message,
  });
  return response.data;
};

// Phase 2: Notes, Lecture, Scholarship, Resume Gap
export const requestSmartNotesPdf = async (file: File, subject: string) => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await pythonApi.post(`/notes/summarize-pdf?subject=${encodeURIComponent(subject)}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const requestSmartNotesText = async (text: string, subject: string) => {
  const response = await pythonApi.post('/notes/summarize-text', { text, subject });
  return response.data;
};

export const requestLectureAudio = async (file: File, subject: string) => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await pythonApi.post(`/lecture/process-audio?subject=${encodeURIComponent(subject)}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const requestScholarships = async (payload: any) => {
  const response = await pythonApi.post('/scholarship/find', payload);
  return response.data;
};

export const requestResumeGap = async (resumeText: string, targetCompany: string, targetRole: string) => {
  const response = await pythonApi.post('/resume-gap/analyze', {
    resume_text: resumeText,
    target_company: targetCompany,
    target_role: targetRole,
  });
  return response.data;
};

// Phase 3: Monthly Wrap, Spaced Repetition
export const requestMonthlyWrap = async (payload: any) => {
  const response = await pythonApi.post('/monthly-wrap/generate', payload);
  return response.data;
};

export const requestSpacedRepetition = async (payload: any) => {
  const response = await pythonApi.post('/spaced-rep/generate', payload);
  return response.data;
};
