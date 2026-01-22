// =============== SPEECH FUNCTIONS ===============
let speechEnabled = localStorage.getItem('speechEnabled') !== 'false'; // Default enabled (true)

// Initialize speech

// Setup speech toggle button

// Update speech toggle button

// Toggle speech on/off

// Speak current flashcard word

// Add speech button to flashcard


// MODIFIED: Update playGoogleVoice to work with flashcard button


// MODIFIED: Reset flashcard button


// Fallback: Use browser's native speech synthesis
function useNativeSpeechSynthesis(text, language = 'en-US') {
    if (!('speechSynthesis' in window)) return false;

    speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language;
    utterance.rate = 0.95;
    utterance.pitch = 1.05;
    utterance.volume = 1;

    const voices = speechSynthesis.getVoices();
    if (voices.length) {
        utterance.voice =
            voices.find(v => v.lang === language && v.name.includes('Google')) ||
            voices.find(v => v.lang.startsWith(language.split('-')[0])) ||
            voices[0];
    }

    utterance.onend = resetTTSButton;
    utterance.onerror = resetTTSButton;

    speechSynthesis.speak(utterance);
    return true;
}

// Update loadCard function
const originalLoadCard = window.loadCard || function(index) {
    // Your existing loadCard code
};

window.loadCard = function(index) {
    originalLoadCard(index);
    
    // Add speech button after card loads
    setTimeout(() => {
        addSpeechButtonToCard();
    }, 50);
};