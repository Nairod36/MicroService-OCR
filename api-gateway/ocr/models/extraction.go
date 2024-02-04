package models

type Extraction struct {
	Name string `json: "imagePath"`
	Content string `json: "content"`
}

func Tostring(extraction Extraction)[]string{
	var str []string
	str = append(str, extraction.Name)
	str = append(str, extraction.Content)
	return str
}