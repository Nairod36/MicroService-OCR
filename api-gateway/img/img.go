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

func SendImageToAPI(file multipart.File, header *multipart.FileHeader) error {
    savePort, ok := os.LookupEnv("SAVE_IMG_PORT")
    if !ok {
        log.Fatal("saving port not found")
    }
    saveUri, ok := os.LookupEnv("SAVE_IMG_URI")
    if !ok {
        log.Fatal("saving port not found")
    }

    // Construire l'URL avec le port dynamique
    apiURL := fmt.Sprintf("%s:%s/upload",saveUri, savePort)

    var requestBody bytes.Buffer
    multiPartWriter := multipart.NewWriter(&requestBody)

    part, err := multiPartWriter.CreateFormFile("image", header.Filename)
    if err != nil {
        return err
    }
    _, err = io.Copy(part, file)
    if err != nil {
        return err
    }

    err = multiPartWriter.Close()
    if err != nil {
        return err
    }

    req, err := http.NewRequest("POST", apiURL, &requestBody)
    if err != nil {
        return err
    }
    req.Header.Set("Content-Type", multiPartWriter.FormDataContentType())

    client := &http.Client{}
    resp, err := client.Do(req)
    if err != nil {
        return err
    }
    defer resp.Body.Close()

    if resp.StatusCode != http.StatusOK {
        return fmt.Errorf("API returned non-OK status: %s", resp.Status)
    }

    return nil
}
