package img

import (
	"bytes"
	"fmt"
	"io"
	"log"
	"mime/multipart"
	"net/http"
	"os"
	"time"
)

func SendImageToAPI(file multipart.File, header *multipart.FileHeader) error {

	logFile, err := os.OpenFile(fmt.Sprintf("../../logs/%s.img.log", time.Now().Format("2006-01-02_15-04-05")), os.O_CREATE|os.O_APPEND|os.O_RDWR, 0666)
	if err != nil {
		log.Fatal(err)
	}
	defer logFile.Close()
	log.SetOutput(io.MultiWriter(os.Stdout, logFile))

	savePort, ok := os.LookupEnv("SAVE_IMG_PORT")
	if !ok {
		log.Fatal("saving port not found")
	}
	saveUri, ok := os.LookupEnv("SAVE_IMG_URI")
	if !ok {
		log.Fatal("saving URI not found")
	}

	apiURL := fmt.Sprintf("%s:%s/upload", saveUri, savePort)

	var requestBody bytes.Buffer
	multiPartWriter := multipart.NewWriter(&requestBody)

	part, err := multiPartWriter.CreateFormFile("image", header.Filename)
	if err != nil {
		log.Panic("Error creating form file: %v", err)
		return err
	}
	_, err = io.Copy(part, file)
	if err != nil {
		log.Panic("Error copying file to form file: %v", err)
		return err
	}

	err = multiPartWriter.Close()
	if err != nil {
		log.Panic("Error closing multipart writer: %v", err)
		return err
	}

	req, err := http.NewRequest("POST", apiURL, &requestBody)
	if err != nil {
		log.Panic("Error creating HTTP request: %v", err)
		return err
	}
	req.Header.Set("Content-Type", multiPartWriter.FormDataContentType())

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		log.Panic("Error performing HTTP request: %v", err)
		return err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		log.Panic("API returned non-OK status: %s", resp.Status)
		return fmt.Errorf("API returned non-OK status: %s", resp.Status)
	}

	return nil
}
