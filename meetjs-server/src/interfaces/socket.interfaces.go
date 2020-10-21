package interfaces

// Socket interface
type Socket struct {
	SessionID string
	HashedURL string
	SocketURL string
}

// Message interface
type Message struct {
	Type        string `json:"type"`
	UserID      string `json:"userID"`
	Description string `json:"description"`
	Candidate   string `json:"candidate"`
	To          string `json:"to"`
}
