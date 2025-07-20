# ErrandHelper Frontend Chat System Documentation

## Overview

The ErrandHelper frontend chat system is built using Angular and provides real-time messaging capabilities through WebSocket connections.

## Architecture

### Components
- **MessagesComponent**: Main chat interface component
- **Chat Service**: Handles API communication with backend
- **WebSocket Service**: Manages real-time WebSocket connections

### Key Files
1. `messages.component.ts` - Main chat component
2. `chat.service.ts` - HTTP API service for chat operations
3. `websocket.service.ts` - WebSocket connection management
4. `chat.models.ts` - TypeScript interfaces and models

## Features

### Real-time Messaging
- WebSocket connection for instant message delivery
- Automatic reconnection on connection loss
- Message status indicators (sent, delivered, read)

### Chat Management
- Create and join chat rooms
- View message history
- User presence indicators
- File sharing capabilities

### User Experience
- Responsive design for mobile and desktop
- Emoji support
- Message search and filtering
- Notification system

## API Integration

The frontend communicates with the Django backend through:
- REST API endpoints for chat management
- WebSocket connections for real-time messaging
- JWT authentication for secure access

## Setup and Configuration

1. Install dependencies: `npm install`
2. Configure WebSocket endpoint in environment files
3. Set API base URL for backend communication
4. Run development server: `ng serve`

## Testing

- Unit tests: `ng test`
- E2E tests: `ng e2e`
- Component testing with Angular Testing Utilities

