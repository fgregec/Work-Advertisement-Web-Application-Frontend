export interface ChatRoom{
    roomName: string;
    user1: string;
    user2: string;
    messages: Message[];
    displayName?: string;
}

export interface Message{
    id: string;
    senderId: string;
    receiverId: string;
    content: string;
    time: string;
}