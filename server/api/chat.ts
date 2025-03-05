import { defineEventHandler, readBody } from 'h3'
import Ollama from 'ollama'

// Define types
interface Message {
  role: 'user' | 'assistant'
  content: string
  model?: string
  thinking?: string
}

interface ChatRequest {
  messages: Message[]
  model: string
}

export default defineEventHandler(async (event) => {
  try {
    // Read the request body
    const body = await readBody<ChatRequest>(event)
    
    if (!body.messages || body.messages.length === 0) {
      throw new Error('No messages provided')
    }

    // Get the model from the request or use default
    const model = body.model || 'qwen2.5:1.5b'
    
    // Filter out model property from messages before sending to Ollama
    const messagesForOllama = body.messages.map(({ role, content }) => ({ role, content }))
    
    // Send the message to Ollama
    const response = await Ollama.chat({
      model: model, // Use the model from the request
      messages: messagesForOllama,
    })

    // Get the response content
    const responseContent = response.message.content
    
    // Return the response with the original content (including thinking sections)
    return {
      content: responseContent,
      model: model
    }
  } catch (error) {
    console.error('Error in chat API:', error)
    
    // Return error message
    return {
      statusCode: 500,
      statusMessage: 'Internal Server Error',
      content: 'An error occurred while contacting Ollama.'
    }
  }
})