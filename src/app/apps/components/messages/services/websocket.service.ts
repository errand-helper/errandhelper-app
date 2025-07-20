import { Injectable } from '@angular/core';
import { Subject, Observable, BehaviorSubject } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { WebSocketMessage, WebSocketResponse } from '../models/chat.models';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private socket: WebSocket | null = null;
  private messageSubject = new Subject<WebSocketResponse>();
  private connectionStatusSubject = new BehaviorSubject<boolean>(false);
  private currentRoomId: string | null = null;

  constructor() { }

  // Connect to WebSocket for a specific room
  connect(roomId: string): void {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.disconnect();
    }

    this.currentRoomId = roomId;
    const token = localStorage.getItem('access_token');
    
    if (!token) {
      console.error('No access token found');
      return;
    }

    const socketUrl = `${environment.wsUrl}ws/chat/${roomId}/?token=${token}`;

    this.socket = new WebSocket(socketUrl);

    this.socket.onopen = (event) => {
      console.log('WebSocket connection opened:', event);
      this.connectionStatusSubject.next(true);
    };

    this.socket.onmessage = (event) => {
      try {
        const data: WebSocketResponse = JSON.parse(event.data);
        this.messageSubject.next(data);
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    this.socket.onclose = (event) => {
      console.log('WebSocket connection closed:', event);
      this.connectionStatusSubject.next(false);
      this.socket = null;
    };

    this.socket.onerror = (error) => {
      console.error('WebSocket error:', error);
      this.connectionStatusSubject.next(false);
    };
  }

  // Disconnect from WebSocket
  disconnect(): void {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
      this.currentRoomId = null;
      this.connectionStatusSubject.next(false);
    }
  }

  // Send a message through WebSocket
  sendMessage(message: WebSocketMessage): void {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(message));
    } else {
      console.error('WebSocket is not connected');
    }
  }

  // Send a chat message
  sendChatMessage(content: string, messageType: 'text' | 'image' | 'file' = 'text', fileUrl?: string): void {
    this.sendMessage({
      type: 'chat_message',
      message: content,
      message_type: messageType,
      file_url: fileUrl
    });
  }

  // Send typing indicator
  startTyping(): void {
    this.sendMessage({
      type: 'typing_start'
    });
  }

  stopTyping(): void {
    this.sendMessage({
      type: 'typing_stop'
    });
  }

  // Mark message as read
  markAsRead(messageId: string): void {
    this.sendMessage({
      type: 'mark_as_read',
      message_id: messageId
    });
  }

  // Edit message
  editMessage(messageId: string, newContent: string): void {
    this.sendMessage({
      type: 'edit_message',
      message_id: messageId,
      new_content: newContent
    });
  }

  // Observable for incoming messages
  getMessages(): Observable<WebSocketResponse> {
    return this.messageSubject.asObservable();
  }

  // Observable for connection status
  getConnectionStatus(): Observable<boolean> {
    return this.connectionStatusSubject.asObservable();
  }

  // Check if WebSocket is connected
  isConnected(): boolean {
    return this.socket !== null && this.socket.readyState === WebSocket.OPEN;
  }

  // Get current room ID
  getCurrentRoomId(): string | null {
    return this.currentRoomId;
  }

  // Reconnect to the same room
  reconnect(): void {
    if (this.currentRoomId) {
      this.connect(this.currentRoomId);
    }
  }
}
