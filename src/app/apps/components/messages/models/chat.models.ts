export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
}

export interface MessageStatus {
  user: User;
  status: 'sent' | 'delivered' | 'read';
  timestamp: string;
}

export interface Message {
  id: string;
  content: string;
  message_type: 'text' | 'image' | 'file' | 'system';
  file_url?: string;
  sender: User;
  created_at: string;
  updated_at: string;
  is_edited: boolean;
  edited_at?: string;
  statuses: MessageStatus[];
}

export interface ChatRoomMembership {
  user: User;
  role: 'member' | 'admin' | 'owner';
  joined_at: string;
  unread_count: number;
}

export interface ChatRoom {
  id: string;
  name?: string;
  room_type: 'private' | 'group';
  participants: User[];
  created_at: string;
  updated_at: string;
  last_message?: Message;
  unread_count: number;
}

export interface CreatePrivateRoomRequest {
  participant_id: string;
}

export interface CreateGroupRoomRequest {
  name: string;
  participant_ids: string[];
}

export interface SendMessageRequest {
  content: string;
  message_type?: 'text' | 'image' | 'file';
  file_url?: string;
}

export interface EditMessageRequest {
  content: string;
}

export interface MarkAsReadRequest {
  message_ids: string[];
}

export interface TypingIndicatorRequest {
  is_typing: boolean;
}

export interface AddParticipantRequest {
  participant_id: string;
}

// WebSocket message types
export interface WebSocketMessage {
  type: 'chat_message' | 'typing_start' | 'typing_stop' | 'mark_as_read' | 'edit_message';
  message?: string;
  message_type?: 'text' | 'image' | 'file';
  file_url?: string;
  message_id?: string;
  new_content?: string;
}

export interface WebSocketResponse {
  type: 'chat_message' | 'typing_indicator' | 'read_receipt' | 'message_edited' | 'user_status';
  message?: Message;
  user_id?: string;
  user_email?: string;
  is_typing?: boolean;
  message_id?: string;
  status?: string;
}

export interface TypingIndicator {
  user: User;
  is_typing: boolean;
  timestamp: string;
}

export interface PaginatedResponse<T> {
  count: number;
  next?: string;
  previous?: string;
  results: T[];
}
