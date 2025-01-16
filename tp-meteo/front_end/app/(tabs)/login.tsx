import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Keyboard, TouchableWithoutFeedback } from 'react-native';
import axios from 'axios';
import { useSession } from '../context/sessionContext';
import { useFocusEffect, useRouter } from 'expo-router';

const LoginScreen = ({ navigation } :any) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const { session, setSession } = useSession();
    const router = useRouter();
    
    useFocusEffect(
        React.useCallback(() => {
          setMessage('');
        }, [])
      );

    const handleLogin = async () => {
        Keyboard.dismiss();

        if (!username || !password) {
            setMessage('Veuillez remplir tous les champs.');
            return;
        }

        try {
            const response = await axios.post(`${process.env.BACKEND_URL}/login`, {
                username,
                password,
            });
    
            const { session } = response.data;
    
            setSession(session);
    
            setMessage('Connexion réussie');
            router.navigate('/home');
        } catch (error: any) {
            console.dir(error, {depth: 10})
            if (error.response && error.response.data.message) {
                setMessage(error.response.data.message);
            } else {
                setMessage('Erreur lors de la connexion.');
            }
        }
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.container}>
            <Text style={styles.title}>Connexion</Text>
            <TextInput
                style={styles.input}
                placeholder="Nom d'utilisateur"
                value={username}
                onChangeText={setUsername}
            />
            <TextInput
                style={styles.input}
                placeholder="Mot de passe"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />
            <Button title="Se connecter" onPress={handleLogin} />
            {message && <Text style={styles.message}>{message}</Text>}
        </View>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 15,
    },
    message: {
        marginTop: 10,
        textAlign: 'center',
        color: 'red',
    },
});

export default LoginScreen;