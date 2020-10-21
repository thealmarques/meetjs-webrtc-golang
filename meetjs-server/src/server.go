package main

import (
	"context"
	"log"
	"meetjs-server/src/controllers"
	"meetjs-server/src/interfaces"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}
var clients = make(map[*websocket.Conn]bool)

func wshandler(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Fatal("Error handling websocket connection.")
		return
	}

	clients[conn] = true

	var message interfaces.Message
	for {
		err = conn.ReadJSON(&message)
		if err != nil {
			if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway, websocket.CloseAbnormalClosure) {
				log.Printf("error: %v", err)
				delete(clients, conn)
			}
			break
		}
		switch message.Type {
		case "connect":
			message.Type = "session_joined"
			err := conn.WriteJSON(message)
			if err != nil {
				log.Printf("Websocket error: %s", err)
				delete(clients, conn)
			}
			break
		case "disconnect":
			delete(clients, conn)

			for client := range clients {
				err := client.WriteJSON(message)
				if err != nil {
					client.Close()
					delete(clients, client)
				}
			}
			break
		default:
			for client := range clients {
				err := client.WriteJSON(message)
				if err != nil {
					delete(clients, client)
				}
			}
		}
	}
}

func main() {
	router := gin.Default()

	credential := options.Credential{
		Username: "root",
		Password: "rootpassword",
	}

	clientOptions := options.Client().ApplyURI("mongodb://localhost:27017").SetAuth(credential)
	client, err := mongo.Connect(context.TODO(), clientOptions)
	if err != nil {
		log.Fatal(err)
	}

	err = client.Ping(context.TODO(), nil)
	if err != nil {
		log.Fatal(err)
	}

	log.Println("MongoDB connection ok...")

	// middleware - intercept requests to use our db controller
	router.Use(func(context *gin.Context) {
		context.Set("db", client)
		context.Next()
	})

	// REST API
	router.POST("/session", controllers.CreateSession)
	router.GET("/connect", controllers.GetSession)
	router.POST("/connect/:url", controllers.ConnectSession)

	// Websocket connection
	router.GET("/ws", func(c *gin.Context) {
		wshandler(c.Writer, c.Request)
	})

	router.Run("0.0.0.0:9000")
}
