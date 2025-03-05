<template>
  <div class="app-container">
    <!-- Header -->
    <header class="header">
      <div class="container">
        <div class="logo-container">
          <div class="logo">Ollama</div>
          <div class="model-selector">
            <button 
              class="model-dropdown-button" 
              @click="toggleModelDropdown"
              ref="modelButton"
            >
              <span class="model-badge">{{ currentModel }}</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M6 9l6 6 6-6"></path>
              </svg>
            </button>
            <div v-if="showModelDropdown" class="model-dropdown">
              <div 
                v-for="model in availableModels" 
                :key="model" 
                class="model-option"
                :class="{ 'selected': model === currentModel }"
                @click="selectModel(model)"
              >
                {{ model }}
              </div>
            </div>
          </div>
        </div>
        <div class="header-actions">
          <button class="icon-button" @click="clearMessages" title="New Chat">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 5v14M5 12h14"></path>
            </svg>
          </button>
        </div>
      </div>
    </header>

    <!-- Main content -->
    <main class="main">
      <div class="container">
        <!-- Empty state -->
        <div v-if="messages.length === 0" class="empty-state">
          <div class="empty-content">
            <svg class="empty-icon" xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <circle cx="8.5" cy="8.5" r="1.5"></circle>
              <circle cx="15.5" cy="8.5" r="1.5"></circle>
              <path d="M8.5 13.5c.83 1.5 2.17 1.5 3 1.5s2.17 0 3-1.5"></path>
            </svg>
            <h2>Begin a conversation</h2>
            <p>Start typing below to chat with Ollama using {{ currentModel }} model</p>
          </div>
        </div>

        <!-- Messages -->
        <div v-else class="messages" ref="messagesContainer">
          <div v-for="(message, index) in messages" :key="index" class="message" :class="message.role">
            <div class="message-avatar">
              <svg v-if="message.role === 'user'" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                <circle cx="15.5" cy="8.5" r="1.5"></circle>
                <path d="M8.5 13.5c.83 1.5 2.17 1.5 3 1.5s2.17 0 3-1.5"></path>
              </svg>
            </div>
            <div class="message-content">
              <div v-if="message.role === 'assistant'" class="message-model">{{ message.model || currentModel }}</div>
              
              <!-- Thinking section (for deepseek model) -->
              <div v-if="message.thinking" class="thinking-section" :class="{ 'expanded': expandedThinking[index] }">
                <div class="thinking-header" @click="toggleThinking(index)">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="16" x2="12" y2="12"></line>
                    <line x1="12" y1="8" x2="12.01" y2="8"></line>
                  </svg>
                  <span>View thinking process</span>
                  <svg class="thinking-arrow" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M6 9l6 6 6-6"></path>
                  </svg>
                </div>
                <div class="thinking-content">{{ message.thinking }}</div>
              </div>
              
              <div class="message-inner">{{ message.content }}</div>
            </div>
          </div>
          
          <!-- Loading indicator -->
          <div v-if="loading" class="message assistant">
            <div class="message-avatar">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                <circle cx="15.5" cy="8.5" r="1.5"></circle>
                <path d="M8.5 13.5c.83 1.5 2.17 1.5 3 1.5s2.17 0 3-1.5"></path>
              </svg>
            </div>
            <div class="message-content">
              <div class="message-model">{{ currentModel }}</div>
              <div class="message-inner">
                <div class="loading-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Input area -->
    <footer class="footer">
      <div class="container">
        <div class="input-wrapper">
          <textarea 
            v-model="userInput" 
            @keydown.enter.prevent="sendMessage"
            placeholder="Message Ollama..." 
            :disabled="loading"
            rows="1"
            ref="inputField"
            @input="autoResize"
            class="input"
          ></textarea>
          <button 
            class="send-button" 
            @click="sendMessage" 
            :disabled="loading || !userInput.trim()">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"></path>
            </svg>
          </button>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, nextTick, onUnmounted, computed, reactive } from 'vue'

interface Message {
  role: 'user' | 'assistant'
  content: string
  model?: string
  thinking?: string
}

const userInput = ref('')
const messages = ref<Message[]>([])
const loading = ref(false)
const messagesContainer = ref<HTMLElement | null>(null)
const inputField = ref<HTMLTextAreaElement | null>(null)
const modelButton = ref<HTMLElement | null>(null)
const expandedThinking = reactive<Record<number, boolean>>({})

// Model selection
const availableModels = ref(['qwen2.5:1.5b', 'deepseek-r1:1.5b', 'llama3.2:latest'])
const currentModel = ref('qwen2.5:1.5b')
const showModelDropdown = ref(false)

const toggleModelDropdown = () => {
  showModelDropdown.value = !showModelDropdown.value
}

const selectModel = (model: string) => {
  currentModel.value = model
  showModelDropdown.value = false
  
  // If there are no messages, no need to add a system message
  if (messages.value.length === 0) return
  
  // Add a system message about model change
  messages.value.push({
    role: 'assistant',
    content: `Model changed to ${model}`,
    model: model
  })
}

