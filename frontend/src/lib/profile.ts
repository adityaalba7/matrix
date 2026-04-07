import api from './api';

export const getProfile = async () => {
  const { data } = await api.get('/profile');
  return data.data;
};

export const updateGitHubUsername = async (githubUsername: string) => {
  const { data } = await api.patch('/profile/github', { github_username: githubUsername });
  return data.data;
};

export const updateLeetCodeUsername = async (leetcodeUsername: string) => {
  const { data } = await api.patch('/profile/leetcode', { leetcode_username: leetcodeUsername });
  return data.data;
};

export const refreshGitHubData = async () => {
  const { data } = await api.post('/profile/github/refresh');
  return data.data;
};

export const refreshLeetCodeData = async () => {
  const { data } = await api.post('/profile/leetcode/refresh');
  return data.data;
};

export const removeGitHubUsername = async () => {
  const { data } = await api.delete('/profile/github');
  return data.data;
};

export const removeLeetCodeUsername = async () => {
  const { data } = await api.delete('/profile/leetcode');
  return data.data;
};

export const getPublicProfile = async (username: string) => {
  const { data } = await api.get(`/public/${username}`);
  return data.data;
};
