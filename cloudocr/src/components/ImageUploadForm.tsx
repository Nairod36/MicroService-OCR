import React, { useState, ChangeEvent, FormEvent } from 'react';
import { Button, Paper, Box, Typography, CircularProgress } from '@mui/material';
import axios from 'axios';

const ImageUploadForm: React.FC<{}> = () => {
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null); // Ajout pour stocker l'URL de prévisualisation de l'image
    const [uploading, setUploading] = useState<boolean>(false);
    const [message, setMessage] = useState<string>('');

    const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            setSelectedImage(file);
            setImagePreviewUrl(URL.createObjectURL(file)); // Créer et stocker l'URL pour la prévisualisation
            setMessage(''); // Réinitialiser le message lorsqu'une nouvelle image est sélectionnée
        }
    };

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (selectedImage) {
            setUploading(true);
            const formData = new FormData();
            formData.append('image', selectedImage);

            axios.post('http://localhost:8090/image', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            .then(response => {
                console.log('Image uploaded successfully', response.data);
                setMessage('Image mise en ligne avec succès.');
                setSelectedImage(null); // Réinitialiser l'image sélectionnée
                setImagePreviewUrl(null); // Réinitialiser l'URL de prévisualisation
            })
            .catch(error => {
                console.error('Error uploading image', error);
                setMessage('Erreur lors de la mise en ligne de l\'image.');
            })
            .finally(() => {
                setUploading(false);
            });
        }
    };

    return (
        <Paper elevation={3} style={{ padding: '20px', maxWidth: '400px', margin: 'auto' }}>
            <Typography variant="h5" style={{ textAlign: 'center', marginBottom: '20px' }}>
                Mettre en ligne une photo
            </Typography>
            <form onSubmit={handleSubmit}>
                <Box marginBottom={2}>
                    <input
                        accept="image/*"
                        style={{ display: 'none' }}
                        id="raised-button-file"
                        type="file"
                        onChange={handleImageChange}
                    />
                    <label htmlFor="raised-button-file">
                        <Button variant="contained" component="span">
                            Sélectionner une photo
                        </Button>
                    </label>
                </Box>
                {uploading && <CircularProgress />}
                {imagePreviewUrl && !uploading && <Box marginBottom={2} textAlign="center">
                    <img src={imagePreviewUrl} alt="Aperçu" style={{ maxWidth: '100%', maxHeight: '200px' }} />
                    <div>{selectedImage?.name}</div>
                </Box>}
                <Button type="submit" fullWidth variant="contained" color="primary" disabled={uploading}>
                    Mettre en ligne
                </Button>
                {message && <Typography style={{ marginTop: '20px', textAlign: 'center' }}>{message}</Typography>}
            </form>
        </Paper>
    );
};

export default ImageUploadForm;
