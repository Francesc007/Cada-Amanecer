import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Modal,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { COLORS } from '../theme/colors';

interface PaywallModalProps {
  visible: boolean;
  onClose: () => void;
  onSubscribe: () => void;
}

const PaywallModal = ({ visible, onClose, onSubscribe }: PaywallModalProps) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>

          <View style={styles.iconContainer}>
            <Text style={styles.premiumBadge}>PREMIUM</Text>
          </View>

          <Text style={styles.modalTitle}>Escucha tu oración diaria</Text>
          
          <Text style={styles.modalDescription}>
            Disfruta de 7 días gratis de contenido Premium. Después solo $49 MXN al mes.
          </Text>

          <View style={styles.benefitsContainer}>
            <Text style={styles.benefitItem}>✓ Meditaciones guiadas en audio</Text>
            <Text style={styles.benefitItem}>✓ Historial completo de reflexiones</Text>
            <Text style={styles.benefitItem}>✓ Contenido exclusivo semanal</Text>
          </View>

          <TouchableOpacity
            style={styles.subscribeButton}
            onPress={onSubscribe}
            activeOpacity={0.8}
          >
            <Text style={styles.subscribeButtonText}>Activar prueba gratis</Text>
          </TouchableOpacity>

          <Text style={styles.footerText}>Cancela en cualquier momento</Text>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(26, 43, 72, 0.7)', // Overlay Midnight Blue semi-transparente
  },
  modalView: {
    backgroundColor: COLORS.background,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  },
  closeButton: {
    alignSelf: 'flex-end',
    padding: 10,
  },
  closeText: {
    fontSize: 20,
    color: COLORS.primary,
    fontWeight: '300',
  },
  iconContainer: {
    marginBottom: 20,
    backgroundColor: COLORS.accent,
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  premiumBadge: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 12,
    letterSpacing: 1,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
    textAlign: 'center',
    marginBottom: 15,
  },
  modalDescription: {
    fontSize: 16,
    color: COLORS.primary,
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
    opacity: 0.8,
  },
  benefitsContainer: {
    width: '100%',
    marginBottom: 40,
  },
  benefitItem: {
    fontSize: 16,
    color: COLORS.primary,
    marginBottom: 12,
    fontWeight: '500',
  },
  subscribeButton: {
    backgroundColor: COLORS.accent,
    width: '100%',
    paddingVertical: 18,
    borderRadius: 30,
    alignItems: 'center',
    shadowColor: COLORS.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  subscribeButtonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: '700',
  },
  footerText: {
    marginTop: 20,
    fontSize: 14,
    color: COLORS.textGray,
  },
});

export default PaywallModal;
