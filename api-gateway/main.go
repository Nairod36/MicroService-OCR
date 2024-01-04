package main

import (
    "log"
    "net/http"
	"api-gateway/img"
)

func main() {
	http.HandleFunc("/auth", authHandler)
    http.HandleFunc("/image", imageUploadHandler)
    http.HandleFunc("/ocr", ocrHandler)

    http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
        w.Write([]byte("API Gateway en cours de développement"))
    })

    log.Fatal(http.ListenAndServe(":8090", nil))
}

func authHandler(w http.ResponseWriter, r *http.Request) {
    // Logique pour l'authentification
}

func imageUploadHandler(w http.ResponseWriter, r *http.Request) {
    // Assurez-vous que c'est une méthode POST
    if r.Method != "POST" {
        http.Error(w, "Méthode non autorisée", http.StatusMethodNotAllowed)
        return
    }

    // Récupération de l'image du corps de la requête
    r.ParseMultipartForm(10 << 20) // Limite de 10 MB
    file, header, err := r.FormFile("image")
    if err != nil {
        http.Error(w, "Erreur lors de l'upload de l'image", http.StatusInternalServerError)
        return
    }
    defer file.Close()

    // Lecture de l'image
    fileData, err := io.ReadAll(file)
    if err != nil {
        http.Error(w, "Erreur lors de la lecture de l'image", http.StatusInternalServerError)
        return
    }

    // Envoyer l'image à l'API de stockage
    err = sendImageToStorage(fileData, header.Filename)
    if err != nil {
        http.Error(w, "Erreur lors de l'envoi de l'image à l'API de stockage", http.StatusInternalServerError)
        return
    }

    // Répondre avec succès
    w.Write([]byte("Image téléchargée avec succès"))
}


func ocrHandler(w http.ResponseWriter, r *http.Request) {
    // Logique pour OCR
}
