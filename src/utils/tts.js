export const speakText = (text, onEnd) => {
    if (!text || typeof window === 'undefined') return;
    
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'es-ES';
    utterance.rate = 0.9;

    if (onEnd) {
      utterance.onend = () => {
        onEnd();
      };
    }
  
    setTimeout(() => {
      window.speechSynthesis.speak(utterance);
    }, 200);
  };