package ocr

import (
	"api-gateway/ocr/models"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
)

func getExtract(imageName string) ([]byte, error) {
	client := &http.Client{}
	req, err := http.NewRequest("GET", fmt.Sprintf("%s",imageName), nil)
	if err != nil {
		return nil,err
	} 
	
	resp, err := client.Do(req)
		if err != nil {
		return nil,err
	}	
	defer resp.Body.Close()
	body, err := io.ReadAll(resp.Body)
	if err != nil{
		return nil,err
	}
	return body,err
}

func parseExtract(extract []byte) (models.Extraction, error) {
	var output models.Extraction
	err := json.Unmarshal(extract, &output)
	
	return output, err
}

func GetOCR(imageName string) (models.Extraction, error) {
	extract, err := getExtract(imageName)
	if err != nil {
		return models.Extraction{}, err
	}
	return parseExtract(extract)
}