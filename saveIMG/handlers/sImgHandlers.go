package handlers

import (
	"context"
	"log"
	"saveIMG/models"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"go.mongodb.org/mongo-driver/mongo/readpref"
)

// DBHandler contient la connexion à la base de données.
type DBHandler struct {
    client   *mongo.Client
    database *mongo.Database
}

// NewDBHandler crée une nouvelle instance de DBHandler.
func NewDBHandler(uri, dbName string) *DBHandler {
    client, err := mongo.NewClient(options.Client().ApplyURI(uri))
    if err != nil {
        log.Fatal(err)
    }

    ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
    defer cancel()
    err = client.Connect(ctx)
    if err != nil {
        log.Fatal(err)
    }

    // Vérifie la connexion
    err = client.Ping(ctx, readpref.Primary())
    if err != nil {
        log.Fatal(err)
    }

    db := client.Database(dbName)
    return &DBHandler{client: client, database: db}
}

// SaveImagePath sauvegarde le chemin de l'image dans la base de données.
func (handler *DBHandler) SaveImagePath(image models.ImageData) error {
    collection := handler.database.Collection("images")
    ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
    defer cancel()
    _, err := collection.InsertOne(ctx, bson.M{
        "name":         image.Name,
        "path":         image.Path, // Sauvegarde du chemin de l'image
        "contentType":  image.ContentType,
    })
    return err
}
