type Listener = (payload: unknown) => void;

class RealtimeClient {
  private socket: WebSocket | null = null;
  private listeners = new Map<string, Listener[]>();

  connect(url: string) {
    if (typeof window === 'undefined') return;
    if (this.socket) return;

    this.socket = new WebSocket(url);

    this.socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        const listeners = this.listeners.get(data.type) || [];
        listeners.forEach((listener) => listener(data.payload));
      } catch (error) {
        console.error('Realtime parsing error', error);
      }
    };
  }

  subscribe(type: string, listener: Listener) {
    const current = this.listeners.get(type) || [];
    this.listeners.set(type, [...current, listener]);
  }

  disconnect() {
    this.socket?.close();
    this.socket = null;
  }
}

export const realtimeClient = new RealtimeClient();
