import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  Animated,
} from 'react-native';
import { COLORS } from '../theme/colors';
import { supabase } from '../lib/supabase';

const QUESTIONS = [
  {
    id: 'goals',
    question: '¿Qué buscas hoy?',
    options: ['Paz', 'Guía', 'Fortaleza', 'Gratitud'],
    multiple: true,
  },
  {
    id: 'prayer_time',
    question: '¿En qué momento prefieres tu oración?',
    options: ['Mañana', 'Tarde', 'Noche'],
    multiple: false,
  },
  {
    id: 'faith_status',
    question: '¿Cómo te sientes estos días con tu fe?',
    options: [
      'Cerca de Dios',
      'Buscando respuestas',
      'Necesito consuelo',
      'Lleno de dudas',
      'En constante crecimiento',
      'Alejado pero con deseo de volver',
    ],
    multiple: true,
    maxSelect: 3,
  },
];

const OnboardingScreen = ({ navigation }: any) => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<any>({
    goals: [],
    prayer_time: '',
    faith_status: [],
  });

  const currentQuestion = QUESTIONS[step];

  const toggleOption = (option: string) => {
    const qId = currentQuestion.id;
    if (currentQuestion.multiple) {
      const currentAnswers = [...answers[qId]];
      if (currentAnswers.includes(option)) {
        setAnswers({ ...answers, [qId]: currentAnswers.filter((item) => item !== option) });
      } else {
        if (currentQuestion.maxSelect && currentAnswers.length >= currentQuestion.maxSelect) return;
        setAnswers({ ...answers, [qId]: [...currentAnswers, option] });
      }
    } else {
      setAnswers({ ...answers, [qId]: option });
    }
  };

  const handleNext = async () => {
    if (step < QUESTIONS.length - 1) {
      setStep(step + 1);
    } else {
      await saveProfile();
    }
  };

  const saveProfile = async () => {
    try {
      // Nota: En una app real, usaríamos el ID del usuario autenticado
      // const { data: { user } } = await supabase.auth.getUser();
      
      const { error } = await supabase
        .from('profiles')
        .insert([
          {
            // id: user.id,
            goals: answers.goals,
            prayer_time: answers.prayer_time,
            faith_status: answers.faith_status,
          },
        ]);

      if (error) throw error;
      navigation.replace('Home');
    } catch (error) {
      console.error('Error saving profile:', error);
      // Navegamos de todos modos por propósitos de demo
      navigation.replace('Home');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.progressContainer}>
          {QUESTIONS.map((_, index) => (
            <View
              key={index}
              style={[
                styles.progressBar,
                { backgroundColor: index <= step ? COLORS.accent : COLORS.divider },
              ]}
            />
          ))}
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.questionText}>{currentQuestion.question}</Text>
        {currentQuestion.maxSelect && (
          <Text style={styles.hintText}>Puedes elegir hasta {currentQuestion.maxSelect} opciones</Text>
        )}

        <View style={styles.optionsContainer}>
          {currentQuestion.options.map((option) => {
            const isSelected = currentQuestion.multiple
              ? answers[currentQuestion.id].includes(option)
              : answers[currentQuestion.id] === option;

            return (
              <TouchableOpacity
                key={option}
                style={[styles.optionButton, isSelected && styles.selectedOption]}
                onPress={() => toggleOption(option)}
                activeOpacity={0.7}
              >
                <Text style={[styles.optionText, isSelected && styles.selectedOptionText]}>
                  {option}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.nextButton,
            (currentQuestion.multiple ? answers[currentQuestion.id].length === 0 : !answers[currentQuestion.id]) && 
            styles.disabledButton
          ]}
          onPress={handleNext}
          disabled={(currentQuestion.multiple ? answers[currentQuestion.id].length === 0 : !answers[currentQuestion.id])}
        >
          <Text style={styles.nextButtonText}>
            {step === QUESTIONS.length - 1 ? 'Finalizar' : 'Siguiente'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingHorizontal: 30,
    paddingTop: 20,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressBar: {
    height: 4,
    flex: 1,
    marginHorizontal: 4,
    borderRadius: 2,
  },
  content: {
    flex: 1,
    paddingHorizontal: 30,
    paddingTop: 60,
  },
  questionText: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 10,
    lineHeight: 36,
  },
  hintText: {
    fontSize: 14,
    color: COLORS.textGray,
    marginBottom: 30,
  },
  optionsContainer: {
    marginTop: 20,
  },
  optionButton: {
    backgroundColor: COLORS.white,
    paddingVertical: 18,
    paddingHorizontal: 25,
    borderRadius: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  selectedOption: {
    borderColor: COLORS.accent,
    backgroundColor: '#FFFBEA',
  },
  optionText: {
    fontSize: 16,
    color: COLORS.primary,
    fontWeight: '500',
  },
  selectedOptionText: {
    color: COLORS.accent,
    fontWeight: '700',
  },
  footer: {
    paddingHorizontal: 30,
    paddingBottom: 40,
  },
  nextButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 18,
    borderRadius: 30,
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.5,
  },
  nextButtonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: '600',
  },
});

export default OnboardingScreen;
