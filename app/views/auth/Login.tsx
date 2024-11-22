// Connexion

import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  StatusBar,
  Image,
} from 'react-native';
import { useAuthViewModel } from '../../viewmodels/authViewModel';

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const { handleLogin, loading, error } = useAuthViewModel();

  const onLoginPress = async () => {
    try {
      const userData = await handleLogin(email, password);
      console.log('Connexion réussie :', userData);
      // Redirigez l'utilisateur ou stockez le token
    } catch (err) {
      console.error('Erreur lors de la connexion :', err);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="default" />
      <Image
        source={require('../../assets/images/image1.png')}
        style={styles.image}
      />
      <Text style={styles.title}>Connexion</Text>
      <SafeAreaView style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Mot de passe"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        {error && <Text style={styles.error}>{error}</Text>}
        <TouchableOpacity
          style={styles.button}
          onPress={onLoginPress}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Connexion...' : 'Se connecter'}
          </Text>
        </TouchableOpacity>
        <Text style={styles.footerText}>
          Pas encore membre ? <Text style={styles.link}>Inscrivez-vous</Text>
        </Text>
      </SafeAreaView>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  form: {
    width: '80%',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: '#4894FE',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  footerText: {
    marginTop: 20,
    color: '#8696BB',
    textAlign: 'center',
  },
  link: {
    color: '#4894FE',
    fontWeight: 'bold',
  },
  error: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',
  },
});

