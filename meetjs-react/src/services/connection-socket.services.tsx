import { SocketEvent } from "../interfaces/socket-data";

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
   * @param data data to send
   * @param type event type
   * @param userID user id
   * @param offer RTC offer
   */
  send(type: string, userID: string) {
    this.connection.send(JSON.stringify({
      type,
      userID
    }));
  }

  sendDescription(type: string, description: RTCSessionDescriptionInit, userID: string, to: string) {
    this.connection.send(JSON.stringify({
      type,
      userID,
      description: JSON.stringify(description),
      to
    }));
  }

  candidate(candidate: RTCIceCandidate, userID: string) {
    this.connection.send(JSON.stringify({
      candidate: JSON.stringify(candidate),
      userID,
      type: 'ice'
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