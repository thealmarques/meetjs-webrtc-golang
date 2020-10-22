package interfaces

import (
	"sync"

	"github.com/gorilla/websocket"
)

// Connection - Websocket connections
type Connection struct {
	Socket *websocket.Conn // websocket connection of the player
	mu     sync.Mutex
}

func (c *Connection) send(message Socket) error {
	c.mu.Lock()
	defer c.mu.Unlock()
	return c.Socket.WriteJSON(message)
}
