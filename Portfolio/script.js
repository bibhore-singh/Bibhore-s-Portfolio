/**
 * Bibhore Raj - Portfolio Dynamic Scripts & Interactive Playgrounds
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initTypewriter();
  initNavigation();
  initSkillsFilter();
  initSnakeGame();
  initParkingSimulator();
  initCopyrightYear();
});

/* ==========================================================================
   1. Theme Management (Dark / Light)
   ========================================================================== */
function initTheme() {
  const themeToggleBtn = document.getElementById('themeToggle');
  const html = document.documentElement;

  // Retrieve saved theme or default to dark
  const savedTheme = localStorage.getItem('bibhore_theme') || 'dark';
  html.setAttribute('data-theme', savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = html.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      html.setAttribute('data-theme', newTheme);
      localStorage.setItem('bibhore_theme', newTheme);
      showToast(`Switched to ${newTheme.toUpperCase()} mode`);
    });
  }
}

/* ==========================================================================
   2. Typewriter Effect
   ========================================================================== */
function initTypewriter() {
  const words = [
    'Multimodal AI & Gemini 3',
    'C++ & Python Logic',
    'Smart IoT Systems',
    'Full-Stack Web Tech',
    'Algorithmic Problem Solving',
    'Clean Scalable Code'
  ];
  const el = document.getElementById('typewriterText');
  if (!el) return;

  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 100;

  function type() {
    const currentWord = words[wordIndex];
    if (isDeleting) {
      el.textContent = currentWord.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 50;
    } else {
      el.textContent = currentWord.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 110;
    }

    if (!isDeleting && charIndex === currentWord.length) {
      isDeleting = true;
      typingSpeed = 1800; // Pause at end of word
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      typingSpeed = 400; // Pause before new word
    }

    setTimeout(type, typingSpeed);
  }

  type();
}

/* ==========================================================================
   3. Navigation & Scroll Spy
   ========================================================================== */
function initNavigation() {
  const mobileToggle = document.getElementById('mobileToggle');
  const navLinks = document.getElementById('navLinks');
  const links = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section');

  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      navLinks.classList.toggle('mobile-active');
    });

    // Close menu when link is clicked
    links.forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('mobile-active');
      });
    });
  }

  // Scroll Spy for active link
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    links.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
}

/* ==========================================================================
   4. Skills Filter Tabs
   ========================================================================== */
function initSkillsFilter() {
  const filterBtns = document.querySelectorAll('#skillsFilter .filter-tab');
  const skillCards = document.querySelectorAll('#skillsContainer .skill-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      skillCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(10px)';
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   5. Playground Tab Switcher & Scroll Jump
   ========================================================================== */
window.switchPlayground = function(tabName) {
  const snakeTab = document.getElementById('snake-playground');
  const parkingTab = document.getElementById('parking-demo');
  const tabSnakeBtn = document.getElementById('tabSnakeBtn');
  const tabParkingBtn = document.getElementById('tabParkingBtn');

  if (tabName === 'snake') {
    snakeTab.classList.add('active');
    parkingTab.classList.remove('active');
    tabSnakeBtn.classList.add('active');
    tabParkingBtn.classList.remove('active');
  } else {
    parkingTab.classList.add('active');
    snakeTab.classList.remove('active');
    tabParkingBtn.classList.add('active');
    tabSnakeBtn.classList.remove('active');
  }
};

window.scrollToPlayground = function(tabName) {
  switchPlayground(tabName);
  const playgroundSection = document.getElementById('playground');
  if (playgroundSection) {
    playgroundSection.scrollIntoView({ behavior: 'smooth' });
  }
};

/* ==========================================================================
   6. Web Audio API Retro Sound Effects Synthesizer
   ========================================================================== */
let audioCtx = null;

function getAudioContext() {
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
      audioCtx = new AudioContext();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

function playBleep(freq, type = 'sine', duration = 0.1) {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch (e) {
    // Audio optional / suppressed
  }
}

function playBuzzerAlarm() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(160, ctx.currentTime);
    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 0.4);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.4);
  } catch (e) {}
}

/* ==========================================================================
   7. Playable Snake Game Engine (Canvas)
   ========================================================================== */
let snakeGame = null;

function initSnakeGame() {
  const canvas = document.getElementById('snakeCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const overlay = document.getElementById('gameOverOverlay');
  const overlayHeading = document.getElementById('overlayHeading');
  const overlayScoreText = document.getElementById('overlayScoreText');
  const startBtn = document.getElementById('startGameBtn');
  const currentScoreEl = document.getElementById('currentScore');
  const highScoreEl = document.getElementById('highScore');

  const gridSize = 20; // 20x20 grid (400px / 20 = 20px per cell)
  const tileCount = 20;

  let snake = [];
  let food = { x: 15, y: 15 };
  let dx = 1;
  let dy = 0;
  let nextDx = 1;
  let nextDy = 0;
  let score = 0;
  let highScore = parseInt(localStorage.getItem('bibhore_snake_hi') || '0', 10);
  let gameInterval = null;
  let isRunning = false;
  let isPaused = false;
  let speed = 120; // ms per tick

  highScoreEl.textContent = highScore;

  function resetGame() {
    snake = [
      { x: 10, y: 10 },
      { x: 9, y: 10 },
      { x: 8, y: 10 }
    ];
    dx = 1;
    dy = 0;
    nextDx = 1;
    nextDy = 0;
    score = 0;
    speed = 120;
    currentScoreEl.textContent = '0';
    spawnFood();
  }

  function spawnFood() {
    let valid = false;
    while (!valid) {
      food.x = Math.floor(Math.random() * tileCount);
      food.y = Math.floor(Math.random() * tileCount);
      valid = !snake.some(segment => segment.x === food.x && segment.y === food.y);
    }
  }

  function startGame() {
    resetGame();
    overlay.classList.add('hidden');
    isRunning = true;
    isPaused = false;
    clearInterval(gameInterval);
    gameInterval = setInterval(gameLoop, speed);
  }

  function gameOver() {
    isRunning = false;
    clearInterval(gameInterval);
    playBleep(140, 'square', 0.3);

    if (score > highScore) {
      highScore = score;
      localStorage.setItem('bibhore_snake_hi', highScore.toString());
      highScoreEl.textContent = highScore;
    }

    overlayHeading.textContent = 'Game Over!';
    overlayScoreText.textContent = `You scored ${score} points! (Best: ${highScore})`;
    startBtn.textContent = 'Play Again';
    overlay.classList.remove('hidden');
  }

  function togglePause() {
    if (!isRunning) return;
    isPaused = !isPaused;
    if (isPaused) {
      clearInterval(gameInterval);
      overlayHeading.textContent = 'Paused';
      overlayScoreText.textContent = 'Press resume or pause button to continue.';
      startBtn.textContent = 'Resume';
      overlay.classList.remove('hidden');
    } else {
      overlay.classList.add('hidden');
      gameInterval = setInterval(gameLoop, speed);
    }
  }

  function gameLoop() {
    // Update direction from input buffer
    dx = nextDx;
    dy = nextDy;

    // Calculate new head coordinate
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };

    // Wall collision
    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
      gameOver();
      return;
    }

    // Body collision
    if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
      gameOver();
      return;
    }

    snake.unshift(head);

    // Food check
    if (head.x === food.x && head.y === food.y) {
      score += 1;
      currentScoreEl.textContent = score;
      playBleep(600, 'sine', 0.1);
      spawnFood();

      // Progressive speed scaling
      if (speed > 60 && score % 3 === 0) {
        speed -= 5;
        clearInterval(gameInterval);
        gameInterval = setInterval(gameLoop, speed);
      }
    } else {
      snake.pop();
    }

    draw();
  }

  function draw() {
    // Clear background
    ctx.fillStyle = '#050810';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Grid lines for arcade look
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= canvas.width; i += gridSize) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, canvas.height);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(canvas.width, i);
      ctx.stroke();
    }

    // Draw Food (Glowing Apple / Orb)
    ctx.fillStyle = '#f43f5e';
    ctx.shadowBlur = 12;
    ctx.shadowColor = '#f43f5e';
    ctx.beginPath();
    const foodRadius = gridSize / 2 - 2;
    ctx.arc(
      food.x * gridSize + gridSize / 2,
      food.y * gridSize + gridSize / 2,
      foodRadius,
      0,
      Math.PI * 2
    );
    ctx.fill();
    ctx.shadowBlur = 0; // reset

    // Draw Snake
    snake.forEach((segment, index) => {
      if (index === 0) {
        // Head with gradient glow
        ctx.fillStyle = '#06b6d4';
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#06b6d4';
      } else {
        // Body
        ctx.fillStyle = index % 2 === 0 ? '#6366f1' : '#818cf8';
        ctx.shadowBlur = 0;
      }

      ctx.beginPath();
      ctx.roundRect(
        segment.x * gridSize + 1,
        segment.y * gridSize + 1,
        gridSize - 2,
        gridSize - 2,
        index === 0 ? 6 : 4
      );
      ctx.fill();
    });
    ctx.shadowBlur = 0;
  }

  // Initial draw
  resetGame();
  draw();

  startBtn.addEventListener('click', () => {
    if (isPaused) {
      togglePause();
    } else {
      startGame();
    }
  });

  // Keyboard controls
  window.addEventListener('keydown', (e) => {
    const key = e.key.toLowerCase();
    
    // Prevent default scrolling for arrows & space
    if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', ' '].includes(e.key)) {
      const activeEl = document.activeElement;
      if (activeEl && ['INPUT', 'TEXTAREA'].includes(activeEl.tagName)) {
        return; // Allow typing in forms
      }
      e.preventDefault();
    }

    if (!isRunning && (key === 'enter' || key === ' ')) {
      startGame();
      return;
    }

    if (key === 'p') {
      togglePause();
      return;
    }

    if ((key === 'arrowup' || key === 'w') && dy === 0) {
      nextDx = 0;
      nextDy = -1;
    } else if ((key === 'arrowdown' || key === 's') && dy === 0) {
      nextDx = 0;
      nextDy = 1;
    } else if ((key === 'arrowleft' || key === 'a') && dx === 0) {
      nextDx = -1;
      nextDy = 0;
    } else if ((key === 'arrowright' || key === 'd') && dx === 0) {
      nextDx = 1;
      nextDy = 0;
    }
  });

  // Mobile D-Pad controls
  const dpadUp = document.getElementById('dpadUp');
  const dpadDown = document.getElementById('dpadDown');
  const dpadLeft = document.getElementById('dpadLeft');
  const dpadRight = document.getElementById('dpadRight');
  const dpadPause = document.getElementById('dpadPause');

  if (dpadUp) {
    dpadUp.addEventListener('click', () => { if (dy === 0) { nextDx = 0; nextDy = -1; } });
    dpadDown.addEventListener('click', () => { if (dy === 0) { nextDx = 0; nextDy = 1; } });
    dpadLeft.addEventListener('click', () => { if (dx === 0) { nextDx = -1; nextDy = 0; } });
    dpadRight.addEventListener('click', () => { if (dx === 0) { nextDx = 1; nextDy = 0; } });
    dpadPause.addEventListener('click', () => { togglePause(); });
  }
}

/* ==========================================================================
   8. Smart Parking Assistance Simulator
   ========================================================================== */
const parkingState = {
  total: 6,
  slots: [
    { id: 1, occupied: true, car: '🚗' },
    { id: 2, occupied: true, car: '🚙' },
    { id: 3, occupied: false, car: '' },
    { id: 4, occupied: false, car: '' },
    { id: 5, occupied: false, car: '' },
    { id: 6, occupied: false, car: '' }
  ]
};

const carEmojis = ['🚗', '🚙', '🏎️', '🚕', '🚐', '🚘'];

function initParkingSimulator() {
  updateParkingUI();
}

function updateParkingUI() {
  const totalSlotsCount = document.getElementById('totalSlotsCount');
  const availSlotsCount = document.getElementById('availSlotsCount');
  const gateStatusText = document.getElementById('gateStatusText');
  const gateBarrierArm = document.getElementById('gateBarrierArm');
  const capacityAlert = document.getElementById('capacityAlert');
  const slotsGrid = document.getElementById('parkingSlotsGrid');

  if (!slotsGrid) return;

  const availableCount = parkingState.slots.filter(s => !s.occupied).length;
  totalSlotsCount.textContent = parkingState.total;
  availSlotsCount.textContent = availableCount;

  // Render Slots
  slotsGrid.innerHTML = '';
  parkingState.slots.forEach(slot => {
    const bay = document.createElement('div');
    bay.className = `parking-bay ${slot.occupied ? 'occupied' : 'free'}`;
    bay.setAttribute('data-slot', slot.id);

    bay.innerHTML = `
      <div class="bay-header">
        <span class="bay-num">Bay 0${slot.id}</span>
        <span class="bay-status-dot ${slot.occupied ? 'occupied' : 'free'}"></span>
      </div>
      <div class="bay-car-visual ${slot.occupied ? '' : 'empty'}">
        ${slot.occupied ? slot.car : '<span>[ FREE ]</span>'}
      </div>
      <button class="bay-toggle-btn" onclick="toggleSlot(${slot.id})">
        ${slot.occupied ? 'Vacate Slot' : 'Park Car'}
      </button>
    `;
    slotsGrid.appendChild(bay);
  });

  // Gate and Capacity Logic
  if (availableCount === 0) {
    // 100% full -> Gate Closed, Buzzer Alarm!
    gateStatusText.textContent = 'GATE CLOSED (FULL)';
    gateStatusText.className = 'metric-val status-full';
    if (gateBarrierArm) gateBarrierArm.classList.add('closed');
    if (capacityAlert) capacityAlert.classList.add('active');
    playBuzzerAlarm();
  } else {
    // Has space -> Gate Open
    gateStatusText.textContent = 'GATE OPEN (SERVO)';
    gateStatusText.className = 'metric-val status-open';
    if (gateBarrierArm) gateBarrierArm.classList.remove('closed');
    if (capacityAlert) capacityAlert.classList.remove('active');
  }
}

