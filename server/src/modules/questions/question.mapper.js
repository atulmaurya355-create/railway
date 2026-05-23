export function mapQuestionPayload(payload) {
  const mapped = {};

  if (payload.question !== undefined) mapped.question = payload.question;
  if (payload.correctAnswer !== undefined) mapped.correctAnswer = payload.correctAnswer;
  if (payload.difficulty !== undefined) mapped.difficulty = payload.difficulty;
  if (payload.topic !== undefined) mapped.topic = payload.topic;
  if (payload.category !== undefined) mapped.category = payload.category;
  if (payload.explanation !== undefined) mapped.explanation = payload.explanation;
  if (payload.isActive !== undefined) mapped.isActive = payload.isActive;

  const options = {};
  if (payload.optionA !== undefined) options.A = payload.optionA;
  if (payload.optionB !== undefined) options.B = payload.optionB;
  if (payload.optionC !== undefined) options.C = payload.optionC;
  if (payload.optionD !== undefined) options.D = payload.optionD;

  if (Object.keys(options).length > 0) {
    mapped.options = options;
  }

  return mapped;
}
