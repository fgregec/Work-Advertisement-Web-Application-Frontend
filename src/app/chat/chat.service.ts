import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { ChatMeta } from '../shared/models/chat-meta';
import { ChatRoom, Message } from '../shared/models/chat-room';
import { UserInfo } from '../shared/models/user-info';
import { Mestar } from '../shared/models/mestar';
import { Observable, Subject } from 'rxjs';
import { BasicUser } from '../shared/models/user';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private messageReceivedSubject = new Subject<Message>();
  public messageReceived$ = this.messageReceivedSubject.asObservable();
  
  private hubConnection!: signalR.HubConnection;

  constructor(private http: HttpClient) { }

  public startConnection = () => {
    this.hubConnection = new signalR.HubConnectionBuilder()
                            .withUrl('http://localhost:5001/chathub')
                            .configureLogging(signalR.LogLevel.Information)
                            .build();
    this.hubConnection
      .start()
      .then(() => {
        console.log('Connection started');
      
    })
      .catch(err => console.log('Error while starting connection: ' + err));
  }

  public joinChatRoom(mestar: Mestar){
    const user = this.getCurrentUserInfo();
    this.hubConnection.invoke('JoinPrivateChatRoom', user.id, mestar.id);
  }

  public joinChatRoomWithId(roomId: string){
    debugger
    var ids = roomId.split('_');
    this.hubConnection.invoke('JoinPrivateChatRoom', ids[0], ids[1]);
  }

  public getChatHistoryMetaData(){
    const user = this.getCurrentUserInfo();
    const headers = new HttpHeaders()
    .set('Authorization', `Bearer ${user.token}`)
    return this.http.get<ChatMeta[]>('http://localhost:5001/api/chat/meta', {headers: headers});
  }

  public getChatRoom(room: string){
    const user = this.getCurrentUserInfo();
    const headers = new HttpHeaders()
    .set('Authorization', `Bearer ${user.token}`)
    let params = new HttpParams()
      .set('roomId', room);
    return this.http.get<ChatRoom>('http://localhost:5001/api/chat/room', {headers, params});
  }

  public getCurrentUserInfo() {
    const stored = localStorage.getItem('user') ?? '';
    const user = JSON.parse(stored) as UserInfo;
    return user;
  }

  public sendMessage(user1: string, user2: string, content: string){
    this.hubConnection.invoke('SendMessageToPrivateChatRoom', user1, user2, content);
  }

  public addMessageListener = () => {
    this.hubConnection.on('ReceiveMessage', (message: Message) => {
      this.messageReceivedSubject.next(message);
    });
  }

  public searchUsers(input: string){
      return this.http.get<BasicUser[]>("http://localhost:5001/api/user/search" + '?input=' + input);  
  }
}