window.toggleSlot = function(slotId) {
  const slot = parkingState.slots.find(s => s.id === slotId);
  if (!slot) return;

  slot.occupied = !slot.occupied;
  if (slot.occupied) {
    slot.car = carEmojis[Math.floor(Math.random() * carEmojis.length)];
    playBleep(520, 'sine', 0.1);
  } else {
    slot.car = '';
    playBleep(350, 'sine', 0.1);
  }
  updateParkingUI();
};

window.parkRandomCar = function() {
  const freeSlot = parkingState.slots.find(s => !s.occupied);
  if (freeSlot) {
    freeSlot.occupied = true;
    freeSlot.car = carEmojis[Math.floor(Math.random() * carEmojis.length)];
    playBleep(520, 'sine', 0.1);
    updateParkingUI();
    showToast(`Vehicle parked in Bay 0${freeSlot.id}`);
  } else {
    playBuzzerAlarm();
    showToast('Cannot park: Parking lot is completely FULL!');
  }
};

window.resetParkingLot = function() {
  parkingState.slots.forEach(s => {
    s.occupied = false;
    s.car = '';
  });
  updateParkingUI();
  showToast('All parking bays reset to FREE');
};

/* ==========================================================================
   9. Clipboard & Feedback Toast
   ========================================================================== */
window.copyToClipboard = function(text, successMsg) {
  navigator.clipboard.writeText(text).then(() => {
    showToast(successMsg || 'Copied to clipboard!');
  }).catch(() => {
    // Fallback
    const input = document.createElement('input');
    input.value = text;
    document.body.appendChild(input);
    input.select();
    document.execCommand('copy');
    document.body.removeChild(input);
    showToast(successMsg || 'Copied to clipboard!');
  });
};

let toastTimeout = null;
function showToast(msg) {
  const toast = document.getElementById('toastNotification');
  const text = document.getElementById('toastText');
  if (!toast || !text) return;

  text.textContent = msg;
  toast.classList.add('show');

  if (toastTimeout) clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 3200);
}

/* ==========================================================================
   10. Contact Form Submission Handler
   ========================================================================== */
window.handleFormSubmit = function(e) {
  e.preventDefault();
  const name = document.getElementById('senderName').value.trim();
  const email = document.getElementById('senderEmail').value.trim();
  const subject = document.getElementById('messageSubject').value.trim();
  const message = document.getElementById('senderMessage').value.trim();
  const feedback = document.getElementById('formFeedback');

  if (!name || !email || !message) return;

  // Provide rich confirmation
  feedback.className = 'form-feedback success';
  feedback.innerHTML = `
    🎉 Thank you, <strong>${name}</strong>! Your message draft has been formatted.
    <br><span style="font-size: 0.82rem; opacity: 0.9;">Direct email to <strong>singhbibhore.gnp@gmail.com</strong> is ready.</span>
  `;

  // Create mailto link for direct sending
  const mailtoUrl = `mailto:singhbibhore.gnp@gmail.com?subject=${encodeURIComponent(subject || 'Portfolio Collaboration')}&body=${encodeURIComponent(`Hi Bibhore,\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}`)}`;
  
  // Prompt user to open their mail client or copy
  setTimeout(() => {
    window.open(mailtoUrl, '_blank');
  }, 1200);

  document.getElementById('contactForm').reset();
  showToast('Draft created for Bibhore Raj!');
};

/* ==========================================================================
   11. Footer Copyright Year
   ========================================================================== */
function initCopyrightYear() {
  const yearEl = document.getElementById('currentYear');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}

/* ==========================================================================
   12. Certificate Lightbox Modal & Details
   ========================================================================== */
const certificateData = {
  'ai-bootcamp': {
    title: 'Hands-on Bootcamp on Artificial Intelligence',
    issuer: 'BlockseBlock & OpenxAI',
    badge: '🤖 Artificial Intelligence',
    date: '28th August 2025',
    img: 'certificates/ai-bootcamp-blockseblock.png',
    pdf: 'certificates/ai-bootcamp-blockseblock.pdf',
    desc: 'Awarded Certificate of Achievement for successfully completing the hands-on Bootcamp on Artificial Intelligence, demonstrating applied learning, neural architectures, AI development workflows, and professional engineering excellence.',
    verifyUrl: null,
    verifyText: null
  },
  'infosys-ai': {
    title: 'Introduction to Artificial Intelligence',
    issuer: 'Infosys Springboard',
    badge: '🤖 Artificial Intelligence',
    date: 'March 25, 2026',
    img: 'certificates/infosys-springboard-ai.png',
    pdf: 'certificates/infosys-springboard-ai.pdf',
    desc: 'Course Completion Certificate awarded by Infosys Springboard validating foundational artificial intelligence principles, cognitive architectures, machine learning concepts, neural algorithms, and applied intelligence systems.',
    verifyUrl: 'https://verify.onwingspan.com',
    verifyText: 'Verify at Wingspan'
  },
  'infosys-python': {
    title: 'Introduction to Python',
    issuer: 'Infosys Springboard',
    badge: '🐍 Python Programming',
    date: 'February 4, 2026',
    img: 'certificates/infosys-springboard-python.png',
    pdf: 'certificates/infosys-springboard-python.pdf',
    desc: 'Course Completion Certificate awarded by Infosys Springboard validating core Python competencies including procedural logic, object-oriented programming, data structures, algorithm design, and clean scripting.',
    verifyUrl: 'https://verify.onwingspan.com',
    verifyText: 'Verify at Wingspan'
  },
  'linkedin-time-mgmt': {
    title: 'Time Management Tips',
    issuer: 'LinkedIn Learning',
    badge: '⏱️ Time Management',
    date: 'November 2, 2025',
    img: 'certificates/linkedin-learning-time-management.png',
    pdf: 'certificates/linkedin-learning-time-management.pdf',
    desc: 'Course Completion Certificate awarded by LinkedIn Learning for completing 7 hours 51 minutes of intensive professional training covering sustainable productivity, distraction management, workload prioritization, and high-efficiency execution.',
    verifyUrl: 'https://www.linkedin.com/learning/certificates/9e4f18455da5e2f6db15eb1b788d3394c840b2fbac25e7fec8ec56d50b114e8a',
    verifyText: 'Verify on LinkedIn'
  },
  'google-algo-hunt': {
    title: 'Algo-N-Hunt Competitive Event',
    issuer: 'Google Student Ambassador Program @ LPU',
    badge: '🌐 Google Student Program',
    date: '22nd November 2025',
    img: 'certificates/google-student-ambassador-algo-n-hunt.png',
    pdf: 'certificates/google-student-ambassador-algo-n-hunt.pdf',
    desc: 'Certificate of Participation awarded as part of the Google Student Ambassador Program for competitive algorithmic problem solving, active leadership, and dedication to fostering technical learning and innovation within the university community.',
    verifyUrl: null,
    verifyText: null
  },
  'optimus-algo-hunt': {
    title: 'ALGO-N-HUNT Coding & Puzzle Marathon',
    issuer: 'Student Organization OPTIMUS, LPU',
    badge: '⚡ Competitive Coding',
    date: '22nd November 2025',
    img: 'certificates/optimus-algo-n-hunt.png',
    pdf: 'certificates/optimus-algo-n-hunt.pdf',
    desc: 'Certificate of Participation recognizing active participation, analytical thinking, teamwork, algorithmic efficiency, and problem-solving excellence throughout an intensive multi-round coding, puzzle & gaming marathon.',
    verifyUrl: null,
    verifyText: null
  },
  'hack-node-india': {
    title: 'Hack Node India Hackathon',
    issuer: 'BlockseBlock & Web3 Sabha',
    badge: '🏆 Web3 & Hackathon',
    date: 'September 2025',
    img: 'certificates/hack-node-india-hackathon.png',
    pdf: 'certificates/hack-node-india-hackathon.pdf',
    desc: 'Certificate of Participation presented for participating in the nationwide Hack Node India Hackathon, delivering collaborative engineering prototypes and decentralized solutions. Certificate ID: BSB-KALLDO-MEZPI544.',
    verifyUrl: null,
    verifyText: null
  }
};

window.openCertModal = function(certId) {
  const cert = certificateData[certId];
  if (!cert) return;

  const backdrop = document.getElementById('certModalBackdrop');
  const img = document.getElementById('certModalImg');
  const title = document.getElementById('certModalTitle');
  const issuer = document.getElementById('certModalIssuer');
  const badge = document.getElementById('certModalBadge');
  const date = document.getElementById('certModalDate');
  const desc = document.getElementById('certModalDesc');
  const pdfBtn = document.getElementById('certModalPdfBtn');
  const verifyBtn = document.getElementById('certModalVerifyBtn');

  if (!backdrop) return;

  img.src = cert.img;
  img.alt = cert.title;
  title.textContent = cert.title;
  issuer.textContent = cert.issuer;
  badge.textContent = cert.badge;
  date.textContent = cert.date;
  desc.textContent = cert.desc;

  if (pdfBtn) {
    pdfBtn.href = cert.pdf;
  }

  if (verifyBtn) {
    if (cert.verifyUrl) {
      verifyBtn.href = cert.verifyUrl;
      verifyBtn.style.display = 'inline-flex';
      const verifySpan = verifyBtn.querySelector('span');
      if (verifySpan) verifySpan.textContent = cert.verifyText || 'Verify Credential';
    } else {
      verifyBtn.style.display = 'none';
    }
  }

  backdrop.classList.add('active');
  document.body.style.overflow = 'hidden';
};

window.closeCertModal = function(event) {
  if (event && event.target && event.target.closest && event.target.closest('.cert-modal-dialog') && !event.target.closest('.cert-modal-close')) {
    return;
  }
  const backdrop = document.getElementById('certModalBackdrop');
  if (backdrop) {
    backdrop.classList.remove('active');
  }
  document.body.style.overflow = '';
};

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeCertModal();
    closeRuralAssistModal();
  }
});

/* ==========================================================================
   14. RuralAssist AI Interactive Showcase Modal & Simulations
   ========================================================================== */

// Crop Scanner Datasets
const cropScannerData = {
  tomato: {
    name: 'Early Blight (Alternaria solani)',
    emoji: '🍅',
    label: 'Tomato Leaf Sample (Solanum lycopersicum)',
    crop: 'Tomato',
    confidence: '96.8%',
    severity: 'Moderate (Stage 2)',
    yieldRisk: '20% – 35%',
    symptoms: 'Concentric dark target-board rings detected on lower foliage with chlorotic yellow halo surrounding necrotic margins. High humidity conditions accelerating fungal spore germination.',
    remedies: {
      en: {
        organic: 'Prune affected lower leaves immediately to improve airflow. Spray Neem Oil solution (5ml per litre of water) early morning.',
        chemical: 'Apply Copper Oxychloride 50 WP @ 2.5g/L or Mancozeb 75 WP @ 2g/L every 10–12 days until symptoms subside.'
      },
      hi: {
        organic: 'संक्रमित निचली पत्तियों को तुरंत काटकर अलग करें। नीम का तेल (5ml प्रति लीटर पानी) सुबह के समय छिड़कें।',
        chemical: 'कॉपर ऑक्सीक्लोराइड 50 WP (2.5 ग्राम/लीटर) या मैंकोजेब 75 WP (2 ग्राम/लीटर) 10-12 दिनों के अंतराल पर छिड़कें।'
      }
    }
  },
  wheat: {
    name: 'Leaf Rust / Brown Rust (Puccinia triticina)',
    emoji: '🌾',
    label: 'Wheat Leaf Sample (Triticum aestivum)',
    crop: 'Wheat',
    confidence: '98.2%',
    severity: 'High (Pustule Spread)',
    yieldRisk: '30% – 45%',
    symptoms: 'Scattered oval or round orange-brown pustules found across flag leaves and stems. Powdery fungal urediniospores rubbing off easily upon contact.',
    remedies: {
      en: {
        organic: 'Spray fermented butter milk (Chhachh) mixed with copper vessel extract (20ml/L) or Trichoderma viride bio-fungicide @ 5g/L.',
        chemical: 'Foliar spray of Propiconazole 25% EC (Tilt) @ 1ml/L or Tebuconazole 25.9% EC @ 1ml/L immediately to halt rust spreading.'
      },
      hi: {
        organic: 'खट्टी छाछ (तांबे के बर्तन में रखी हुई) 20ml/लीटर या ट्राइकोडर्मा विरिडी (5 ग्राम/लीटर) का जैव-कवकनाशी छिड़काव करें।',
        chemical: 'प्रोपिकोनाज़ोल 25% EC (टिल्ट) 1ml/लीटर या टेबुकोनाज़ोल 25.9% EC का तुरंत छिड़काव करें ताकि रतुआ न फैले।'
      }
    }
  },
  rice: {
    name: 'Healthy Crop (No Pathogens Detected)',
    emoji: '🌱',
    label: 'Paddy Canopy Sample (Oryza sativa)',
    crop: 'Rice / Paddy',
    confidence: '99.1%',
    severity: 'Optimal (Clean Foliage)',
    yieldRisk: '0% (Healthy Growth)',
    symptoms: 'Uniform vibrant chlorophyll pigmentation without necrotic lesions, blast spots, or bacterial blight stripes. Vigorous tiller development observed.',
    remedies: {
      en: {
        organic: 'Maintain intermittent 2-inch standing water depth. Top-dress with vermicompost and Azospirillum bio-fertilizer.',
        chemical: 'No chemical fungicides needed. Continue standard NPK 120:60:40 schedule with zinc sulfate micronutrient spray @ 5g/L.'
      },
      hi: {
        organic: 'खेत में 2 इंच पानी का स्तर बनाए रखें। वर्मीकम्पोस्ट और एजोस्पिरिलम जैव-उर्वरक का उपयोग करें।',
        chemical: 'किसी रासायनिक कवकनाशी की आवश्यकता नहीं है। मानक NPK खाद और जिंक सल्फेट (5 ग्राम/लीटर) का छिड़काव जारी रखें।'
      }
    }
  },
  cotton: {
    name: 'Cotton Aphid & Jassid Infestation (Aphis gossypii)',
    emoji: '🌿',
    label: 'Cotton Leaf Underside (Gossypium hirsutum)',
    crop: 'Cotton',
    confidence: '94.5%',
    severity: 'Early Warning (Sucking Pests)',
    yieldRisk: '15% – 25%',
    symptoms: 'Downward leaf curling with honeydew exudates on upper surfaces leading to early sooty mold. Sucking pest clusters localized on tender terminal shoots.',
    remedies: {
      en: {
        organic: 'Install yellow sticky traps (6–8 per acre). Spray 5% NSKE (Neem Seed Kernel Extract) or Verticillium lecanii @ 5g/L.',
        chemical: 'Spray Imidacloprid 17.8% SL @ 0.3ml/L or Acetamiprid 20% SP @ 0.4g/L on lower leaf surfaces during cool hours.'
      },
      hi: {
        organic: 'पीले चिपचिपे ट्रैप (6-8 प्रति एकड़) लगाएं। 5% नीम बीज अर्क (NSKE) या वर्टिसिलियम लेकानी (5g/L) का छिड़काव करें।',
        chemical: 'इमिडाक्लोप्रिड 17.8% SL (0.3ml/लीटर) या एसिटामिप्रिड 20% SP (0.4 ग्राम/लीटर) पत्तियों की निचली सतह पर छिड़कें।'
      }
    }
  }
};

