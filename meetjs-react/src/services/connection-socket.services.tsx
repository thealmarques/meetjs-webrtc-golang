import { SocketEvent, SocketResponse } from "../interfaces/socket-data";

export class ConnectionSocket {
  private connection: WebSocket;

  constructor(url: string) {
    this.connection = new WebSocket(url);
  }

  /**
   * Disconnect
   */
  disconnect() {
    this.connection.close();
  }
  
  /**
   * On open connection event.
   * @param callback handles on connection ready.
   */
  onOpen(callback: () => void) {
    this.connection.onopen = callback;
  }

  /**
   * Sends message through web sockets.
   * @param message message to send
   */
  send(message: string, type: string, userId: string) {
    this.connection.send(JSON.stringify({
      data: message,
      type: type,
      userID: userId
    }));
  }

  /**
   * On message received.
   * @param callback method to handle on message function.
   */
  onMessage(callback: (event: Event & SocketEvent) => void) {
    this.connection.onmessage = callback;
  }

  /**
   * Checks if connection is ready.
   */
  isReady(): boolean {
    return this.connection.readyState === this.connection.OPEN;
  }
}