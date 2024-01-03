import React, { useState } from 'react';
import { Button, Paper, Box, Typography } from '@mui/material';

const ImageUploadForm: React.FC = () => {
    const [selectedImage, setSelectedImage] = useState<File | null>(null);

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setSelectedImage(event.target.files[0]);
        }
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (selectedImage) {
            // Logique pour mettre en ligne l'image
            console.log(selectedImage);
            // Vous pouvez utiliser FormData pour envoyer l'image au serveur ici
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
                {selectedImage && <Box marginBottom={2} style={{ textAlign: 'center' }}>
                    {selectedImage.name}
                </Box>}
                <Button type="submit" fullWidth variant="contained" color="primary">
                    Mettre en ligne
                </Button>
            </form>
        </Paper>
    );
};

export default ImageUploadForm;
