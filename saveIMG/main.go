package main

import (
	"fmt"
	"log"
	"os"
	"path/filepath"
	"saveIMG/handlers"
	"saveIMG/models"
	"go.mongodb.org/mongo-driver/mongo"
    "net/http"

	"github.com/gin-gonic/gin"
)

func main() {
    router := gin.Default()

    db_uri, ok := os.LookupEnv("DB_URI")
    if !ok{
        log.Fatal("DB uri not found")
    }
    
    save_port, ok := os.LookupEnv("SAVE_IMG_PORT")
    if !ok{
        log.Fatal("saving port not found")
    }

    // Configuration de la base de données
    dbHandler := handlers.NewDBHandler(db_uri, "imageDB")

    // Définir les routes
    router.POST("/upload", func(c *gin.Context) {
        // Récupération du fichier image de la requête
        file, header, err := c.Request.FormFile("image")
        if err != nil {
            c.JSON(400, gin.H{"error": err.Error()})
            return
        }
        defer file.Close()

        // Définir le chemin où sauvegarder l'image
        imagePath := fmt.Sprintf("./images/%s", header.Filename)
        if err := os.MkdirAll(filepath.Dir(imagePath), os.ModePerm); err != nil {
            c.JSON(500, gin.H{"error": err.Error()})
            return
        }

        // Sauvegarder l'image dans le dossier img
        if err := c.SaveUploadedFile(header, imagePath); err != nil {
            c.JSON(500, gin.H{"error": err.Error()})
            return
        }

        // Création de l'objet ImageData avec le chemin de l'image
        imageData := models.ImageData{
            Name: header.Filename,
            Path: imagePath, // Utilisez le chemin de l'image au lieu des données binaires
            ContentType: header.Header.Get("Content-Type"),
        }

        // Sauvegarder le chemin de l'image dans MongoDB
        var insertedID string
        insertedID, err = dbHandler.SaveImagePath(imageData)
        if err != nil {
            c.JSON(500, gin.H{"error": err.Error()})
            return
        }

        c.JSON(200, gin.H{"message": "Image uploaded and path saved successfully","ID":insertedID})
    })

    router.GET("/images/:filename", func(c *gin.Context) {
        filename := c.Param("filename")
        imagePath := fmt.Sprintf("./images/%s", filename)
        c.File(imagePath)
    })

    router.GET("/image/:id", func(c *gin.Context) {
        id := c.Param("id")
        image, err := dbHandler.FindImageByID(id)
        if err != nil {
            if err == mongo.ErrNoDocuments {
                c.JSON(http.StatusNotFound, gin.H{"error": "Image not found"})
            } else {
                c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
            }
            return
        }
    
        c.JSON(http.StatusOK, image)
    })
    
    router.PATCH("/image/:id", func(c *gin.Context) {
        id := c.Param("id")
        
        var updateData models.ImageData
        if err := c.ShouldBindJSON(&updateData); err != nil {
            c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
            return
        }

        if err := dbHandler.UpdateImage(id, updateData); err != nil {
            c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
            return
        }

        c.JSON(http.StatusOK, gin.H{"message": "Image updated successfully"})
    })

    router.Run(fmt.Sprintf(":%s",save_port))
}
