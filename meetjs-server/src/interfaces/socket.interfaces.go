package interfaces

// Socket interface
type Socket struct {
	SessionID string
	HashedURL string
	SocketURL string
}

// Message interface
type Message struct {
	Type   string `json:"type"`
	Data   string `json:"data"`
	UserID string `json:"userID"`
}
