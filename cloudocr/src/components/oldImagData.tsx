import React, { useState, useEffect } from 'react';
import { Box, Paper, Typography, CircularProgress, Grid, Card, CardMedia, CardContent } from '@mui/material';
import axios from 'axios';

interface ImageData {
    _id: string;
    name: string;
    path: string;
    contentType: string;
    extractData: string;
}

export const UserImages: React.FC<{}> = () => {
    const [images, setImages] = useState<ImageData[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const userId = "333"; // Remplacez ceci par l'ID réel de l'utilisateur connecté

    useEffect(() => {
        const fetchImages = async () => {
            setLoading(true);
            const apiUrl = `${process.env.REACT_APP_SAVE_IMG_URI}:${process.env.REACT_APP_SAVE_IMG_PORT}/images/user/${userId}`;
            try {
                const response = await axios.get<ImageData[]>(apiUrl);
                setImages(response.data);
            } catch (error) {
                console.error('Erreur lors de la récupération des images', error);
            } finally {
                setLoading(false);
            }
        };

        fetchImages();
    }, [userId]);

    return (
        <Paper elevation={3} style={{ padding: '20px', margin: 'auto', maxWidth: '800px' }}>
            <Typography variant="h5" style={{ textAlign: 'center', marginBottom: '20px' }}>
                Vos photos
            </Typography>
            {loading ? (
                <CircularProgress />
            ) : (
                <Grid container spacing={2}>
                    {images.map((image) => (
                        <Grid item xs={12} sm={6} md={4} key={image._id}>
                            <Card>
                                <CardMedia
                                    component="img"
                                    height="140"
                                    image={image.path}
                                    alt={image.name}
                                />
                                <CardContent>
                                    <Typography gutterBottom variant="h6" component="div">
                                        {image.name}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        Type: {image.contentType}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        {image.extractData ? `Texte extrait: ${image.extractData}` : 'Aucun texte extrait'}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Paper>
    );
};

export default UserImages;
