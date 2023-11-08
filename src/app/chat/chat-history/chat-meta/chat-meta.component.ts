import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ChatMeta } from 'src/app/shared/models/chat-meta';

@Component({
  selector: 'app-chat-meta',
  templateUrl: './chat-meta.component.html',
  styleUrls: ['./chat-meta.component.scss']
})
export class ChatMetaComponent {
  @Input() chat!: ChatMeta;
  @Output() roomSelected = new EventEmitter<string>();

  openRoom(roomId: string){
    this.roomSelected.emit(roomId);
  }
}
