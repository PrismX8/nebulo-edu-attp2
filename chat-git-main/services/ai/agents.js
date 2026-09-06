const dotenv = require('dotenv');

dotenv.config();

/**
 * Get AI response for a user message
 * @param {string} userId - User ID
 * @param {string} message - User message
 * @param {string} agentId - AI agent ID or type
 * @returns {Promise<string>} - AI response
 */
async function getAIResponse(userId, message, agentId = 'default') {
  return 'AI responses are not configured for this deployment.';
}

/**
 * Get conversation history for a user
 * @param {string} userId - User ID
 * @param {number} limit - Maximum number of messages to retrieve
 * @returns {Promise<Array<Object>>} - Conversation history
 */
async function getConversationHistory(userId, limit = 10) {
  return [];
}

/**
 * Save conversation message to database
 * @param {string} userId - User ID
 * @param {string} userMessage - User message
 * @param {string} aiResponse - AI response
 * @returns {Promise<void>}
 */
async function saveConversation(userId, userMessage, aiResponse) {
  return undefined;
}

/**
 * Get system prompt for an AI agent
 * @param {string} agentId - Agent ID or type
 * @returns {Promise<string>} - System prompt
 */
async function getAgentSystemPrompt(agentId) {
  const systemPrompts = {
    default: 'You are a helpful assistant in a chat application.',
    support: 'You are a customer support agent helping users with the UBG Chat application. Be professional, friendly, and provide clear instructions.',
    sales: 'You are a sales representative for UBG Chat premium accounts. Explain the benefits of premium accounts and help users with the purchase process.',
    moderator: 'You are a chat moderator. Ensure conversations remain civil and follow the community guidelines. Avoid sharing any illegal content or instructions.'
  };

  return systemPrompts[agentId] || systemPrompts.default;
}

module.exports = {
  getAIResponse,
  getConversationHistory,
  saveConversation
};
