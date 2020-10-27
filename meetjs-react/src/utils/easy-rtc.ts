import { StunServers } from "../interfaces/stun-servers";

export class EasyRTC {
  servers: StunServers;
  stream: MediaStream;
  peerConnection: RTCPeerConnection;

  constructor(servers: StunServers, stream: MediaStream) {
    this.servers = servers;
    this.stream = stream;

    this.peerConnection = new RTCPeerConnection(servers);

    this.stream.getTracks().forEach((track: MediaStreamTrack) => {
      this.peerConnection.addTrack(track);
    });
  }

  /**
   * Creates offer to send to remote peers.
   */
  async createOffer() {
    let sessionDescription: RTCSessionDescriptionInit;
    sessionDescription = await this.peerConnection.createOffer();
    this.peerConnection.setLocalDescription(sessionDescription);
    
    return sessionDescription;
  }

  /**
   * Creates answer when offer is received.
   */
  async createAnswer() {
    let sessionDescription: RTCSessionDescriptionInit;
    sessionDescription = await this.peerConnection.createAnswer();
    this.peerConnection.setLocalDescription(sessionDescription)

    return sessionDescription;
  }

  /**
   * Receives answer from remote peers.
   */
  async receiveAnswer(event: RTCSessionDescriptionInit | undefined) {
    if (event) {
      await this.peerConnection.setRemoteDescription(new RTCSessionDescription(event))
    }
  }

  /**
   * 
   * @param candidate 
   */
  async addCandidate(candidate: RTCIceCandidate) {
    await this.peerConnection.addIceCandidate(candidate);
  }

  onTrack(callback: (event: RTCTrackEvent) => void) {
    this.peerConnection.ontrack = callback ;
  }

  onIceCandidate(callback: (event: RTCPeerConnectionIceEvent) => void) {
    this.peerConnection.onicecandidate = callback ;
  }

  async setRemoteDescription(description: RTCSessionDescriptionInit) {
    await this.peerConnection.setRemoteDescription(description);
  }

  addIceCandidate(candidate: RTCIceCandidate) {
    this.peerConnection.addIceCandidate(candidate);
  }

  disconnect() {
    this.peerConnection.close();
  }
}