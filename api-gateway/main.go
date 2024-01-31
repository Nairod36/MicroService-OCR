package main

import (
    "log"
    "net/http"
	"api-gateway/img"
    "encoding/json"
    "bytes"
    "io/ioutil"
    "time"
    "strings"
)

type ApiResponse struct {
    JWT_Token    string    `json:"token"`
    ConnectedAt time.Time
}

var sessions = make(map[string]*ApiResponse)

func main() {
	http.HandleFunc("/auth", authHandler)
    http.HandleFunc("/image", jwtMiddleware(imageUploadHandler))
    http.HandleFunc("/ocr", jwtMiddleware(ocrHandler))

    http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
        w.Write([]byte("API Gateway en cours de développement"))
    })

    log.Fatal(http.ListenAndServe(":8090", nil))
}

func authHandler(w http.ResponseWriter, r *http.Request) {
    // méthode POST
    if r.Method != "POST" {
        http.Error(w, "Méthode non autorisée", http.StatusMethodNotAllowed)
        return
    }

    // Lire et décoder le corps de la requête entrante
    body, err := ioutil.ReadAll(r.Body)
    if err != nil {
        // Gère l'erreur si la lecture échoue
        http.Error(w, "Erreur lors de la lecture du corps de la requête", http.StatusInternalServerError)
        return
    }
    defer r.Body.Close()

    // Encodage des données d'identification au format JSON pour l'API d'authentification
    jsonBody, err := json.Marshal(body)
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }

    // Création et envoi de la requête à l'API d'authentification
    req, err := http.NewRequest("POST", "http://localhost:8080/login", bytes.NewBuffer(jsonBody))
    req.Header.Set("Content-Type", "application/json")

    client := &http.Client{}
    resp, err := client.Do(req)
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }
    defer resp.Body.Close()

    var result ApiResponse
    if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
        log.Fatalf("Erreur lors du décodage de la réponse : %v", err)
    }

}

// jwtMiddleware est un middleware qui vérifie le JWT et la durée de la session
func jwtMiddleware(next http.HandlerFunc) http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) {
        authHeader := r.Header.Get("Authorization")
        if authHeader == "" {
            // rediriger vers /login frontend
            http.Redirect(w, r, "/login", http.StatusFound)
            return
        }
        parts := strings.Split(authHeader, " ")
        if len(parts) != 2 || parts[0] != "Bearer" {
            // rediriger vers /login frontend
            http.Redirect(w, r, "/login", http.StatusFound)
            return
        }
        jwtToken := parts[1]

        // Vérifie si le JWT existe dans sessions
        session, exists := sessions[jwtToken]
        if !exists {
            // rediriger vers /login frontend
            http.Redirect(w, r, "/login", http.StatusFound)
            return
        }

        // Vérifie si plus de 10 minutes se sont écoulées depuis la connexion
        if time.Since(session.ConnectedAt) <= 0  {
            // modifier l'url pour mettre l'url du frontend
            // Si le temps actuel est égale au temps enregistrer dans la session
            http.Redirect(w, r, "/login", http.StatusFound)
            return
        }

        // exécuter le gestionnaire suivant
        next(w, r)
    }
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
