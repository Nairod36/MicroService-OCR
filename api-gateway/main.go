package main

import (
	"api-gateway/img"
	"api-gateway/ocr"
	"api-gateway/ocr/models"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"time"
)

type ApiResponse struct {
    JWT_Token    string    `json:"token"`
    ConnectedAt time.Time
}

var sessions = make(map[string]*ApiResponse)

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
  http.HandleFunc("/image", jwtMiddleware(imageUploadHandler))
  http.HandleFunc("/ocr", jwtMiddleware(ocrHandler))


    http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
        w.Write([]byte("API Gateway en cours de développement"))
    })

    log.Fatal(http.ListenAndServe(fmt.Sprintf(":%s",REACT_APP_GATEWAY_PORT), nil))
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
    // TODO : SUPPRIMER POUR PROD
    // Set CORS headers
    w.Header().Set("Access-Control-Allow-Origin", "*") // or specify your domain
    w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
    w.Header().Set("Access-Control-Allow-Headers", "Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization")

	file, header, err := r.FormFile("image")
	if err != nil {
		http.Error(w, "Failed to get image: "+err.Error(), http.StatusBadRequest)
		return
	}
	defer file.Close()

    userId := r.FormValue("userId")

	imageId,err := img.SendImageToAPI(file, userId, header)
	if err != nil {
		http.Error(w, "Failed to send image to API: "+err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Write([]byte(imageId))
}

func imageDownloadHandler(w http.ResponseWriter, r *http.Request){
    // TODO : SUPPRIMER POUR PROD
    // Set CORS headers
    w.Header().Set("Access-Control-Allow-Origin", "*") // or specify your domain
    w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
    w.Header().Set("Access-Control-Allow-Headers", "Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization")

	if r.Method == "GET" {
        // Récupération de l'id de l'image
        imageId := r.URL.Query().Get("id")
    
        if imageId != "" {
            // Appel de l'API saveIMG
            imgData, err := img.GetImageFromId(imageId)
            if err != nil {
                log.Panic("Méthode non autorisée")
                http.Error(w, "Erreur lors de l'appel de l'API saveIMG", http.StatusInternalServerError)
                return
            }
        
            jsonData, err := json.Marshal(imgData)
            if err != nil {
                log.Panic("Méthode non autorisée")
                http.Error(w, "Erreur lors de la conversion en JSON", http.StatusInternalServerError)
                return
            }
            log.Print("Extraction complétée")
        
            w.Write(jsonData)
        }else {
            log.Panic("Méthode non autorisée")
            http.Error(w, "Erreur lors de l'appel de l'API saveIMG", http.StatusInternalServerError)
            return
        } 
    }
}


func ocrHandler(w http.ResponseWriter, r *http.Request) {
    // TODO : SUPPRIMER POUR PROD
    // Set CORS headers
    w.Header().Set("Access-Control-Allow-Origin", "*") // or specify your domain
    w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
    w.Header().Set("Access-Control-Allow-Headers", "Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization")

    if r.Method == "OPTIONS" {
		w.WriteHeader(http.StatusOK)
		return
	}

	// Logique pour OCR
    if r.Method == "GET" {
        // Récupération de l'id de l'image
        imageId := r.URL.Query().Get("id")
        // Récupération du nom de l'image
        imageName := r.URL.Query().Get("image")
    
        if imageId != "" {
            // Appel de l'API OCR
            ocrData, err := ocr.GetOCRFromId(imageId)
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
        }else if imageName != "" {
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
        }else {
            log.Panic("Méthode non autorisée")
            http.Error(w, "Erreur lors de l'appel de l'API OCR", http.StatusInternalServerError)
            return
        }        
    }else if r.Method == "POST" {
        // Récupération de l'id de l'image
        imageId := r.URL.Query().Get("id")
        // Récupération du nom de l'image
        input := models.IInput{}

		// Lecture du corps de la requête
		body, err := ioutil.ReadAll(r.Body)
		if err != nil {
			log.Panic("Méthode non autorisée")
			http.Error(w, "Erreur lors de la lecture du corps de la requête", http.StatusInternalServerError)
			return
		}

		// Décodage du JSON dans la structure IInput
		err = json.Unmarshal(body, &input)
		if err != nil {
			log.Panic("Méthode non autorisée")
			http.Error(w, "Erreur lors de la conversion du JSON", http.StatusInternalServerError)
			return
		}
    
        if imageId != "" {
            // Appel de l'API OCR
            ocrData, err := ocr.PostOCRFromId(imageId,input)
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
        }else {
            log.Panic("Méthode non autorisée")
            http.Error(w, "Erreur lors de l'appel de l'API OCR", http.StatusInternalServerError)
            return
        }        
    }else {
		http.Error(w, "Only POST method is allowed", http.StatusMethodNotAllowed)
		return
    }
}