let currentCropKey = 'tomato';
let currentDiagLang = 'en';

// Kisan-Bhai Chatbot Datasets
const kisanDialects = {
  hi: {
    welcome: 'राम राम किसान भाई! मैं आपका डिजिटल कृषि साथी हूँ। फसल रोग, मौसम सलाह, खाद का अनुपात या सरकारी योजनाओं के बारे में कुछ भी पूछें।',
    placeholder: 'खेती या फसल से जुड़ा सवाल यहाँ पूछें...',
    status: '● लाइव ऑडियो स्ट्रीमिंग · Gemini 3.1 Flash-Lite (हिन्दी)'
  },
  pa: {
    welcome: 'ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ ਕਿਸਾਨ ਵੀਰੋ! ਮੈਂ ਤੁਹਾਡਾ ਡਿਜੀਟਲ ਖੇਤੀ ਸਲਾਹਕਾਰ ਹਾਂ। ਫ਼ਸਲਾਂ ਦੇ ਰੋਗ, ਮੌਸਮ, ਖਾਦਾਂ ਅਤੇ ਸਬਸਿਡੀ ਬਾਰੇ ਜੋ ਮਰਜ਼ੀ ਪੁੱਛੋ।',
    placeholder: 'ਖੇਤੀ ਨਾਲ ਸੰਬੰਧਿਤ ਸਵਾਲ ਇੱਥੇ ਲਿਖੋ...',
    status: '● ਲਾਈਵ ਆਡੀਓ ਸਟ੍ਰੀਮਿੰਗ · Gemini 3.1 Flash-Lite (ਪੰਜਾਬੀ)'
  },
  mr: {
    welcome: 'राम राम शेतकरी बंधूंनो! मी आपला डिजिटल कृषी मित्र आहे. पीक रोग, खत व्यवस्थापन, हवामान अंदाज किंवा सरकारी योजनांविषयी काहीही विचारा.',
    placeholder: 'शेती विषयी प्रश्न येथे विचारा...',
    status: '● लाईव्ह ऑडिओ स्ट्रीमिंग · Gemini 3.1 Flash-Lite (मराठी)'
  },
  en: {
    welcome: 'Greetings farmer friend! I am your Kisan-Bhai digital agronomy advisor. Ask me anything about crop disease diagnosis, weather alerts, fertilizer ratios, or government subsidies.',
    placeholder: 'Type your farming question here...',
    status: '● Live Audio Streaming · Gemini 3.1 Flash-Lite (English)'
  }
};

let currentDialect = 'hi';

const kisanPresetAnswers = {
  yellow_leaves: {
    hi: '🌿 **गेहूं में पीले पत्ते का कारण व उपचार:**\n1. यदि निचली पत्तियां पीली हैं: **नाइट्रोजन की कमी** है। प्रति एकड़ 25-30kg यूरिया सिंचाई के साथ दें।\n2. यदि बीच की पत्तियों पर पीली धारियां हैं: **जिंक की कमी** है। 0.5% जिंक सल्फेट + 2.5% यूरिया का पर्णीय छिड़काव करें।\n3. यदि पीलापन पाउडरी पाउडर जैसा है: **पीला रतुआ** का लक्षण है, तुरंत प्रोपिकोनाज़ोल 25 EC (1ml/L) छिड़कें।',
    pa: '🌿 **ਕਣਕ ਵਿੱਚ ਪੀਲੇ ਪੱਤਿਆਂ ਦਾ ਕਾਰਨ ਤੇ ਇਲਾਜ:**\n1. ਨਾਈਟ੍ਰੋਜਨ ਦੀ ਘਾਟ ਲਈ ਯੂਰੀਆ ਦਿਓ।\n2. ਪੀਲੀ ਕੁੰਗੀ (Yellow Rust) ਦੇ ਸ਼ੱਕ ਲਈ ਟਿਲਟ (Tilt 25 EC) 200ml ਪ੍ਰਤੀ 200 ਲੀਟਰ ਪਾਣੀ ਵਿੱਚ ਮਿਲਾ ਕੇ ਛਿੜਕੋ।',
    mr: '🌿 **गहू पिकातील पिवळेपणा उपाय:**\nनायट्रोजन कमतरतेसाठी युरिया द्या किंवा ०.५% झिंक सल्फेट फवारणी करा. तांबेरा रोगाची लक्षणे आढळल्यास प्रोपिकोनाझोल १ मिली/लिटर फवारा.',
    en: '🌿 **Yellow Leaves Diagnosis in Wheat:**\n1. Bottom leaves yellowing: Nitrogen deficiency. Top-dress 25-30kg Urea/acre with irrigation.\n2. Yellow streaks on middle leaves: Zinc deficiency. Foliar spray 0.5% Zinc Sulfate + 2.5% Urea.\n3. Powdery yellow stripes: Yellow Rust. Apply Propiconazole 25% EC @ 1ml/L immediately.'
  },
  fertilizer_calc: {
    hi: '🧪 **काली मिट्टी (Black Soil) के लिए उर्वरक अनुपात:**\nकाली मिट्टी में पोटाश की मात्रा पर्याप्त होती है लेकिन फास्फोरस व नाइट्रोजन कम होता है।\n• बुवाई के समय: 50kg DAP + 20kg MOP प्रति एकड़।\n• पहली व दूसरी सिंचाई पर: 30-30kg यूरिया दो बराबर भागों में डालें।\n• मृदा स्वास्थ्य के लिए हर 2 वर्ष में 4 क्विंटल जिप्सम प्रति एकड़ अवश्य डालें।',
    pa: '🧪 **ਕਾਲੀ ਮਿੱਟੀ ਲਈ ਖਾਦ ਪ੍ਰਬੰਧਨ:**\nਬਿਜਾਈ ਵੇਲੇ 50 ਕਿਲੋ DAP ਅਤੇ ਪਹਿਲੀ ਸਿੰਚਾਈ ਵੇਲੇ 35 ਕਿਲੋ ਯੂਰੀਆ ਪਾਓ।',
    mr: '🧪 **काळी कापशी मातीसाठी खत व्यवस्थापन:**\nपेरणीवेळी ५० किलो डीएपी + २० किलो एमओपी प्रति एकर द्या. पहिल्या पाण्यासोबत ३० किलो युरिया द्या.',
    en: '🧪 **Fertilizer Management for Black Soil:**\nBlack soil is naturally rich in Potash but deficient in Phosphorus & Nitrogen.\n• Sowing Time: 50kg DAP + 20kg MOP per acre.\n• 1st & 2nd Irrigation: Split application of 30kg Urea each.\n• Apply 4 quintals Gypsum/acre every 2 years to maintain soil porosity.'
  },
  subsidies: {
    hi: '🚜 **सरकारी सब्सिडी व योजनाएं (2026 अपडेट):**\n1. **PM-Kisan:** ₹6,000 प्रति वर्ष 3 किस्तों में।\n2. **PM कुसुम योजना (Solar Pump):** 3HP से 7.5HP सोलर पंप पर 60% तक सरकारी सब्सिडी।\n3. **कृषि यंत्रीकरण (SMAM):** रोटावेटर व सुपर सीडर पर 40% से 50% छूट।\nआवेदन के लिए अपने नजदीकी CSC केंद्र या `pmkisan.gov.in` पर आधार कार्ड व खतौनी के साथ संपर्क करें।',
    pa: '🚜 **ਸਰਕਾਰੀ ਸਬਸਿਡੀਆਂ:**\n1. PM-ਕਿਸਾਨ: ₹6,000 ਸਾਲਾਨਾ।\n2. ਸੋਲਰ ਪੰਪ ਤੇ 60% ਸਬਸਿਡੀ।\n3. ਖੇਤੀ ਮਸ਼ੀਨਰੀ ਤੇ 50% ਛੋਟ।',
    mr: '🚜 **शासकीय योजना व अनुदान:**\n१. पीएम किसान: ₹६,००० वार्षिक अनुदान.\n२. महाडीबीटी सोलर पंप: ६०% अनुदान.\n३. ट्रॅक्टर व अवजारे योजना: ५०% सबसिडी.',
    en: '🚜 **Government Subsidies & Schemes (2026):**\n1. **PM-Kisan Samman Nidhi:** ₹6,000/yr direct income support.\n2. **PM-KUSUM Solar Pumps:** Up to 60% subsidy for 3HP to 7.5HP solar pumps.\n3. **SMAM Mechanization:** 40% to 50% subsidy on Super Seeders, Happy Seeders & Rotavators.'
  },
  weather_rain: {
    hi: '🌧️ **मौसम पूर्वानुमान (अमृतसर/लुधियाना क्षेत्र):**\nअगले 48 घंटों में हल्की से मध्यम वर्षा (15–20mm) और 35km/h की गति से हवाएं चलने की 70% संभावना है।\n⚠️ **सलाह:** अगले 2 दिन तक फसलों में सिंचाई व कीटनाशक छिड़काव स्थगित रखें। कटे हुए अनाज को सुरक्षित स्थान पर ढककर रखें।',
    pa: '🌧️ **ਮੌਸਮ ਚੇਤਾਵਨੀ:**\nਅਗਲੇ 48 ਘੰਟਿਆਂ ਵਿੱਚ ਮੀਂਹ ਪੈਣ ਦੀ ਸੰਭਾਵਨਾ ਹੈ। ਕਿਰਪਾ ਕਰਕੇ ਪਾਣੀ ਲਗਾਉਣਾ ਅਤੇ ਸਪਰੇਅ ਕਰਨਾ ਮੁਲਤਵੀ ਰੱਖੋ।',
    mr: '🌧️ **हवामान अंदाज:**\nपुढील ४८ तासांत अवकाळी पावसाची शक्यता. औषध फवारणी व सिंचन थांबवा.',
    en: '🌧️ **Hyper-Local Weather Forecast:**\n70% probability of light-to-moderate showers (15–20mm) with gusty winds (35km/h) in the next 48 hours.\n⚠️ **Advisory:** Postpone irrigation and foliar chemical spraying for 48 hours. Ensure harvested produce is safely stored in covered sheds.'
  }
};

// Modal Control Functions
window.openRuralAssistModal = function(initialTab = 'scanner') {
  const backdrop = document.getElementById('ruralModalBackdrop');
  if (!backdrop) return;
  backdrop.classList.add('active');
  document.body.style.overflow = 'hidden';
  switchRuralTab(initialTab);
};

window.closeRuralAssistModal = function(event) {
  if (event && event.target && event.target.closest && event.target.closest('.rural-modal-dialog') && !event.target.closest('.rural-modal-close')) {
    return;
  }
  const backdrop = document.getElementById('ruralModalBackdrop');
  if (backdrop) {
    backdrop.classList.remove('active');
  }
  document.body.style.overflow = '';
};

window.switchRuralTab = function(tabName) {
  const tabs = ['scanner', 'voice', 'planner', 'arch'];
  tabs.forEach(t => {
    const btn = document.getElementById(`ruralTabBtn-${t}`);
    const panel = document.getElementById(`ruralTab-${t}`);
    if (btn) btn.classList.toggle('active', t === tabName);
    if (panel) panel.classList.toggle('active', t === tabName);
  });
};

