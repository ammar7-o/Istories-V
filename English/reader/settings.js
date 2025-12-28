// settings
const settingsButton = document.getElementById("settings-button");
const settingsPage = document.getElementById("settings-page");
const closeSettings = document.getElementById("close-settings");
const settingsOverlay = document.getElementById("settings-overlay");

settingsButton.addEventListener("click", function () {
    settingsPage.classList.toggle("open");
    settingsOverlay.classList.add("active");
});

closeSettings.addEventListener("click", function () {
    settingsPage.classList.remove("open");
    settingsOverlay.classList.remove("active");
});


const ttsBtn = document.getElementById("tts-toggle");
const sound = document.getElementById("sound");
let active = false; // Start with TTS disabled

ttsBtn.addEventListener("click", function () {
    if (active === false) {
        // Enable TTS
        sound.classList.add("tts-open");
        ttsBtn.classList.add("tts-active");
        ttsBtn.innerHTML = `<i class="fas fa-volume-up"></i> Disable`;
        active = true;
    } else {
        // Disable TTS
        sound.classList.remove("tts-open");
        ttsBtn.classList.remove("tts-active");
        ttsBtn.innerHTML = `<i class="fas fa-volume-up"></i> Enable`;
        active = false;
    }
});
