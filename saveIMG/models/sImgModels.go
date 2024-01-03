package models

type ImageData struct {
    ID          string `bson:"_id,omitempty"` // Identifiant unique de l'image
    Name        string `bson:"name"`         // Nom de l'image
    Data        []byte `bson:"data"`         // Données de l'image en binaire ou en base64
    ContentType string `bson:"content_type"` // Type de contenu (par exemple, "image/png")
}