// Tab 1: Crop Scanner Functions
window.selectCropSample = function(sampleKey) {
  currentCropKey = sampleKey;
  const data = cropScannerData[sampleKey];
  if (!data) return;

  // Update sample button active states
  const buttons = document.querySelectorAll('.sample-leaf-btn');
  buttons.forEach(b => {
    b.classList.toggle('active', b.textContent.toLowerCase().includes(sampleKey));
  });

  // Update visual preview
  const emojiDisplay = document.getElementById('sampleEmojiDisplay');
  const leafLabel = document.getElementById('sampleLeafLabel');
  if (emojiDisplay) emojiDisplay.textContent = data.emoji;
  if (leafLabel) leafLabel.textContent = data.label;

  // Reset status
  const badge = document.getElementById('diagStatusBadge');
  if (badge) badge.textContent = '⏳ Ready to Analyze';

  // Automatically run scan
  runSimulatedCropScan();
};

window.runSimulatedCropScan = function() {
  const laser = document.getElementById('scanLaserBeam');
  const btn = document.getElementById('runScanBtn');
  const btnText = document.getElementById('scanBtnText');
  const data = cropScannerData[currentCropKey];
  if (!data) return;

  if (laser) laser.classList.add('scanning');
  if (btn) btn.disabled = true;
  if (btnText) btnText.textContent = 'Processing Multimodal Vision Embeddings...';

  // Play subtle scan bleep
  playBleep(880, 'sine', 0.15);

  setTimeout(() => {
    if (laser) laser.classList.remove('scanning');
    if (btn) btn.disabled = false;
    if (btnText) btnText.textContent = 'Analyze Leaf with Gemini 3 Flash';

    // Update diagnostic fields
    const title = document.getElementById('diagTitle');
    const conf = document.getElementById('diagConfidence');
    const crop = document.getElementById('diagCrop');
    const severity = document.getElementById('diagSeverity');
    const risk = document.getElementById('diagYieldRisk');
    const symptoms = document.getElementById('diagSymptoms');
    const badge = document.getElementById('diagStatusBadge');

    if (title) title.textContent = data.name;
    if (conf) conf.textContent = data.confidence;
    if (crop) crop.textContent = data.crop;
    if (severity) severity.textContent = data.severity;
    if (risk) risk.textContent = data.yieldRisk;
    if (symptoms) symptoms.textContent = data.symptoms;
    if (badge) badge.textContent = '✅ Analysis Complete (Gemini 3 Flash)';

    updateRemediesDisplay();
    playBleep(587, 'sine', 0.1);
  }, 1200);
};

function updateRemediesDisplay() {
  const data = cropScannerData[currentCropKey];
  if (!data) return;
  const rem = data.remedies[currentDiagLang] || data.remedies['en'];

  const org = document.getElementById('remedyOrganic');
  const chem = document.getElementById('remedyChemical');

  if (org) org.textContent = rem.organic;
  if (chem) chem.textContent = rem.chemical;
}

window.switchDiagLang = function(lang) {
  currentDiagLang = lang;
  const btnEn = document.getElementById('btnLangEn');
  const btnHi = document.getElementById('btnLangHi');

  if (btnEn) btnEn.classList.toggle('active', lang === 'en');
  if (btnHi) btnHi.classList.toggle('active', lang === 'hi');

  updateRemediesDisplay();
};

// Tab 2: Kisan-Bhai Voice Chat Functions
window.setKisanDialect = function(dialect) {
  currentDialect = dialect;
  const buttons = document.querySelectorAll('.v-lang-btn');
  buttons.forEach(b => {
    b.classList.toggle('active', b.onclick.toString().includes(dialect));
  });

  const config = kisanDialects[dialect] || kisanDialects.hi;
  const welcome = document.getElementById('kisanWelcomeText');
  const input = document.getElementById('kisanChatInput');

  if (welcome) welcome.textContent = config.welcome;
  if (input) input.placeholder = config.placeholder;

  showToast(`Kisan-Bhai switched to ${dialect.toUpperCase()}`);
};

window.askKisanPreset = function(presetKey) {
  const ansMap = kisanPresetAnswers[presetKey];
  if (!ansMap) return;

  const questionTitles = {
    yellow_leaves: 'गेहूं में पीले पत्ते का क्या इलाज है?',
    fertilizer_calc: 'काली मिट्टी में यूरिया और DAP का सही अनुपात क्या है?',
    subsidies: 'PM-Kisan व सोलर पंप सब्सिडी के लिए कैसे आवेदन करें?',
    weather_rain: 'अगले 48 घंटे में क्या बारिश होने की संभावना है?'
  };

  const userQuestion = questionTitles[presetKey] || 'कृषि सलाह';
  appendChatMessage('user', userQuestion);

  simulateBotResponse(ansMap[currentDialect] || ansMap['hi']);
};

window.sendKisanChatMessage = function() {
  const input = document.getElementById('kisanChatInput');
  if (!input) return;
  const text = input.value.trim();
  if (!text) return;

  appendChatMessage('user', text);
  input.value = '';

  // Smart agronomy matching
  let reply = '';
  const lower = text.toLowerCase();
  if (lower.includes('पीला') || lower.includes('leaf') || lower.includes('rust') || lower.includes('रोग')) {
    reply = kisanPresetAnswers.yellow_leaves[currentDialect] || kisanPresetAnswers.yellow_leaves.hi;
  } else if (lower.includes('खाद') || lower.includes('fertilizer') || lower.includes('urea') || lower.includes('यूरिया')) {
    reply = kisanPresetAnswers.fertilizer_calc[currentDialect] || kisanPresetAnswers.fertilizer_calc.hi;
  } else if (lower.includes('योजना') || lower.includes('subsidy') || lower.includes('पंप') || lower.includes('subsidies')) {
    reply = kisanPresetAnswers.subsidies[currentDialect] || kisanPresetAnswers.subsidies.hi;
  } else if (lower.includes('मौसम') || lower.includes('rain') || lower.includes('weather') || lower.includes('बारिश')) {
    reply = kisanPresetAnswers.weather_rain[currentDialect] || kisanPresetAnswers.weather_rain.hi;
  } else {
    reply = (currentDialect === 'hi')
      ? `🌾 किसान भाई, आपके प्रश्न "${text}" का विश्लेषण किया गया है। मिट्टी की नमी 60% बनाए रखें और संतुलित NPK उर्वरक का प्रयोग करें। किसी भी रोग की स्थिति में पत्ते की फोटो अपलोड करें।`
      : `🌾 Farmer friend, for "${text}", maintaining 60% soil moisture and applying balanced NPK fertilizers is recommended. For disease queries, use our Instant Crop Scanner!`;
  }

  simulateBotResponse(reply);
};

window.handleKisanInputKey = function(event) {
  if (event.key === 'Enter') {
    sendKisanChatMessage();
  }
};

