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
        "path":         image.Path,
        "contentType":  image.ContentType,
        "extract_data": updateData.ExctractData, 
    })
    return err
}

func (handler *DBHandler) FindImageByID(id string) (*models.ImageData, error) {
    var image models.ImageData
    collection := handler.database.Collection("images")
    ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
    defer cancel()

    err := collection.FindOne(ctx, bson.M{"_id": id}).Decode(&image)
    if err != nil {
        return nil, err
    }

    return &image, nil
}

func (handler *DBHandler) UpdateImage(id string, updateData models.ImageData) error {
    collection := handler.database.Collection("images")
    ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
    defer cancel()

    update := bson.M{
        "$set": bson.M{
            "name":        updateData.Name,
            "path":        updateData.Path,
            "contentType": updateData.ContentType,
            "extract_data": updateData.ExctractData,
        },
    }

    _, err := collection.UpdateByID(ctx, id, update)
    return err
}