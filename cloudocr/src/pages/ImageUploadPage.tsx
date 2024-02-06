import React from 'react';
import ImageUploadForm from '../components/ImageUploadForm';
import UserImages from '../components/oldImagData';
import { Button, Container, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom'; // Importer useNavigate

const ImageUploadPage: React.FC = () => {
    const navigate = useNavigate(); // Utiliser useNavigate pour la redirection

    const handleLogout = () => {
        // Logique de déconnexion ici
        navigate('/'); // Rediriger vers la page de connexion après la déconnexion
    };

    return (
        <Container maxWidth="sm" style={{ paddingTop: '20px', position: 'relative', minHeight: '100vh' }}>
            <Box display="flex" justifyContent="flex-end">
                <Button variant="contained" color="secondary" onClick={handleLogout}>
                    Déconnexion
                </Button>
            </Box>
            <Box style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%' }}>
                <ImageUploadForm />
                <UserImages />
            </Box>
        </Container>
    );
}

export default ImageUploadPage;
