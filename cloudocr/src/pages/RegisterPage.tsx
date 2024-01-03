import React from 'react';
import RegisterForm from '../components/RegisterForm';
import { Container } from '@mui/material';

const RegisterPage: React.FC = () => {
    return (
        <Container maxWidth="sm" style={{ display: 'flex', flexDirection: 'column', height: '100vh', justifyContent: 'center' }}>
            <RegisterForm />
        </Container>
    );
}

export default RegisterPage;