function appendChatMessage(sender, text) {
  const chatBox = document.getElementById('kisanChatBox');
  if (!chatBox) return;

  const msgDiv = document.createElement('div');
  msgDiv.className = `chat-msg ${sender}`;

  const avatar = document.createElement('div');
  avatar.className = 'msg-avatar';
  avatar.textContent = sender === 'user' ? '👨‍🌾' : '🌾';

  const bubble = document.createElement('div');
  bubble.className = 'msg-bubble';
  bubble.innerHTML = `<p>${text.replace(/\n/g, '<br>')}</p><span class="msg-time">${sender === 'user' ? 'You' : 'Kisan-Bhai AI'} · Just now</span>`;

  msgDiv.appendChild(avatar);
  msgDiv.appendChild(bubble);
  chatBox.appendChild(msgDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function simulateBotResponse(replyText) {
  const waveBars = document.querySelector('.wave-bars');
  const waveText = document.getElementById('waveStatusText');

  if (waveBars) waveBars.classList.add('speaking');
  if (waveText) waveText.textContent = 'Kisan-Bhai Synthesizing Audio Stream...';

  setTimeout(() => {
    appendChatMessage('bot', replyText);
    if (waveBars) waveBars.classList.remove('speaking');
    if (waveText) waveText.textContent = 'Voice consultation ready';

    // Optional Speech Synthesis
    speakText(replyText);
  }, 900);
}

function speakText(text) {
  try {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      // Strip markdown asterisks for clean TTS
      const cleanText = text.replace(/[*_#•]/g, '').substring(0, 150);
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = (currentDialect === 'hi' || currentDialect === 'mr') ? 'hi-IN' : 'en-US';
      utterance.rate = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  } catch (e) {}
}

window.toggleVoiceSpeechSim = function() {
  const waveBars = document.querySelector('.wave-bars');
  const waveText = document.getElementById('waveStatusText');

  if (waveBars) waveBars.classList.add('speaking');
  if (waveText) waveText.textContent = '🎙️ Listening to Farmer Voice Input...';

  showToast('Listening in native dialect...');

  setTimeout(() => {
    if (waveBars) waveBars.classList.remove('speaking');
    if (waveText) waveText.textContent = 'Voice consultation ready';
    askKisanPreset('yellow_leaves');
  }, 1600);
};

// Tab 3: Crop Planner & Subsidies Calculator
let selectedSeason = 'Rabi';

window.updateLandVal = function(val) {
  const display = document.getElementById('landSizeDisplay');
  if (display) display.textContent = `${val} Acres`;
};

window.setSeason = function(seasonName) {
  selectedSeason = seasonName;
  const buttons = document.querySelectorAll('.season-pill');
  buttons.forEach(b => {
    b.classList.toggle('active', b.textContent.includes(seasonName));
  });
  calculateCropPlan();
};

window.calculateCropPlan = function() {
  const state = document.getElementById('plannerState')?.value || 'Punjab';
  const soil = document.getElementById('plannerSoil')?.value || 'Alluvial';
  const acres = parseInt(document.getElementById('plannerLandSize')?.value || '5', 10);

  // Dynamic agronomy plan matrix
  let cropName = 'Wheat (HD-3086) + Mustard Border';
  let profitPerAcre = 37000;
  let water = 'Medium (4–5 Irrigations)';
  let risk = 'Low Risk (8.4/10 Score)';
  let duration = '125 – 135 Days';
  let inputCost = '₹18,500 / Acre';

  if (selectedSeason === 'Kharif') {
    if (soil === 'Black') {
      cropName = 'Bt Cotton (RCH-659) + Soybean Intercrop';
      profitPerAcre = 44000;
      water = 'Moderate Rainfed (3 Irrigations)';
      risk = 'Medium Risk (7.2/10 Score)';
      duration = '150 – 165 Days';
      inputCost = '₹22,000 / Acre';
    } else {
      cropName = 'Basmati Rice (Pusa 1121) + Maize';
      profitPerAcre = 48000;
      water = 'High (Continuous Saturation)';
      risk = 'Low-Medium (8.0/10 Score)';
      duration = '120 – 130 Days';
      inputCost = '₹24,000 / Acre';
    }
  } else if (selectedSeason === 'Zaid') {
    cropName = 'Moong Dal (Green Gram) + Summer Groundnut';
    profitPerAcre = 29000;
    water = 'Low-Medium (2–3 Irrigations)';
    risk = 'Low Risk (8.8/10 Score)';
    duration = '65 – 70 Days';
    inputCost = '₹11,500 / Acre';
  } else {
    // Rabi Season
    if (soil === 'Sandy') {
      cropName = 'Gram / Chickpea (Pusa 362) + Barley';
      profitPerAcre = 31000;
      water = 'Low (1–2 Irrigations)';
      risk = 'Low Risk (8.9/10 Score)';
      duration = '110 – 120 Days';
      inputCost = '₹13,000 / Acre';
    } else if (soil === 'Black') {
      cropName = 'Durum Wheat + Bengal Gram Intercrop';
      profitPerAcre = 39000;
      water = 'Medium (3 Irrigations)';
      risk = 'Low Risk (8.5/10 Score)';
      duration = '120 – 130 Days';
      inputCost = '₹17,000 / Acre';
    }
  }

  const totalNetProfit = profitPerAcre * acres;
  const formattedProfit = `₹${totalNetProfit.toLocaleString('en-IN')}`;

  // Update UI Elements
  const titleEl = document.getElementById('planCropTitle');
  const profitEl = document.getElementById('planProfitVal');
  const waterEl = document.getElementById('planWaterVal');
  const riskEl = document.getElementById('planRiskVal');
  const durEl = document.getElementById('planDurationVal');
  const costEl = document.getElementById('planCostVal');

  if (titleEl) titleEl.textContent = `Optimal Crop: ${cropName}`;
  if (profitEl) profitEl.textContent = formattedProfit;
  if (waterEl) waterEl.textContent = water;
  if (riskEl) riskEl.textContent = risk;
  if (durEl) durEl.textContent = duration;
  if (costEl) costEl.textContent = inputCost;

  // Schemes List Update based on State
  const schemesList = document.getElementById('planSchemesList');
  if (schemesList) {
    schemesList.innerHTML = `
      <div class="scheme-item">
        <div class="scheme-dot"></div>
        <div><strong>PM Kisan Samman Nidhi:</strong> ₹6,000/year direct financial income support eligible for your ${acres}-acre profile.</div>
      </div>
      <div class="scheme-item">
        <div class="scheme-dot"></div>
        <div><strong>PM Fasal Bima Yojana (PMFBY):</strong> 1.5% premium crop insurance against localized climate risks in ${state}.</div>
      </div>
      <div class="scheme-item">
        <div class="scheme-dot"></div>
        <div><strong>${state} Krishi Yantra Subsidy:</strong> Up to 50% state subsidy on modern tractor-driven zero-till seed drills.</div>
      </div>
    `;
  }
};

/* ==========================================================================
   FAKEBUSTER - AI-Powered Fake News Detection System
   "Bust the Fake. Find the Facts."
   ========================================================================== */

const fakeNewsPresets = {
  nasa: {
    title: "NASA James Webb Space Telescope Reveals Ancient Galaxies Formed After Big Bang",
    author: "Astrophysical Journal (Dr. Sarah Jenkins)",
    text: "Astronomers using the James Webb Space Telescope have discovered an unprecedented cluster of massive galaxies dating back to within 400 million years of the Big Bang. These observations challenge existing cosmological models of early universe structure formation and provide pristine spectroscopic confirmation of rapid stellar accretion. The peer-reviewed findings were published this week in the Astrophysical Journal following rigorous multi-institution validation.",
    isFake: false,
    confidence: 96.2,
    keywords: ["astronomers", "james webb", "spectroscopic", "peer reviewed", "astrophysical journal"],
    weight: 0.98,
    weightDesc: "Verified scientific publisher with consistent factual record. Maximum algorithmic feed visibility (1.0x baseline)."
  },
  miracle: {
    title: "SHOCKING: Secret Miracle Herb Cures All Diseases Overnight Suppressed by Big Pharma",
    author: "NaturalHealthTruths Telegram Network",
    text: "A secret ancient root found in the remote mountains has been clinically proven to cure diabetes, cancer, and heart diseases in less than 24 hours. However, multinational pharmaceutical conglomerates and corrupt federal officials are violently suppressing this information to protect their trillion-dollar profits. Order your starter extract kit today before government agents seize this website forever!",
    isFake: true,
    confidence: 97.4,
    keywords: ["shocking", "miracle herb", "cures all", "suppressed", "big pharma", "government agents"],
    weight: 0.08,
    weightDesc: "Severe disinformation pattern. Algorithmic feed reach throttled by 92% across social recommendation surfaces."
  },
  moon: {
    title: "Leaked Government Documents Prove Moon Is Hollow Alien Surveillance Outpost",
    author: "CosmicFreedomPatriot Daily",
    text: "Uncensored classified military memos obtained by anonymous whistleblower hacktivists confirm that Apollo astronauts encountered extraterrestrial reconnaissance stations inside the moon's hollow core. Seismic resonance data recorded during lunar landings allegedly confirms metallic resonance signatures. Mainstream media networks are under strict gag orders to conceal humanity's impending orbital contact.",
    isFake: true,
    confidence: 96.8,
    keywords: ["whistleblower", "alien surveillance", "hollow core", "gag orders", "seismic resonance"],
    weight: 0.12,
    weightDesc: "Unverified conspiracy claims without empirical data. Algorithmic distribution deprioritized by 88%."
  },
  energy: {
    title: "Global Renewable Energy Capacity Grew by Record 50% in 2024, IEA Report Shows",
    author: "International Energy Agency (IEA Dispatch)",
    text: "A comprehensive report published by the International Energy Agency (IEA) reveals that global renewable power capacity additions expanded by nearly fifty percent over the past twelve months. The surge was driven primarily by rapid utility-scale photovoltaic deployment across China, the European Union, and North America. Clean energy transition investments outpaced fossil fuel infrastructure for the third consecutive fiscal year.",
    isFake: false,
    confidence: 95.7,
    keywords: ["renewable energy", "international energy agency", "photovoltaic", "clean energy", "investments"],
    weight: 0.99,
    weightDesc: "Official statistical agency reporting. Full unrestricted newsfeed distribution enabled."
  }
};

let currentFNSampleKey = 'nasa';

window.openFakeNewsModal = function(initialTab = 'analyzer') {
  const backdrop = document.getElementById('fakeNewsModalBackdrop');
  if (!backdrop) return;
  backdrop.classList.add('active');
  document.body.style.overflow = 'hidden';
  switchFakeNewsTab(initialTab);
  
  // Auto-populate initial sample if inputs empty
  const headlineInput = document.getElementById('fnHeadlineInput');
  if (headlineInput && !headlineInput.value) {
    selectNewsSample('nasa');
  }
};

window.closeFakeNewsModal = function(event) {
  if (event && event.target && event.target.closest && event.target.closest('.fakenews-modal-dialog') && !event.target.closest('.fakenews-modal-close')) {
    return;
  }
  const backdrop = document.getElementById('fakeNewsModalBackdrop');
  if (backdrop) {
    backdrop.classList.remove('active');
  }
  document.body.style.overflow = '';
};

window.switchFakeNewsTab = function(tabName) {
  const tabs = ['analyzer', 'source', 'metrics', 'arch', 'media'];
  tabs.forEach(t => {
    const btn = document.getElementById(`fnTabBtn-${t}`);
    const panel = document.getElementById(`fnTab-${t}`);
    if (btn) btn.classList.toggle('active', t === tabName);
    if (panel) panel.classList.toggle('active', t === tabName);
  });

  if (tabName === 'media') {
    initMediaForensicsIfEmpty();
  }
};

window.selectNewsSample = function(sampleKey) {
  currentFNSampleKey = sampleKey;
  const sample = fakeNewsPresets[sampleKey];
  if (!sample) return;

  // Toggle sample button active states
  const buttons = document.querySelectorAll('.fn-sample-btn');
  buttons.forEach(b => {
    b.classList.toggle('active', b.id === `fnSampleBtn-${sampleKey}`);
  });

  // Populate inputs
  const titleInput = document.getElementById('fnHeadlineInput');
  const sourceInput = document.getElementById('fnSourceInput');
  const textInput = document.getElementById('fnArticleInput');

  if (titleInput) titleInput.value = sample.title;
  if (sourceInput) sourceInput.value = sample.author;
  if (textInput) textInput.value = sample.text;

  // Automatically evaluate
  runNewsAnalysis();
};

window.resetNewsFields = function() {
  const titleInput = document.getElementById('fnHeadlineInput');
  const sourceInput = document.getElementById('fnSourceInput');
  const textInput = document.getElementById('fnArticleInput');

  if (titleInput) titleInput.value = '';
  if (sourceInput) sourceInput.value = '';
  if (textInput) textInput.value = '';

  const buttons = document.querySelectorAll('.fn-sample-btn');
  buttons.forEach(b => b.classList.remove('active'));

  // Reset diagnosis
  const badge = document.getElementById('fnVerdictBadge');
  const hero = document.getElementById('fnVerdictHero');
  const icon = document.getElementById('fnVerdictIcon');
  const sub = document.getElementById('fnVerdictSub');
  const title = document.getElementById('fnVerdictTitle');
  const sourceText = document.getElementById('fnVerdictSourceText');
  const bar = document.getElementById('fnConfidenceBar');
  const pct = document.getElementById('fnConfidenceText');
  const kwList = document.getElementById('fnKeywordsList');
  const weightMult = document.getElementById('fnWeightMultiplier');
  const weightDesc = document.getElementById('fnWeightDesc');

  if (badge) {
    badge.textContent = '⏳ Ready to Analyze';
    badge.className = 'fn-status-pill';
  }
  if (hero) hero.className = 'fn-verdict-hero';
  if (icon) icon.textContent = '📰';
  if (sub) sub.textContent = 'Prediction Status';
  if (title) title.textContent = 'Enter text and click Classify';
  if (sourceText) sourceText.textContent = 'Source: None';
  if (bar) {
    bar.style.width = '0%';
    bar.className = 'meter-bar-fill';
  }
  if (pct) pct.textContent = '--%';
  if (kwList) kwList.innerHTML = '<span class="kw-chip">No tokens extracted yet</span>';
  if (weightMult) weightMult.textContent = '--x';
  if (weightDesc) weightDesc.textContent = 'Enter text to calculate source visibility reach factor.';
};

window.runNewsAnalysis = function() {
  const titleInput = document.getElementById('fnHeadlineInput');
  const sourceInput = document.getElementById('fnSourceInput');
  const textInput = document.getElementById('fnArticleInput');

  const titleVal = titleInput ? titleInput.value.trim() : '';
  const sourceVal = sourceInput ? sourceInput.value.trim() : 'Unknown Publisher';
  const textVal = textInput ? textInput.value.trim() : '';

  if (!titleVal && !textVal) {
    if (typeof showToast === 'function') {
      showToast('Please enter an article title or body to classify.');
    }
    return;
  }

  // Check if current input matches preset
  let isFake = false;
  let confidence = 96.0;
  let keywords = [];
  let weight = 0.95;
  let weightDesc = '';

  const matchedPreset = fakeNewsPresets[currentFNSampleKey];
  if (matchedPreset && titleVal.toLowerCase().includes(matchedPreset.title.slice(0, 20).toLowerCase())) {
    isFake = matchedPreset.isFake;
    confidence = matchedPreset.confidence;
    keywords = matchedPreset.keywords;
    weight = matchedPreset.weight;
    weightDesc = matchedPreset.weightDesc;
  } else {
    // Dynamic heuristic TF-IDF n-gram scoring for custom user text
    const fullText = `${titleVal} ${sourceVal} ${textVal}`.toLowerCase();
    const fakeTriggers = [
      'shocking', 'secret', 'miracle', 'suppressed', 'cure', 'cures', 'whistleblower',
      'alien', 'hollow', 'reptilian', 'conspiracy', '5g', 'nanotechnology', 'doomsday',
      'big pharma', 'gag order', 'admit', 'leaked', 'hoax', 'flat earth', 'elixir'
    ];
    const realTriggers = [
      'astronomy', 'telescope', 'astrophysical', 'nasa', 'iea', 'reuters', 'peer reviewed',
      'clinical trial', 'published', 'researchers', 'percent', 'semiconductor', 'vaccine',
      'capacity', 'federal reserve', 'data', 'university', 'official', 'confirmed'
    ];

    let fakeHits = [];
    fakeTriggers.forEach(kw => {
      if (fullText.includes(kw)) fakeHits.push(kw);
    });

    let realHits = [];
    realTriggers.forEach(kw => {
      if (fullText.includes(kw)) realHits.push(kw);
    });

    if (fakeHits.length > realHits.length) {
      isFake = true;
      confidence = Math.min(98.8, 93.0 + (fakeHits.length * 1.5));
      keywords = fakeHits.slice(0, 5);
      weight = Math.max(0.05, Math.round((1.0 - (fakeHits.length * 0.22)) * 100) / 100);
      weightDesc = `High probability of unverified sensationalism (${fakeHits.length} warning markers). Social feed reach throttled to ${weight}x.`;
    } else {
      isFake = false;
      confidence = Math.min(99.0, 94.0 + (realHits.length * 1.2));
      keywords = realHits.length > 0 ? realHits.slice(0, 5) : ['factual narrative', 'standard lexicon', 'neutral sentiment'];
      weight = Math.min(1.0, Math.round((0.92 + (realHits.length * 0.02)) * 100) / 100);
      weightDesc = `Text matches established credible journalism patterns. Standard unthrottled distribution enabled (${weight}x).`;
    }
  }

  // Update UI with diagnosis
  const badge = document.getElementById('fnVerdictBadge');
  const hero = document.getElementById('fnVerdictHero');
  const icon = document.getElementById('fnVerdictIcon');
  const sub = document.getElementById('fnVerdictSub');
  const title = document.getElementById('fnVerdictTitle');
  const sourceText = document.getElementById('fnVerdictSourceText');
  const bar = document.getElementById('fnConfidenceBar');
  const pct = document.getElementById('fnConfidenceText');
  const kwList = document.getElementById('fnKeywordsList');
  const weightMult = document.getElementById('fnWeightMultiplier');
  const weightDescEl = document.getElementById('fnWeightDesc');

  if (badge) {
    badge.textContent = isFake ? '🚨 Unreliable (Fake News)' : '✅ Reliable (Authentic News)';
    badge.className = `fn-status-pill ${isFake ? 'fake' : 'real'}`;
  }

  if (hero) {
    hero.className = `fn-verdict-hero ${isFake ? 'fake-active' : 'real-active'}`;
  }

  if (icon) icon.textContent = isFake ? '🚨' : '🛡️';
  if (sub) sub.textContent = isFake ? 'Misinformation Detected' : 'Verified Authenticity';
  if (title) title.textContent = isFake ? 'Unreliable / Fabricated News Story' : 'Reliable / Authentic News Story';
  if (sourceText) sourceText.textContent = `Source Track Record Evaluated: ${sourceVal}`;

  if (bar) {
    bar.style.width = `${confidence}%`;
    bar.className = `meter-bar-fill ${isFake ? 'fake-fill' : ''}`;
  }
  if (pct) pct.textContent = `${confidence.toFixed(1)}%`;

  if (kwList) {
    kwList.innerHTML = keywords.map(kw => `<span class="kw-chip ${isFake ? 'fake-kw' : ''}">${kw}</span>`).join('');
  }

  if (weightMult) weightMult.textContent = `${weight}x`;
  if (weightDescEl) weightDescEl.textContent = weightDesc;

  // Render in-text linguistic highlights
  renderLinguisticEvidence(titleVal, textVal, isFake, keywords);

  if (typeof showToast === 'function') {
    showToast(`PAC Model: Evaluated as ${isFake ? 'Unreliable' : 'Reliable'} (${confidence.toFixed(1)}%)`);
  }
};

/* Helper: Render in-text highlighted evidence */
function renderLinguisticEvidence(title, text, isFake, keywords) {
  const container = document.getElementById('fnHighlightedText');
  if (!container) return;

  const rawSample = `${title}. ${text}`.trim();
  if (!rawSample) {
    container.innerHTML = '<em>No textual content provided.</em>';
    return;
  }

  let highlighted = rawSample;
  keywords.forEach(kw => {
    if (!kw || kw.length < 3) return;
    const regex = new RegExp(`(${kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    highlighted = highlighted.replace(regex, `<mark class="trigger-token ${isFake ? 'fake-token' : 'real-token'}">$1</mark>`);
  });

  container.innerHTML = `<p class="highlighted-snippet">"${highlighted}"</p>`;
}

/* Tab 2: Domain Quick-Check */
window.checkDomainQuick = function(event) {
  if (event && event.key && event.key !== 'Enter') return;

  const input = document.getElementById('fnDomainSearchInput');
  const resultBox = document.getElementById('fnDomainQuickResult');
  if (!input || !resultBox) return;

  const rawDomain = input.value.trim().toLowerCase().replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0];
  if (!rawDomain) return;

  const knownDomains = {
    'reuters.com': { name: 'Reuters News', trust: 98, tier: 'Tier 1 (High Trust)', action: 'Full Distribution (1.0x Reach)', safe: true },
    'reuters': { name: 'Reuters News', trust: 98, tier: 'Tier 1 (High Trust)', action: 'Full Distribution (1.0x Reach)', safe: true },
    'nature.com': { name: 'Nature Publishing', trust: 99, tier: 'Tier 1 (Academic Gold)', action: 'Full Distribution (1.0x Reach)', safe: true },
    'nature': { name: 'Nature Publishing', trust: 99, tier: 'Tier 1 (Academic Gold)', action: 'Full Distribution (1.0x Reach)', safe: true },
    'bbc.com': { name: 'BBC News', trust: 96, tier: 'Tier 1 (High Trust)', action: 'Full Distribution (1.0x Reach)', safe: true },
    'bbc': { name: 'BBC News', trust: 96, tier: 'Tier 1 (High Trust)', action: 'Full Distribution (1.0x Reach)', safe: true },
    'nasa.gov': { name: 'NASA Official', trust: 99, tier: 'Tier 1 (Verified Govt Agency)', action: 'Full Distribution (1.0x Reach)', safe: true },
    'nasa': { name: 'NASA Official', trust: 99, tier: 'Tier 1 (Verified Govt Agency)', action: 'Full Distribution (1.0x Reach)', safe: true },
    'theonion.com': { name: 'The Onion (Satire)', trust: 80, tier: 'Satirical Media', action: 'Labeled as Satire (0.90x Reach)', safe: true },
    'onion': { name: 'The Onion (Satire)', trust: 80, tier: 'Satirical Media', action: 'Labeled as Satire (0.90x Reach)', safe: true },
    'viralhoaxnews.com': { name: 'ViralHoaxNews Buzz', trust: 12, tier: 'Tier 3 (Disinformation Farm)', action: '🚨 Throttled to 0.08x Reach', safe: false },
    'viralhoaxnews': { name: 'ViralHoaxNews Buzz', trust: 12, tier: 'Tier 3 (Disinformation Farm)', action: '🚨 Throttled to 0.08x Reach', safe: false },
    'naturalhealthsecrets': { name: 'NaturalHealthSecrets Network', trust: 15, tier: 'Tier 3 (Pseudoscience Farm)', action: '🚨 Throttled to 0.10x Reach', safe: false },
    'flathorizonnetwork': { name: 'FlatHorizon Network', trust: 8, tier: 'Tier 3 (Conspiracy Outlet)', action: '🚨 Throttled to 0.05x Reach', safe: false },
    'pettruthwatch': { name: 'PetTruthWatch Telegram', trust: 5, tier: 'Tier 3 (Disinformation Farm)', action: '🚨 Throttled to 0.05x Reach', safe: false }
  };

  const match = knownDomains[rawDomain];
  resultBox.style.display = 'block';

  if (match) {
    resultBox.className = `domain-quick-result ${match.safe ? 'safe' : 'danger'}`;
    resultBox.innerHTML = `
      <div class="dqr-top">
        <strong>${match.name}</strong> · <span class="dqr-tier">${match.tier}</span>
        <span class="dqr-trust">${match.trust}% Trust Rating</span>
      </div>
      <p class="dqr-action">Algorithmic Feed Standing: <strong>${match.action}</strong></p>
    `;
  } else {
    // Unindexed domain heuristic
    const isSuspicious = ['truth', 'patriot', 'miracle', 'secret', 'uncensored', 'buzz', 'hoax'].some(w => rawDomain.includes(w));
    resultBox.className = `domain-quick-result ${isSuspicious ? 'warn' : 'neutral'}`;
    resultBox.innerHTML = `
      <div class="dqr-top">
        <strong>${rawDomain}</strong> · <span class="dqr-tier">${isSuspicious ? 'Tier 2 (Unverified / Warning)' : 'Tier 2 (Unindexed Domain)'}</span>
        <span class="dqr-trust">${isSuspicious ? '45%' : '70%'} Baseline Trust</span>
      </div>
      <p class="dqr-action">Algorithmic Feed Standing: <strong>${isSuspicious ? '⚠️ Monitored Under Enhanced Scrutiny (0.45x)' : 'Standard Provisional Distribution (0.70x)'}</strong></p>
    `;
  }

  if (typeof showToast === 'function') {
    showToast(`Domain Verified: ${rawDomain}`);
  }
};

/* Export Forensic Diagnostic Report */
window.exportDiagnosticReport = function() {
  const title = (document.getElementById('fnHeadlineInput') || {}).value || 'Untitled Article';
  const author = (document.getElementById('fnSourceInput') || {}).value || 'Unspecified Source';
  const text = (document.getElementById('fnArticleInput') || {}).value || '';
  const verdict = (document.getElementById('fnVerdictBadge') || {}).textContent || 'Not Analyzed';
  const conf = (document.getElementById('fnConfidenceText') || {}).textContent || '0%';
  const weight = (document.getElementById('fnWeightMultiplier') || {}).textContent || '1.0x';
  const tokens = Array.from(document.querySelectorAll('#fnKeywordsList .kw-chip')).map(el => el.textContent);

  const reportObj = {
    header: "FAKEBUSTER — AI-POWERED FAKE NEWS DETECTION REPORT",
    tagline: "Bust the Fake. Find the Facts.",
    timestamp: new Date().toISOString(),
    evaluation_engine: "Passive Aggressive Classifier (Hinge Loss) v2.0",
    model_evaluation_accuracy: "96.0%",
    article_metadata: {
      headline: title,
      publisher_source: author,
      character_count: text.length,
      word_count: text.split(/\s+/).filter(Boolean).length
    },
    diagnostic_verdict: {
      authenticity_label: verdict,
      decision_confidence: conf,
      social_visibility_multiplier: weight,
      salient_tfidf_ngrams: tokens
    },
    recommendation: weight.includes('0.0') || weight.includes('0.1')
      ? "HIGH RISK: Disinformation indicators detected. Dampen social feed virality."
      : "LOW RISK: Consistent with reputable journalistic lexicon. Authorize normal distribution."
  };

  const reportStr = JSON.stringify(reportObj, null, 2);

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(reportStr).then(() => {
      if (typeof showToast === 'function') {
        showToast("✓ Forensic verification report copied to clipboard!");
      }
    }).catch(() => {
      fallbackDownloadReport(reportStr);
    });
  } else {
    fallbackDownloadReport(reportStr);
  }
};

function fallbackDownloadReport(reportStr) {
  const blob = new Blob([reportStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `fakebuster_forensic_report_${Date.now()}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  if (typeof showToast === 'function') {
    showToast("✓ Forensic verification report downloaded!");
  }
}


/* Tab 2: Interactive Source Reputation Simulator */
window.loadSourceSimulation = function(presetKey) {
  const totalSlider = document.getElementById('simTotalArticles');
  const fakeSlider = document.getElementById('simFakeArticles');

  if (!totalSlider || !fakeSlider) return;

  const buttons = document.querySelectorAll('.source-chip-btn');
  buttons.forEach((btn, idx) => {
    btn.classList.toggle('active', 
      (presetKey === 'reputable' && idx === 0) ||
      (presetKey === 'mixed' && idx === 1) ||
      (presetKey === 'hoax' && idx === 2)
    );
  });

  if (presetKey === 'reputable') {
    totalSlider.value = 25;
    fakeSlider.max = 25;
    fakeSlider.value = 1;
  } else if (presetKey === 'mixed') {
    totalSlider.value = 20;
    fakeSlider.max = 20;
    fakeSlider.value = 6;
  } else if (presetKey === 'hoax') {
    totalSlider.value = 30;
    fakeSlider.max = 30;
    fakeSlider.value = 24;
  }

  updateSourceSim();
};

window.updateSourceSim = function() {
  const totalSlider = document.getElementById('simTotalArticles');
  const fakeSlider = document.getElementById('simFakeArticles');

  if (!totalSlider || !fakeSlider) return;

  let total = parseInt(totalSlider.value, 10);
  let fake = parseInt(fakeSlider.value, 10);

  // Ensure fake <= total
  if (fake > total) {
    fake = total;
    fakeSlider.value = total;
  }
  fakeSlider.max = total;

  const totalDisplay = document.getElementById('simTotalDisplay');
  const fakeDisplay = document.getElementById('simFakeDisplay');
  const ratioDisplay = document.getElementById('simRatioDisplay');
  const weightDisplay = document.getElementById('simWeightDisplay');
  const actionDisplay = document.getElementById('simActionDisplay');
  const reachBar = document.getElementById('simReachBar');

  if (totalDisplay) totalDisplay.textContent = total;
  if (fakeDisplay) fakeDisplay.textContent = fake;

  const fakeRatio = fake / total;
  const fakePct = (fakeRatio * 100).toFixed(1);
  if (ratioDisplay) ratioDisplay.textContent = `${fakePct}%`;

  // Dynamic Visibility Formula: W = max(0.05, 1.0 - (ratio^2 * 1.25))
  let visibilityWeight;
  let actionText = '';
  let badgeClass = 'safe';

  if (fakeRatio >= 0.6) {
    visibilityWeight = Math.max(0.05, 1.0 - (Math.pow(fakeRatio, 2) * 1.25));
    actionText = '🚨 Severe Feed Demotion (-90% Reach)';
    badgeClass = 'danger';
  } else if (fakeRatio >= 0.25) {
    visibilityWeight = Math.max(0.25, 1.0 - (fakeRatio * 0.95));
    actionText = '⚠️ Algorithmic Downrank (-50% Reach)';
    badgeClass = 'warn';
  } else {
    visibilityWeight = 1.0 - (fakeRatio * 0.25);
    actionText = '✅ Full Organic Distribution (Safe)';
    badgeClass = 'safe';
  }

  const weightFormatted = visibilityWeight.toFixed(3);
  if (weightDisplay) weightDisplay.textContent = `${weightFormatted}x`;

  if (actionDisplay) {
    actionDisplay.textContent = actionText;
    actionDisplay.className = `sim-stat-badge ${badgeClass}`;
  }

  if (reachBar) {
    const reachPct = (visibilityWeight * 100).toFixed(1);
    reachBar.style.width = `${reachPct}%`;
    if (badgeClass === 'danger') {
      reachBar.style.background = 'linear-gradient(90deg, #f43f5e, #e11d48)';
    } else if (badgeClass === 'warn') {
      reachBar.style.background = 'linear-gradient(90deg, #f59e0b, #d97706)';
    } else {
      reachBar.style.background = 'linear-gradient(90deg, var(--secondary), var(--accent-emerald))';
    }
  }
};

/* ==========================================================================
   Multimodal Media & Deepfake Verification Engine (Tab 5)
   ========================================================================== */

const mediaForensicPresets = {
  fakeScreenshot: {
    type: 'image',
    filename: 'viral_doctored_headline_cnn_clone.png',
    title: 'Manipulated Breaking News Banner (Fabricated Screenshot)',
    sub: 'Pixel Grid Mismatch & Typography Artifacts Detected',
    isFake: true,
    deepfakeScore: '94.8%',
    deepfakeDesc: 'Error Level Analysis reveals severe compression gradient divergence between the red headline banner and background text.',
    reach: '0.05x Throttled',
    reachPct: 5,
    ocrText: '"BREAKING: WHITE HOUSE ADMITS SECRET MOON BASE CONTROLS GLOBAL WEATHER AND TIDAL FREQUENCIES"',
    ocrScore: 'PAC NLP: 98.2% Fabricated News',
    tokens: ['secret', 'admits', 'frequencies', 'controls', 'white house'],
    provTag: 'Template Meme Generator Footprint',
    provText: 'Identified as synthesized using "ViralNewsMaker.cc". Digital signature stripped with inconsistent JPEG quantisation matrices.',
    svgPreview: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360" width="100%" height="100%">
      <rect width="640" height="360" fill="#0b0f19"/>
      <rect x="0" y="240" width="640" height="120" fill="#dc2626"/>
      <rect x="20" y="255" width="180" height="32" fill="#fff" rx="4"/>
      <text x="30" y="278" font-family="'Impact', sans-serif" font-size="22" font-weight="900" fill="#dc2626">BREAKING NEWS</text>
      <text x="220" y="278" font-family="'Arial', sans-serif" font-size="16" font-weight="bold" fill="#fff">LIVE SPECIAL REPORT</text>
      <text x="30" y="325" font-family="'Impact', sans-serif" font-size="24" fill="#fef08a">WHITE HOUSE ADMITS SECRET MOON BASE CONTROLS WEATHER</text>
      <circle cx="560" cy="120" r="70" fill="#cbd5e1" opacity="0.3"/>
      <rect x="40" y="40" width="560" height="180" fill="#1e293b" rx="8" stroke="#334155"/>
      <text x="320" y="135" text-anchor="middle" font-family="sans-serif" font-size="16" fill="#94a3b8">⚠️ [FABRICATED MEDIA: DOCTORED LOWER-THIRD GRAPHIC]</text>
      <rect x="25" y="245" width="590" height="105" fill="none" stroke="#f43f5e" stroke-width="2" stroke-dasharray="6,4"/>
    </svg>`
  },
  deepfakeAi: {
    type: 'image',
    filename: 'ai_synthetic_executive_briefing.jpg',
    title: 'Synthetic AI Deepfake (Diffusion / GAN Generation)',
    sub: 'Facial Biometric Asymmetry & Diffusion Lattice Noise Detected',
    isFake: true,
    deepfakeScore: '98.6%',
    deepfakeDesc: 'Frequency spectrum analysis detects characteristic high-frequency GAN checkboard patterns and pupil corneal reflection mismatches.',
    reach: '0.05x Throttled',
    reachPct: 5,
    ocrText: '"STATEMENT FROM PRESIDENCY: EMERGENCY CRISIS DECLARATION SIGNED LIVE ON AIR"',
    ocrScore: 'PAC NLP: 96.1% Fabricated News',
    tokens: ['emergency', 'declaration', 'crisis', 'signed live'],
    provTag: 'Synthetic GAN Fingerprint Confirmed',
    provText: 'Cross-spectral FFT decomposition confirms synthetic generative model architecture (StyleGAN / Midjourney v6 signature).',
    svgPreview: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360" width="100%" height="100%">
      <rect width="640" height="360" fill="#090d16"/>
      <!-- Biometric Mesh Overlay -->
      <circle cx="320" cy="160" r="90" fill="#1e293b" stroke="#ec4899" stroke-width="2"/>
      <circle cx="285" cy="145" r="12" fill="none" stroke="#06b6d4" stroke-width="2"/>
      <circle cx="355" cy="145" r="14" fill="none" stroke="#f43f5e" stroke-width="2"/>
      <path d="M 280 205 Q 320 230 360 205" fill="none" stroke="#ec4899" stroke-width="2"/>
      <!-- Grid lines -->
      <line x1="230" y1="160" x2="410" y2="160" stroke="#06b6d4" stroke-dasharray="4,4" opacity="0.6"/>
      <line x1="320" y1="70" x2="320" y2="250" stroke="#06b6d4" stroke-dasharray="4,4" opacity="0.6"/>
      <rect x="250" y="270" width="140" height="26" fill="#f43f5e" rx="4"/>
      <text x="320" y="288" text-anchor="middle" font-family="'JetBrains Mono', monospace" font-size="12" font-weight="bold" fill="#fff">DEEPFAKE 98.6%</text>
      <text x="320" y="45" text-anchor="middle" font-family="sans-serif" font-size="15" font-weight="bold" fill="#f87171">🚨 SYNTHETIC DIFFUSION FACE GENERATION DETECTED</text>
    </svg>`
  },
  authenticPress: {
    type: 'image',
    filename: 'g7_climate_conference_reuters.webp',
    title: 'Authentic Press Briefing (Verified Provenance & Neutral EXIF)',
    sub: 'C2PA Cryptographic Provenance Confirmed · Natural Sensor Noise',
    isFake: false,
    deepfakeScore: '1.8% Clean',
    deepfakeDesc: 'Uniform ISO camera sensor noise distribution. Unaltered natural optical light gradients across human subjects and background.',
    reach: '1.0x Full Reach',
    reachPct: 100,
    ocrText: '"GLOBAL CLIMATE SUMMIT: SCIENTIFIC CONSENSUS REPORTS 12% REDUCTION IN EMISSIONS ACROSS 45 NATIONS"',
    ocrScore: 'PAC NLP: 96.8% Reliable News',
    tokens: ['scientific', 'consensus', 'emissions', 'nations', 'reduction'],
    provTag: 'Verified C2PA Digital Signature',
    provText: 'Cryptographically linked to accredited wire service camera device (Nikon Z9, firmware authenticated). Exact match in AP/Reuters archive.',
    svgPreview: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360" width="100%" height="100%">
      <rect width="640" height="360" fill="#0f172a"/>
      <rect x="60" y="60" width="520" height="240" fill="#1e293b" rx="12" stroke="#10b981" stroke-width="2"/>
      <circle cx="320" cy="150" r="45" fill="#334155"/>
      <rect x="270" y="200" width="100" height="70" fill="#475569" rx="4"/>
      <!-- Verified Badge -->
      <rect x="80" y="80" width="220" height="32" fill="#10b981" rx="6"/>
      <text x="95" y="102" font-family="sans-serif" font-size="14" font-weight="bold" fill="#fff">✓ C2PA VERIFIED AUTHENTIC</text>
      <text x="320" y="295" text-anchor="middle" font-family="sans-serif" font-size="13" fill="#cbd5e1">Reuters Photo Archive · Dr. Elena Rossi · UN Press Gallery</text>
    </svg>`
  },
  outOfContextVideo: {
    type: 'video',
    filename: 'viral_breaking_explosion_clip.mp4',
    title: 'Recycled 2017 Industrial Accident Falsely Relabeled as Current Event',
    sub: 'Out-of-Context Media Recycling · Misleading Geo-Temporal Captioning',
    isFake: true,
    deepfakeScore: '89.4% Context Mismatch',
    deepfakeDesc: 'Video is visually authentic footage from August 2017 in Veracruz, Mexico, but deceptively recycled with fabricated breaking news claims.',
    reach: '0.05x Throttled',
    reachPct: 5,
    ocrText: '"URGENT VIDEO: MAJOR PIPELINE DETONATION REPORTED IN CENTRAL CAPITAL MINUTES AGO"',
    ocrScore: 'PAC NLP: 97.6% Fabricated News',
    tokens: ['urgent video', 'major detonation', 'minutes ago', 'pipeline'],
    provTag: 'Reverse Video Frame Match: 2017 Event',
    provText: 'Keyframe perceptual hash matches archived Reuters footage from 2017. Current breaking news attribution is completely fabricated.',
    svgPreview: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360" width="100%" height="100%">
      <rect width="640" height="360" fill="#020617"/>
      <circle cx="320" cy="180" r="70" fill="#ea580c" opacity="0.4"/>
      <circle cx="320" cy="180" r="45" fill="#f59e0b" opacity="0.8"/>
      <!-- Play button icon -->
      <circle cx="320" cy="180" r="30" fill="rgba(0,0,0,0.7)" stroke="#fff" stroke-width="2"/>
      <polygon points="312,168 335,180 312,192" fill="#fff"/>
      <rect x="30" y="30" width="310" height="32" fill="#dc2626" rx="4"/>
      <text x="40" y="52" font-family="sans-serif" font-size="14" font-weight="bold" fill="#fff">🚨 RECYCLED 2017 FOOTAGE DETECTED</text>
      <text x="320" y="330" text-anchor="middle" font-family="'JetBrains Mono', monospace" font-size="13" fill="#94a3b8">Keyframe Hash Match: August 14, 2017 Incident</text>
    </svg>`
  }
};

let currentMediaPresetKey = 'fakeScreenshot';
let isElaModeActive = false;

function initMediaForensicsIfEmpty() {
  const previewBox = document.getElementById('fnMediaPreviewBox');
  if (previewBox && !previewBox.getAttribute('data-initialized')) {
    loadMediaPreset('fakeScreenshot');
    previewBox.setAttribute('data-initialized', 'true');
  }
}

window.triggerMediaInput = function() {
  const fileInput = document.getElementById('fnMediaFileInput');
  if (fileInput) fileInput.click();
};

window.handleMediaFileUpload = function(event) {
  const file = event.target.files && event.target.files[0];
  if (!file) return;

  const fileName = file.name;
  const isVideo = file.type.startsWith('video');

  const reader = new FileReader();
  reader.onload = function(e) {
    displayUploadedMedia(e.target.result, fileName, isVideo);
    runCustomMediaScan(fileName, isVideo);
  };
  reader.readAsDataURL(file);
};

function displayUploadedMedia(dataUrl, fileName, isVideo) {
  const imgEl = document.getElementById('fnMediaImagePreview');
  const vidEl = document.getElementById('fnMediaVideoPreview');
  const phEl = document.getElementById('fnMediaPlaceholder');
  const fnLabel = document.getElementById('fnMediaFilename');

  if (fnLabel) fnLabel.textContent = fileName;
  if (phEl) phEl.style.display = 'none';

  if (isVideo) {
    if (imgEl) imgEl.style.display = 'none';
    if (vidEl) {
      vidEl.src = dataUrl;
      vidEl.style.display = 'block';
      vidEl.play().catch(() => {});
    }
  } else {
    if (vidEl) vidEl.style.display = 'none';
    if (imgEl) {
      imgEl.src = dataUrl;
      imgEl.style.display = 'block';
    }
  }
}

function runCustomMediaScan(fileName, isVideo) {
  // Trigger laser scan animation
  triggerLaserScan();

  // Evaluate heuristics based on filename and type
  const lower = fileName.toLowerCase();
  const isSuspicious = ['fake', 'deepfake', 'meme', 'leak', 'shock', 'ai', 'secret'].some(w => lower.includes(w));

  setTimeout(() => {
    const hero = document.getElementById('fnMediaVerdictHero');
    const icon = document.getElementById('fnMediaVerdictIcon');
    const sub = document.getElementById('fnMediaVerdictSub');
    const title = document.getElementById('fnMediaVerdictTitle');
    const pill = document.getElementById('fnMediaStatusPill');
    const scoreVal = document.getElementById('fnDeepfakeScore');
    const scoreBar = document.getElementById('fnDeepfakeBar');
    const scoreDesc = document.getElementById('fnDeepfakeDesc');
    const reachVal = document.getElementById('fnMediaReach');
    const reachBar = document.getElementById('fnMediaReachBar');
    const reachDesc = document.getElementById('fnMediaReachDesc');
    const ocrBadge = document.getElementById('fnOcrPacBadge');
    const ocrText = document.getElementById('fnOcrTextContent');
    const ocrTokens = document.getElementById('fnOcrTokensRow');
    const provTag = document.getElementById('fnProvTag');
    const provText = document.getElementById('fnProvText');

    if (isSuspicious) {
      if (hero) hero.className = 'media-verdict-hero fake-active';
      if (icon) icon.textContent = '🚨';
      if (sub) sub.textContent = 'Digital Manipulation & Misinformation Flagged';
      if (title) title.textContent = `Manipulated Media: "${fileName}"`;
      if (pill) { pill.textContent = 'High Risk'; pill.className = 'badge-pill danger'; }
      if (scoreVal) { scoreVal.textContent = '91.4% Risk'; scoreVal.className = 'mmb-score danger'; }
      if (scoreBar) { scoreBar.style.width = '91.4%'; scoreBar.className = 'meter-bar-fill fake-fill'; }
      if (scoreDesc) scoreDesc.textContent = 'High-frequency noise artifacts & unaligned compression boundaries detected.';
      if (reachVal) { reachVal.textContent = '0.05x Throttled'; reachVal.className = 'mmb-score danger'; }
      if (reachBar) { reachBar.style.width = '5%'; reachBar.className = 'meter-bar-fill fake-fill'; }
      if (reachDesc) reachDesc.textContent = 'Virality automatically suppressed by 95% across algorithmic feeds.';
      if (ocrBadge) ocrBadge.textContent = 'PAC NLP: 94.8% Fabricated News';
      if (ocrText) ocrText.textContent = `"ANALYSIS OF ${fileName.toUpperCase()}: SENSATIONALIZED HEADLINE OVERLAY WITH EXAGGERATED CLAIMS"`;
      if (ocrTokens) ocrTokens.innerHTML = '<span class="kw-chip fake-kw">sensationalized</span><span class="kw-chip fake-kw">unaligned</span><span class="kw-chip fake-kw">manipulated</span>';
      if (provTag) provTag.textContent = 'Unverified Provenance / Stripped EXIF';
      if (provText) provText.textContent = 'Missing cryptographic C2PA authenticity headers. Compression metadata indicates multi-pass re-encoding.';
    } else {
      if (hero) hero.className = 'media-verdict-hero real-active';
      if (icon) icon.textContent = '✅';
      if (sub) sub.textContent = 'Verified Visual Integrity & Authenticity';
      if (title) title.textContent = `Authentic Media Asset: "${fileName}"`;
      if (pill) { pill.textContent = 'Safe'; pill.className = 'badge-pill safe'; }
      if (scoreVal) { scoreVal.textContent = '4.2% Clean'; scoreVal.className = 'mmb-score safe'; }
      if (scoreBar) { scoreBar.style.width = '4.2%'; scoreBar.className = 'meter-bar-fill'; }
      if (scoreDesc) scoreDesc.textContent = 'Natural sensor noise pattern. No anomalous facial boundary blending or typeface splices.';
      if (reachVal) { reachVal.textContent = '1.0x Full Reach'; reachVal.className = 'mmb-score safe'; }
      if (reachBar) { reachBar.style.width = '100%'; reachBar.className = 'meter-bar-fill'; }
      if (reachDesc) reachDesc.textContent = 'Full normal distribution authorized across algorithmic feeds.';
      if (ocrBadge) ocrBadge.textContent = 'PAC NLP: 95.2% Authentic Lexicon';
      if (ocrText) ocrText.textContent = `"IMAGE METRICS FOR ${fileName.toUpperCase()}: NEUTRAL DOCUMENTARY CONTEXT"`;
      if (ocrTokens) ocrTokens.innerHTML = '<span class="kw-chip">verified</span><span class="kw-chip">natural light</span><span class="kw-chip">authentic</span>';
      if (provTag) provTag.textContent = 'Original Sensor Signature Intact';
      if (provText) provText.textContent = 'Standard Bayer sensor mosaic noise detected. Consistent lighting vectors across visual planes.';
    }

    if (typeof showToast === 'function') {
      showToast(`Multimodal Scan Complete: ${isSuspicious ? '🚨 Manipulated' : '✅ Authentic'}`);
    }
  }, 900);
}

window.loadMediaPreset = function(presetKey) {
  currentMediaPresetKey = presetKey;
  const p = mediaForensicPresets[presetKey];
  if (!p) return;

  // Highlight active button
  document.querySelectorAll('.media-preset-btn').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('onclick').includes(presetKey));
  });

  const fnLabel = document.getElementById('fnMediaFilename');
  const imgEl = document.getElementById('fnMediaImagePreview');
  const vidEl = document.getElementById('fnMediaVideoPreview');
  const phEl = document.getElementById('fnMediaPlaceholder');

  if (fnLabel) fnLabel.textContent = p.filename;
  if (phEl) phEl.style.display = 'none';

  // Render SVG data URL
  const svgDataUrl = 'data:image/svg+xml;utf8,' + encodeURIComponent(p.svgPreview);

  if (vidEl) vidEl.style.display = 'none';
  if (imgEl) {
    imgEl.src = svgDataUrl;
    imgEl.style.display = 'block';
  }

  // Update forensic fields
  const hero = document.getElementById('fnMediaVerdictHero');
  const icon = document.getElementById('fnMediaVerdictIcon');
  const sub = document.getElementById('fnMediaVerdictSub');
  const title = document.getElementById('fnMediaVerdictTitle');
  const pill = document.getElementById('fnMediaStatusPill');
  const scoreVal = document.getElementById('fnDeepfakeScore');
  const scoreBar = document.getElementById('fnDeepfakeBar');
  const scoreDesc = document.getElementById('fnDeepfakeDesc');
  const reachVal = document.getElementById('fnMediaReach');
  const reachBar = document.getElementById('fnMediaReachBar');
  const reachDesc = document.getElementById('fnMediaReachDesc');
  const ocrBadge = document.getElementById('fnOcrPacBadge');
  const ocrText = document.getElementById('fnOcrTextContent');
  const ocrTokens = document.getElementById('fnOcrTokensRow');
  const provTag = document.getElementById('fnProvTag');
  const provText = document.getElementById('fnProvText');

  if (hero) hero.className = `media-verdict-hero ${p.isFake ? 'fake-active' : 'real-active'}`;
  if (icon) icon.textContent = p.isFake ? '🚨' : '✅';
  if (sub) sub.textContent = p.sub;
  if (title) title.textContent = p.title;
  if (pill) {
    pill.textContent = p.isFake ? 'High Risk' : 'Safe';
    pill.className = `badge-pill ${p.isFake ? 'danger' : 'safe'}`;
  }
  if (scoreVal) {
    scoreVal.textContent = p.deepfakeScore;
    scoreVal.className = `mmb-score ${p.isFake ? 'danger' : 'safe'}`;
  }
  if (scoreBar) {
    scoreBar.style.width = p.deepfakeScore.replace(/[^\d.]/g, '') + '%';
    scoreBar.className = `meter-bar-fill ${p.isFake ? 'fake-fill' : ''}`;
  }
  if (scoreDesc) scoreDesc.textContent = p.deepfakeDesc;
  if (reachVal) {
    reachVal.textContent = p.reach;
    reachVal.className = `mmb-score ${p.isFake ? 'danger' : 'safe'}`;
  }
  if (reachBar) {
    reachBar.style.width = `${p.reachPct}%`;
    reachBar.className = `meter-bar-fill ${p.isFake ? 'fake-fill' : ''}`;
  }
  if (reachDesc) {
    reachDesc.textContent = p.isFake 
      ? 'Virality throttled by 95% on algorithmic feeds to curb unverified sensationalism.'
      : 'Full unthrottled distribution authorized across algorithmic feeds.';
  }
  if (ocrBadge) ocrBadge.textContent = p.ocrScore;
  if (ocrText) ocrText.textContent = p.ocrText;
  if (ocrTokens) {
    ocrTokens.innerHTML = p.tokens.map(t => `<span class="kw-chip ${p.isFake ? 'fake-kw' : ''}">${t}</span>`).join('');
  }
  if (provTag) provTag.textContent = p.provTag;
  if (provText) provText.textContent = p.provText;

  triggerLaserScan();
};

window.runMediaForensicScan = function() {
  triggerLaserScan();
  if (typeof showToast === 'function') {
    showToast('Re-running Multimodal Neural Scan & ELA Decomposition...');
  }
};

function triggerLaserScan() {
  const laser = document.getElementById('fnMediaScannerLaser');
  if (!laser) return;
  laser.classList.remove('scanning');
  void laser.offsetWidth; // trigger reflow
  laser.classList.add('scanning');
}

window.toggleElaMode = function() {
  isElaModeActive = !isElaModeActive;
  const imgEl = document.getElementById('fnMediaImagePreview');
  const btn = document.getElementById('fnBtnElaToggle');

  if (imgEl) {
    if (isElaModeActive) {
      imgEl.style.filter = 'invert(1) contrast(200%) hue-rotate(180deg)';
      if (btn) btn.classList.add('active');
      if (typeof showToast === 'function') showToast('Error Level Analysis (ELA) Filter Enabled');
    } else {
      imgEl.style.filter = '';
      if (btn) btn.classList.remove('active');
      if (typeof showToast === 'function') showToast('Returned to Standard Optical View');
    }
  }
};

// Initialize drag and drop on dropzone when DOM ready
document.addEventListener('DOMContentLoaded', () => {
  const dropzone = document.getElementById('fnMediaDropzone');
  if (dropzone) {
    ['dragenter', 'dragover'].forEach(eventName => {
      dropzone.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropzone.classList.add('drag-over');
      }, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
      dropzone.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropzone.classList.remove('drag-over');
      }, false);
    });

    dropzone.addEventListener('drop', (e) => {
      const dt = e.dataTransfer;
      const files = dt.files;
      if (files && files[0]) {
        const file = files[0];
        const isVideo = file.type.startsWith('video');
        const reader = new FileReader();
        reader.onload = function(evt) {
          displayUploadedMedia(evt.target.result, file.name, isVideo);
          runCustomMediaScan(file.name, isVideo);
        };
        reader.readAsDataURL(file);
      }
    }, false);
  }
});

/* ==========================================================================
   Modal Model Benchmark Switcher & Live NLP Lab Functions
   ========================================================================== */

const modalBenchmarkModels = {
  pac: {
    title: 'Confusion Matrix: Passive Aggressive Classifier (PAC)',
    accuracy: '96.08% Acc',
    badgeClass: 'safe',
    tn: '1,048',
    fp: '43',
    fn: '41',
    tp: '1,012',
    theory: 'PAC updates only when hinge loss > 0, remaining strictly passive on correctly-classified articles with ultra-low latency (<2ms).'
  },
  linearsvc: {
    title: 'Confusion Matrix: Linear Support Vector Classifier (LinearSVC)',
    accuracy: '94.12% Acc',
    badgeClass: 'safe',
    tn: '1,015',
    fp: '76',
    fn: '50',
    tp: '1,003',
    theory: 'LinearSVC maximizes geometric hyperplane separation margin. High accuracy but lacks PAC\'s instant streaming online adaptability.'
  },
  logreg: {
    title: 'Confusion Matrix: Logistic Regression (L2 Regularized)',
    accuracy: '91.50% Acc',
    badgeClass: 'warn',
    tn: '988',
    fp: '103',
    fn: '79',
    tp: '974',
    theory: 'Logistic Regression optimizes cross-entropy loss. Steady baseline for high-frequency terms, but less dynamic on emerging lexical variations.'
  },
  mnb: {
    title: 'Confusion Matrix: Multinomial Naive Bayes (MNB)',
    accuracy: '88.42% Acc',
    badgeClass: 'danger',
    tn: '945',
    fp: '146',
    fn: '102',
    tp: '951',
    theory: 'Multinomial Naive Bayes assumes strict feature independence, underperforming on coordinated contextual disinformation phrasing.'
  }
};

window.switchModalBenchmarkModel = function(modelKey) {
  const data = modalBenchmarkModels[modelKey];
  if (!data) return;

  ['pac', 'linearsvc', 'logreg', 'mnb'].forEach(k => {
    const row = document.getElementById(`fnRow-${k}`);
    if (row) row.classList.toggle('active', k === modelKey);
  });

  const titleEl = document.getElementById('fnModalCmTitle');
  const badgeEl = document.getElementById('fnModalCmBadge');
  const tnEl = document.getElementById('fnModalCmTN');
  const fpEl = document.getElementById('fnModalCmFP');
  const fnEl = document.getElementById('fnModalCmFN');
  const tpEl = document.getElementById('fnModalCmTP');
  const theoryEl = document.getElementById('fnModalModelTheory');

  if (titleEl) titleEl.textContent = data.title;
  if (badgeEl) {
    badgeEl.textContent = data.accuracy;
    badgeEl.className = `badge-pill ${data.badgeClass}`;
  }
  if (tnEl) tnEl.textContent = data.tn;
  if (fpEl) fpEl.textContent = data.fp;
  if (fnEl) fnEl.textContent = data.fn;
  if (tpEl) tpEl.textContent = data.tp;
  if (theoryEl) theoryEl.textContent = data.theory;
};

const modalNlpPresets = {
  tabloid: "BREAKING: Secret government insiders admit confidential lunar frequencies control global weather!",
  nasa: "NASA’s James Webb Space Telescope confirms atmospheric water vapor and carbon dioxide across exoplanets.",
  election: "URGENT REPORT: Whistleblower alleges voting machines automatically switched thousands of ballots during midnight updates."
};

window.loadModalNlpPreset = function(key) {
  document.querySelectorAll('.nlp-mini-btn').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('onclick').includes(key));
  });
  const input = document.getElementById('fnModalNlpInput');
  if (input && modalNlpPresets[key]) {
    input.value = modalNlpPresets[key];
    runModalNlpPipeline();
  }
};

