package models

// ImageData représente les métadonnées d'une image, y compris son chemin d'accès.
type ImageData struct {
    ID           string `bson:"_id,omitempty"` // Identifiant unique de l'image
    Name         string `bson:"name"`          // Nom de l'image
    Path         string `bson:"path"`          // Chemin d'accès au fichier de l'image sur le serveur
    ContentType  string `bson:"content_type"`  // Type de contenu (par exemple, "image/png")
    ExctractData string `bson:"extract_data"`  // Texte extrait de l'image
}
