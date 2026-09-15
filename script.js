/* ==========================================================================
   KIDZ NOVA PLAYGROUP & PRESCHOOL - INTERACTIVE ENGINE
   Includes Web Audio Synthesizer, Flashcards Game, Painter Canvas & Portal logic
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // --- 1. Sound Effects Synth Engine (Web Audio API) ---
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  let soundEnabled = true;

  function playTone(freq = 440, type = 'sine', duration = 0.2) {
    if (!soundEnabled || audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    if (!soundEnabled) return;

    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

      gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
      console.log('Audio synth error:', e);
    }
  }

  window.speakAndPlay = function (text, freq = 440) {
    playTone(freq, 'sine', 0.35);
    if ('speechSynthesis' in window && soundEnabled) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.pitch = 1.25;
      window.speechSynthesis.speak(utterance);
    }
  };

  window.playInstrumentAudio = function (type) {
    if (!soundEnabled || audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }

    if (type === 'piano') {
      // Play realistic multi-note Piano synth chord (C4, E4, G4, C5) with warm decay envelope
      const pianoNotes = [261.63, 329.63, 392.00, 523.25];
      pianoNotes.forEach((freq, idx) => {
        setTimeout(() => {
          try {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
            osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
            gain.gain.setValueAtTime(0.25, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.9);
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start();
            osc.stop(audioCtx.currentTime + 0.9);
          } catch (e) { }
        }, idx * 60);
      });
    } else if (type === 'drum') {
      // Play energetic drum roll beat
      const drumBeats = ['kick', 'snare', 'hihat', 'kick', 'snare'];
      drumBeats.forEach((pad, idx) => {
        setTimeout(() => playDrumPad(pad), idx * 110);
      });
    } else if (type === 'xylophone' || type === 'sax') {
      // Play bright rainbow xylophone glissando chime
      const xyloNotes = [523.25, 659.25, 783.99, 1046.50];
      xyloNotes.forEach((freq, idx) => {
        setTimeout(() => playXylophoneKey('gliss', freq), idx * 75);
      });
    }
  };

  window.playPianoKey = function (noteName, freq) {
    if (!soundEnabled || audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.8);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.8);
    } catch (e) { }
  };

  window.playXylophoneKey = function (noteName, freq) {
    if (!soundEnabled || audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    try {
      const osc = audioCtx.createOscillator();
      const osc2 = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq * 1.5, audioCtx.currentTime);

      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(freq, audioCtx.currentTime);

      gain.gain.setValueAtTime(0.35, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.6);

      osc.connect(gain);
      osc2.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc2.start();
      osc.stop(audioCtx.currentTime + 0.6);
      osc2.stop(audioCtx.currentTime + 0.6);
    } catch (e) { }
  };

  window.playDrumPad = function (padType) {
    if (!soundEnabled || audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    try {
      if (padType === 'kick') {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.frequency.setValueAtTime(140, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(35, audioCtx.currentTime + 0.2);
        gain.gain.setValueAtTime(0.4, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.2);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.2);
      } else if (padType === 'snare') {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(220, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(80, audioCtx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.15);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.15);
      } else if (padType === 'hihat') {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(1200, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.08);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.08);
      } else if (padType === 'bongo') {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(450, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(200, audioCtx.currentTime + 0.18);
        gain.gain.setValueAtTime(0.35, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.18);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.18);
      }
    } catch (e) { }
  };

  window.switchInstrumentTab = function (type) {
    if (typeof playInstrumentAudio === 'function') {
      playInstrumentAudio(type);
    }
    const views = ['piano', 'drum', 'xylophone'];
    views.forEach(v => {
      const viewElem = document.getElementById(v + 'InstView');
      const btnElem = document.getElementById(v + 'InstTab');
      if (viewElem) viewElem.style.display = (v === type) ? 'block' : 'none';
      if (btnElem) {
        if (v === type) {
          btnElem.classList.add('active-inst-tab');
          btnElem.style.transform = 'scale(1.08)';
          btnElem.style.boxShadow = '0 6px 16px rgba(0,0,0,0.2)';
        } else {
          btnElem.classList.remove('active-inst-tab');
          btnElem.style.transform = 'scale(1)';
          btnElem.style.boxShadow = 'none';
        }
      }
    });
  };

  window.playShapeAudio = function (shapeName, spellOut, freq) {
    playTone(freq, 'sine', 0.4);
    if ('speechSynthesis' in window && soundEnabled) {
      window.speechSynthesis.cancel();
      const utt = new SpeechSynthesisUtterance(`${shapeName}! ${spellOut}. It is called a ${shapeName}!`);
      utt.rate = 0.92;
      utt.pitch = 1.2;
      window.speechSynthesis.speak(utt);
    }
  };

  function playHappyChime() {
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      setTimeout(() => playTone(freq, 'triangle', 0.25), idx * 80);
    });
  }

  function playPopSound() {
    playTone(350, 'sine', 0.08);
  }

  // Attach sound toggler
  const soundToggleBtn = document.getElementById('soundToggle');
  if (soundToggleBtn) {
    soundToggleBtn.addEventListener('click', () => {
      soundEnabled = !soundEnabled;
      soundToggleBtn.innerHTML = soundEnabled ? '🔊' : '🔇';
      if (soundEnabled) playHappyChime();
    });
  }

  // --- 2. Dark / Light Theme Toggler ---
  const themeToggleBtn = document.getElementById('themeToggle');
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = document.body.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      document.body.setAttribute('data-theme', newTheme);
      themeToggleBtn.innerHTML = newTheme === 'dark' ? '☀️' : '🌙';
      playPopSound();
    });
  }

  // Attach global button click audio feedback
  document.querySelectorAll('button, a.btn-primary, a.btn-secondary').forEach(btn => {
    btn.addEventListener('click', () => playPopSound());
  });

  // --- 3. Interactive Toddler Sound Flashcards ---
  const flashcardData = [
    { letter: 'A', emoji: '🍎', word: 'Apple', freq: 261.63 },
    { letter: 'B', emoji: '🐻', word: 'Bear', freq: 293.66 },
    { letter: 'C', emoji: '🐱', word: 'Cat', freq: 329.63 },
    { letter: 'D', emoji: '🦆', word: 'Duck', freq: 349.23 },
    { letter: 'E', emoji: '🐘', word: 'Elephant', freq: 392.00 },
    { letter: 'F', emoji: '🐸', word: 'Frog', freq: 440.00 },
    { letter: 'G', emoji: '🦒', word: 'Giraffe', freq: 493.88 },
    { letter: 'H', emoji: '🦔', word: 'Hedgehog', freq: 523.25 },
    { letter: 'I', emoji: '🍦', word: 'Ice Cream', freq: 587.33 },
    { letter: 'J', emoji: '🪼', word: 'Jellyfish', freq: 620.00 },
    { letter: 'K', emoji: '🪁', word: 'Kite', freq: 659.25 },
    { letter: 'L', emoji: '🦁', word: 'Lion', freq: 698.46 },
    { letter: 'M', emoji: '🐒', word: 'Monkey', freq: 739.99 },
    { letter: 'N', emoji: '🪹', word: 'Nest', freq: 783.99 },
    { letter: 'O', emoji: '🦉', word: 'Owl', freq: 830.61 },
    { letter: 'P', emoji: '🐧', word: 'Penguin', freq: 880.00 },
    { letter: 'Q', emoji: '👑', word: 'Queen', freq: 932.33 },
    { letter: 'R', emoji: '🚀', word: 'Rocket', freq: 987.77 },
    { letter: 'S', emoji: '🌟', word: 'Star', freq: 1046.50 },
    { letter: 'T', emoji: '🐯', word: 'Tiger', freq: 1108.73 },
    { letter: 'U', emoji: '☂️', word: 'Umbrella', freq: 1174.66 },
    { letter: 'V', emoji: '🎻', word: 'Violin', freq: 1244.51 },
    { letter: 'W', emoji: '🐋', word: 'Whale', freq: 1318.51 },
    { letter: 'X', emoji: '🎷', word: 'Xylophone', freq: 1396.91 },
    { letter: 'Y', emoji: '🪀', word: 'Yo-Yo', freq: 1479.98 },
    { letter: 'Z', emoji: '🦓', word: 'Zebra', freq: 1567.98 }
  ];

  const flashcardGrid = document.getElementById('flashcardGrid');
  if (flashcardGrid) {
    flashcardGrid.innerHTML = '';
    flashcardData.forEach(item => {
      const card = document.createElement('div');
      card.className = 'flashcard';
      card.innerHTML = `
        <div class="flashcard-letter">${item.letter}</div>
        <span class="flashcard-emoji">${item.emoji}</span>
        <div class="flashcard-word">${item.word}</div>
      `;

      card.addEventListener('click', () => {
        playTone(item.freq, 'sine', 0.4);
        card.style.transform = 'scale(1.2) rotate(5deg)';
        setTimeout(() => {
          card.style.transform = '';
        }, 300);

        // Speech synthesis if supported
        if ('speechSynthesis' in window && soundEnabled) {
          window.speechSynthesis.cancel();
          const utterance = new SpeechSynthesisUtterance(`${item.letter} is for ${item.word}`);
          utterance.rate = 0.95;
          utterance.pitch = 1.2;
          window.speechSynthesis.speak(utterance);
        }
      });

      flashcardGrid.appendChild(card);
    });
  }

  // --- 4. Toddler Interactive Drawing Canvas ---
  const canvas = document.getElementById('kidsCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let isDrawing = false;
    let currentColor = '#FF6B6B';
    let brushSize = 8;

    // Responsive Canvas Resizing
    function resizeCanvas() {
      const containerWidth = canvas.parentElement.clientWidth - 40;
      canvas.width = Math.min(containerWidth, 700);
      canvas.height = 360;
      // White background default
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Color Dots Selector
    document.querySelectorAll('.color-picker-dot').forEach(dot => {
      dot.addEventListener('click', (e) => {
        document.querySelectorAll('.color-picker-dot').forEach(d => d.classList.remove('active'));
        dot.classList.add('active');
        currentColor = dot.getAttribute('data-color');
        playPopSound();
      });
    });

    // Clear Canvas Button
    const clearCanvasBtn = document.getElementById('clearCanvasBtn');
    if (clearCanvasBtn) {
      clearCanvasBtn.addEventListener('click', () => {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        playHappyChime();
      });
    }

    // Drawing Events
    function startDraw(e) {
      isDrawing = true;
      draw(e);
    }

    function stopDraw() {
      isDrawing = false;
      ctx.beginPath();
    }

    function draw(e) {
      if (!isDrawing) return;
      const rect = canvas.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;

      const x = clientX - rect.left;
      const y = clientY - rect.top;

      ctx.lineWidth = brushSize;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.strokeStyle = currentColor;

      ctx.lineTo(x, y);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x, y);
    }

    canvas.addEventListener('mousedown', startDraw);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDraw);
    canvas.addEventListener('mouseleave', stopDraw);

    canvas.addEventListener('touchstart', startDraw, { passive: true });
    canvas.addEventListener('touchmove', draw, { passive: true });
    canvas.addEventListener('touchend', stopDraw);
  }

  // --- Helper: Confetti & Emoji Burst Effect ---
  function triggerConfettiBurst(x = window.innerWidth / 2, y = window.innerHeight / 2) {
    const emojis = ['🎉', '⭐', '🎈', '✨', '🥳', '🧸', '🐥', '🌟', '🎨'];
    for (let i = 0; i < 15; i++) {
      const p = document.createElement('div');
      p.className = 'confetti-particle';
      p.innerText = emojis[Math.floor(Math.random() * emojis.length)];
      p.style.left = `${x}px`;
      p.style.top = `${y}px`;

      const angle = Math.random() * Math.PI * 2;
      const velocity = 80 + Math.random() * 150;
      const tx = Math.cos(angle) * velocity;
      const ty = Math.sin(angle) * velocity - 100;

      p.style.setProperty('--tx', `${tx}px`);
      p.style.setProperty('--ty', `${ty}px`);

      document.body.appendChild(p);
      setTimeout(() => p.remove(), 1800);
    }
  }

  // ==========================================================================
  // Three.js 3D Animated Child Character Engine for View Details
  // ==========================================================================
  let active3DAnimator = null;

  class Child3DAnimator {
    constructor(containerElement, activityType = 'playgroup') {
      this.container = containerElement;
      this.activityType = activityType;
      this.animationFrameId = null;
      this.clock = typeof THREE !== 'undefined' ? new THREE.Clock() : null;

      if (typeof THREE === 'undefined') {
        console.log('THREE.js not loaded, skipping 3D rendering');
        return;
      }

      this.initScene();
      this.createChildCharacter();
      this.createActivityProps();
      this.setupAnimationState();
      this.animate();

      this.onResizeHandler = this.onResize.bind(this);
      window.addEventListener('resize', this.onResizeHandler);
    }

    initScene() {
      this.width = this.container.clientWidth || 340;
      this.height = this.container.clientHeight || 320;

      this.scene = new THREE.Scene();

      const ambientLight = new THREE.AmbientLight(0xffffff, 0.75);
      this.scene.add(ambientLight);

      const dirLight = new THREE.DirectionalLight(0xffffff, 0.85);
      dirLight.position.set(5, 8, 5);
      this.scene.add(dirLight);

      const backLight = new THREE.DirectionalLight(0xffe66d, 0.45);
      backLight.position.set(-5, 4, -5);
      this.scene.add(backLight);

      this.camera = new THREE.PerspectiveCamera(45, this.width / this.height, 0.1, 100);
      this.camera.position.set(0, 0.75, 4.2);
      this.camera.lookAt(0, 0.35, 0);

      this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      this.renderer.setSize(this.width, this.height);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      this.container.appendChild(this.renderer.domElement);
    }

    createChildCharacter() {
      this.childGroup = new THREE.Group();

      const skinMat = new THREE.MeshToonMaterial({ color: 0xffd1b3 });
      const cheekMat = new THREE.MeshToonMaterial({ color: 0xff8ea4 });
      const hairMat = new THREE.MeshToonMaterial({ color: 0x5a3825 });
      const shirtMat = new THREE.MeshToonMaterial({
        color: this.activityType === 'playgroup' ? 0xff6b6b :
          this.activityType === 'nursery' ? 0x6c5ce7 :
            this.activityType === 'juniorKg' ? 0x00cec9 : 0xffc048
      });
      const pantsMat = new THREE.MeshToonMaterial({ color: 0x2f3640 });
      const shoeMat = new THREE.MeshToonMaterial({ color: 0xffffff });
      const eyeWhiteMat = new THREE.MeshToonMaterial({ color: 0xffffff });
      const irisMat = new THREE.MeshToonMaterial({ color: 0x2c3e50 });

      // Head Group
      this.headGroup = new THREE.Group();
      this.headGroup.position.y = 0.95;

      const headGeo = new THREE.SphereGeometry(0.35, 32, 32);
      const headMesh = new THREE.Mesh(headGeo, skinMat);
      this.headGroup.add(headMesh);

      // Cheeks
      const cheekGeo = new THREE.SphereGeometry(0.07, 16, 16);
      const leftCheek = new THREE.Mesh(cheekGeo, cheekMat);
      leftCheek.position.set(-0.2, -0.06, 0.28);
      const rightCheek = new THREE.Mesh(cheekGeo, cheekMat);
      rightCheek.position.set(0.2, -0.06, 0.28);
      this.headGroup.add(leftCheek);
      this.headGroup.add(rightCheek);

      // Eyes
      const eyeGeo = new THREE.SphereGeometry(0.065, 16, 16);
      const irisGeo = new THREE.SphereGeometry(0.04, 16, 16);

      const leftEye = new THREE.Mesh(eyeGeo, eyeWhiteMat);
      leftEye.position.set(-0.13, 0.05, 0.31);
      const leftIris = new THREE.Mesh(irisGeo, irisMat);
      leftIris.position.set(0, 0, 0.03);
      leftEye.add(leftIris);
      this.headGroup.add(leftEye);

      const rightEye = new THREE.Mesh(eyeGeo, eyeWhiteMat);
      rightEye.position.set(0.13, 0.05, 0.31);
      const rightIris = new THREE.Mesh(irisGeo, irisMat);
      rightIris.position.set(0, 0, 0.03);
      rightEye.add(rightIris);
      this.headGroup.add(rightEye);

      // Eyelids for Blinking
      const lidGeo = new THREE.BoxGeometry(0.14, 0.07, 0.05);
      const lidMat = new THREE.MeshToonMaterial({ color: 0xffd1b3 });
      this.leftLid = new THREE.Mesh(lidGeo, lidMat);
      this.leftLid.position.set(-0.13, 0.09, 0.33);
      this.leftLid.scale.y = 0.01;
      this.rightLid = new THREE.Mesh(lidGeo, lidMat);
      this.rightLid.position.set(0.13, 0.09, 0.33);
      this.rightLid.scale.y = 0.01;
      this.headGroup.add(this.leftLid);
      this.headGroup.add(this.rightLid);

      // Smile Mouth
      const mouthGeo = new THREE.TorusGeometry(0.07, 0.015, 16, 16, Math.PI);
      const mouthMat = new THREE.MeshBasicMaterial({ color: 0xc0392b });
      const mouth = new THREE.Mesh(mouthGeo, mouthMat);
      mouth.position.set(0, -0.12, 0.32);
      mouth.rotation.x = Math.PI / 8;
      mouth.rotation.z = Math.PI;
      this.headGroup.add(mouth);

      // Hair
      const hairGeo = new THREE.SphereGeometry(0.37, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.55);
      const hairMesh = new THREE.Mesh(hairGeo, hairMat);
      hairMesh.position.y = 0.03;
      this.headGroup.add(hairMesh);

      const tuftGeo = new THREE.ConeGeometry(0.08, 0.2, 16);
      const tuft = new THREE.Mesh(tuftGeo, hairMat);
      tuft.position.set(0, 0.38, 0.1);
      tuft.rotation.x = -Math.PI / 6;
      this.headGroup.add(tuft);

      this.childGroup.add(this.headGroup);

      // Torso
      this.torsoGroup = new THREE.Group();
      const shirtGeo = new THREE.CylinderGeometry(0.24, 0.28, 0.55, 32);
      const shirtMesh = new THREE.Mesh(shirtGeo, shirtMat);
      shirtMesh.position.y = 0.45;
      this.torsoGroup.add(shirtMesh);
      this.childGroup.add(this.torsoGroup);

      // Arms
      const armGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.4, 16);
      armGeo.translate(0, -0.2, 0);
      const handGeo = new THREE.SphereGeometry(0.07, 16, 16);

      this.leftArmGroup = new THREE.Group();
      this.leftArmGroup.position.set(-0.3, 0.62, 0);
      const leftArmMesh = new THREE.Mesh(armGeo, shirtMat);
      const leftHand = new THREE.Mesh(handGeo, skinMat);
      leftHand.position.y = -0.42;
      this.leftArmGroup.add(leftArmMesh);
      this.leftArmGroup.add(leftHand);
      this.childGroup.add(this.leftArmGroup);

      this.rightArmGroup = new THREE.Group();
      this.rightArmGroup.position.set(0.3, 0.62, 0);
      const rightArmMesh = new THREE.Mesh(armGeo, shirtMat);
      const rightHand = new THREE.Mesh(handGeo, skinMat);
      rightHand.position.y = -0.42;
      this.rightArmGroup.add(rightArmMesh);
      this.rightArmGroup.add(rightHand);
      this.childGroup.add(this.rightArmGroup);

      // Legs
      const legGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.42, 16);
      legGeo.translate(0, -0.21, 0);
      const shoeGeo = new THREE.BoxGeometry(0.14, 0.1, 0.22);

      this.leftLegGroup = new THREE.Group();
      this.leftLegGroup.position.set(-0.14, 0.2, 0);
      const leftLegMesh = new THREE.Mesh(legGeo, pantsMat);
      const leftShoe = new THREE.Mesh(shoeGeo, shoeMat);
      leftShoe.position.set(0, -0.42, 0.04);
      this.leftLegGroup.add(leftLegMesh);
      this.leftLegGroup.add(leftShoe);
      this.childGroup.add(this.leftLegGroup);

      this.rightLegGroup = new THREE.Group();
      this.rightLegGroup.position.set(0.14, 0.2, 0);
      const rightLegMesh = new THREE.Mesh(legGeo, pantsMat);
      const rightShoe = new THREE.Mesh(shoeGeo, shoeMat);
      rightShoe.position.set(0, -0.42, 0.04);
      this.rightLegGroup.add(rightLegMesh);
      this.rightLegGroup.add(rightShoe);
      this.childGroup.add(this.rightLegGroup);

      // Initial Entrance Position off-screen right
      this.childGroup.position.set(3.8, -0.2, 0);
      this.scene.add(this.childGroup);
    }

    createActivityProps() {
      this.propsGroup = new THREE.Group();

      if (this.activityType === 'playgroup') {
        const blockMat1 = new THREE.MeshToonMaterial({ color: 0xff6b6b });
        const blockMat2 = new THREE.MeshToonMaterial({ color: 0xffc048 });
        const blockMat3 = new THREE.MeshToonMaterial({ color: 0x00cec9 });
        const blockGeo = new THREE.BoxGeometry(0.25, 0.25, 0.25);

        this.block1 = new THREE.Mesh(blockGeo, blockMat1);
        this.block1.position.set(-0.55, -0.1, 0.3);
        this.block2 = new THREE.Mesh(blockGeo, blockMat2);
        this.block2.position.set(-0.55, 0.15, 0.3);
        this.block3 = new THREE.Mesh(blockGeo, blockMat3);
        this.block3.position.set(-0.55, 0.4, 0.3);
        this.block3.scale.set(0, 0, 0);

        this.propsGroup.add(this.block1);
        this.propsGroup.add(this.block2);
        this.propsGroup.add(this.block3);
      } else if (this.activityType === 'nursery') {
        this.notes = [];
        const noteMat = new THREE.MeshToonMaterial({ color: 0x6c5ce7 });
        const noteGeo = new THREE.TorusGeometry(0.09, 0.03, 16, 32);

        for (let i = 0; i < 4; i++) {
          const note = new THREE.Mesh(noteGeo, noteMat);
          note.position.set(-0.8 + i * 0.5, 0.4 + (i % 2) * 0.3, 0.2);
          note.scale.set(0.8, 0.8, 0.8);
          this.notes.push(note);
          this.propsGroup.add(note);
        }
      } else if (this.activityType === 'juniorKg') {
        const glassMat = new THREE.MeshToonMaterial({ color: 0x81ecec, transparent: true, opacity: 0.85 });
        const flaskGeo = new THREE.ConeGeometry(0.2, 0.35, 16);
        this.flask = new THREE.Mesh(flaskGeo, glassMat);
        this.flask.position.set(-0.5, 0.35, 0.25);
        this.propsGroup.add(this.flask);

        this.sparkles = [];
        const sparkMat = new THREE.MeshBasicMaterial({ color: 0xffe66d });
        const sparkGeo = new THREE.SphereGeometry(0.04, 8, 8);
        for (let i = 0; i < 6; i++) {
          const sp = new THREE.Mesh(sparkGeo, sparkMat);
          sp.position.set(-0.5 + (Math.random() - 0.5) * 0.2, 0.55 + i * 0.12, 0.25);
          this.sparkles.push(sp);
          this.propsGroup.add(sp);
        }
      } else {
        const bookCoverMat = new THREE.MeshToonMaterial({ color: 0xe67e22 });
        const bookGeo = new THREE.BoxGeometry(0.36, 0.45, 0.06);
        this.book = new THREE.Mesh(bookGeo, bookCoverMat);
        this.book.position.set(0.45, 0.35, 0.3);
        this.book.rotation.y = -Math.PI / 6;
        this.propsGroup.add(this.book);

        const starMat = new THREE.MeshToonMaterial({ color: 0xffc048 });
        const starGeo = new THREE.OctahedronGeometry(0.18);
        this.goldStar = new THREE.Mesh(starGeo, starMat);
        this.goldStar.position.set(0, 1.45, 0);
        this.propsGroup.add(this.goldStar);
      }

      this.scene.add(this.propsGroup);
    }

    setupAnimationState() {
      this.enterProgress = 0;
      this.isBlinking = false;
      this.blinkTimer = 0;
      this.actionProgress = 0;
    }

    animate() {
      if (!this.renderer || !this.scene || !this.camera) return;
      this.animationFrameId = requestAnimationFrame(this.animate.bind(this));

      const delta = this.clock ? this.clock.getDelta() : 0.016;
      const elapsedTime = this.clock ? this.clock.getElapsedTime() : Date.now() * 0.001;

      // 1. Entrance Walk-In Animation
      if (this.enterProgress < 1) {
        this.enterProgress += delta * 1.25;
        const walkT = Math.min(this.enterProgress, 1);
        const easeX = 3.8 * (1 - Math.pow(1 - walkT, 3));
        this.childGroup.position.x = 3.8 - easeX;

        const gait = Math.sin(elapsedTime * 14);
        this.leftLegGroup.rotation.x = gait * 0.4;
        this.rightLegGroup.rotation.x = -gait * 0.4;
        this.leftArmGroup.rotation.x = -gait * 0.4;
        this.rightArmGroup.rotation.x = gait * 0.4;

        if (this.enterProgress >= 1) {
          this.leftLegGroup.rotation.x = 0;
          this.rightLegGroup.rotation.x = 0;
          this.leftArmGroup.rotation.x = 0;
          this.rightArmGroup.rotation.x = 0;
        }
      } else {
        // 2. Activity Specific Actions
        this.actionProgress += delta;

        if (this.activityType === 'playgroup') {
          const wave = Math.sin(elapsedTime * 4);
          this.rightArmGroup.rotation.z = -Math.PI / 3 + wave * 0.15;
          this.rightArmGroup.rotation.x = -Math.PI / 4;
          if (this.block3) {
            const blockT = Math.min(this.actionProgress * 1.5, 1);
            this.block3.scale.set(blockT, blockT, blockT);
          }
        } else if (this.activityType === 'nursery') {
          const sway = Math.sin(elapsedTime * 5);
          this.childGroup.rotation.z = sway * 0.1;
          this.leftArmGroup.rotation.z = Math.PI / 4 + sway * 0.3;
          this.rightArmGroup.rotation.z = -Math.PI / 4 - sway * 0.3;

          if (this.notes) {
            this.notes.forEach((n, i) => {
              n.position.y = 0.4 + Math.sin(elapsedTime * 3 + i) * 0.15;
              n.rotation.z = elapsedTime * 2 + i;
            });
          }
        } else if (this.activityType === 'juniorKg') {
          this.leftArmGroup.rotation.x = -Math.PI / 3;
          this.rightArmGroup.rotation.z = -Math.PI / 3 + Math.sin(elapsedTime * 6) * 0.2;

          if (this.sparkles) {
            this.sparkles.forEach((sp, i) => {
              sp.position.y = 0.5 + ((elapsedTime * 1.5 + i * 0.3) % 0.5);
              sp.scale.setScalar(0.5 + Math.sin(elapsedTime * 8 + i) * 0.3);
            });
          }
        } else {
          this.leftArmGroup.rotation.x = -Math.PI / 3;
          this.rightArmGroup.rotation.x = -Math.PI / 3;
          if (this.goldStar) {
            this.goldStar.rotation.y = elapsedTime * 2;
            this.goldStar.position.y = 1.45 + Math.sin(elapsedTime * 3) * 0.08;
          }
        }

        // 3. Idle Breathing & Blinking
        const breathing = Math.sin(elapsedTime * 3) * 0.02;
        this.torsoGroup.scale.y = 1.0 + breathing;

        this.blinkTimer += delta;
        if (this.blinkTimer > 3.2) {
          this.isBlinking = true;
          this.leftLid.scale.y = 1;
          this.rightLid.scale.y = 1;
          if (this.blinkTimer > 3.35) {
            this.isBlinking = false;
            this.leftLid.scale.y = 0.01;
            this.rightLid.scale.y = 0.01;
            this.blinkTimer = 0;
          }
        }
      }

      this.renderer.render(this.scene, this.camera);
    }

    onResize() {
      if (!this.container || !this.renderer || !this.camera) return;
      this.width = this.container.clientWidth;
      this.height = this.container.clientHeight;
      this.camera.aspect = this.width / this.height;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(this.width, this.height);
    }

    destroy() {
      if (this.animationFrameId) {
        cancelAnimationFrame(this.animationFrameId);
        this.animationFrameId = null;
      }
      if (this.onResizeHandler) {
        window.removeEventListener('resize', this.onResizeHandler);
      }
      if (this.renderer) {
        if (this.renderer.domElement && this.renderer.domElement.parentNode) {
          this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
        }
        this.renderer.dispose();
        this.renderer = null;
      }
    }
  }

  // --- Program Details Modal Data ---
  const programModalElem = document.getElementById('programModal');
  const modalTitleElem = document.getElementById('modalTitle');
  const modalBodyElem = document.getElementById('modalBody');
  const closeModalBtnElem = document.getElementById('closeModalBtn');

  const programDetails = {
    playgroup: {
      kidIcon: '👧🎈',
      bubble: 'Yay! I love soft wooden blocks & sensory water play!',
      title: 'Playgroup Program (1.5 - 2.5 Years)',
      content: `
        <p><strong>Age Group:</strong> 18 Months to 30 Months</p>
        <p><strong>Ratio:</strong> 1 Educator per 6 Toddlers</p>
        <p><strong>Focus Areas:</strong> Sensory exploration, motor skills development, emotional bonding, and speech building.</p>
        <ul style="margin: 16px 0; padding-left: 20px;">
          <li>🌟 Daily Circle Time & Rhymes</li>
          <li>🎨 Texture & Finger Paint Explorations</li>
          <li>🧩 Montessori Soft Wooden Toys</li>
          <li>🍎 Organic Snack Time & Nap Pods</li>
        </ul>
        <p style="color: var(--coral-red); font-weight: 700;">Monthly Fee: $380 / month</p>
      `
    },
    nursery: {
      kidIcon: '👦🚀',
      bubble: 'I can count 1 to 20 and sing 5 rhymes!',
      title: 'Nursery Program (2.5 - 3.5 Years)',
      content: `
        <p><strong>Age Group:</strong> 2.5 to 3.5 Years</p>
        <p><strong>Ratio:</strong> 1 Educator per 8 Children</p>
        <p><strong>Focus Areas:</strong> Vocabulary expansion, color recognition, social play, and basic counting foundation.</p>
        <ul style="margin: 16px 0; padding-left: 20px;">
          <li>📚 Phonics & Alphabet Discovery</li>
          <li>🌱 Nature & Garden Sensory Walk</li>
          <li>🎵 Music, Rhythm & Percussion Class</li>
          <li>💧 Safe Outdoor Water & Sand Fun</li>
        </ul>
        <p style="color: var(--royal-purple); font-weight: 700;">Monthly Fee: $420 / month</p>
      `
    },
    juniorKg: {
      kidIcon: '👧🔬',
      bubble: 'Look at my science experiment & drawing easel!',
      title: 'Junior KG (3.5 - 4.5 Years)',
      content: `
        <p><strong>Age Group:</strong> 3.5 to 4.5 Years</p>
        <p><strong>Ratio:</strong> 1 Educator per 10 Students</p>
        <p><strong>Focus Areas:</strong> Early reading, number bonds, creative writing readiness, and STEM inquiry.</p>
        <ul style="margin: 16px 0; padding-left: 20px;">
          <li>🔬 Junior STEM & Wonder Lab</li>
          <li>✏️ Pre-Writing Strokes & Tracing</li>
          <li>🎭 Story Theater & Drama Workshops</li>
          <li>🤖 Interactive Smart Screen Games</li>
        </ul>
        <p style="color: #10B981; font-weight: 700;">Monthly Fee: $450 / month</p>
      `
    },
    seniorKg: {
      kidIcon: '👦🎓',
      bubble: 'I am reading full sentences & ready for 1st Grade!',
      title: 'Senior KG (4.5 - 5.5 Years)',
      content: `
        <p><strong>Age Group:</strong> 4.5 to 5.5 Years</p>
        <p><strong>Ratio:</strong> 1 Educator per 12 Students</p>
        <p><strong>Focus Areas:</strong> Primary school readiness, fluent reading, logical math, and public speaking confidence.</p>
        <ul style="margin: 16px 0; padding-left: 20px;">
          <li>🎓 Primary Grade Bridge Curriculum</li>
          <li>🧠 Logic Puzzles & Coding Toys</li>
          <li>🌍 World & Cultural Appreciation</li>
          <li>🎨 Fine Arts & Clay Sculpting</li>
        </ul>
        <p style="color: #D97706; font-weight: 700;">Monthly Fee: $480 / month</p>
      `
    }
  };

  // --- REALISTIC HUMAN BOY "VIEW DETAILS" INTERACTION ENGINE ---
  let isViewDetailsAnimating = false;

  function triggerRealisticBoyInteraction(button, progKey) {
    // Calculate button screen coordinates
    const rect = button ? button.getBoundingClientRect() : { left: window.innerWidth / 2, top: window.innerHeight / 2, width: 0, height: 0 };

    // 1. OPEN MODAL INSTANTLY ON 1ST CLICK (0ms delay)
    openProgramDetailsModal(progKey, { clientX: rect.left + rect.width / 2, clientY: rect.top + rect.height / 2 });

    // Tactile button press feedback
    if (button) {
      button.style.transform = 'scale(0.92)';
      setTimeout(() => { button.style.transform = ''; }, 200);
    }

    if (isViewDetailsAnimating) return;
    isViewDetailsAnimating = true;

    // 2. Animate Boy Character Presentation
    const isMobile = window.innerWidth <= 768;
    const boyWidth = isMobile ? 105 : 140;
    const boyHeight = isMobile ? 160 : 220;

    const targetX = Math.max(10, rect.left - (boyWidth * 0.75));
    const targetY = Math.max(10, rect.top + (rect.height / 2) - (boyHeight * 0.6));

    let overlay = document.getElementById('realisticBoyOverlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'realisticBoyOverlay';
      overlay.className = 'realistic-boy-overlay';
      document.body.appendChild(overlay);
    }
    overlay.innerHTML = '';

    const boyElem = document.createElement('div');
    boyElem.className = 'realistic-boy-character is-walking';
    boyElem.innerHTML = `
      <div class="walking-boy-bubble">Opening details! 👦✨</div>
      <img src="assets/realistic-boy.png" alt="Boy Character" style="width:100%; height:100%; object-fit:contain;" />
    `;

    const startX = Math.max(0, targetX - 150);
    const startY = targetY;
    boyElem.style.transform = `translate3d(${startX}px, ${startY}px, 0)`;
    overlay.appendChild(boyElem);

    setTimeout(() => {
      boyElem.style.transform = `translate3d(${targetX}px, ${targetY}px, 0)`;
    }, 30);

    setTimeout(() => {
      boyElem.classList.remove('is-walking');
      boyElem.classList.add('is-tapping');
    }, 400);

    setTimeout(() => {
      boyElem.style.opacity = '0';
      setTimeout(() => {
        if (overlay) overlay.innerHTML = '';
        isViewDetailsAnimating = false;
      }, 300);
    }, 1000);
  }

  // Function to open Program Details Modal with realistic boy presentation
  function openProgramDetailsModal(progKey, clickEvent) {
    const item = programDetails[progKey] || programDetails['playgroup'];

    if (modalTitleElem) modalTitleElem.innerText = item.title;
    if (modalBodyElem) {
      modalBodyElem.innerHTML = `
        <div style="display: flex; gap: 20px; align-items: center; flex-wrap: wrap;">
          <div style="flex: 0 0 160px; text-align: center; background: linear-gradient(135deg, #FFF0F5, #E0F7FA); padding: 15px; border-radius: 16px; border: 2px solid #FFFFFF; box-shadow: 0 8px 20px rgba(0,0,0,0.08);">
            <img src="assets/realistic-boy.png" alt="Realistic Boy" style="width: 130px; height: 195px; object-fit: contain; filter: drop-shadow(0 6px 12px rgba(0,0,0,0.15));" />
            <p style="font-size: 0.85rem; font-weight: 700; color: var(--royal-purple); margin-top: 6px;">Hi! I love this activity! ✨</p>
          </div>
          <div style="flex: 1; min-width: 260px;" class="modal-details-content">
            ${item.content}
          </div>
        </div>
      `;
    }

    if (programModalElem) programModalElem.classList.add('active');
    playHappyChime();
    triggerConfettiBurst(clickEvent ? clickEvent.clientX : window.innerWidth / 2, clickEvent ? clickEvent.clientY : window.innerHeight / 2);
  }

  // Open Program Modal on "View Details" button click with Realistic Boy Interaction
  document.querySelectorAll('.open-program-modal').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const progKey = btn.getAttribute('data-program');
      triggerRealisticBoyInteraction(btn, progKey);
    });
  });

  // Feature Cards Click Listeners for Kids Interactive Demos (Shapes, Music, Park, Camera)
  document.querySelectorAll('.feature-card').forEach((card, idx) => {
    card.addEventListener('click', (e) => {
      triggerConfettiBurst(e.clientX, e.clientY);
      playHappyChime();

      // Clean up existing 3D Animator
      if (active3DAnimator) {
        active3DAnimator.destroy();
        active3DAnimator = null;
      }

      const featureDemos = [
        {
          icon: '🧩',
          kidIcon: '👶✨',
          bubble: 'Tap the shapes below to hear their sound & spelling!',
          title: 'Fun Learning Toys & Puzzles Demo',
          html: `
            <p>Our tactile Montessori toys help toddlers learn spatial relationships and shape names!</p>
            <div style="display: flex; justify-content: center; gap: 20px; font-size: 3.5rem; margin: 24px 0;">
              <span class="interactive-toy" style="cursor: pointer; transition: transform 0.2s; display: inline-block;" onclick="this.style.transform='scale(1.4) rotate(20deg)'; setTimeout(()=>this.style.transform='',300); playShapeAudio('Square', 'S, Q, U, A, R, E', 300);">🟥</span>
              <span class="interactive-toy" style="cursor: pointer; transition: transform 0.2s; display: inline-block;" onclick="this.style.transform='scale(1.4) rotate(-20deg)'; setTimeout(()=>this.style.transform='',300); playShapeAudio('Circle', 'C, I, R, C, L, E', 400);">🟡</span>
              <span class="interactive-toy" style="cursor: pointer; transition: transform 0.2s; display: inline-block;" onclick="this.style.transform='scale(1.4) rotate(20deg)'; setTimeout(()=>this.style.transform='',300); playShapeAudio('Diamond', 'D, I, A, M, O, N, D', 500);">🔷</span>
              <span class="interactive-toy" style="cursor: pointer; transition: transform 0.2s; display: inline-block;" onclick="this.style.transform='scale(1.4) rotate(-20deg)'; setTimeout(()=>this.style.transform='',300); playShapeAudio('Star', 'S, T, A, R', 600);">⭐</span>
            </div>
            <p style="text-align: center; color: var(--text-muted); font-size: 0.95rem; font-weight: 600;">(Tap 🟥 Square, 🟡 Circle, 🔷 Diamond, or ⭐ Star to hear sound & spelling!)</p>
          `
        },
        {
          icon: '🎵',
          kidIcon: '👧🎶',
          bubble: 'Tap Piano, Drum, or Xylophone to switch views & play pure musical sounds!',
          title: 'Music, Songs & Dance Demo',
          html: `
            <p style="text-align: center; color: var(--text-color); font-weight: 600;">Daily rhythm & song sessions stimulate toddler brain development!</p>

            <div style="display: flex; justify-content: center; gap: 14px; margin: 18px 0; flex-wrap: wrap;">
              <button id="pianoInstTab" class="btn-primary active-inst-tab" style="padding: 12px 24px; font-size: 1.15rem; transform: scale(1.08); box-shadow: 0 6px 16px rgba(0,0,0,0.2); transition: all 0.2s;" onclick="switchInstrumentTab('piano');">🎹 Piano</button>
              <button id="drumInstTab" class="btn-primary" style="padding: 12px 24px; font-size: 1.15rem; background: var(--royal-purple); transition: all 0.2s;" onclick="switchInstrumentTab('drum');">🥁 Drum Kit</button>
              <button id="xylophoneInstTab" class="btn-primary" style="padding: 12px 24px; font-size: 1.15rem; background: #10B981; transition: all 0.2s;" onclick="switchInstrumentTab('xylophone');">🎷 Xylophone</button>
            </div>

            <!-- 1. Piano View (Active by default) -->
            <div id="pianoInstView" class="inst-view" style="display: block; margin-top: 15px; background: rgba(255,255,255,0.85); padding: 18px 14px; border-radius: 18px; border: 2px solid #E2E8F0; text-align: center;">
              <p style="font-weight:700; color:var(--text-color); margin-bottom: 12px; font-size: 1.05rem;">🎹 Full Playable Piano Keyboard Setup:</p>
              <div style="display: flex; justify-content: center; gap: 6px; user-select: none;">
                <button style="background: white; border: 2px solid #CBD5E1; border-radius: 0 0 8px 8px; width: 40px; height: 105px; font-weight: 700; font-size: 1.1rem; color: #1E293B; cursor: pointer; box-shadow: 0 4px 6px rgba(0,0,0,0.12);" onclick="this.style.transform='translateY(4px)'; setTimeout(()=>this.style.transform='',150); playPianoKey('C', 261.63);">C</button>
                <button style="background: white; border: 2px solid #CBD5E1; border-radius: 0 0 8px 8px; width: 40px; height: 105px; font-weight: 700; font-size: 1.1rem; color: #1E293B; cursor: pointer; box-shadow: 0 4px 6px rgba(0,0,0,0.12);" onclick="this.style.transform='translateY(4px)'; setTimeout(()=>this.style.transform='',150); playPianoKey('D', 293.66);">D</button>
                <button style="background: white; border: 2px solid #CBD5E1; border-radius: 0 0 8px 8px; width: 40px; height: 105px; font-weight: 700; font-size: 1.1rem; color: #1E293B; cursor: pointer; box-shadow: 0 4px 6px rgba(0,0,0,0.12);" onclick="this.style.transform='translateY(4px)'; setTimeout(()=>this.style.transform='',150); playPianoKey('E', 329.63);">E</button>
                <button style="background: white; border: 2px solid #CBD5E1; border-radius: 0 0 8px 8px; width: 40px; height: 105px; font-weight: 700; font-size: 1.1rem; color: #1E293B; cursor: pointer; box-shadow: 0 4px 6px rgba(0,0,0,0.12);" onclick="this.style.transform='translateY(4px)'; setTimeout(()=>this.style.transform='',150); playPianoKey('F', 349.23);">F</button>
                <button style="background: white; border: 2px solid #CBD5E1; border-radius: 0 0 8px 8px; width: 40px; height: 105px; font-weight: 700; font-size: 1.1rem; color: #1E293B; cursor: pointer; box-shadow: 0 4px 6px rgba(0,0,0,0.12);" onclick="this.style.transform='translateY(4px)'; setTimeout(()=>this.style.transform='',150); playPianoKey('G', 392.00);">G</button>
                <button style="background: white; border: 2px solid #CBD5E1; border-radius: 0 0 8px 8px; width: 40px; height: 105px; font-weight: 700; font-size: 1.1rem; color: #1E293B; cursor: pointer; box-shadow: 0 4px 6px rgba(0,0,0,0.12);" onclick="this.style.transform='translateY(4px)'; setTimeout(()=>this.style.transform='',150); playPianoKey('A', 440.00);">A</button>
                <button style="background: white; border: 2px solid #CBD5E1; border-radius: 0 0 8px 8px; width: 40px; height: 105px; font-weight: 700; font-size: 1.1rem; color: #1E293B; cursor: pointer; box-shadow: 0 4px 6px rgba(0,0,0,0.12);" onclick="this.style.transform='translateY(4px)'; setTimeout(()=>this.style.transform='',150); playPianoKey('B', 493.88);">B</button>
                <button style="background: white; border: 2px solid #CBD5E1; border-radius: 0 0 8px 8px; width: 40px; height: 105px; font-weight: 700; font-size: 1.1rem; color: #1E293B; cursor: pointer; box-shadow: 0 4px 6px rgba(0,0,0,0.12);" onclick="this.style.transform='translateY(4px)'; setTimeout(()=>this.style.transform='',150); playPianoKey('C High', 523.25);">C</button>
              </div>
              <p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 12px; font-weight: 600;">(Tap keys to play pure piano musical notes!)</p>
            </div>

            <!-- 2. Drum View (Hidden by default) -->
            <div id="drumInstView" class="inst-view" style="display: none; margin-top: 15px; background: rgba(255,255,255,0.85); padding: 18px 14px; border-radius: 18px; border: 2px solid #E2E8F0; text-align: center;">
              <p style="font-weight:700; color:var(--text-color); margin-bottom: 12px; font-size: 1.05rem;">🥁 Playable Drum Kit Setup:</p>
              <div style="display: flex; justify-content: center; gap: 14px; user-select: none; flex-wrap: wrap;">
                <button style="background: #6C5CE7; color: white; border: none; border-radius: 16px; padding: 16px 22px; font-weight: 700; font-size: 1.1rem; cursor: pointer; box-shadow: 0 4px 10px rgba(108,92,231,0.3);" onclick="this.style.transform='scale(0.92)'; setTimeout(()=>this.style.transform='',150); playDrumPad('kick');">💥 Kick Drum</button>
                <button style="background: #FD79A8; color: white; border: none; border-radius: 16px; padding: 16px 22px; font-weight: 700; font-size: 1.1rem; cursor: pointer; box-shadow: 0 4px 10px rgba(253,121,168,0.3);" onclick="this.style.transform='scale(0.92)'; setTimeout(()=>this.style.transform='',150); playDrumPad('snare');">🥁 Snare</button>
                <button style="background: #00CEC9; color: white; border: none; border-radius: 16px; padding: 16px 22px; font-weight: 700; font-size: 1.1rem; cursor: pointer; box-shadow: 0 4px 10px rgba(0,206,201,0.3);" onclick="this.style.transform='scale(0.92)'; setTimeout(()=>this.style.transform='',150); playDrumPad('hihat');">🔔 Hi-Hat</button>
                <button style="background: #E17055; color: white; border: none; border-radius: 16px; padding: 16px 22px; font-weight: 700; font-size: 1.1rem; cursor: pointer; box-shadow: 0 4px 10px rgba(225,112,85,0.3);" onclick="this.style.transform='scale(0.92)'; setTimeout(()=>this.style.transform='',150); playDrumPad('bongo');">🪘 Bongo</button>
              </div>
              <p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 12px; font-weight: 600;">(Tap pads to play energetic drum rhythm beats!)</p>
            </div>

            <!-- 3. Xylophone View (Hidden by default) -->
            <div id="xylophoneInstView" class="inst-view" style="display: none; margin-top: 15px; background: rgba(255,255,255,0.85); padding: 18px 14px; border-radius: 18px; border: 2px solid #E2E8F0; text-align: center;">
              <p style="font-weight:700; color:var(--text-color); margin-bottom: 12px; font-size: 1.05rem;">🎷 Playable Rainbow Xylophone Setup:</p>
              <div style="display: flex; justify-content: center; align-items: flex-end; gap: 8px; height: 105px; user-select: none;">
                <button style="background: #FF4757; border: none; border-radius: 8px; width: 38px; height: 105px; color: white; font-weight: 700; font-size: 1.05rem; cursor: pointer; box-shadow: 0 3px 6px rgba(0,0,0,0.15);" onclick="this.style.transform='scale(0.93)'; setTimeout(()=>this.style.transform='',150); playXylophoneKey('C', 523.25);">C</button>
                <button style="background: #FFA502; border: none; border-radius: 8px; width: 38px; height: 95px; color: white; font-weight: 700; font-size: 1.05rem; cursor: pointer; box-shadow: 0 3px 6px rgba(0,0,0,0.15);" onclick="this.style.transform='scale(0.93)'; setTimeout(()=>this.style.transform='',150); playXylophoneKey('D', 587.33);">D</button>
                <button style="background: #2ED573; border: none; border-radius: 8px; width: 38px; height: 85px; color: white; font-weight: 700; font-size: 1.05rem; cursor: pointer; box-shadow: 0 3px 6px rgba(0,0,0,0.15);" onclick="this.style.transform='scale(0.93)'; setTimeout(()=>this.style.transform='',150); playXylophoneKey('E', 659.25);">E</button>
                <button style="background: #1E90FF; border: none; border-radius: 8px; width: 38px; height: 75px; color: white; font-weight: 700; font-size: 1.05rem; cursor: pointer; box-shadow: 0 3px 6px rgba(0,0,0,0.15);" onclick="this.style.transform='scale(0.93)'; setTimeout(()=>this.style.transform='',150); playXylophoneKey('F', 698.46);">F</button>
                <button style="background: #3742FA; border: none; border-radius: 8px; width: 38px; height: 65px; color: white; font-weight: 700; font-size: 1.05rem; cursor: pointer; box-shadow: 0 3px 6px rgba(0,0,0,0.15);" onclick="this.style.transform='scale(0.93)'; setTimeout(()=>this.style.transform='',150); playXylophoneKey('G', 783.99);">G</button>
                <button style="background: #9B59B6; border: none; border-radius: 8px; width: 38px; height: 55px; color: white; font-weight: 700; font-size: 1.05rem; cursor: pointer; box-shadow: 0 3px 6px rgba(0,0,0,0.15);" onclick="this.style.transform='scale(0.93)'; setTimeout(()=>this.style.transform='',150); playXylophoneKey('A', 880.00);">A</button>
                <button style="background: #FF6B81; border: none; border-radius: 8px; width: 38px; height: 45px; color: white; font-weight: 700; font-size: 1.05rem; cursor: pointer; box-shadow: 0 3px 6px rgba(0,0,0,0.15);" onclick="this.style.transform='scale(0.93)'; setTimeout(()=>this.style.transform='',150); playXylophoneKey('B', 987.77);">B</button>
                <button style="background: #FF6348; border: none; border-radius: 8px; width: 38px; height: 35px; color: white; font-weight: 700; font-size: 1.05rem; cursor: pointer; box-shadow: 0 3px 6px rgba(0,0,0,0.15);" onclick="this.style.transform='scale(0.93)'; setTimeout(()=>this.style.transform='',150); playXylophoneKey('C High', 1046.50);">C</button>
              </div>
              <p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 12px; font-weight: 600;">(Tap bars to play bright rainbow xylophone chimes!)</p>
            </div>
          `
        },
        {
          icon: '🌳',
          kidIcon: '👦🪁',
          bubble: 'Tap the park items to hear their sound & name!',
          title: 'Safe Outdoor Playground Demo',
          html: `
            <p>Soft turf grass, splash fountains, and sensory flower gardens!</p>
            <div style="display: flex; justify-content: center; gap: 24px; font-size: 3.5rem; margin: 24px 0;">
              <span style="cursor: pointer; transition: transform 0.2s; display: inline-block;" onclick="this.style.transform='scale(1.4) rotate(15deg)'; setTimeout(()=>this.style.transform='',300); speakAndPlay('Wooden Slide! Wheeee!', 500);">🛝</span>
              <span style="cursor: pointer; transition: transform 0.2s; display: inline-block;" onclick="this.style.transform='scale(1.4) rotate(-15deg)'; setTimeout(()=>this.style.transform='',300); speakAndPlay('Water Fountain! Splash!', 600);">⛲</span>
              <span style="cursor: pointer; transition: transform 0.2s; display: inline-block;" onclick="this.style.transform='scale(1.4) rotate(15deg)'; setTimeout(()=>this.style.transform='',300); speakAndPlay('Sunflower! So pretty!', 700);">🌻</span>
            </div>
          `
        },
        {
          icon: '📹',
          kidIcon: '👩‍👦📱',
          bubble: 'HD Live Video Streaming to your mobile phone!',
          title: 'Live Parent Camera App Demo',
          html: `
            <div style="background: #1E293B; color: #FFFFFF; padding: 20px; border-radius: 16px; text-align: center;">
              <div style="font-size: 0.9rem; color: #10B981; margin-bottom: 8px;">● LIVE STREAM ACTIVE (CCTV CAM 02)</div>
              <img src="assets/hero.jpg" style="border-radius: 12px; height: 180px; width: 100%; object-fit: cover;" />
              <div style="margin-top: 10px; font-size: 0.85rem; color: #94A3B8;">Encrypted 256-bit SSL parent connection</div>
            </div>
          `
        }
      ];

      const demo = featureDemos[idx] || featureDemos[0];
      if (modalTitleElem) modalTitleElem.innerText = demo.title;
      if (modalBodyElem) modalBodyElem.innerHTML = demo.html;
      if (programModalElem) programModalElem.classList.add('active');
    });
  });

  // Function to close modal safely & destroy 3D Three.js resources
  function closeModalSafely() {
    if (programModalElem) {
      programModalElem.classList.remove('active');
    }
    if (active3DAnimator) {
      active3DAnimator.destroy();
      active3DAnimator = null;
    }
    playPopSound();
  }

  if (closeModalBtnElem) {
    closeModalBtnElem.addEventListener('click', closeModalSafely);
  }

  if (programModalElem) {
    programModalElem.addEventListener('click', (e) => {
      if (e.target === programModalElem) {
        closeModalSafely();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && programModalElem && programModalElem.classList.contains('active')) {
      closeModalSafely();
    }
  });

  // --- 6. Tuition Fee Estimator Calculator ---
  const feeProgramSelect = document.getElementById('calcProgram');
  const feeMealsCheck = document.getElementById('calcMeals');
  const feeTransportCheck = document.getElementById('calcTransport');
  const feeDaycareCheck = document.getElementById('calcDaycare');
  const totalFeeVal = document.getElementById('totalFeeVal');

  function calculateFee() {
    if (!feeProgramSelect || !totalFeeVal) return;
    let base = parseInt(feeProgramSelect.value) || 380;
    if (feeMealsCheck && feeMealsCheck.checked) base += 80;
    if (feeTransportCheck && feeTransportCheck.checked) base += 100;
    if (feeDaycareCheck && feeDaycareCheck.checked) base += 150;

    totalFeeVal.innerText = `$${base}`;
  }

  if (feeProgramSelect) {
    feeProgramSelect.addEventListener('change', () => {
      calculateFee();
      playPopSound();
    });
  }
  [feeMealsCheck, feeTransportCheck, feeDaycareCheck].forEach(chk => {
    if (chk) chk.addEventListener('change', () => {
      calculateFee();
      playPopSound();
    });
  });

  // --- 7. Admission Form Submission Handler (Send to WhatsApp) ---
  const admissionForm = document.getElementById('admissionForm');
  const confirmModal = document.getElementById('confirmModal');
  const confirmCloseBtn = document.getElementById('confirmCloseBtn');
  const confirmDetails = document.getElementById('confirmDetails');

  if (admissionForm) {
    admissionForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const parentName = document.getElementById('parentName')?.value || '';
      const parentPhone = document.getElementById('parentPhone')?.value || '';
      const parentEmail = document.getElementById('parentEmail')?.value || '';
      const childName = document.getElementById('childName')?.value || '';
      const childAge = document.getElementById('childAge')?.value || '';
      const selectedProgElem = document.getElementById('admissionProgram');
      const selectedProgText = selectedProgElem ? selectedProgElem.options[selectedProgElem.selectedIndex].text : '';
      const parentNotes = document.getElementById('parentNotes')?.value || 'None';

      // 1. Format complete WhatsApp Enquiry Message with all details
      const waMessage = `🎈 *KIDZ NOVA PRESCHOOL - NEW ADMISSION ENQUIRY* 🎈\n\n` +
        `👤 *Parent / Guardian:* ${parentName}\n` +
        `📱 *Mobile Phone:* ${parentPhone}\n` +
        `✉️ *Email Address:* ${parentEmail}\n\n` +
        `👶 *Child's Full Name:* ${childName}\n` +
        `🎂 *Child's Age / DOB:* ${childAge}\n` +
        `🎒 *Desired Program:* ${selectedProgText}\n` +
        `📝 *Special Notes:* ${parentNotes}\n\n` +
        `✨ *Sent via Kidz Nova Online Portal*`;

      const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(waMessage)}`;

      // 2. Open WhatsApp in new window with pre-filled enquiry text
      window.open(waUrl, '_blank');

      // 3. Display website confirmation popup
      if (confirmDetails) {
        confirmDetails.innerHTML = `
          <p style="margin-bottom: 10px; font-size: 1.1rem;">🎉 Thank you <strong>${parentName}</strong>!</p>
          <p>Application details for <strong>${childName}</strong> (${childAge}) for <strong>${selectedProgText}</strong> have been opened in <strong>WhatsApp 💬</strong>!</p>
          <p style="margin-top: 12px; color: var(--text-muted); font-size: 0.9rem;">Click Send in WhatsApp to deliver your enquiry directly to our admissions office.</p>
        `;
      }

      if (confirmModal) {
        confirmModal.classList.add('active');
      }

      playHappyChime();
      triggerConfettiBurst(window.innerWidth / 2, window.innerHeight / 2);
      admissionForm.reset();
    });
  }

  if (confirmCloseBtn) {
    confirmCloseBtn.addEventListener('click', () => {
      confirmModal.classList.remove('active');
    });
  }

  // --- 8. Smooth Scroll for Nav Links ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId.startsWith('#') && targetId.length > 1) {
        e.preventDefault();
        const targetSection = document.querySelector(targetId);
        if (targetSection) {
          targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });

  console.log('Kidz Nova Interactive Engine initialized successfully!');
});
