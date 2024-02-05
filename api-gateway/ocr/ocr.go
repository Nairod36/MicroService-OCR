package ocr

import (
	"api-gateway/ocr/models"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"time"
)

func getExtract(imageName string) ([]byte, error) {

    logFile, err := os.OpenFile(fmt.Sprintf("../../logs/%s.ocr.log", time.Now().Format("2006-01-02_15-04-05")), os.O_CREATE|os.O_APPEND|os.O_RDWR, 0666)
    if err != nil {
        log.Fatal(err)
    }
    log.SetOutput(logFile)

	ocrURI, ok := os.LookupEnv("OCR_ENGINE_URI")
	if !ok {
		log.Fatal("OCR engine URI not found")
	}
	ocrPort, ok := os.LookupEnv("OCR_ENGINE_PORT")
	if !ok {
		log.Fatal("OCR engine port not found")
	}

	client := &http.Client{}
	req, err := http.NewRequest("GET", fmt.Sprintf("%s:%s/recognize/%s", ocrURI, ocrPort, imageName), nil)
	if err != nil {
		log.Panic("Error during request: ", err)
		return nil, err
	}

	resp, err := client.Do(req)
	if err != nil {
		log.Panic("Error during request: ", err)
		return nil, err
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		log.Panic("Error during request: ", err)
		return nil, err
	}

	return body, nil
}

func parseExtract(extract []byte) (models.Extraction, error) {
	var output models.Extraction
	err := json.Unmarshal(extract, &output)
	return output, err
}

func GetOCR(imageName string) (models.Extraction, error) {
	extract, err := getExtract(imageName)
	if err != nil {
		log.Panic("Error during extraction: ", err)
		return models.Extraction{}, err
	}
	return parseExtract(extract)
}