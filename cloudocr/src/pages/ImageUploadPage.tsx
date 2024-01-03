import React from 'react';
import ImageUploadForm from '../components/ImageUploadForm';
import { Container } from '@mui/material';

const ImageUploadPage: React.FC = () => {
    return (
        <Container maxWidth="sm" style={{ display: 'flex', flexDirection: 'column', height: '100vh', justifyContent: 'center' }}>
            <ImageUploadForm />
        </Container>
    );
}

export default ImageUploadPage;
