package main

import (
    "github.com/gin-gonic/gin"
    "io/ioutil"
)

func main() {
    router := gin.Default()

    // Configuration de la base de données
    dbHandler := NewDBHandler("mongodb://root:example@localhost:27017", "imageDB")

    // Définir les routes
    router.POST("/upload", func(c *gin.Context) {
        // Récupération du fichier image de la requête
        file, header, err := c.Request.FormFile("image")
        if err != nil {
            c.JSON(400, gin.H{"error": err.Error()})
            return
        }
        defer file.Close()

        // Lecture des données du fichier
        fileBytes, err := ioutil.ReadAll(file)
        if err != nil {
            c.JSON(500, gin.H{"error": err.Error()})
            return
        }

        // Création de l'objet ImageData
        imageData := ImageData{
            Name: header.Filename,
            Data: fileBytes,
            ContentType: header.Header.Get("Content-Type"),
        }

        // Sauvegarder l'image dans MongoDB
        err = dbHandler.SaveImage(imageData)
        if err != nil {
            c.JSON(500, gin.H{"error": err.Error()})
            return
        }

        c.JSON(200, gin.H{"message": "Image uploaded successfully"})
    })

    router.Run(":8080")
}