// Parse content for thinking sections (for deepseek model)
const parseThinking = (content: string): { content: string, thinking?: string } => {
  if (!content.includes('<think>')) return { content }
  
  const thinkMatch = content.match(/<think>([\s\S]*?)<\/think>/)
  if (!thinkMatch) return { content }
  
  const thinking = thinkMatch[1].trim()
  const cleanContent = content.replace(/<think>[\s\S]*?<\/think>/, '').trim()
  
  return { content: cleanContent, thinking }
}

// Close dropdown when clicking outside
const handleClickOutside = (event: MouseEvent) => {
  if (modelButton.value && !modelButton.value.contains(event.target as Node)) {
    showModelDropdown.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

// Auto-resize textarea
const autoResize = () => {
  if (inputField.value) {
    inputField.value.style.height = 'auto'
    inputField.value.style.height = `${Math.min(inputField.value.scrollHeight, 150)}px`
  }
}

// Clear all messages (new chat)
const clearMessages = () => {
  messages.value = []
  Object.keys(expandedThinking).forEach(key => delete expandedThinking[Number(key)])
  if (inputField.value) {
    inputField.value.focus()
  }
}

const sendMessage = async () => {
  if (!userInput.value.trim() || loading.value) return
  
  // Add user message to the chat
  messages.value.push({
    role: 'user',
    content: userInput.value
  })
  
  // Clear input and reset height
  const userMessage = userInput.value
  userInput.value = ''
  if (inputField.value) {
    inputField.value.style.height = 'auto'
  }
  
  // Set loading state
  loading.value = true
  
  try {
    // Call the API
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messages: messages.value,
        model: currentModel.value
      })
    })
    
    if (!response.ok) {
      throw new Error('Error connecting to Ollama')
    }
    
    const data = await response.json()
    
    // Parse thinking section if present
    const { content, thinking } = parseThinking(data.content)
    
    // Add assistant message to the chat
    const messageIndex = messages.value.length
    messages.value.push({
      role: 'assistant',
      content: content,
      model: currentModel.value,
      thinking: thinking
    })
    
    // Initialize the expanded state for this message
    if (thinking) {
      expandedThinking[messageIndex] = false
    }
  } catch (error) {
    console.error('Failed to send message:', error)
    messages.value.push({
      role: 'assistant',
      content: 'Terjadi kesalahan saat menghubungi Ollama. Silakan coba lagi.',
      model: currentModel.value
    })
  } finally {
    loading.value = false
    
    // Focus on input field after response
    nextTick(() => {
      if (inputField.value) {
        inputField.value.focus()
      }
    })
  }
}

// Auto-scroll to bottom when new messages arrive
watch(messages, () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
}, { deep: true })

onMounted(() => {
  // Focus on input when page loads
  nextTick(() => {
    if (inputField.value) {
      inputField.value.focus()
    }
  })
})

// Toggle thinking section visibility
const toggleThinking = (index: number) => {
  expandedThinking[index] = !expandedThinking[index]
}
</script>

<style>
/* Reset and base styles */
:root {
  --font-sans: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif, 'Apple Color Emoji';
  --foreground: #000;
  --background: #fff;
  --gray-50: #fafafa;
  --gray-100: #f5f5f5;
  --gray-200: #eaeaea;
  --gray-300: #e5e5e5;
  --gray-400: #d4d4d4;
  --gray-500: #9e9e9e;
  --gray-600: #757575;
  --gray-700: #616161;
  --gray-800: #424242;
  --accent: #000;
  --accent-light: #333;
  --accent-foreground: #fff;
  --border-radius: 8px;
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  --thinking-bg: #f8f9fa;
  --thinking-border: #e9ecef;
  --thinking-text: #495057;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  height: 100%;
  background-color: var(--background);
  color: var(--foreground);
  font-family: var(--font-sans);
  font-size: 14px;
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
}

/* Layout */
.app-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.container {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  padding: 0 20px;
}

/* Header */
.header {
  height: 64px;
  border-bottom: 1px solid var(--gray-200);
  display: flex;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  position: sticky;
  top: 0;
  z-index: 10;
}

.header .container {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo-container {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo {
  font-weight: 600;
  font-size: 16px;
  letter-spacing: -0.02em;
}

/* Model selector */
.model-selector {
  position: relative;
}

.model-dropdown-button {
  display: flex;
  align-items: center;
  gap: 6px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
}

.model-badge {
  font-size: 12px;
  padding: 2px 8px;
  background-color: var(--gray-100);
  border-radius: 12px;
  color: var(--gray-700);
  font-weight: 500;
  transition: background-color 0.15s ease;
}

.model-dropdown-button:hover .model-badge {
  background-color: var(--gray-200);
}

.model-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  margin-top: 8px;
  background-color: white;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-md);
  border: 1px solid var(--gray-200);
  min-width: 180px;
  z-index: 20;
}

