// script.js — Profile editor logic.
// Loaded by main/profile/index.html. Relies on showNotification() from
// nav/common.js (loaded before this file).

// DOM Elements
const profilePhoto = document.getElementById('profile-photo');
const changePhotoBtn = document.getElementById('change-photo-btn');
const photoInput = document.getElementById('photo-input');
const nameInput = document.getElementById('profile-name-input');
const nameCharCount = document.getElementById('name-char-count');
const nameValidIcon = document.getElementById('name-valid-icon');
const cancelBtn = document.getElementById('cancel-btn');
const saveBtn = document.getElementById('save-btn');
const profilePic = document.getElementById('profile-pic');
const profileName = document.getElementById('profile-name');
const removePhotoBtn = document.getElementById('remove-photo-btn');
const profileStatus = document.getElementById('profile-status');

const DEFAULT_PHOTO = (profilePhoto && profilePhoto.hasAttribute('src'))
    ? profilePhoto.getAttribute('src')
    : '../../imges/user.jpg';

let lastSaved = {
    name: '',
    photo: DEFAULT_PHOTO
};

// Update character counter
function updateCharCounter() {
    if (!nameInput || !nameCharCount) return;
    const currentLength = nameInput.value.length;
    nameCharCount.textContent = currentLength;

    // Change color based on length
    if (currentLength === 0) {
        nameCharCount.style.color = 'var(--text-tertiary)';
    } else if (currentLength > 40) {
        nameCharCount.style.color = 'var(--warning-color)';
    } else {
        nameCharCount.style.color = 'var(--success-color)';
    }
}

// Update displayed profile name in real-time
function updateDisplayedName() {
    if (profileName && nameInput) {
        const name = nameInput.value.trim();
        profileName.textContent = name || 'Your name';
    }
}

function isDirty() {
    const name = nameInput ? nameInput.value.trim() : '';
    const photo = profilePhoto ? profilePhoto.src : DEFAULT_PHOTO;
    return (name !== lastSaved.name) || (photo !== lastSaved.photo);
}

function updateValidationState() {
    if (!nameInput) return;
    const raw = nameInput.value;
    const name = raw.trim();
    const isSpaces = raw.length > 0 && name.length === 0;

    nameInput.classList.toggle('is-valid', name.length > 0);
    nameInput.classList.toggle('is-invalid', isSpaces);

    // Don't clobber the "saved" confirmation that is currently on screen.
    if (profileStatus && !profileStatus.classList.contains('is-ok')) {
        profileStatus.classList.remove('is-warn');
        if (isSpaces) {
            profileStatus.textContent = 'Name cannot be just spaces.';
            profileStatus.classList.add('is-warn');
        } else if (isDirty()) {
            profileStatus.textContent = 'You have unsaved changes.';
            profileStatus.classList.add('is-warn');
        } else {
            profileStatus.textContent = '';
        }
    }
}

function markDirty() {
    const dirty = isDirty();
    if (saveBtn) saveBtn.disabled = !dirty;
    if (cancelBtn) cancelBtn.disabled = !dirty;
    updateValidationState();
}

function setStatusSaved() {
    if (!profileStatus) return;
    profileStatus.textContent = 'Changes saved successfully.';
    profileStatus.classList.remove('is-warn');
    profileStatus.classList.add('is-ok');
    setTimeout(() => {
        if (profileStatus) {
            profileStatus.textContent = '';
            profileStatus.classList.remove('is-ok');
        }
    }, 2200);
}

// Load saved data from localStorage
function loadProfileData() {
    const savedName = localStorage.getItem('profileName');
    const savedPhoto = localStorage.getItem('profilePhoto');

    if (nameInput) {
        nameInput.value = savedName ? savedName : '';
    }
    if (profileName) {
        profileName.textContent = savedName || 'Your name';
    }

    if (profilePhoto && savedPhoto) {
        profilePhoto.src = savedPhoto;
    } else if (profilePhoto) {
        profilePhoto.src = DEFAULT_PHOTO;
    }
    if (profilePic && savedPhoto) {
        profilePic.src = savedPhoto;
    } else if (profilePic && profilePhoto) {
        profilePic.src = profilePhoto.src;
    }

    lastSaved = {
        name: (savedName || '').trim(),
        photo: savedPhoto || DEFAULT_PHOTO
    };

    updateCharCounter();
    updateDisplayedName();
    updateValidationState();
    if (saveBtn) saveBtn.disabled = true;
    if (cancelBtn) cancelBtn.disabled = true;
    if (profileStatus) {
        profileStatus.textContent = '';
        profileStatus.classList.remove('is-ok', 'is-warn');
    }
}

