import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Paper, Box, Typography } from '@mui/material';
import axios from 'axios'; // Assurez-vous qu'Axios est importé

const RegisterForm: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        // Vérifiez que les mots de passe correspondent
        if (password !== confirmPassword) {
            alert("Les mots de passe ne correspondent pas.");
            return;
        }

        // const apiUrl = `${process.env.REACT_APP_AUTH_USER_URI}:${process.env.REACT_APP_AUTH_USER_PORT}/register`; // Utilisez vos variables d'environnement

        // try {
        //     // Envoyer la requête d'inscription à l'API
        //     const response = await axios.post(apiUrl, {
        //         email: email,
        //         password: password
        //     });

        //     console.log(response.data); // Traiter la réponse de l'API

            // Après l'inscription réussie, rediriger vers la page de connexion
            navigate('/'); 
        // } catch (error) {
        //     if (axios.isAxiosError(error)) {
        //         console.error('Erreur lors de l\'inscription', error.response?.data || error.message);
        //     } else {
        //         console.error('Une erreur inattendue est survenue', error);
        //         }    }
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