.model-option {
  padding: 8px 12px;
  cursor: pointer;
  transition: background-color 0.15s ease;
  font-size: 13px;
}

.model-option:hover {
  background-color: var(--gray-100);
}

.model-option.selected {
  background-color: var(--gray-100);
  font-weight: 500;
}

.header-actions {
  display: flex;
  gap: 8px;
}

.icon-button {
  width: 32px;
  height: 32px;
  border-radius: var(--border-radius);
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: 1px solid var(--gray-200);
  cursor: pointer;
  color: var(--gray-700);
  transition: all 0.15s ease;
}

.icon-button:hover {
  border-color: var(--gray-300);
  background: var(--gray-100);
  color: var(--gray-800);
}

/* Main content */
.main {
  flex: 1;
  overflow-y: auto;
  padding: 24px 0;
  background-color: var(--gray-50);
}

/* Empty state */
.empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  min-height: 300px;
}

.empty-content {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 400px;
}

.empty-icon {
  margin-bottom: 24px;
  color: var(--gray-400);
}

.empty-content h2 {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 8px;
  letter-spacing: -0.01em;
}

.empty-content p {
  color: var(--gray-600);
  font-size: 14px;
}

/* Messages */
.messages {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.message {
  display: flex;
  max-width: 85%;
  align-items: flex-start;
  gap: 12px;
}

.message-avatar {
  width: 32px;
  height: 32px;
  border-radius: var(--border-radius);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.message-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.message-model {
  font-size: 11px;
  color: var(--gray-500);
  font-weight: 500;
}

.message.user {
  align-self: flex-end;
  flex-direction: row-reverse;
}

.message.assistant {
  align-self: flex-start;
}

.message.user .message-avatar {
  background-color: var(--accent);
  color: var(--accent-foreground);
}

.message.assistant .message-avatar {
  background-color: var(--gray-100);
  color: var(--gray-700);
  border: 1px solid var(--gray-200);
}

.message-inner {
  padding: 12px 16px;
  border-radius: var(--border-radius);
  white-space: pre-wrap;
  box-shadow: var(--shadow-sm);
}

.message.user .message-inner {
  background: var(--accent);
  color: var(--accent-foreground);
}

.message.assistant .message-inner {
  background: white;
  color: var(--foreground);
  border: 1px solid var(--gray-200);
}

/* Thinking section */
.thinking-section {
  margin-bottom: 8px;
  border-radius: var(--border-radius);
  border: 1px solid var(--thinking-border);
  overflow: hidden;
}

.thinking-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background-color: var(--thinking-bg);
  cursor: pointer;
  font-size: 12px;
  color: var(--thinking-text);
  font-weight: 500;
  transition: background-color 0.15s ease;
  user-select: none;
}

.thinking-header:hover {
  background-color: var(--gray-200);
}

.thinking-arrow {
  margin-left: auto;
  transition: transform 0.2s ease;
}

.thinking-section.expanded .thinking-arrow {
  transform: rotate(180deg);
}

.thinking-content {
  padding: 12px;
  background-color: white;
  white-space: pre-wrap;
  font-family: monospace;
  font-size: 13px;
  color: var(--thinking-text);
  border-top: 1px solid var(--thinking-border);
  display: none;
}

.thinking-section.expanded .thinking-content {
  display: block;
  max-height: 500px;
  overflow-y: auto;
}

/* Loading animation */
.loading-dots {
  display: flex;
  align-items: center;
  gap: 4px;
  height: 10px;
  padding: 0 4px;
}

.loading-dots span {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: var(--gray-500);
  animation: pulse 1.5s infinite ease-in-out;
}

.loading-dots span:nth-child(2) {
  animation-delay: 0.2s;
}

.loading-dots span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes pulse {
  0%, 100% {
    opacity: 0.3;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.2);
  }
}

/* Footer input */
.footer {
  border-top: 1px solid var(--gray-200);
  padding: 16px 0;
  background-color: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
}

.input-wrapper {
  display: flex;
  align-items: flex-end;
  border: 1px solid var(--gray-300);
  border-radius: var(--border-radius);
  transition: border 0.15s ease, box-shadow 0.15s ease;
  overflow: hidden;
  background-color: white;
  box-shadow: var(--shadow-sm);
}

.input-wrapper:focus-within {
  border-color: var(--accent);
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.1);
}

.input {
  flex: 1;
  border: none;
  padding: 12px 16px;
  font-size: 14px;
  font-family: inherit;
  background: transparent;
  resize: none;
  outline: none;
  max-height: 150px;
}

.send-button {
  background: transparent;
  border: none;
  height: 38px;
  width: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.7;
  cursor: pointer;
  color: var(--accent);
  transition: opacity 0.15s ease;
}

.send-button:hover:not(:disabled) {
  opacity: 1;
}

.send-button:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

/* Responsive */
@media (max-width: 640px) {
  .container {
    padding: 0 16px;
  }
  
  .message {
    max-width: 90%;
  }
  
  .header {
    height: 56px;
  }
}
</style>