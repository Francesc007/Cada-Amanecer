import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { COLORS } from '../theme/colors';

const WelcomeScreen = ({ navigation }: any) => {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ImageBackground
        source={{ uri: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&q=80' }}
        style={styles.backgroundImage}
      >
        <View style={styles.overlay}>
          <SafeAreaView style={styles.content}>
            <View style={styles.topSpace} />
            
            <View style={styles.textContainer}>
              <Text style={styles.welcomeText}>Bienvenido a</Text>
              <Text style={styles.titleText}>Cada Amanecer</Text>
              
              <Text style={styles.subtitleText}>
                Sin importar en qué punto de tu fe te encuentres, aquí encontrarás un hogar, apoyo y esperanza renovada para tu camino.
              </Text>
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate('Onboarding')}
                activeOpacity={0.8}
              >
                <Text style={styles.buttonText}>Comienza tu camino</Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(253, 252, 240, 0.4)', // Sutil tinte del color crema de la app
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 30,
    paddingBottom: 50,
  },
  topSpace: {
    flex: 1,
  },
  textContainer: {
    flex: 1,
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 20,
    color: COLORS.primary,
    fontFamily: 'System', // Cambiar a Serif si está disponible
    marginBottom: 5,
  },
  titleText: {
    fontSize: 42,
    fontWeight: 'bold',
    color: COLORS.accent,
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: 'System', // Idealmente una Serif elegante
  },
  subtitleText: {
    fontSize: 18,
    color: COLORS.primary,
    textAlign: 'center',
    lineHeight: 28,
    opacity: 0.9,
    paddingHorizontal: 10,
  },
  buttonContainer: {
    width: '100%',
  },
  button: {
    backgroundColor: COLORS.primary,
    paddingVertical: 18,
    borderRadius: 30,
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 1,
  },
});

export default WelcomeScreen;