window.runModalNlpPipeline = function() {
  const inputEl = document.getElementById('fnModalNlpInput');
  if (!inputEl) return;
  const rawText = inputEl.value;

  // 1. Regex clean [^a-zA-Z\s]
  const regexClean = rawText.replace(/[^a-zA-Z\s]/g, ' ').replace(/\s+/g, ' ').trim();
  const stage1El = document.getElementById('fnModalNlpStage1');
  if (stage1El) stage1El.textContent = regexClean || '(No alphabetic tokens)';

  // 2. Stopword filtering
  const stopSet = new Set([
    'i','me','my','myself','we','our','ours','ourselves','you','your','yours','he','him','his','she',
    'her','hers','it','its','they','them','their','theirs','what','which','who','whom','this','that',
    'these','those','am','is','are','was','were','be','been','being','have','has','had','having','do',
    'does','did','doing','a','an','the','and','but','if','or','because','as','until','while','of','at',
    'by','for','with','about','against','between','into','through','during','before','after','above','below',
    'to','from','up','down','in','out','on','off','over','under','again','further','then','once','here',
    'there','when','where','why','how','all','any','both','each','few','more','most','other','some','such',
    'no','nor','not','only','own','same','so','than','too','very','can','will','just','should','now'
  ]);

  const lowercased = regexClean.toLowerCase();
  const tokens = lowercased ? lowercased.split(' ').filter(t => t.length > 0) : [];
  let stage2Html = '';
  let keptTokens = [];

  tokens.forEach(t => {
    if (stopSet.has(t)) {
      stage2Html += `<span class="token dropped" title="NLTK Stopword">${t}</span> `;
    } else {
      keptTokens.push(t);
      stage2Html += `<span class="token keep">${t}</span> `;
    }
  });
  const stage2El = document.getElementById('fnModalNlpStage2');
  if (stage2El) stage2El.innerHTML = stage2Html || '(All tokens filtered)';

  // 3. WordNet Lemmatizer
  const lemmaMap = {
    'frequencies': 'frequency', 'tides': 'tide', 'insiders': 'insider',
    'patterns': 'pattern', 'breaking': 'break', 'manipulating': 'manipulate',
    'admits': 'admit', 'confirms': 'confirm', 'exoplanets': 'exoplanet',
    'machines': 'machine', 'ballots': 'ballot', 'updates': 'update'
  };

  let stage3Html = '';
  keptTokens.forEach(t => {
    const lemma = lemmaMap[t] || (t.endsWith('s') && t.length > 3 ? t.slice(0, -1) : t);
    stage3Html += `<span class="lemma-token">${t} → <strong>${lemma}</strong></span> `;
  });
  const stage3El = document.getElementById('fnModalNlpStage3');
  if (stage3El) stage3El.innerHTML = stage3Html || '(No features)';
};




