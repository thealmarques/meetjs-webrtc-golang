package controllers

import (
	"meetjs-server/src/interfaces"
	"meetjs-server/src/utils"
	"net/http"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

// CreateSession - Creates user session
func CreateSession(ctx *gin.Context) {
	db := ctx.MustGet("db").(*mongo.Client)
	collection := db.Database("MeetJS").Collection("sessions")

	var session interfaces.Session
	if err := ctx.ShouldBindJSON(&session); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	session.Password = utils.HashPassword(session.Password)

	collection.InsertOne(ctx, session)

	ctx.Status(http.StatusOK)
}

// GetSession - Given a password returns the session object.
func GetSession(ctx *gin.Context) {
	db := ctx.MustGet("db").(*mongo.Client)
	collection := db.Database("MeetJS").Collection("sessions")

	var input interfaces.Session
	if err := ctx.ShouldBindJSON(&input); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	cursor, err := collection.Find(ctx, bson.M{"host": input.Host})
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Session not found."})
		return
	}

	for cursor.Next(ctx) {
		var session interfaces.Session

		err = cursor.Decode(&session)
		if err != nil {
			ctx.JSON(http.StatusBadRequest, gin.H{"error": "Error decoding session."})
			return
		}

		if utils.ComparePasswords(session.Password, []byte(input.Password)) {
			ctx.JSON(http.StatusOK, gin.H{"socket": "socket connection"})
		}
	}
}
