package handlers

import (
    "context"
    "log"
    "time"

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

    ctx, _ := context.WithTimeout(context.Background(), 10*time.Second)
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

// SaveImage stocke une image dans la base de données.
func (handler *DBHandler) SaveImage(image ImageData) error {
    collection := handler.database.Collection("images")
    ctx, _ := context.WithTimeout(context.Background(), 5*time.Second)
    _, err := collection.InsertOne(ctx, image)
    return err
}

