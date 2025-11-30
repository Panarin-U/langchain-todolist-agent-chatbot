# Todo List Agent with LINE Chatbot

An intelligent todo list application powered by LangChain and Ollama, with LINE chatbot integration for managing tasks via chat interface.

## Demo
[![Watch the video](./video-preview/Screenshot%202568-11-30%20at%2013.12.14.png)](./video-preview/todolist-short.mp4)

## Features

- AI-powered task management through LINE chatbot
- CRUD operations via natural language
- Web UI for viewing tasks
- Docker containerized deployment
- PostgreSQL database

## Architecture

```
src/
  agent/        # LINE chatbot & LLM logic
    index.js    # Express server & LINE webhook
    llms.js     # Ollama LLM configuration
    tools.js    # Task CRUD tools
  api/          # REST API
    server.js   # API server
    index.js    # API routes
    repo.js     # Database repository
  ui/           # Frontend
    server.js   # UI server (Node.js)
    index.js    # React app
public/         # Static files
dockerfiles/    # Docker configurations
docker-compose.yml

```

## Prerequisites

- Node.js 18+ (or Docker)
- PostgreSQL 15+ (or use Docker Compose)
- Ollama
- LINE Messaging API account

## Installation

### 1. Setup LINE Chatbot

1. Go to [LINE Developers Console](https://developers.line.biz/)
2. Create a new Provider (if you don't have one)
3. Create a new Messaging API channel
4. Get your credentials:
   - **Channel Secret**: Basic settings í Channel secret
   - **Channel Access Token**: Messaging API í Channel access token (Long-lived)
5. Set webhook URL:
   - For local development, use ngrok to expose port 3000:
     ```bash
     # Install ngrok (if not installed)
     brew install ngrok

     # Start ngrok tunnel
     ngrok http 3000
     ```
   - Copy the HTTPS URL from ngrok (e.g., `https://abc123.ngrok.io`)
   - Go to Messaging API tab in LINE Developers Console
   - Set Webhook URL to: `https://abc123.ngrok.io/callback`
   - Enable "Use webhook"
   - Disable "Auto-reply messages" (optional)

   **Note:** For production, replace ngrok URL with your actual domain

### 2. Install Ollama

**On macOS (using Homebrew):**
```bash
# Install Ollama
brew install ollama

# Pull the llama3.1 model
ollama pull llama3.1

# Verify installation
ollama list
```


### 3. Clone and Configure

```bash
# Clone the repository
git clone <repository-url>
cd todo-list-agent

# Copy environment file
cp .env.example .env

# Edit .env and add your credentials
nano .env
```

**.env configuration:**
```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=todo_db
DB_USER=postgres
DB_PASSWORD=postgres

# LINE Chatbot
CHANNEL_SECRET=your_channel_secret_here
CHANNEL_ACCESS_TOKEN=your_channel_access_token_here

# Ollama
OLLAMA_BASE_URL=http://localhost:11434

# Ports
PORT=3000
API_PORT=3001
UI_PORT=3002
```

### 4. Database Setup

**Using Docker (Recommended):**
```bash
docker-compose up -d postgres
```

**Manual setup:**
```bash
# Create database
psql -U postgres -c "CREATE DATABASE todo_db;"

# Run init script
psql -U postgres -d todo_db -f init.sql
```

### 5. Install Dependencies

```bash
npm install --legacy-peer-deps
```

## Running the Application

### Option 1: Docker Compose (Recommended)

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

Services will be available at:
- **LINE Chatbot**: http://localhost:3000
- **REST API**: http://localhost:3001
- **Web UI**: http://localhost:3002

### Option 2: Manual Start

**Terminal 1 - Start Ollama:**
```bash
ollama serve
```

**Terminal 2 - Start API Server:**
```bash
node src/api/server.js
```

**Terminal 3 - Start LINE Bot Server:**
```bash
node src/agent/index.js
```

**Terminal 4 - Start UI Server:**
```bash
# Using nginx (production)
# Build and serve with Docker

# OR using Node.js (development)
node src/ui/server.js
```

## Testing

### 1. Test via LINE Chatbot

1. Add your LINE bot as a friend (scan QR code from LINE Developers Console)
2. Send messages in Thai to manage tasks:


### 2. Test via Web UI

1. Open browser and go to: http://localhost:3002
2. You should see the todo list with all tasks
3. Click "Refresh" to reload tasks

### 3. Test via REST API

```bash
# Get all tasks
curl http://localhost:3001/api/listAllTask

# Create a task
curl -X POST http://localhost:3001/api/task \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Task","status":"pending"}'

# Get task by ID
curl http://localhost:3001/api/task/1

# Update task
curl -X PUT http://localhost:3001/api/task/1 \
  -H "Content-Type: application/json" \
  -d '{"title":"Updated Task","status":"completed"}'

# Delete task
curl -X DELETE http://localhost:3001/api/task/1
```

## Development

### Project Structure

- **src/agent/** - LINE chatbot integration with Ollama LLM
- **src/api/** - RESTful API for task management
- **src/ui/** - React-based web interface
- **dockerfiles/** - Docker configurations for each service
- **public/** - Static HTML files

### Available Docker Configurations

- `dockerfiles/Dockerfile.ui` - Nginx-based UI (production)
- `dockerfiles/Dockerfile.ui.node` - Node.js-based UI (development)
- `dockerfiles/Dockerfile.api` - API server

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DB_HOST` | PostgreSQL host | localhost |
| `DB_PORT` | PostgreSQL port | 5432 |
| `DB_NAME` | Database name | todo_db |
| `DB_USER` | Database user | postgres |
| `DB_PASSWORD` | Database password | postgres |
| `CHANNEL_SECRET` | LINE channel secret | - |
| `CHANNEL_ACCESS_TOKEN` | LINE access token | - |
| `OLLAMA_BASE_URL` | Ollama API URL | http://localhost:11434 |
| `PORT` | LINE bot server port | 3000 |
| `API_PORT` | API server port | 3001 |
| `UI_PORT` | UI server port | 3002 |

## Troubleshooting

### Ollama Connection Issues

```bash
# Check if Ollama is running
curl http://localhost:11434/api/tags

# If using Docker, use host.docker.internal
OLLAMA_BASE_URL=http://host.docker.internal:11434
```

### LINE Webhook Errors

1. Check if webhook URL is accessible from internet (use ngrok for local development)
2. Verify CHANNEL_SECRET and CHANNEL_ACCESS_TOKEN are correct
3. Check logs: `docker-compose logs app`

### Database Connection Issues

```bash
# Check if PostgreSQL is running
docker-compose ps postgres

# View database logs
docker-compose logs postgres
```

## License

MIT

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.
