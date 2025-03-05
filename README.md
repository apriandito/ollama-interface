# Ollama Chat Interface

A modern, responsive web interface for interacting with Ollama language models. This application allows you to chat with various Ollama models through a clean and intuitive UI.

![Ollama Chat Interface](https://via.placeholder.com/800x450.png?text=Ollama+Chat+Interface)

## Features

- 🤖 Chat with multiple Ollama models
- 🔄 Switch between models during conversation
- 💭 View thinking process for supported models (like deepseek)
- 📱 Responsive design for desktop and mobile
- 🌐 Built with Nuxt 3 and Vue 3
- 🚀 Fast and lightweight

## Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v16 or newer)
- [Ollama](https://ollama.ai/) - Running locally on your machine
- Ollama models installed (at minimum one of these):
  - qwen2.5:1.5b
  - deepseek-r1:1.5b
  - llama3.2:latest

## Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/ollama-chat-interface.git
cd ollama-chat-interface
```

2. Install dependencies:

```bash
npm install
```

3. Make sure Ollama is running on your local machine:

```bash
# Start Ollama service
ollama serve
```

4. Pull the required models (if you haven't already):

```bash
ollama pull qwen2.5:1.5b
ollama pull deepseek-r1:1.5b
ollama pull llama3.2:latest
```

## Usage

### Development Server

Start the development server:

```bash
npm run dev
```

This will start the application on `http://localhost:3000`.

### Production Build

Build the application for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Configuration

The application is configured to work with Ollama running on the default host (`localhost:11434`). If your Ollama instance is running on a different host or port, you'll need to modify the `server/api/chat.ts` file.

## Customization

### Adding New Models

To add new models to the dropdown, edit the `availableModels` array in `app.vue`:

```javascript
const availableModels = ref(['qwen2.5:1.5b', 'deepseek-r1:1.5b', 'llama3.2:latest', 'your-new-model'])
```

### Styling

The application uses custom CSS for styling. You can modify the styles in the `<style>` section of `app.vue`.

## Troubleshooting

### Common Issues

1. **Connection Error**: Make sure Ollama is running on your machine with `ollama serve`.
2. **Model Not Found**: Ensure you've pulled the models you want to use with `ollama pull model-name`.
3. **Slow Responses**: Larger models require more resources. Consider using smaller models on less powerful hardware.

## License

[MIT](LICENSE)

## Acknowledgements

- [Ollama](https://ollama.ai/) for providing the local LLM runtime
- [Nuxt.js](https://nuxt.com/) for the Vue framework
- [Vue.js](https://vuejs.org/) for the frontend framework
