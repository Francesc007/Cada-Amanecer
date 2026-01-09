import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Dimensions,
  Image,
} from 'react-native';
import { COLORS } from '../theme/colors';
import { supabase } from '../lib/supabase';
import PaywallModal from '../components/PaywallModal';

const { width } = Dimensions.get('window');

const HomeScreen = () => {
  const [content, setContent] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [isPaywallVisible, setIsPaywallVisible] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [streakFinished, setStreakFinished] = useState(false);

  useEffect(() => {
    fetchDailyContent();
    fetchUserProfile();
  }, []);

  const fetchDailyContent = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase
        .from('daily_content')
        .select('*')
        .eq('date', today)
        .single();

      if (error) {
        // Data placeholder para propósitos de demo
        setContent({
          verse_title: 'Salmo 23:1',
          verse_text: 'El Señor es mi pastor; nada me faltará.',
          reflection: 'En medio de las tormentas de la vida, recordamos que no caminamos solos. Como un pastor cuida de sus ovejas, Dios cuida de cada detalle de tu existencia. Hoy, descansa en la promesa de que Su provisión es suficiente para ti.',
          audio_url: 'https://example.com/audio.mp3',
        });
      } else {
        setContent(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchUserProfile = async () => {
    // Simulación de carga de perfil
    setProfile({
      streak_days: 5,
      is_premium: false,
    });
  };

  const handlePlayAudio = () => {
    if (!profile?.is_premium) {
      setIsPaywallVisible(true);
    } else {
      setIsPlaying(!isPlaying);
      // Aquí iría la lógica del reproductor
    }
  };

  const handleFinishDaily = () => {
    if (!streakFinished) {
      setStreakFinished(true);
      setProfile({ ...profile, streak_days: profile.streak_days + 1 });
      // Aquí actualizaríamos Supabase: update profiles set streak_days = streak_days + 1
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.streakContainer}>
          <Text style={styles.seedIcon}>🌱</Text>
          <Text style={styles.streakText}>{profile?.streak_days || 0} días</Text>
        </View>
        <TouchableOpacity style={styles.profileButton}>
          <View style={styles.profileIcon} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.welcomeContainer}>
          <Text style={styles.dateText}>Jueves, 8 de Enero</Text>
          <Text style={styles.greetingText}>Paz contigo, Francisco</Text>
        </View>

        {/* Daily Card */}
        <View style={styles.dailyCard}>
          <Text style={styles.cardSectionTitle}>{content?.verse_title || 'Cargando...'}</Text>
          
          <Text style={styles.verseText}>
            "{content?.verse_text}"
          </Text>

          <View style={styles.divider} />

          <Text style={styles.reflectionText}>
            {content?.reflection}
          </Text>

          {/* Audio Controls */}
          <View style={styles.audioContainer}>
            <View style={styles.audioWaveform}>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <View key={i} style={[styles.waveBar, { height: 10 + Math.random() * 20 }]} />
              ))}
            </View>
            
            <TouchableOpacity 
              style={styles.playButton}
              onPress={handlePlayAudio}
              activeOpacity={0.9}
            >
              <Text style={styles.playIcon}>{isPlaying ? '⏸' : '▶'}</Text>
            </TouchableOpacity>

            <View style={styles.audioWaveform}>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <View key={i} style={[styles.waveBar, { height: 10 + Math.random() * 20 }]} />
              ))}
            </View>
          </View>
        </View>

        {/* Action Button */}
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => {
            handleFinishDaily();
            // Lógica para abrir notas
          }}
        >
          <Text style={styles.actionButtonText}>Escribir mi reflexión</Text>
        </TouchableOpacity>
      </ScrollView>

      <PaywallModal 
        visible={isPaywallVisible}
        onClose={() => setIsPaywallVisible(false)}
        onSubscribe={() => {
          setIsPaywallVisible(false);
          setProfile({ ...profile, is_premium: true });
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  seedIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  streakText: {
    color: COLORS.accent,
    fontWeight: '700',
    fontSize: 14,
  },
  profileButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.divider,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: COLORS.primary,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  welcomeContainer: {
    marginTop: 10,
    marginBottom: 25,
  },
  dateText: {
    fontSize: 14,
    color: COLORS.textGray,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 5,
  },
  greetingText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  dailyCard: {
    backgroundColor: COLORS.white,
    borderRadius: 25,
    padding: 30,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 5,
    alignItems: 'center',
  },
  cardSectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.accent,
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: 25,
  },
  verseText: {
    fontSize: 24,
    color: COLORS.primary,
    textAlign: 'center',
    fontFamily: 'System', // Cambiar a Serif (ej: 'Georgia')
    lineHeight: 34,
    fontStyle: 'italic',
    marginBottom: 25,
  },
  divider: {
    width: 40,
    height: 2,
    backgroundColor: COLORS.accent,
    opacity: 0.3,
    marginBottom: 25,
  },
  reflectionText: {
    fontSize: 16,
    color: COLORS.primary,
    textAlign: 'justify',
    lineHeight: 24,
    opacity: 0.8,
    marginBottom: 35,
  },
  audioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  playButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: COLORS.white,
    borderWidth: 2,
    borderColor: COLORS.accent,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 20,
    shadowColor: COLORS.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  playIcon: {
    fontSize: 30,
    color: COLORS.accent,
    marginLeft: 4, // Ajuste para centrar el icono de play
  },
  audioWaveform: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 40,
  },
  waveBar: {
    width: 3,
    backgroundColor: COLORS.accent,
    marginHorizontal: 1,
    borderRadius: 2,
    opacity: 0.4,
  },
  actionButton: {
    marginTop: 30,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.primary,
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: 'center',
  },
  actionButtonText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default HomeScreen;
