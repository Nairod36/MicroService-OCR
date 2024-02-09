import React, { useState } from 'react';
import { TextField, Button, Paper, Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


const LoginForm: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();


    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const uri = process.env.REACT_APP_AUTH_USER_URI;
        const port = process.env.REACT_APP_AUTH_USER_PORT;
        const apiUrl = `${uri}:${port}/login`;

    //     try {
    //         const response = await axios.post(apiUrl, {
    //             email: email,
    //             password: password
    //         });

    //         console.log(response.data); // Traiter la réponse de l'API

    //         // Si la connexion est réussie, rediriger vers la page d'upload
            navigate('/recognize');
    //     } catch (error) {
    //         console.error('Erreur lors de la connexion', error);
    //         // Gérer l'erreur de connexion ici
    //     }
    };
    
    const handleRegisterRedirect = () => {
        navigate('/register'); 
    };

    return (
        <Paper elevation={3} style={{ padding: '20px', maxWidth: '400px', margin: 'auto' }}>
            <Typography variant="h5" style={{ textAlign: 'center', marginBottom: '20px' }}>
                Connexion
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
                <Button type="submit" fullWidth variant="contained" color="primary">
                    Se connecter
                </Button>
            </form>
            <Box marginTop={2} marginBottom={2}>
                <Typography variant="body2" style={{ textAlign: 'center' }}>
                    Pas de compte ?
                </Typography>
            </Box>
            <Button onClick={handleRegisterRedirect} fullWidth variant="outlined" color="primary">
                S'inscrire
            </Button>
        </Paper>
    );
};

export default LoginForm;
