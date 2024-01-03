import React, { useState } from 'react';
import { TextField, Button, Paper, Box, Typography } from '@mui/material';

const RegisterForm: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        // Logique d'inscription ici
        console.log(email, password, confirmPassword);
    };

    return (
        <Paper elevation={3} style={{ padding: '20px', maxWidth: '400px', margin: 'auto' }}>
            <Typography variant="h5" style={{ textAlign: 'center', marginBottom: '20px' }}>
                Inscription
            </Typography>
            <form onSubmit={handleSubmit}>
                <Box marginBottom={2}>
                    <TextField
                        fullWidth
                        label="Email"
                        variant="outlined"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </Box>
                <Box marginBottom={2}>
                    <TextField
                        fullWidth
                        label="Mot de passe"
                        type="password"
                        variant="outlined"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </Box>
                <Box marginBottom={2}>
                    <TextField
                        fullWidth
                        label="Confirmez le mot de passe"
                        type="password"
                        variant="outlined"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                </Box>
                <Button type="submit" fullWidth variant="contained" color="primary">
                    S'inscrire
                </Button>
            </form>
        </Paper>
    );
};

export default RegisterForm;
