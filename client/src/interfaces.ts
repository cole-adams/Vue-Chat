export interface MessageItem {
    content: string;
    timestamp: string;
    author: User;
}

export interface User {
    username: string;
    color: string;
}