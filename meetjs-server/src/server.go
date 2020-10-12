package main

import (
	"context"
	"log"
	"meetjs-server/src/controllers"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

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

	router.POST("/session", controllers.CreateSession)
	router.GET("/connect", controllers.GetSession)
	router.POST("/connect/:socket", controllers.ConnectSession)

	router.Run("0.0.0.0:9000")
}
