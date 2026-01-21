
// Update TTS functions to set isTTSPlaying
function playGoogleVoice(word, language = 'en') {
    isTTSPlaying = true;
    // ... rest of your TTS code ...
    
    audio.onended = () => {
        isTTSPlaying = false;
        resetTTSButton();
    };
    
    audio.onerror = () => {
        isTTSPlaying = false;
        resetTTSButton();
    };
}

// Update hideDictionary
function hideDictionary() {
    dictionaryPopup.style.display = 'none';
    currentWordData = null;
    isTTSPlaying = false; // Reset flag
}