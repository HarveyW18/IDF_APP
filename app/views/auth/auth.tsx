import React from 'react';
import { View, Text, SafeAreaView, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { observer } from 'mobx-react-lite';
import { useAuthViewModel } from '../../viewmodels/authViewModel';

const Auth = observer(() => {
  const {
    isConnexionSelected,
    isNextStep,
    toggleConnexion,
    toggleNextStep,
    handleLogin,
    handleRegister,
    inputs,
    updateInput,
    loading,
    error,
  } = useAuthViewModel();

  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        {/* Boutons pour basculer entre Connexion et Inscription */}
        <View style={styles.switchContainer}>
          <TouchableOpacity onPress={() => toggleConnexion(true)}>
            <Text style={[styles.switchText, isConnexionSelected && styles.activeSwitchText]}>
              Connexion
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => toggleConnexion(false)}>
            <Text style={[styles.switchText, !isConnexionSelected && styles.activeSwitchText]}>
              Inscription
            </Text>
          </TouchableOpacity>
        </View>

        {/* Affichage du formulaire selon le mode sélectionné */}
        {isConnexionSelected ? (
          <SafeAreaView>
            {/* Formulaire de Connexion */}
            <TextInput
              style={styles.wideInput}
              placeholder="Email"
              value={inputs.email}
              onChangeText={(text) => updateInput('email', text)}
            />
            <TextInput
              style={styles.wideInput}
              placeholder="Mot de passe"
              secureTextEntry
              value={inputs.password}
              onChangeText={(text) => updateInput('password', text)}
            />
            <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
              <Text style={styles.buttonText}>{loading ? 'Connexion...' : 'Se connecter'}</Text>
            </TouchableOpacity>
            {error && <Text style={styles.error}>{error}</Text>}
          </SafeAreaView>
        ) : (
          <SafeAreaView>
            {/* Formulaire d'Inscription : Étape 1 ou 2 */}
            {!isNextStep ? (
              <>
                <TextInput
                  style={styles.wideInput}
                  placeholder="Email"
                  value={inputs.email}
                  onChangeText={(text) => updateInput('email', text)}
                />
                <TextInput
                  style={styles.wideInput}
                  placeholder="Mot de passe"
                  secureTextEntry
                  value={inputs.password}
                  onChangeText={(text) => updateInput('password', text)}
                />
                <TouchableOpacity style={styles.button} onPress={toggleNextStep}>
                  <Text style={styles.buttonText}>Suivant</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <TextInput
                  style={styles.wideInput}
                  placeholder="Adresse"
                  value={inputs.address}
                  onChangeText={(text) => updateInput('address', text)}
                />
                <TextInput
                  style={styles.wideInput}
                  placeholder="Numéro de téléphone"
                  value={inputs.phone}
                  onChangeText={(text) => updateInput('phone', text)}
                />
                <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
                  <Text style={styles.buttonText}>{loading ? 'Inscription...' : 'Valider'}</Text>
                </TouchableOpacity>
              </>
            )}
            {error && <Text style={styles.error}>{error}</Text>}
          </SafeAreaView>
        )}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
  innerContainer: { flex: 1.5, alignItems: 'center', borderRadius: 30 },
  switchContainer: { flexDirection: 'row', justifyContent: 'center', marginTop: 40 },
  switchText: { fontSize: 18, fontWeight: 'bold', marginHorizontal: 20, color: '#8696BB' },
  activeSwitchText: { color: '#4894FE' },
  wideInput: { height: 40, margin: 12, borderRadius: 8, padding: 10, width: 300, backgroundColor: '#FAFAFA' },
  button: { backgroundColor: '#4894FE', margin: 12, borderRadius: 8, padding: 12, alignItems: 'center', width: 300 },
  buttonText: { color: 'white', fontSize: 16 },
  error: { color: 'red', textAlign: 'center', marginTop: 10 },
});

export default Auth;
