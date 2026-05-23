import { env } from '../../config/env.js';
import { ApiError } from '../../utils/apiError.js';
import { AiTutorSession } from './aiTutorSession.model.js';
import { buildInputMessages, buildTutorInstructions, modeLabels } from './aiTutor.prompts.js';
import { createOpenAIClient } from './openai.client.js';

const client = createOpenAIClient();

export async function askTutor(user, payload) {
  const session = payload.sessionId
    ? await getOwnedSession(payload.sessionId, user.id)
    : await AiTutorSession.create({
        user: user.id,
        title: createSessionTitle(payload.message),
        lastMode: payload.mode,
        messages: [],
      });

  const userMessage = {
    role: 'user',
    mode: payload.mode,
    content: payload.message,
  };

  const assistantText = await generateTutorResponse({
    user,
    session,
    userMessage,
    mode: payload.mode,
    context: payload.context,
  });

  const assistantMessage = {
    role: 'assistant',
    mode: payload.mode,
    content: assistantText,
  };

  session.messages.push(userMessage, assistantMessage);
  session.lastMode = payload.mode;
  await session.save();

  return {
    session: summarizeSession(session),
    assistantMessage: session.messages[session.messages.length - 1],
  };
}

export async function listTutorSessions(userId) {
  const sessions = await AiTutorSession.find({ user: userId }).sort({ updatedAt: -1 }).limit(30);
  return sessions.map(summarizeSession);
}

export async function getTutorSession(sessionId, userId) {
  const session = await getOwnedSession(sessionId, userId);
  return session;
}

export async function deleteTutorSession(sessionId, userId) {
  const session = await AiTutorSession.findOneAndDelete({ _id: sessionId, user: userId });

  if (!session) {
    throw new ApiError(404, 'AI tutor chat not found');
  }
}

async function generateTutorResponse({ user, session, userMessage, mode, context }) {
  if (!client) {
    return createFallbackResponse(mode, userMessage.content);
  }

  const response = await client.responses.create({
    model: env.OPENAI_TUTOR_MODEL,
    instructions: buildTutorInstructions({ user, mode, context }),
    input: buildInputMessages(session.messages, userMessage.content),
  });

  return response.output_text || createFallbackResponse(mode, userMessage.content);
}

async function getOwnedSession(sessionId, userId) {
  const session = await AiTutorSession.findOne({ _id: sessionId, user: userId });

  if (!session) {
    throw new ApiError(404, 'AI tutor chat not found');
  }

  return session;
}

function summarizeSession(session) {
  const lastMessage = session.messages[session.messages.length - 1];

  return {
    id: session.id,
    title: session.title,
    lastMode: session.lastMode,
    messageCount: session.messages.length,
    preview: lastMessage?.content?.slice(0, 120) ?? '',
    updatedAt: session.updatedAt,
  };
}

function createSessionTitle(message) {
  return message.length > 48 ? `${message.slice(0, 48)}...` : message;
}

function createFallbackResponse(mode, message) {
  return [
    `Development AI Tutor Response (${modeLabels[mode]})`,
    '',
    'OpenAI is not configured yet. Add `OPENAI_API_KEY` to `server/.env` to enable live AI answers.',
    '',
    `Your question: ${message}`,
    '',
    'Suggested next step: break the problem into topic, formula or rule, solved example, and one practice question.',
  ].join('\n');
}
