export interface SocketResponse {
  type: string;
  data: string;
  userID: string;
}

export interface SocketEvent {
  data: string;
}