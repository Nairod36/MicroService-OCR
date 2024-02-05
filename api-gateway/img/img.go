package img

import (
	"bytes"
	"fmt"
	"io"
	"log"
	"mime/multipart"
	"net/http"
	"os"
)

func SendImageToStorage(imageData []byte, imageName string) error {
	save_uri,ok := os.LookupEnv("SAVE_IMG_URI")
	if !ok {
		log.Fatal("gateway port not found")
	}
	save_port,ok := os.LookupEnv("SAVE_IMG_PORT")
	if !ok {
		log.Fatal("gateway port not found")
	}
    // Création d'une requête multipart/form-data
    body := &bytes.Buffer{}
    writer := multipart.NewWriter(body)

    // Ajout de l'image
    part, err := writer.CreateFormFile("image", imageName)
    if err != nil {
        return err
    }
    _, err = io.Copy(part, bytes.NewReader(imageData))
    if err != nil {
        return err
    }
    writer.Close()

    // Envoi de la requête
    req, err := http.NewRequest("POST", fmt.Sprintf("%s:%s",save_uri,save_port), body)
    if err != nil {
        return err
    }
    req.Header.Set("Content-Type", writer.FormDataContentType())

    // Exécution de la requête
    client := &http.Client{}
    resp, err := client.Do(req)
    if err != nil {
        return err
    }
    defer resp.Body.Close()

    // Gérer la réponse ici...

    return nil
}
