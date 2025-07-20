import { Component, ElementRef, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../sharedmodule/sharedmodule.module';
import { ChatService } from './services/chat.service';
import { WebSocketService } from './services/websocket.service';
import { ChatRoom, Message, User, WebSocketResponse, CreatePrivateRoomRequest } from './models/chat.models';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [SharedModule, CommonModule, FormsModule],
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.css'
})
export class MessagesComponent implements OnInit, OnDestroy {
  @ViewChild('sidebar') sidebar!: ElementRef;
  @ViewChild('conversationsList') conversationsList!: ElementRef;
  @ViewChild('messageInput') messageInput!: ElementRef;
  @ViewChild('messagesArea') messagesArea!: ElementRef;
  @ViewChild('typingIndicator') typingIndicator!: ElementRef;
  
  // Component state
  chatRooms: ChatRoom[] = [];
  selectedRoom: ChatRoom | null = null;
  messages: Message[] = [];
  currentUserId: string | null = null;
  messageText: string = '';
  isLoading: boolean = false;
  isConnected: boolean = false;
  typingUsers: Set<string> = new Set();
  
  // Subscriptions
  private subscriptions: Subscription[] = [];
  private typingTimeout: any;
  private isTyping: boolean = false;
  business_list:any[] = []
  constructor(
    private chatService: ChatService,
    private webSocketService: WebSocketService
  ) {}

  ngOnInit(): void {
    this.currentUserId = this.chatService.getCurrentUserId();
    this.loadChatRooms();
    this.setupWebSocketSubscriptions();

    // Enable HTTP-only messaging since WebSocket is disabled
    // This will be overridden when a room is selected
    this.isConnected = false; // Keep false initially to show proper state

    this.getBusinessList()
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.webSocketService.disconnect();
    if (this.typingTimeout) {
      clearTimeout(this.typingTimeout);
    }
  }

  ngAfterViewInit(): void {
    this.scrollToBottom();
    this.setupMessageInput();
  }

  private setupMessageInput(): void {
    const inputElement = this.messageInput?.nativeElement?.querySelector('textarea');
    if (inputElement) {
      // Auto resize message input
      inputElement.addEventListener('input', () => {
        inputElement.style.height = 'auto';
        inputElement.style.height = inputElement.scrollHeight + 'px';
        this.onTyping();
      });

      inputElement.addEventListener('keydown', (e: KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          this.sendMessage();
        }
      });

      inputElement.addEventListener('blur', () => {
        this.stopTyping();
      });
    }

