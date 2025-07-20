import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import {
  ChatRoom,
  Message,
  User,
  CreatePrivateRoomRequest,
  CreateGroupRoomRequest,
  SendMessageRequest,
  EditMessageRequest,
  MarkAsReadRequest,
  TypingIndicatorRequest,
  AddParticipantRequest,
  PaginatedResponse
} from '../models/chat.models';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private baseUrl = environment.baseUrl;
  private chatApiUrl = `${this.baseUrl}chat/`;

  constructor(private http: HttpClient) { }

  getBusinessProfiles(){
    return this.http.get(`${this.baseUrl}business_profile/profiles/`, {
      headers: this.getAuthHeaders()
    });
  }

  // Helper method to get authentication headers
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('access_token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  // Chat Room endpoints
  getChatRooms(): Observable<ChatRoom[]> {
    return this.http.get<ChatRoom[]>(`${this.chatApiUrl}rooms/`, {
      headers: this.getAuthHeaders()
    });
  }

  getChatRoom(roomId: string): Observable<ChatRoom> {
    return this.http.get<ChatRoom>(`${this.chatApiUrl}rooms/${roomId}/`, {
      headers: this.getAuthHeaders()
    });
  }

  createPrivateRoom(data: CreatePrivateRoomRequest): Observable<ChatRoom> {
    return this.http.post<ChatRoom>(`${this.chatApiUrl}rooms/private/`, data, {
      headers: this.getAuthHeaders()
    });
  }

  createGroupRoom(data: CreateGroupRoomRequest): Observable<ChatRoom> {
    return this.http.post<ChatRoom>(`${this.chatApiUrl}rooms/group/`, data, {
      headers: this.getAuthHeaders()
    });
  }

  // Message endpoints
  getMessages(roomId: string, page: number = 1, pageSize: number = 50): Observable<PaginatedResponse<Message>> {
    return this.http.get<PaginatedResponse<Message>>(`${this.chatApiUrl}rooms/${roomId}/messages/`, {
      headers: this.getAuthHeaders(),
      params: {
        page: page.toString(),
        page_size: pageSize.toString()
      }
    });
  }

  sendMessage(roomId: string, data: SendMessageRequest): Observable<Message> {
    return this.http.post<Message>(`${this.chatApiUrl}rooms/${roomId}/messages/`, data, {
      headers: this.getAuthHeaders()
    });
  }

  editMessage(roomId: string, messageId: string, data: EditMessageRequest): Observable<Message> {
    return this.http.patch<Message>(`${this.chatApiUrl}rooms/${roomId}/messages/${messageId}/`, data, {
      headers: this.getAuthHeaders()
    });
  }

  deleteMessage(roomId: string, messageId: string): Observable<void> {
    return this.http.delete<void>(`${this.chatApiUrl}rooms/${roomId}/messages/${messageId}/`, {
      headers: this.getAuthHeaders()
    });
  }

  // Mark messages as read
  markMessagesAsRead(roomId: string, data: MarkAsReadRequest): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.chatApiUrl}rooms/${roomId}/mark-read/`, data, {
      headers: this.getAuthHeaders()
    });
  }

  // Typing indicators
  setTypingIndicator(roomId: string, data: TypingIndicatorRequest): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.chatApiUrl}rooms/${roomId}/typing/`, data, {
      headers: this.getAuthHeaders()
    });
  }

  // Participant management
  getRoomParticipants(roomId: string): Observable<User[]> {
    return this.http.get<User[]>(`${this.chatApiUrl}rooms/${roomId}/participants/`, {
      headers: this.getAuthHeaders()
    });
  }

  addParticipant(roomId: string, data: AddParticipantRequest): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.chatApiUrl}rooms/${roomId}/participants/`, data, {
      headers: this.getAuthHeaders()
    });
  }

  removeParticipant(roomId: string, participantId: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.chatApiUrl}rooms/${roomId}/participants/${participantId}/`, {
      headers: this.getAuthHeaders()
    });
  }

  // User search
  searchUsers(query: string): Observable<User[]> {
    return this.http.get<User[]>(`${this.chatApiUrl}users/search/`, {
      headers: this.getAuthHeaders(),
      params: { q: query }
    });
  }

  // Helper methods
  getDisplayName(user: User): string {
    if (user.first_name && user.last_name) {
      return `${user.first_name} ${user.last_name}`;
    }
    return user.email;
  }

  getInitials(user: User): string {
    if (user.first_name && user.last_name) {
      return `${user.first_name.charAt(0)}${user.last_name.charAt(0)}`.toUpperCase();
    }
    return user.email.charAt(0).toUpperCase();
  }

  formatTime(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.abs(now.getTime() - date.getTime()) / 36000000;

    if (diffInHours < 24) {
      return date.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit', 
        hour12: true 
      });
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else if (diffInHours < 168) { // 7 days
      return date.toLocaleDateString('en-US', { weekday: 'long' });
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
    }
  }

  getCurrentUserId(): string | null {
    // This should return the current user's ID from your auth service
    // You might need to decode the JWT token or get it from your auth service
    const token = localStorage.getItem('access_token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.user_id;
      } catch (error) {
        console.error('Error decoding token:', error);
        return null;
      }
    }
    return null;
  }
}
