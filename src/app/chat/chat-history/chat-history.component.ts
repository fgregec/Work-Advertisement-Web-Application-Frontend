import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ChatMeta } from 'src/app/shared/models/chat-meta';
import { BasicUser } from 'src/app/shared/models/user';
import { ChatService } from '../chat.service';

@Component({
  selector: 'app-chat-history',
  templateUrl: './chat-history.component.html',
  styleUrls: ['./chat-history.component.scss']
})
export class ChatHistoryComponent implements OnInit {
  @Input() chats: ChatMeta[] = [];
  @Output() roomMetaSelected = new EventEmitter<string>();

  myControl = new FormControl('');
  options: BasicUser[] = [];

  constructor(private chatService: ChatService) {}

  ngOnInit() {}

  roomSelected(roomId: string) {
    this.roomMetaSelected.emit(roomId);
  }

  search(input: any) {
    this.chatService.searchUsers(input).subscribe({
      next: response => {
        this.options = response;
      }
    });
  }
}