    window.addEventListener('resize', () => {
      if (window.innerWidth > 768) {
        this.conversationsList.nativeElement.classList.remove('hidden');
      }
    });
  }

  toggleSidebar(): void {
    this.sidebar.nativeElement.classList.toggle('active');
  }

  showConversations(): void {
    this.conversationsList.nativeElement.classList.remove('hidden');
  }

  // Load chat rooms from backend
  private loadChatRooms(): void {
    this.isLoading = true;
    const subscription = this.chatService.getChatRooms().subscribe({
      next: (rooms) => {
        this.chatRooms = rooms;
        this.isLoading = false;
        // Auto-select first room if available
        if (rooms.length > 0 && !this.selectedRoom) {
          this.selectRoom(rooms[0]);
        }
      },
      error: (error) => {
        console.error('Error loading chat rooms:', error);
        this.isLoading = false;
      }
    });
    this.subscriptions.push(subscription);
  }

  // Setup WebSocket subscriptions
  private setupWebSocketSubscriptions(): void {
    // Subscribe to WebSocket messages
    const messageSubscription = this.webSocketService.getMessages().subscribe({
      next: (response: WebSocketResponse) => {
        this.handleWebSocketMessage(response);
      },
      error: (error) => {
        console.error('WebSocket error:', error);
      }
    });
    this.subscriptions.push(messageSubscription);

    // Subscribe to connection status
    const connectionSubscription = this.webSocketService.getConnectionStatus().subscribe({
      next: (isConnected) => {
        this.isConnected = isConnected;
      }
    });
    this.subscriptions.push(connectionSubscription);
  }

  // Handle WebSocket messages
  private handleWebSocketMessage(response: WebSocketResponse): void {
    switch (response.type) {
      case 'chat_message':
        if (response.message) {
          this.messages.push(response.message);
          this.scrollToBottom();
        }
        break;
      case 'typing_indicator':
        this.handleTypingIndicator(response);
        break;
      case 'read_receipt':
        this.handleReadReceipt(response);
        break;
      case 'message_edited':
        this.handleMessageEdited(response);
        break;
      case 'user_status':
        this.handleUserStatus(response);
        break;
    }
  }

  // Handle typing indicators
  private handleTypingIndicator(response: WebSocketResponse): void {
    if (response.user_id && response.user_id !== this.currentUserId) {
      if (response.is_typing) {
        this.typingUsers.add(response.user_id);
        this.showTypingIndicator();
      } else {
        this.typingUsers.delete(response.user_id);
        if (this.typingUsers.size === 0) {
          this.hideTypingIndicator();
        }
      }
    }
  }

  // Handle read receipts
  private handleReadReceipt(response: WebSocketResponse): void {
    if (response.message_id) {
      // Update message status in the messages array
      const message = this.messages.find(m => m.id === response.message_id);
      if (message) {
        // Update the message status
        console.log('Message marked as read:', response.message_id);
      }
    }
  }

  // Handle message edits
  private handleMessageEdited(response: WebSocketResponse): void {
    if (response.message) {
      const messageIndex = this.messages.findIndex(m => m.id === response.message!.id);
      if (messageIndex !== -1) {
        this.messages[messageIndex] = response.message;
      }
    }
  }

  // Handle user status updates
  private handleUserStatus(response: WebSocketResponse): void {
    // Update user online status
    console.log('User status updated:', response.user_id, response.status);
  }

  // Select a chat room
  selectRoom(room: ChatRoom): void {
    if (this.selectedRoom?.id === room.id) {
      return;
    }

    this.selectedRoom = room;
    this.messages = [];
    this.typingUsers.clear();
    
    // Disconnect from previous room
    this.webSocketService.disconnect();
    
    // Load messages for this room
    this.loadMessages(room.id);
    
    // Connect to WebSocket for this room
    this.webSocketService.connect(room.id);
    
    // Mark messages as read
    this.markRoomAsRead(room.id);
    
    // Update UI
    if (window.innerWidth <= 768) {
      this.conversationsList.nativeElement.classList.add('hidden');
    }
  }

  // Load messages for a room
  private loadMessages(roomId: string): void {
    this.isLoading = true;
    const subscription = this.chatService.getMessages(roomId).subscribe({
      next: (response) => {
        this.messages = response.results.reverse(); // Reverse to show oldest first
        this.isLoading = false;
        setTimeout(() => this.scrollToBottom(), 100);
      },
      error: (error) => {
        console.error('Error loading messages:', error);
        this.isLoading = false;
      }
    });
    this.subscriptions.push(subscription);
  }

  // Send a message
  sendMessage(): void {
    if (!this.selectedRoom || !this.messageText.trim()) {
      return;
    }

    const content = this.messageText.trim();
    this.messageText = '';
    
    // Reset input height
    const inputElement = this.messageInput?.nativeElement?.querySelector('textarea');
    if (inputElement) {
      inputElement.style.height = 'auto';
    }

    // Send via WebSocket for real-time delivery
    this.webSocketService.sendChatMessage(content);
    
    // Also send via HTTP API for persistence
    const subscription = this.chatService.sendMessage(this.selectedRoom.id, {
      content: content,
      message_type: 'text'
    }).subscribe({
      next: (message) => {
        // Message will be received via WebSocket
        console.log('Message sent successfully:', message);
      },
      error: (error) => {
        console.error('Error sending message:', error);
        // You might want to show an error message to the user
      }
    });
    this.subscriptions.push(subscription);
    
    // Stop typing indicator
    this.stopTyping();
  }

  // Handle typing events
  private onTyping(): void {
    if (!this.selectedRoom) return;
    
    if (!this.isTyping) {
      this.isTyping = true;
      this.webSocketService.startTyping();
    }
    
    // Clear existing timeout
    if (this.typingTimeout) {
      clearTimeout(this.typingTimeout);
    }
    
    // Set new timeout to stop typing
    this.typingTimeout = setTimeout(() => {
      this.stopTyping();
    }, 2000);
  }

  // Stop typing
  private stopTyping(): void {
    if (this.isTyping) {
      this.isTyping = false;
      this.webSocketService.stopTyping();
    }
    
    if (this.typingTimeout) {
      clearTimeout(this.typingTimeout);
      this.typingTimeout = null;
    }
  }

  // Mark room as read
  private markRoomAsRead(roomId: string): void {
    // Get unread messages and mark them as read
    const unreadMessages = this.messages
      .filter(m => m.sender.id !== this.currentUserId)
      .map(m => m.id);
    
    if (unreadMessages.length > 0) {
      const subscription = this.chatService.markMessagesAsRead(roomId, {
        message_ids: unreadMessages
      }).subscribe({
        next: () => {
          console.log('Messages marked as read');
        },
        error: (error) => {
          console.error('Error marking messages as read:', error);
        }
      });
      this.subscriptions.push(subscription);
    }
  }

  // Helper methods
  showTypingIndicator(): void {
    if (this.typingIndicator) {
      this.typingIndicator.nativeElement.style.display = 'flex';
      this.scrollToBottom();
    }
  }

  hideTypingIndicator(): void {
    if (this.typingIndicator) {
      this.typingIndicator.nativeElement.style.display = 'none';
    }
  }

  scrollToBottom(): void {
    if (this.messagesArea) {
      const el = this.messagesArea.nativeElement;
      setTimeout(() => {
        el.scrollTop = el.scrollHeight;
      }, 50);
    }
  }

  // Get display name for a user
  getDisplayName(user: User): string {
    return this.chatService.getDisplayName(user);
  }

  // Get initials for a user
  getInitials(user: User): string {
    return this.chatService.getInitials(user);
  }

  // Format time
  formatTime(dateString: string): string {
    return this.chatService.formatTime(dateString);
  }

  // Check if message is from current user
  isMyMessage(message: Message): boolean {
    return message.sender.id === this.currentUserId;
  }

  // Search functionality
  onSearchChange(event: Event): void {
    const input = (event.target as HTMLInputElement).value.toLowerCase();
    // Filter chatRooms based on search input
    // This would be implemented based on your specific search requirements
  }

  getBusinessList(){
    return this.chatService.getBusinessProfiles().subscribe((res:any)=>{
      this.business_list = res;
      console.log('this.business_list',this.business_list);
    })
  }

  // Start new conversation
  startNewConversation(): void {
    console.log('Starting new conversation...');
    // Modal will be opened by Bootstrap's data-bs-toggle attribute
  }

  // Method to handle creating a new conversation from modal selection
  createNewConversation(): void {
    // Collect selected business IDs from checkboxes within the modal
    const selectedBusinessIds = Array.from(document.querySelectorAll('#exampleModal input[type="checkbox"]:checked'))
      .map((checkbox: any) => checkbox.value)
      .filter(value => value); // Filter out empty values

    if (selectedBusinessIds.length === 0) {
      console.log('No businesses selected');
      return;
    }

    selectedBusinessIds.forEach(participantId => {
      // Create a new private chat room for each selected business
      const request: CreatePrivateRoomRequest = { participant_id: participantId };
      const subscription = this.chatService.createPrivateRoom(request).subscribe({
        next: (newRoom) => {
          console.log('New chat room created:', newRoom);
          this.chatRooms.push(newRoom);
          // Clear checkboxes after successful creation
          this.clearModalCheckboxes();
        },
        error: (error) => {
          console.error('Error creating chat room:', error);
        }
      });
      this.subscriptions.push(subscription);
    });
  }

  // Helper method to clear modal checkboxes
  private clearModalCheckboxes(): void {
    const checkboxes = document.querySelectorAll('#exampleModal input[type="checkbox"]');
    checkboxes.forEach((checkbox: any) => {
      checkbox.checked = false;
    });
  }

  // Get the display user for a room (the other participant in private rooms)
  getRoomDisplayUser(room: ChatRoom): User {
    if (room.room_type === 'group') {
      // For group rooms, we might show the first participant or use a default
      return room.participants[0] || { id: '', email: 'Group', first_name: 'Group', last_name: 'Chat' };
    }
    
    // For private rooms, get the other participant
    const otherParticipant = room.participants.find(p => p.id !== this.currentUserId);
    return otherParticipant || room.participants[0] || { id: '', email: 'Unknown', first_name: 'Unknown', last_name: 'User' };
  }

  // Get room display name
  getRoomDisplayName(room: ChatRoom): string {
    if (room.room_type === 'group' && room.name) {
      return room.name;
    }
    
    // For private rooms, show the other participant's name
    const displayUser = this.getRoomDisplayUser(room);
    return this.getDisplayName(displayUser);
  }

  // Check if user is online (placeholder implementation)
  isUserOnline(user: User): boolean {
    // This would be implemented based on your real-time user status tracking
    // For now, return false as a placeholder
    return false;
  }

  // Check if message has read receipt
  hasReadReceipt(message: Message): boolean {
    // Check if any of the message statuses show 'read'
    return message.statuses.some(status => status.status === 'read');
  }
}