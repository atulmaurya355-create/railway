import { httpClient } from '../../services/httpClient.js';

export const tutorModes = [
  { id: 'doubt', label: 'Ask Doubts' },
  { id: 'reasoning', label: 'Solve Reasoning' },
  { id: 'explain', label: 'Explain Answers' },
  { id: 'generate', label: 'Generate Questions' },
  { id: 'planner', label: 'Study Planner' },
  { id: 'recommend', label: 'Recommendations' },
];

export const aiTutorService = {
  async ask(payload) {
    const response = await httpClient.post('/ai-tutor/ask', payload);
    return response.data.data;
  },

  async listSessions() {
    const response = await httpClient.get('/ai-tutor/sessions');
    return response.data.data.sessions;
  },

  async getSession(sessionId) {
    const response = await httpClient.get(`/ai-tutor/sessions/${sessionId}`);
    return response.data.data.session;
  },

  async deleteSession(sessionId) {
    const response = await httpClient.delete(`/ai-tutor/sessions/${sessionId}`);
    return response.data;
  },
};
