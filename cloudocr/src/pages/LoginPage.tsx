import React from 'react';
import LoginForm from '../components/LoginForm';
import { Container } from '@mui/material';

const LoginPage: React.FC = () => {
    return (
        <Container maxWidth="sm" style={{ display: 'flex', flexDirection: 'column', height: '100vh', justifyContent: 'center' }}>
            <LoginForm />
        </Container>
    );
}

export default LoginPage;