// Save profile data
function saveProfileData() {
    if (!nameInput) return;
    const name = nameInput.value.trim();
    if (!name) {
        showNotification('Please enter your name', 'error');
        nameInput.focus();
        updateValidationState();
        return;
    }
    const photo = profilePhoto ? profilePhoto.src : DEFAULT_PHOTO;

    localStorage.setItem('profileName', name);
    localStorage.setItem('profilePhoto', photo);

    if (profileName) profileName.textContent = name;
    if (profilePic && profilePhoto) profilePic.src = profilePhoto.src;

    lastSaved = { name, photo };
    updateCharCounter();
    updateValidationState();
    if (saveBtn) saveBtn.disabled = true;
    if (cancelBtn) cancelBtn.disabled = true;
    setStatusSaved();
    showNotification('Profile updated successfully!', 'success');
}

// Handle photo upload
function handlePhotoUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
        showNotification('File size must be less than 5MB', 'error');
        return;
    }
    if (!file.type.match('image.*')) {
        showNotification('Please select an image file', 'error');
        return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
        if (profilePhoto) profilePhoto.src = e.target.result;
        if (profilePic && profilePhoto) profilePic.src = profilePhoto.src;
        markDirty();
    };
    reader.readAsDataURL(file);
}

document.addEventListener('DOMContentLoaded', function () {
    loadProfileData();

    if (changePhotoBtn) {
        changePhotoBtn.addEventListener('click', () => photoInput && photoInput.click());
        changePhotoBtn.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                photoInput && photoInput.click();
            }
        });
    }
    if (photoInput) photoInput.addEventListener('change', handlePhotoUpload);

    if (nameInput) {
        nameInput.addEventListener('input', function () {
            updateCharCounter();
            updateDisplayedName();
            markDirty();
        });
    }

    if (cancelBtn) {
        cancelBtn.addEventListener('click', function () {
            if (!cancelBtn.disabled && confirm('Discard unsaved changes?')) {
                if (nameInput) nameInput.value = lastSaved.name;
                if (profilePhoto) profilePhoto.src = lastSaved.photo;
                if (profilePic && profilePhoto) profilePic.src = profilePhoto.src;
                updateCharCounter();
                updateDisplayedName();
                markDirty();
                if (profileStatus) profileStatus.textContent = 'Changes discarded.';
                setTimeout(() => {
                    if (profileStatus) profileStatus.textContent = '';
                    profileStatus && profileStatus.classList.remove('is-warn', 'is-ok');
                }, 1800);
            }
        });
    }

    if (saveBtn) {
        saveBtn.addEventListener('click', saveProfileData);
    }

    if (nameInput) {
        nameInput.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                saveBtn && saveBtn.click();
            }
        });
    }

    if (removePhotoBtn) {
        removePhotoBtn.addEventListener('click', function () {
            if (profilePhoto) profilePhoto.src = DEFAULT_PHOTO;
            if (profilePic) profilePic.src = DEFAULT_PHOTO;
            markDirty();
            showNotification('Photo reset to default.', 'info');
        });
    }
});

document.addEventListener('DOMContentLoaded', function () {
    const photoWrapper = document.querySelector('.photo-wrapper');
    const photoFrame = document.querySelector('.photo-frame');
    const target = photoWrapper || photoFrame;
    if (!target) return;
    target.addEventListener('dragover', function (e) {
        e.preventDefault();
        target.classList.add('is-dragover');
    });
    target.addEventListener('dragleave', function (e) {
        e.preventDefault();
        target.classList.remove('is-dragover');
    });
    target.addEventListener('drop', function (e) {
        e.preventDefault();
        target.classList.remove('is-dragover');
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handlePhotoUpload({ target: { files: files } });
        }
    });
});
