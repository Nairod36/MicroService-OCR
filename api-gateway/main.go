package main

import (
	"api-gateway/img"
	"api-gateway/ocr"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"time"
)

func main() {

    logFile, err := os.OpenFile(fmt.Sprintf("../logs/%s.gateway.log", time.Now().Format("2006-01-02_15-04-05")), os.O_CREATE|os.O_APPEND|os.O_RDWR, 0666)
    if err != nil {
        log.Fatal(err)
    }
    log.SetOutput(logFile)

	REACT_APP_GATEWAY_PORT,ok := os.LookupEnv("REACT_APP_GATEWAY_PORT")
	if !ok {
		log.Fatal("gateway port not found")
	}

	log.Print("Server start...")
	http.HandleFunc("/auth", authHandler)
    http.HandleFunc("/image", imageUploadHandler)
    http.HandleFunc("/ocr", ocrHandler)

    http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
        w.Write([]byte("API Gateway en cours de développement"))
    })

    log.Fatal(http.ListenAndServe(fmt.Sprintf(":%s",REACT_APP_GATEWAY_PORT), nil))
}

func authHandler(w http.ResponseWriter, r *http.Request) {
    // Logique pour l'authentification
}

func imageUploadHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Only POST method is allowed", http.StatusMethodNotAllowed)
		return
	}

	file, header, err := r.FormFile("image")
	if err != nil {
		http.Error(w, "Failed to get image: "+err.Error(), http.StatusBadRequest)
		return
	}
	defer file.Close()

	_,err = img.SendImageToAPI(file, header)
	if err != nil {
		http.Error(w, "Failed to send image to API: "+err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Write([]byte("Image uploaded successfully"))
}


func ocrHandler(w http.ResponseWriter, r *http.Request) {
    // Logique pour OCR
    if r.Method != "GET" {
        log.Panic("Méthode non autorisée")
        http.Error(w, "Méthode non autorisée", http.StatusMethodNotAllowed)
        return
    }
    
    // Récupération du nom de l'image
    imageName := r.URL.Query().Get("image")

    // Appel de l'API OCR
    ocrData, err := ocr.GetOCR(imageName)
    if err != nil {
        log.Panic("Méthode non autorisée")
        http.Error(w, "Erreur lors de l'appel de l'API OCR", http.StatusInternalServerError)
        return
    }

    jsonData, err := json.Marshal(ocrData)
    if err != nil {
        log.Panic("Méthode non autorisée")
        http.Error(w, "Erreur lors de la conversion en JSON", http.StatusInternalServerError)
        return
    }
    log.Print("Extraction complétée")

    w.Write(jsonData)
}
