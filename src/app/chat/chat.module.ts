import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChatRoutingModule } from './chat-routing.module';
import { ChatRoomComponent } from './chat-room/chat-room.component';
import { ChatHistoryComponent } from './chat-history/chat-history.component';
import { SharedModule } from '../shared/shared.module';
import { ChatComponent } from './chat.component';
import { ChatMetaComponent } from './chat-history/chat-meta/chat-meta.component';
import { MessageComponent } from './chat-room/message/message.component';


@NgModule({
  declarations: [
    ChatRoomComponent,
    ChatHistoryComponent,
    ChatComponent,
    ChatMetaComponent,
    MessageComponent
  ],
  imports: [
    CommonModule,
    ChatRoutingModule,
    SharedModule
  ],
})
export class ChatModule { }
