package img

import (
    "bytes"
    "io"
    "mime/multipart"
    "net/http"
)

func sendImageToStorage(imageData []byte, imageName string) error {
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
    req, err := http.NewRequest("POST", "URL_de_l'API_de_stockage", body)
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
