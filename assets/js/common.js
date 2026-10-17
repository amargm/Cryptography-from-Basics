/* -------------------------------------------------------------
   CRYPTOGRAPHY FROM BASICS — SHARED CORE JAVASCRIPT
   Handles Theme, Typography, Reading Progress, & Quiz Feedback
------------------------------------------------------------- */

(function () {
  // 1. Initialize Theme from localStorage or Default to 'paper'
  const savedTheme = localStorage.getItem('crypto_theme') || 'paper';
  setTheme(savedTheme, false);

  // 2. Initialize Font from localStorage or Default to 'sans'
  const savedFont = localStorage.getItem('crypto_font') || 'sans';
  setFont(savedFont, false);

  // 3. Setup Scroll Progress Bar
  window.addEventListener('scroll', updateReadingProgress);

  // 4. Highlight current page in sidebar on DOM ready
  document.addEventListener('DOMContentLoaded', () => {
    highlightActiveNavLink();
    updateThemeUI(savedTheme);
    updateFontUI(savedFont);
  });
})();

// Reading Progress
function updateReadingProgress() {
  const progressBar = document.getElementById('readingProgress');
  if (!progressBar) return;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  if (docHeight <= 0) {
    progressBar.style.width = '0%';
    return;
  }
  const scrolled = (window.scrollY / docHeight) * 100;
  progressBar.style.width = Math.min(100, Math.max(0, scrolled)) + '%';
}

// Theme Switcher
function setTheme(themeName, persist = true) {
  document.documentElement.setAttribute('data-theme', themeName);
  if (persist) {
    localStorage.setItem('crypto_theme', themeName);
  }
  updateThemeUI(themeName);
}

function updateThemeUI(themeName) {
  document.querySelectorAll('.theme-chip').forEach(chip => chip.classList.remove('active'));
  const activeBtn = document.getElementById('theme' + themeName.charAt(0).toUpperCase() + themeName.slice(1));
  if (activeBtn) activeBtn.classList.add('active');
}

// Font Switcher
function setFont(fontType, persist = true) {
  document.documentElement.setAttribute('data-font', fontType);
  if (persist) {
    localStorage.setItem('crypto_font', fontType);
  }
  updateFontUI(fontType);
}

function updateFontUI(fontType) {
  const btnSans = document.getElementById('btnSans');
  const btnSerif = document.getElementById('btnSerif');
  if (btnSans && btnSerif) {
    btnSans.classList.toggle('active', fontType === 'sans');
    btnSerif.classList.toggle('active', fontType === 'serif');
  }
}

// Sidebar Active Page Matcher
function highlightActiveNavLink() {
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href && href.endsWith(currentPath)) {
      link.classList.add('active');
    }
  });
}

// Universal Checkpoint Quiz Engine
function handleQuiz(button, isCorrect, explanationText) {
  const parentCard = button.closest('.checkpoint-card') || button.parentElement.parentElement;
  const feedback = parentCard.querySelector('.feedback-note');
  const allButtons = parentCard.querySelectorAll('.choice-btn');

  allButtons.forEach(btn => {
    btn.style.opacity = '0.45';
    btn.disabled = true;
  });

  button.style.opacity = '1';
  if (feedback) {
    feedback.style.display = 'block';
    if (isCorrect) {
      button.classList.add('selected-correct');
      feedback.style.background = 'var(--accent-soft)';
      feedback.style.color = 'var(--accent-text)';
      feedback.style.border = '1px solid var(--accent-border)';
      feedback.innerHTML = `<strong>Correct.</strong> ${explanationText}`;
    } else {
      button.style.borderColor = '#c53030';
      feedback.style.background = 'rgba(197, 48, 48, 0.08)';
      feedback.style.color = '#c53030';
      feedback.style.border = '1px solid rgba(197, 48, 48, 0.2)';
      feedback.innerHTML = `<strong>Not quite.</strong> ${explanationText}`;
    }
  }
}

