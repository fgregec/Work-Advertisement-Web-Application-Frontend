import { Component, Input } from '@angular/core';
import { Message } from 'src/app/shared/models/chat-room';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent {
    @Input() message!: Message;
    @Input() currentUserId!: string;
}
