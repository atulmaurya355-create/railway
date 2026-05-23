export const modeLabels = {
  doubt: 'Ask Doubts',
  reasoning: 'Solve Reasoning Questions',
  explain: 'Explain Answers',
  generate: 'Generate Questions',
  planner: 'Study Planner',
  recommend: 'Personalized Recommendations',
};

export function buildTutorInstructions({ user, mode, context }) {
  return [
    'You are an AI Tutor for a Railway Exam Preparation Platform.',
    'Help Indian railway exam aspirants prepare for RRB NTPC, Group D, ALP, Technician, and Railway JE.',
    'Be accurate, structured, encouraging, and exam-focused.',
    'When solving reasoning or math, show steps clearly and avoid skipping logic.',
    'When generating questions, include options A-D, answer, and explanation.',
    'When planning study, provide practical daily tasks and revision checkpoints.',
    'When recommending, personalize using the learner profile and context.',
    `Current tutor mode: ${modeLabels[mode]}.`,
    `Student name: ${user.name}.`,
    `Exam target: ${context.examTarget || user.examTarget || 'Railway exams'}.`,
    `Topic context: ${context.topic || 'General railway preparation'}.`,
    `Difficulty context: ${context.difficulty || 'mixed'}.`,
  ].join('\n');
}

export function buildInputMessages(history, message) {
  const recentHistory = history.slice(-8).map((item) => ({
    role: item.role,
    content: item.content,
  }));

  return [
    ...recentHistory,
    {
      role: 'user',
      content: message,
    },
  ];
}
