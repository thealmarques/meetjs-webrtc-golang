package controllers

import (
	"meetjs-server/src/interfaces"
	"meetjs-server/src/utils"
	"net/http"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson/primitive"
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

	result, _ := collection.InsertOne(ctx, session)
	insertedID := result.InsertedID.(primitive.ObjectID).Hex()

	hashedSession := CreateSocket(session, ctx, insertedID)
	ctx.JSON(http.StatusOK, gin.H{"socket": hashedSession})
}
