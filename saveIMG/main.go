package main

import (
    "fmt"
    "github.com/gin-gonic/gin"
    "os"
    "path/filepath"
    "saveIMG/handlers"
    "saveIMG/models"
)

func main() {
    router := gin.Default()

    // Configuration de la base de données
    dbHandler := handlers.NewDBHandler("mongodb://root:example@localhost:27017", "imageDB")

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
        imagePath := fmt.Sprintf("./img/%s", header.Filename)
        if err := os.MkdirAll(filepath.Dir(imagePath), os.ModePerm); err != nil {
            c.JSON(500, gin.H{"error": err.Error()})
            return
        }

        // Sauvegarder l'image dans le dossier img
        if err := c.SaveUploadedFile(file, imagePath); err != nil {
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
        err = dbHandler.SaveImagePath(imageData)
        if err != nil {
            c.JSON(500, gin.H{"error": err.Error()})
            return
        }

        c.JSON(200, gin.H{"message": "Image uploaded and path saved successfully"})
    })

    router.Run(":8080")
}
