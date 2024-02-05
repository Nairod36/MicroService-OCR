package ocr

import (
	"api-gateway/ocr/models"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
)

func getExtract(imageName string) ([]byte, error) {
	ocr_uri,ok := os.LookupEnv("OCR_ENGINE_URI")
	if !ok {
		log.Fatal("ocr engine uri not found")
	}
	ocr_port,ok := os.LookupEnv("OCR_ENGINE_PORT")
	if !ok {
		log.Fatal("ocr engine uri not found")
	}
	client := &http.Client{}

	req, err := http.NewRequest("GET", fmt.Sprintf("%s:%s/recognize/%s", ocr_uri, ocr_port, imageName), nil)
	if err != nil {
		log.Panic("Erreur lors de la requête : ", err)
		return nil, err
	}

	resp, err := client.Do(req)
	if err != nil {
		log.Panic("Erreur lors de la requête : ", err)
		return nil, err
	}
	defer resp.Body.Close()
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		log.Panic("Erreur lors de la requête : ", err)
		return nil, err
	}
	return body, err
}

func parseExtract(extract []byte) (models.Extraction, error) {
	var output models.Extraction
	err := json.Unmarshal(extract, &output)

	return output, err
}

func GetOCR(imageName string) (models.Extraction, error) {
	extract, err := getExtract(imageName)
	if err != nil {
		log.Panic("Erreur lors de l'extraction : ", err)
		return models.Extraction{}, err
	}
	return parseExtract(extract)
}
