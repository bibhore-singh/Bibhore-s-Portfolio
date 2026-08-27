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
  }
});
