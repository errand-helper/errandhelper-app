import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.css'
})
export class MessagesComponent {
  @ViewChild('sidebar') sidebar!: ElementRef;
  @ViewChild('conversationsList') conversationsList!: ElementRef;
  @ViewChild('messageInput') messageInput!: ElementRef;
  @ViewChild('messagesArea') messagesArea!: ElementRef;
  @ViewChild('typingIndicator') typingIndicator!: ElementRef;
  chatHeaderName: string = '';
  responses: string[] = [
    "I'll be there in about 15 minutes.",
    "Sure, I can help with that!",
    "Thanks for the quick response.",
    "I understand. I'll take care of it.",
    "Perfect! See you soon."
  ];

  ngAfterViewInit(): void {
    this.scrollToBottom();

    // Auto resize message input
    this.messageInput.nativeElement.addEventListener('input', () => {
      const el = this.messageInput.nativeElement;
      el.style.height = 'auto';
      el.style.height = el.scrollHeight + 'px';
    });

    this.messageInput.nativeElement.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        this.sendMessage();
      }
    });

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

  selectConversation(event: Event, name: string): void {
    const items = document.querySelectorAll('.conversation-item');
    items.forEach(item => item.classList.remove('active'));

    const target = event.currentTarget as HTMLElement;
    target.classList.add('active');
    this.chatHeaderName = name;

    const unreadCount = target.querySelector('.unread-count');
    if (unreadCount) unreadCount.remove();

    if (window.innerWidth <= 768) {
      this.conversationsList.nativeElement.classList.add('hidden');
    }

    this.scrollToBottom();
  }

  sendMessage(): void {
    const input = this.messageInput.nativeElement;
    const message = input.value.trim();

    if (message) {
      const messageGroup = document.createElement('div');
      messageGroup.className = 'message-group sent';
      messageGroup.innerHTML = `
        <div class="message-avatar">JD</div>
        <div class="message-content">
          <div class="message-bubble">${this.escapeHtml(message)}</div>
          <div class="message-time">${this.getCurrentTime()}</div>
        </div>
      `;

      this.messagesArea.nativeElement.insertBefore(messageGroup, this.typingIndicator.nativeElement);

      input.value = '';
      input.style.height = 'auto';

      this.scrollToBottom();

      setTimeout(() => this.showTypingIndicator(), 1000);
      setTimeout(() => {
        this.hideTypingIndicator();
        this.simulateResponse();
      }, 3000);
    }
  }

  escapeHtml(text: string): string {
    const map: { [char: string]: string } = {
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
  }

  getCurrentTime(): string {
    return new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  }

  showTypingIndicator(): void {
    this.typingIndicator.nativeElement.style.display = 'flex';
    this.scrollToBottom();
  }

  hideTypingIndicator(): void {
    this.typingIndicator.nativeElement.style.display = 'none';
  }

  simulateResponse(): void {
    const randomResponse = this.responses[Math.floor(Math.random() * this.responses.length)];
    const messageGroup = document.createElement('div');
    messageGroup.className = 'message-group received';
    messageGroup.innerHTML = `
      <div class="message-avatar">QE</div>
      <div class="message-content">
        <div class="message-bubble">${randomResponse}</div>
        <div class="message-time">${this.getCurrentTime()}</div>
      </div>
    `;
    this.messagesArea.nativeElement.insertBefore(messageGroup, this.typingIndicator.nativeElement);
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    const el = this.messagesArea.nativeElement;
    el.scrollTop = el.scrollHeight;
  }

  onSearchChange(event: Event): void {
    const input = (event.target as HTMLInputElement).value.toLowerCase();
    const items = document.querySelectorAll('.conversation-item');

    items.forEach(conv => {
      const name = conv.querySelector('.conversation-name')?.textContent?.toLowerCase() || '';
      const message = conv.querySelector('.conversation-last-message')?.textContent?.toLowerCase() || '';
      conv.setAttribute('style', name.includes(input) || message.includes(input) ? 'display: flex;' : 'display: none;');
    });
  }
}