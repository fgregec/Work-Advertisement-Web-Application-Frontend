import { AfterViewChecked, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ChatRoom } from 'src/app/shared/models/chat-room';
import { ChatService } from '../chat.service';
import { Message } from 'src/app/shared/models/chat-room';
import { Subscription } from 'rxjs';
import { FormControl } from '@angular/forms';
import { BasicUser } from 'src/app/shared/models/user';
import { Mestar } from 'src/app/shared/models/mestar';

@Component({
  selector: 'app-chat-room',
  templateUrl: './chat-room.component.html',
  styleUrls: ['./chat-room.component.scss']
})
export class ChatRoomComponent implements OnInit, AfterViewChecked {
  searchValue: string = '';
  private subscription: Subscription = new Subscription();
  @Input() chatRoom?: ChatRoom;
  @Input() userId!: string;
  @ViewChild('scrollMe') private myScrollContainer!: ElementRef;
  @Output() messageSent = new EventEmitter();

  myControl = new FormControl('');
  options: BasicUser[] = [];

  constructor(private chatService: ChatService){}

  ngOnInit() {
    this.scrollToBottom();

    this.subscription = this.chatService.messageReceived$.subscribe(message => {
      if (this.chatRoom && message.senderId != this.userId) {
        this.chatRoom.messages.push(message);
      }
    });
  }

  ngAfterViewChecked() {
      this.scrollToBottom();
  }

  scrollToBottom(): void {
      try {
          this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
      } catch(err) { }
  }

  sentMessage(message: any){
    if(this.chatRoom && this.userId)
      {
        var otherUser = this.chatRoom.user1 == this.userId ? this.chatRoom.user2 : this.chatRoom.user1;
        this.chatService.sendMessage(this.userId, otherUser, message);
        this.chatRoom.messages.push({
          senderId: this.userId,
          receiverId: otherUser,
          content: message,
          time: Date.now().toString()
        } as Message);
        this.searchValue = '';
        this.messageSent.emit();
      }

  }

  ngOnDestroy() {
    // Always unsubscribe on destroy to prevent memory leaks
    this.subscription.unsubscribe();
  }

  search(input: any) {
    this.chatService.searchUsers(input).subscribe({
      next: response => {
        this.options = response;
      }
    });
  }

  chat(user: BasicUser){
    var currentUser = this.chatService.getCurrentUserInfo();
    const sortedUserIds = [currentUser.id, user.id].sort();
    let roomId = `${sortedUserIds[0]}_${sortedUserIds[1]}`;
    this.chatRoom = {
      user1: currentUser.id,
      user2: user.id,
      displayName: `${user.firstName} ${user.lastName}`,
      roomName: roomId,
      messages: []
    } as ChatRoom;
    this.myControl.reset();
    this.chatService.joinChatRoomWithId(roomId);
  }
}