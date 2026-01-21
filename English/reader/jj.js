
// =============google tts =================
// Fixed TTS function with CORS proxy
function playGoogleVoice(word, language = 'en') {
    if (!word || word.trim() === '') {
        showNotification('No word to speak', 'error');
        return;
    }
    
    const text = word.trim();
    
    // Show loading indicator
    const ttsBtn = document.getElementById('googleTTSBtn');
    if (ttsBtn) {
        const icon = ttsBtn.querySelector('i');
        if (icon) {
            icon.className = 'fas fa-spinner fa-spin';
        }
        ttsBtn.disabled = true;
    }
    
    try {
        // Original Google TTS URL
        const googleTTSUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text)}&tl=${language}&client=tw-ob`;
        
        // Use a CORS proxy to bypass restrictions
        // Option 1: cors-anywhere (requires temporary access for localhost)
        // const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
        
        // Option 2: corsproxy.io (more reliable)
        const proxyUrl = 'https://corsproxy.io/?';
        
        // Option 3: allorigins.win
        // const proxyUrl = 'https://api.allorigins.win/raw?url=';
        
        // Construct the proxied URL
        const proxiedUrl = proxyUrl + encodeURIComponent(googleTTSUrl);
        
        // Create audio element and play
        const audio = new Audio(proxiedUrl);
        
        // Play the audio
        audio.play()
            .then(() => {
                console.log(`Playing TTS for: ${text} in ${language}`);
                showNotification(`Speaking "${text}"`, 'info');
            })
            .catch(error => {
                console.error('TTS play failed:', error);
                
                // Fallback: Try browser's native speech synthesis
                if (useNativeSpeechSynthesis(text, language)) {
                    showNotification(`Speaking "${text}" (native)`, 'info');
                } else {
                    showNotification('Could not play audio. Try again.', 'error');
                }
            });
        
        // Reset button when audio ends
        audio.onended = () => {
            resetTTSButton();
        };
        
        // Reset button on error
        audio.onerror = () => {
            console.error('Audio element error');
            resetTTSButton();
            showNotification('TTS playback failed', 'error');
        };
        
    } catch (error) {
        console.error('TTS error:', error);
        showNotification('Failed to play audio', 'error');
        resetTTSButton();
    }
}

// Helper function to reset TTS button
function resetTTSButton() {
    const ttsBtn = document.getElementById('googleTTSBtn');
    if (ttsBtn) {
        const icon = ttsBtn.querySelector('i');
        if (icon) {
            icon.className = 'fas fa-volume-up';
        }
        ttsBtn.disabled = false;
    }
}

// Fallback: Use browser's native speech synthesis
function useNativeSpeechSynthesis(text, language = 'en') {
    if ('speechSynthesis' in window) {
        // Cancel any ongoing speech
        speechSynthesis.cancel();
        
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = language;
        utterance.rate = 0.8;
        utterance.pitch = 1;
        utterance.volume = 1;
        
        // Get available voices
        const voices = speechSynthesis.getVoices();
        if (voices.length > 0) {
            // Try to find a voice matching the language
            const voice = voices.find(v => v.lang.startsWith(language)) || voices[0];
            utterance.voice = voice;
        }
        
        speechSynthesis.speak(utterance);
        
        utterance.onend = resetTTSButton;
        utterance.onerror = resetTTSButton;
        
        return true;
    }
    return false;
}

// Add event listener to your TTS button
document.addEventListener('DOMContentLoaded', function() {
    const ttsBtn = document.getElementById('googleTTSBtn');
    if (ttsBtn) {
        ttsBtn.addEventListener('click', function() {
            const popupWord = document.getElementById('popupWord');
            if (popupWord) {
                // Get the word text
                const wordText = popupWord.textContent || popupWord.innerText;
                
                // Determine language
                let language = 'en'; // Default to English
                
                // Try to get language from translation settings
                if (typeof getCurrentTranslationLanguage === 'function') {
                    language = getCurrentTranslationLanguage();
                } else if (currentWordData && currentWordData.wordData) {
                    // Try to get from word data
                    language = currentWordData.wordData.language || 'en';
                }
                
                // Call the TTS function
                playGoogleVoice(wordText, language);
            }
        });
    }
});