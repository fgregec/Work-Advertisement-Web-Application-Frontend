import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ChatService } from './chat.service';
import { ChatMeta } from '../shared/models/chat-meta';
import { ChatRoom, Message } from '../shared/models/chat-room';
import { AccountService } from '../account/account.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  newMessage = new Observable<Message>(); 
 
  chatsMeta: ChatMeta[] = [];
  chatRoom!: ChatRoom;
  currentUserId!: string;
 
  constructor(private chatService: ChatService, private accountService: AccountService, private router: Router){}

  ngOnInit(): void {
    this.accountService.currentUser.subscribe(user => {
      if(!user)
        this.router.navigate(['/account/login']);
      else
        this.currentUserId = user?.id;
    })

    this.chatService.startConnection();
    this.chatService.getChatHistoryMetaData().subscribe(res => {
      this.chatsMeta = res;
    });

    this.chatService.addMessageListener();
  }

  roomSelected(roomId: string){
    this.chatService.getChatRoom(roomId).subscribe(res => {
      var meta = this.chatsMeta.filter(cm => cm.roomId == roomId)[0];
      res.displayName = `${meta.firstName} ${meta.lastName}`;
      this.chatRoom = res;

    })
    this.chatService.joinChatRoomWithId(roomId);
  }

  refreshMetas(){
    this.chatService.getChatHistoryMetaData().subscribe(res => {
      this.chatsMeta = res;
    });

  }

}
