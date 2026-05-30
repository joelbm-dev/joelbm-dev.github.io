import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Gamepad2, RotateCcw, Volume2, VolumeX, Trophy, 
  Terminal, Star, Download, Send 
} from 'lucide-react';

/* ─────────────────────────────────────────────────────────────────────────────
   RETRO AUDIO SYNTHESIZER (WEB AUDIO API)
   Generates 8-bit arcade sounds dynamically without external files
───────────────────────────────────────────────────────────────────────────── */
class RetroSynth {
  ctx: AudioContext | null = null;
  muted: boolean = false;

  init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }

  playLaser() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(880, t);
    osc.frequency.exponentialRampToValueAtTime(110, t + 0.12);

    gain.gain.setValueAtTime(0.12, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.12);
  }

  playExplosion() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const bufferSize = this.ctx.sampleRate * 0.22;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(450, t);
    filter.frequency.exponentialRampToValueAtTime(20, t + 0.22);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.25, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.22);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    noise.start(t);
    noise.stop(t + 0.22);
  }

  playPowerup() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(150, t);
    osc.frequency.linearRampToValueAtTime(300, t + 0.08);
    osc.frequency.linearRampToValueAtTime(600, t + 0.16);
    osc.frequency.linearRampToValueAtTime(1200, t + 0.24);

    gain.gain.setValueAtTime(0.08, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.26);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.26);
  }

  playGameOver() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const notes = [392, 349, 311, 261]; // G4, F4, Eb4, C4
    
    notes.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(freq, t + idx * 0.16);

      gain.gain.setValueAtTime(0.1, t + idx * 0.16);
      gain.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.16 + 0.15);

      osc.connect(gain);
      gain.connect(this.ctx!.destination);

      osc.start(t + idx * 0.16);
      osc.stop(t + idx * 0.16 + 0.15);
    });
  }
}

const synth = new RetroSynth();

/* ─────────────────────────────────────────────────────────────────────────────
   GAME TYPES & CONSTANTS
───────────────────────────────────────────────────────────────────────────── */
interface Laser {
  x: number;
  y: number;
  speed: number;
  width: number;
  height: number;
  color: string;
}

interface Bug {
  x: number;
  y: number;
  name: string;
  width: number;
  height: number;
  speed: number;
  color: string;
  scoreValue: number;
  lives: number;
  maxLives: number;
  oscilationAmp: number;
  oscilationSpeed: number;
  angle: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  decay: number;
}

interface PowerUp {
  x: number;
  y: number;
  type: 'light' | 'guard' | 'cure';
  size: number;
  speed: number;
  color: string;
  pulseScale: number;
}

interface StarBackground {
  x: number;
  y: number;
  char: string;
  speed: number;
  size: number;
  color: string;
  twinkle: number;
}

const BUG_TYPES = [
  { name: 'Null Shadow', color: '#cc44ff', scoreValue: 30, lives: 3, speedMod: 0.8 },
  { name: 'Syntax Shade', color: '#ff44aa', scoreValue: 15, lives: 1, speedMod: 1.6 },
  { name: 'Merge Heartless', color: '#ff8800', scoreValue: 20, lives: 2, speedMod: 1.1 },
  { name: 'Memory Wraith', color: '#ff2266', scoreValue: 40, lives: 4, speedMod: 0.6 },
  { name: 'Endless Loop', color: '#aa22ff', scoreValue: 25, lives: 2, speedMod: 1.2 },
];

export default function Arcade() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  
  // Image assets for player ship and enemies
  const shipImageRef = useRef<HTMLImageElement | null>(null);
  const enemyImageRef = useRef<HTMLImageElement | null>(null);

  // Load images on mount
  useEffect(() => {
    const shipImg = new Image();
    shipImg.src = '/nave.png';
    shipImageRef.current = shipImg;

    const enemyImg = new Image();
    enemyImg.src = '/enemigo.png';
    enemyImageRef.current = enemyImg;
  }, []);
  
  // Game states
  const [gameState, setGameState] = useState<'start' | 'playing' | 'gameover'>('start');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [level, setLevel] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [shieldActive, setShieldActive] = useState(false);
  const [activePowerUp, setActivePowerUp] = useState<string | null>(null);
  const [unlockedReward, setUnlockedReward] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  // Key tracking
  const keysPressed = useRef<{ [key: string]: boolean }>({});

  // Core Game Variables (Refs for 60fps animation loop consistency)
  const scoreRef = useRef(0);
  const livesRef = useRef(3);
  const levelRef = useRef(1);
  const shipX = useRef(300); // Center of 600 width canvas
  const shipY = useRef(630); // fixed bottom
  const lasers = useRef<Laser[]>([]);
  const bugs = useRef<Bug[]>([]);
  const particles = useRef<Particle[]>([]);
  const powerUps = useRef<PowerUp[]>([]);
  const stars = useRef<StarBackground[]>([]);
  
  const lastShotTime = useRef(0);
  const doubleShotRef = useRef(false);
  const shieldRef = useRef(false);
  const doubleShotTimer = useRef<any>(null);
  const shieldTimer = useRef<any>(null);
  
  const frameId = useRef<number | null>(null);
  const spawnTimer = useRef<number>(0);
  const difficultyMultiplier = useRef(1);

  // Load High Score and check muted state on mount
  useEffect(() => {
    const savedHighScore = localStorage.getItem('arcade_highscore');
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore, 10));
    }
  }, []);

  // Sync mute state with synth singleton
  const toggleMute = () => {
    const nextMute = !isMuted;
    setIsMuted(nextMute);
    synth.muted = nextMute;
  };

  // Keyboard Event Handlers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressed.current[e.key] = true;
      if (e.key === ' ' && gameState === 'playing') {
        e.preventDefault(); // Prevent page scrolling
      }
    };
    
    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current[e.key] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      if (doubleShotTimer.current) clearTimeout(doubleShotTimer.current);
      if (shieldTimer.current) clearTimeout(shieldTimer.current);
    };
  }, [gameState]);

  // Handle high score saving and reward unlocking
  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('arcade_highscore', score.toString());
    }

    if (score >= 500 && !unlockedReward) {
      setUnlockedReward(true);
    }
  }, [score, highScore, unlockedReward]);

  // Generate Kingdom Hearts crystal starfield background
  const initStars = (width: number, height: number) => {
    const arr: StarBackground[] = [];
    const characters = ['✦', '✧', '◆', '◇', '♦', '★', '☆', '♡', '♥'];
    const colors = [
      `rgba(180,100,255,`,
      `rgba(255,180,50,`,
      `rgba(100,200,255,`,
      `rgba(255,80,200,`,
    ];
    for (let i = 0; i < 55; i++) {
      const c = colors[Math.floor(Math.random() * colors.length)];
      arr.push({
        x: Math.random() * width,
        y: Math.random() * height,
        char: characters[Math.floor(Math.random() * characters.length)],
        speed: Math.random() * 0.8 + 0.2,
        size: Math.random() * 12 + 6,
        color: `${c}${(Math.random() * 0.18 + 0.04).toFixed(2)})`,
        twinkle: Math.random() * Math.PI * 2,
      });
    }
    stars.current = arr;
  };

  // Sound triggering functions
  const shootLaser = () => {
    const now = Date.now();
    const fireInterval = doubleShotRef.current ? 120 : 180;
    if (now - lastShotTime.current < fireInterval) return;
    
    lastShotTime.current = now;
    synth.playLaser();

    const laserSpeed = 10;
    const laserWidth = 3;
    const laserHeight = 16;
    const color = doubleShotRef.current ? '#ffd700' : '#cc88ff';

    if (doubleShotRef.current) {
      // Triple thread shooting!
      lasers.current.push({
        x: shipX.current - 15,
        y: shipY.current - 20,
        speed: laserSpeed,
        width: laserWidth,
        height: laserHeight,
        color
      });
      lasers.current.push({
        x: shipX.current,
        y: shipY.current - 25,
        speed: laserSpeed + 1,
        width: laserWidth,
        height: laserHeight,
        color
      });
      lasers.current.push({
        x: shipX.current + 15,
        y: shipY.current - 20,
        speed: laserSpeed,
        width: laserWidth,
        height: laserHeight,
        color
      });
    } else {
      // Normal single thread compile
      lasers.current.push({
        x: shipX.current,
        y: shipY.current - 25,
        speed: laserSpeed,
        width: laserWidth,
        height: laserHeight,
        color
      });
    }
  };

  // Spark beautiful vector neon particles upon destroying a bug
  const spawnExplosion = (x: number, y: number, color: string) => {
    synth.playExplosion();
    const count = Math.floor(Math.random() * 6) + 12; // 12-18 particles
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 4 + 1.5;
      particles.current.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: Math.random() * 3 + 2,
        color,
        alpha: 1.0,
        decay: Math.random() * 0.03 + 0.015,
      });
    }
  };

  // Clear everything on board
  const playRefactorBomb = () => {
    synth.playExplosion();
    
    // Score all current bugs on screen
    bugs.current.forEach(bug => {
      scoreRef.current += Math.floor(bug.scoreValue * 0.5);
      setScore(scoreRef.current);
      spawnExplosion(bug.x, bug.y, bug.color);
    });
    
    // Reset bugs array
    bugs.current = [];
    
    // Draw refactor wave overlay trigger
    const count = 40;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      particles.current.push({
        x: 300,
        y: 350,
        vx: Math.cos(angle) * 8,
        vy: Math.sin(angle) * 8,
        size: 5,
        color: '#10b981',
        alpha: 1.0,
        decay: 0.015
      });
    }
  };

  // Start a fresh game session
  const startGame = () => {
    synth.init();
    
    // Reset state values
    scoreRef.current = 0;
    livesRef.current = 3;
    levelRef.current = 1;
    difficultyMultiplier.current = 1;
    shipX.current = 300;
    
    setScore(0);
    setLives(3);
    setLevel(1);
    
    lasers.current = [];
    bugs.current = [];
    particles.current = [];
    powerUps.current = [];
    
    doubleShotRef.current = false;
    shieldRef.current = false;
    setShieldActive(false);
    setActivePowerUp(null);

    if (doubleShotTimer.current) clearTimeout(doubleShotTimer.current);
    if (shieldTimer.current) clearTimeout(shieldTimer.current);

    setGameState('playing');
  };

  // Trigger game over sequences
  const triggerGameOver = () => {
    synth.playGameOver();
    setGameState('gameover');
    if (frameId.current) {
      cancelAnimationFrame(frameId.current);
      frameId.current = null;
    }
  };

  // Main Canvas Render and Game Physics Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set high-DPI sizing
    canvas.width = 600;
    canvas.height = 700;
    
    initStars(canvas.width, canvas.height);

    const gameLoop = () => {
      // 1. CLEAR & BACKGROUND RENDER — Kingdom Hearts Dark World
      const bgGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
      bgGrad.addColorStop(0, '#08041a');
      bgGrad.addColorStop(0.5, '#0d0820');
      bgGrad.addColorStop(1, '#120628');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Ambient purple glow at center
      const glowGrad = ctx.createRadialGradient(300, 350, 30, 300, 350, 260);
      glowGrad.addColorStop(0, 'rgba(140,50,255,0.06)');
      glowGrad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = glowGrad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Render KH crystal starfield
      stars.current.forEach(star => {
        star.twinkle += 0.03;
        const alpha = 0.07 + Math.abs(Math.sin(star.twinkle)) * 0.18;
        // re-compute color with twinkling alpha
        const base = star.color.substring(0, star.color.lastIndexOf(','));
        ctx.fillStyle = `${base},${alpha.toFixed(2)})`;
        ctx.font = `${star.size}px serif`;
        ctx.textAlign = 'center';
        ctx.fillText(star.char, star.x, star.y);
        
        star.y += star.speed;
        if (star.y > canvas.height + 20) {
          star.y = -20;
          star.x = Math.random() * canvas.width;
        }
      });

      if (gameState === 'playing') {
        // 2. USER SHIP INPUTS PROCESSING
        const moveSpeed = 6.5;
        if (keysPressed.current['ArrowLeft'] || keysPressed.current['a'] || keysPressed.current['A']) {
          shipX.current = Math.max(25, shipX.current - moveSpeed);
        }
        if (keysPressed.current['ArrowRight'] || keysPressed.current['d'] || keysPressed.current['D']) {
          shipX.current = Math.min(canvas.width - 25, shipX.current + moveSpeed);
        }
        if (keysPressed.current[' ']) {
          shootLaser();
        }

        // 3. LAUNCH / UPDATE LASERS
        lasers.current.forEach((laser, index) => {
          laser.y -= laser.speed;
          
          // Draw Keyblade light beams
          ctx.shadowBlur = 18;
          ctx.shadowColor = laser.color;
          ctx.fillStyle = laser.color;
          // Tapered beam shape
          ctx.beginPath();
          ctx.moveTo(laser.x - laser.width, laser.y);
          ctx.lineTo(laser.x, laser.y - laser.height);
          ctx.lineTo(laser.x + laser.width, laser.y);
          ctx.closePath();
          ctx.fill();
          ctx.shadowBlur = 0; // reset shadow

          // Remove off-screen lasers
          if (laser.y < -30) {
            lasers.current.splice(index, 1);
          }
        });

        // 4. POWER-UP ITEM DRAWING AND COLLISION
        powerUps.current.forEach((item, index) => {
          item.y += item.speed;
          item.pulseScale = 1.0 + Math.sin(Date.now() * 0.01) * 0.15;

          // Draw floating neon badge
          ctx.save();
          ctx.shadowBlur = 15;
          ctx.shadowColor = item.color;
          ctx.fillStyle = item.color;
          ctx.beginPath();
          ctx.arc(item.x, item.y, item.size * item.pulseScale, 0, Math.PI * 2);
          ctx.fill();

          // Icon indicator letter inside
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 10px monospace';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          let letter = '✦';
          if (item.type === 'light') letter = '☀';
          if (item.type === 'guard') letter = '🛡';
          if (item.type === 'cure') letter = '♥';
          ctx.fillText(letter, item.x, item.y);
          ctx.restore();

          // Check collision with player ship
          const distToShip = Math.hypot(item.x - shipX.current, item.y - shipY.current);
          if (distToShip < item.size + 20) {
            synth.playPowerup();
            powerUps.current.splice(index, 1);

            // Execute power-up effect
            if (item.type === 'light') {
              doubleShotRef.current = true;
              setActivePowerUp('Ragnarok');
              if (doubleShotTimer.current) clearTimeout(doubleShotTimer.current);
              doubleShotTimer.current = setTimeout(() => {
                doubleShotRef.current = false;
                setActivePowerUp(prev => prev === 'Ragnarok' ? null : prev);
              }, 8000);
            } else if (item.type === 'guard') {
              shieldRef.current = true;
              setShieldActive(true);
              setActivePowerUp('Reflect');
              if (shieldTimer.current) clearTimeout(shieldTimer.current);
              shieldTimer.current = setTimeout(() => {
                shieldRef.current = false;
                setShieldActive(false);
                setActivePowerUp(prev => prev === 'Reflect' ? null : prev);
              }, 8000);
            } else if (item.type === 'cure') {
              playRefactorBomb();
            }
          }

          // Offscreen clean
          if (item.y > canvas.height + 40) {
            powerUps.current.splice(index, 1);
          }
        });

        // 5. UPDATE BUGS / ENEMIES
        spawnTimer.current++;
        // Spawn rate based on levels
        const spawnInterval = Math.max(35, 100 - levelRef.current * 10);
        if (spawnTimer.current >= spawnInterval) {
          spawnTimer.current = 0;
          const template = BUG_TYPES[Math.floor(Math.random() * BUG_TYPES.length)];
          const bugWidth = 24 + Math.random() * 12;
          const bugHeight = 24 + Math.random() * 12;

          bugs.current.push({
            x: Math.random() * (canvas.width - 60) + 30,
            y: -40,
            name: template.name,
            width: bugWidth,
            height: bugHeight,
            speed: (Math.random() * 1.5 + 1.2) * template.speedMod * difficultyMultiplier.current,
            color: template.color,
            scoreValue: template.scoreValue,
            lives: template.lives,
            maxLives: template.lives,
            oscilationAmp: Math.random() > 0.5 ? Math.random() * 2 : 0, // woven path
            oscilationSpeed: Math.random() * 0.05 + 0.02,
            angle: 0
          });
        }

        bugs.current.forEach((bug, bIdx) => {
          bug.y += bug.speed;
          if (bug.oscilationAmp > 0) {
            bug.angle += bug.oscilationSpeed;
            bug.x += Math.sin(bug.angle) * bug.oscilationAmp;
            
            // Constrain
            bug.x = Math.max(bug.width, Math.min(canvas.width - bug.width, bug.x));
          }

          // Draw neon enemy bugs
          ctx.save();
          ctx.shadowBlur = 10;
          ctx.shadowColor = bug.color;
          ctx.fillStyle = bug.color;
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 1;
          
          if (enemyImageRef.current && enemyImageRef.current.complete && enemyImageRef.current.naturalWidth !== 0) {
            // Draw custom enemy image
            ctx.drawImage(
              enemyImageRef.current,
              bug.x - bug.width / 2,
              bug.y - bug.height / 2,
              bug.width,
              bug.height
            );
          } else {
            // Bug capsule rectangle fallback
            ctx.beginPath();
            ctx.roundRect(bug.x - bug.width / 2, bug.y - bug.height / 2, bug.width, bug.height, 6);
            ctx.fill();
            ctx.stroke();
          }

          // HP indicators
          if (bug.maxLives > 1) {
            const barW = bug.width - 6;
            const healthRatio = bug.lives / bug.maxLives;
            ctx.fillStyle = 'rgba(0,0,0,0.5)';
            ctx.fillRect(bug.x - barW / 2, bug.y - bug.height / 2 - 8, barW, 4);
            ctx.fillStyle = '#10b981';
            ctx.fillRect(bug.x - barW / 2, bug.y - bug.height / 2 - 8, barW * healthRatio, 4);
          }

          // Text marker next to the bug
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 8px monospace';
          ctx.textAlign = 'center';
          ctx.fillText(
            bug.name.substring(0, 10) + '...',
            bug.x,
            bug.y + bug.height / 2 + 10
          );
          ctx.restore();

          // Collision detection: Laser hitting a Bug
          lasers.current.forEach((laser, lIdx) => {
            const hit = (
              laser.x > bug.x - bug.width / 2 - 6 &&
              laser.x < bug.x + bug.width / 2 + 6 &&
              laser.y < bug.y + bug.height / 2 &&
              laser.y > bug.y - bug.height / 2
            );

            if (hit) {
              lasers.current.splice(lIdx, 1);
              bug.lives -= 1;

              // Flash explosion sparks
              spawnExplosion(laser.x, bug.y, bug.color);

              if (bug.lives <= 0) {
                bugs.current.splice(bIdx, 1);
                scoreRef.current += bug.scoreValue;
                setScore(scoreRef.current);

                // Spawn Kingdom Hearts Drive Orb (10% probability)
                if (Math.random() < 0.10) {
                  const types: ('light' | 'guard' | 'cure')[] = ['light', 'guard', 'cure'];
                  const pickedType = types[Math.floor(Math.random() * types.length)];
                  const colors = { light: '#ffd700', guard: '#8866ff', cure: '#ff44aa' };
                  
                  powerUps.current.push({
                    x: bug.x,
                    y: bug.y,
                    type: pickedType,
                    size: 14,
                    speed: 2.2,
                    color: colors[pickedType],
                    pulseScale: 1
                  });
                }

                // Check leveling threshold
                const targetLevel = Math.floor(scoreRef.current / 150) + 1;
                if (targetLevel > levelRef.current) {
                  levelRef.current = targetLevel;
                  setLevel(targetLevel);
                  difficultyMultiplier.current = 1 + (targetLevel - 1) * 0.15;
                  
                  // Play Level Up sound blast
                  synth.playPowerup();
                }
              }
            }
          });

          // Collision detection: Bug reaching bottom (Security Breach!)
          if (bug.y > canvas.height + 30) {
            bugs.current.splice(bIdx, 1);
            if (shieldRef.current) {
              // Antivirus shield breaks instead of taking damage
              shieldRef.current = false;
              setShieldActive(false);
              setActivePowerUp(null);
              synth.playExplosion();
            } else {
              livesRef.current -= 1;
              setLives(livesRef.current);
              
              if (livesRef.current <= 0) {
                triggerGameOver();
              }
            }
          }

          // Collision detection: Bug hitting the Ship directly
          const distToShip = Math.hypot(bug.x - shipX.current, bug.y - shipY.current);
          if (distToShip < bug.width / 2 + 15) {
            bugs.current.splice(bIdx, 1);
            spawnExplosion(bug.x, bug.y, bug.color);

            if (shieldRef.current) {
              shieldRef.current = false;
              setShieldActive(false);
              setActivePowerUp(null);
            } else {
              livesRef.current -= 1;
              setLives(livesRef.current);
              if (livesRef.current <= 0) {
                triggerGameOver();
              }
            }
          }
        });

        // 6. RENDER REFLECT BARRIER (Kingdom Hearts Shield)
        if (shieldActive) {
          const t = Date.now() * 0.002;
          ctx.save();
          // Outer pulsing hexagon shield
          ctx.shadowBlur = 25;
          ctx.shadowColor = '#8866ff';
          ctx.strokeStyle = '#aa88ff';
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          for (let i = 0; i < 6; i++) {
            const angle = (i / 6) * Math.PI * 2 + t;
            const r = 38 + Math.sin(t * 3 + i) * 4;
            const hx = shipX.current + Math.cos(angle) * r;
            const hy = (shipY.current - 12) + Math.sin(angle) * r;
            i === 0 ? ctx.moveTo(hx, hy) : ctx.lineTo(hx, hy);
          }
          ctx.closePath();
          ctx.stroke();
          // Inner glow fill
          ctx.fillStyle = 'rgba(136,102,255,0.08)';
          ctx.fill();
          ctx.restore();
        }

        // 7. RENDER KEYBLADE CROWN SHIP
        const sx = shipX.current;
        const sy = shipY.current;
        const t2 = Date.now() * 0.0015;

        ctx.save();
        // --- Dual Gummi Engine Thrusters ---
        const drawEngineTrail = (ex: number, ey: number) => {
          const engineGrad = ctx.createLinearGradient(ex, ey, ex, ey + 18);
          engineGrad.addColorStop(0, 'rgba(255, 90, 50, 0.85)');
          engineGrad.addColorStop(0.5, 'rgba(255, 180, 50, 0.45)');
          engineGrad.addColorStop(1, 'rgba(140, 50, 255, 0)');
          ctx.fillStyle = engineGrad;
          ctx.beginPath();
          ctx.moveTo(ex - 4, ey);
          ctx.lineTo(ex + 4, ey);
          ctx.lineTo(ex + 2, ey + 14 + Math.sin(t2 * 6) * 3);
          ctx.lineTo(ex - 2, ey + 14 + Math.sin(t2 * 6 + 1.5) * 3);
          ctx.closePath();
          ctx.fill();
        };

        drawEngineTrail(sx - 16, sy + 12);
        drawEngineTrail(sx + 16, sy + 12);

        if (shipImageRef.current && shipImageRef.current.complete && shipImageRef.current.naturalWidth !== 0) {
          // Draw custom ship image
          ctx.drawImage(
            shipImageRef.current,
            sx - 22,
            sy - 22,
            44,
            44
          );

          // Small heart detail on the hull for Kingdom Hearts styling
          ctx.fillStyle = '#ff44aa';
          ctx.font = '7px serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('♥', sx, sy + 6);
        } else {
          // --- Gummi Ship Modular Blocky Body Construction (Fallback) ---
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 1;
          ctx.shadowBlur = 4;
          ctx.shadowColor = 'rgba(255, 255, 255, 0.3)';

          // 1. Blue Base Support Wing Block
          ctx.fillStyle = '#1e3a8a';
          ctx.beginPath();
          ctx.rect(sx - 26, sy - 2, 52, 6);
          ctx.fill();
          ctx.stroke();

          // 2. Red Side Boosters / Wedges (Left/Right)
          ctx.fillStyle = '#dc2626';
          // Left Booster
          ctx.beginPath();
          ctx.rect(sx - 20, sy - 8, 8, 18);
          ctx.fill();
          ctx.stroke();
          // Right Booster
          ctx.beginPath();
          ctx.rect(sx + 12, sy - 8, 8, 18);
          ctx.fill();
          ctx.stroke();

          // 3. Central Grey Main Hull Block
          ctx.fillStyle = '#4b5563';
          ctx.beginPath();
          ctx.rect(sx - 8, sy - 14, 16, 24);
          ctx.fill();
          ctx.stroke();

          // 4. Yellow/Gold Laser Blasters (front of side boosters)
          ctx.fillStyle = '#fbbf24';
          // Left Gun
          ctx.beginPath();
          ctx.rect(sx - 18, sy - 16, 4, 8);
          ctx.fill();
          ctx.stroke();
          // Right Gun
          ctx.beginPath();
          ctx.rect(sx + 14, sy - 16, 4, 8);
          ctx.fill();
          ctx.stroke();

          // 5. Bright Orange Cockpit Bubble Block (center front)
          ctx.fillStyle = '#f59e0b';
          ctx.shadowBlur = 12;
          ctx.shadowColor = '#f59e0b';
          ctx.beginPath();
          ctx.rect(sx - 5, sy - 22, 10, 8);
          ctx.fill();
          ctx.stroke();

          // 6. Cute white detail plates
          ctx.shadowBlur = 0;
          ctx.fillStyle = '#f3f4f6';
          ctx.beginPath();
          ctx.rect(sx - 3, sy - 6, 6, 5);
          ctx.fill();
          ctx.stroke();

          // 7. Small heart detail on the hull
          ctx.fillStyle = '#ff44aa';
          ctx.font = '7px serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('♥', sx, sy - 3);
        }

        ctx.restore();
      }

      // 8. PHYSICAL PARTICLE SYSTEM UPDATES
      particles.current.forEach((p, index) => {
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= p.decay;
        
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
        ctx.globalAlpha = 1.0; // reset

        if (p.alpha <= 0) {
          particles.current.splice(index, 1);
        }
      });

      // Keep looping if playing
      if (gameState === 'playing') {
        frameId.current = requestAnimationFrame(gameLoop);
      }
    };

    if (gameState === 'playing') {
      frameId.current = requestAnimationFrame(gameLoop);
    } else {
      // Static Kingdom Hearts dark world background
      const bgG = ctx.createLinearGradient(0, 0, 0, canvas.height);
      bgG.addColorStop(0, '#08041a');
      bgG.addColorStop(1, '#120628');
      ctx.fillStyle = bgG;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Subtle diamond dot grid
      ctx.fillStyle = 'rgba(180,100,255,0.04)';
      for (let x = 0; x < canvas.width; x += 28) {
        for (let y = 0; y < canvas.height; y += 28) {
          ctx.fillRect(x, y, 2, 2);
        }
      }
    }

    return () => {
      if (frameId.current) {
        cancelAnimationFrame(frameId.current);
      }
    };
  }, [gameState, shieldActive]);

  // Mobile Drag Support
  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (gameState !== 'playing') return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const touchX = e.touches[0].clientX - rect.left;
    
    // Scale client touch to internal 600 width coordinate space
    const scaledX = (touchX / rect.width) * canvas.width;
    shipX.current = Math.max(25, Math.min(canvas.width - 25, scaledX));
    
    // Continuous mobile firing helper
    shootLaser();
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText('joel.barreira@outlook.com');
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  return (
    <section id="arcade" className="py-24 relative transition-colors duration-300 overflow-hidden font-sans bg-kh-bg-primary text-kh-text">
      {/* Kingdom Hearts ambient glows */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-accent-500/5 dark:from-purple-900/20 via-transparent to-transparent pointer-events-none z-0" />
      <div className="absolute top-[10%] left-[5%] w-[420px] h-[420px] rounded-full blur-[120px] pointer-events-none bg-accent-500/5 dark:bg-purple-900/10" />
      <div className="absolute bottom-[10%] right-[5%] w-[380px] h-[380px] rounded-full blur-[100px] pointer-events-none bg-purple-500/5 dark:bg-amber-500/5" />
      <div className="absolute top-[40%] right-[15%] w-[200px] h-[200px] rounded-full blur-[80px] pointer-events-none bg-pink-500/5 dark:bg-pink-900/5" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Title Section */}
        <motion.div 
          className="mb-12 text-center flex flex-col items-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-bold tracking-widest uppercase mb-4 shadow-inner bg-accent-500/10 dark:bg-accent-500/5 border-accent-500/30 text-accent-600 dark:text-accent-400">
            <Gamepad2 size={14} className="animate-bounce" />
            ✦ Coliseo de Habilidades ✦
          </div>
          <h2 className="text-4xl md:text-6xl font-black flex items-center justify-center gap-4 tracking-tight font-cinzel-dec bg-clip-text text-transparent bg-gradient-to-r from-accent-500 via-accent-400 to-accent-600 drop-shadow-[0_0_15px_rgba(212,175,55,0.4)]">
            CODE KEYBLADE
          </h2>
          <p className="max-w-2xl mt-4 text-base md:text-lg font-medium leading-relaxed text-kh-muted">
            Los Sincorazón han invadido el reino del código. Pilota tu Nave Gummi digital y elimina las sombras. ¡Supera los <strong className="text-accent-500 dark:text-accent-400">500 Munny</strong> para desbloquear los secretos del Maestro!
          </p>
        </motion.div>

        {/* Arcade Console Container */}
        <div className="flex flex-col lg:flex-row justify-center items-stretch gap-10 max-w-6xl mx-auto">
          
          {/* LEFT: Game Screen cabinet wrapper */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65 }}
            className="flex-1 flex flex-col items-center"
          >
            {/* Screen bezel - Kingdom Hearts Gummi Ship Console */}
            <div className="relative p-2 sm:p-3 md:p-5 rounded-[24px] sm:rounded-[32px] md:rounded-[40px] w-full max-w-[500px] bg-gradient-to-b from-[#e3dac3] to-[#c7ba9d] dark:from-[#1a0a38] dark:to-[#0d0420] border-3 border-[#c3ac75]/60 dark:border-[#9966cc]/40 shadow-[0_0_40px_rgba(212,175,55,0.15),_inset_0_0_20px_rgba(0,0,0,0.1)] dark:shadow-[0_0_60px_rgba(140,50,255,0.2),_inset_0_0_30px_rgba(0,0,0,0.5)]">
              
              {/* Flashing power light */}
              <div className="absolute top-1.5 left-1/2 -translate-x-1/2 flex items-center gap-1 sm:gap-1.5 bg-black/40 dark:bg-black/60 px-2 sm:px-3 py-0.5 rounded-full border border-kh-border/40 max-w-[90%]">
                <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full shrink-0 ${gameState === 'playing' ? 'animate-pulse' : ''}`} style={{background: gameState === 'playing' ? '#cc44ff' : '#ff4466', boxShadow: gameState === 'playing' ? '0 0 8px #cc44ff' : '0 0 8px #ff4466'}} />
                <span className="text-[7px] sm:text-[9px] font-mono font-black tracking-wider text-accent-500 dark:text-[#cc88ff] truncate">✦ GUMMI CONSOLE — KINGDOM OS ✦</span>
              </div>

              {/* CRT Scanline Filters Container */}
              <div className="relative overflow-hidden rounded-[16px] sm:rounded-[20px] md:rounded-[26px] bg-[#0a0e1c] border-2 border-gray-900 shadow-inner group">
                
                {/* 1. CRT flickering grid overlay */}
                <div className="absolute inset-0 pointer-events-none z-30 opacity-[0.07] bg-[linear-gradient(rgba(18,16,16,0)_50%,_rgba(0,0,0,0.25)_50%),_linear-gradient(90deg,_rgba(255,0,0,0.06),_rgba(0,255,0,0.02),_rgba(0,0,255,0.06))] bg-[length:100%_4px,_3px_100%] select-none" />
                
                {/* 2. Glass scan reflections */}
                <div className="absolute inset-0 pointer-events-none z-30 bg-gradient-to-tr from-white/[0.01] via-transparent to-white/[0.04] select-none" />

                {/* THE GAME CANVAS ELEMENT */}
                <canvas 
                  ref={canvasRef}
                  onTouchStart={handleTouchMove}
                  onTouchMove={handleTouchMove}
                  className="w-full h-auto aspect-[600/700] block cursor-crosshair z-10"
                />

                {/* HUD: Overlay UI text for non-canvas interactions */}
                <AnimatePresence mode="wait">
                  
                  {/* START SCREEN PANEL */}
                  {gameState === 'start' && (
                    <motion.div 
                      key="start-screen"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 bg-[#0a0e1c]/90 backdrop-blur-sm z-20 flex flex-col justify-center items-center p-4 sm:p-6 text-center overflow-y-auto"
                    >
                      {/* KH Crown icon */}
                      <div className="text-4xl sm:text-6xl mb-2 sm:mb-4 animate-bounce" style={{filter: 'drop-shadow(0 0 20px rgba(255,215,0,0.7))'}}>👑</div>
                      <h3 className="text-xl sm:text-3xl font-black tracking-widest mb-1" style={{fontFamily: "'Cinzel Decorative', serif", background: 'linear-gradient(135deg, #ffd700, #cc88ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>CODE KEYBLADE</h3>
                      <p className="font-bold text-[10px] sm:text-xs tracking-widest uppercase mb-4 sm:mb-6" style={{color: '#cc88ff', fontFamily: 'monospace'}}>
                        ✦ Pilota la Nave Gummi. Derrota las Sombras. ✦
                      </p>

                      <div className="space-y-2.5 sm:space-y-4 w-full max-w-sm mb-4 sm:mb-8 text-left p-3 sm:p-5 rounded-2xl" style={{background: 'rgba(30,10,60,0.8)', border: '1px solid rgba(180,100,255,0.25)'}}>
                        <div className="flex items-center gap-2 sm:gap-3 text-xs" style={{color: '#c0a0e0'}}>
                          <kbd className="px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-[10px] font-bold shadow font-mono" style={{background: '#2a1050', border: '1px solid rgba(180,100,255,0.4)', color: '#ffd700'}}>←</kbd>
                          <kbd className="px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-[10px] font-bold shadow font-mono" style={{background: '#2a1050', border: '1px solid rgba(180,100,255,0.4)', color: '#ffd700'}}>→</kbd>
                          <span className="font-semibold">Mover Nave</span>
                        </div>
                        <div className="flex items-center gap-2 sm:gap-3 text-xs" style={{color: '#c0a0e0'}}>
                          <kbd className="px-3 sm:px-5 py-0.5 sm:py-1 rounded text-[10px] font-bold shadow font-mono" style={{background: '#2a1050', border: '1px solid rgba(180,100,255,0.4)', color: '#ffd700'}}>Espacio</kbd>
                          <span className="font-semibold">Lanzar Hechizo de Luz</span>
                        </div>
                        <div className="flex items-start gap-2 sm:gap-3 text-xs border-t pt-2 sm:pt-3" style={{color: '#9977bb', borderColor: 'rgba(180,100,255,0.15)'}}>
                          <span className="px-1.5 py-0.5 rounded font-mono font-bold text-[9px] uppercase mt-0.5 shrink-0" style={{background: 'rgba(140,50,255,0.15)', color: '#cc88ff'}}>MÓVIL</span>
                          <span className="font-semibold leading-relaxed text-[11px] sm:text-xs">Arrastra el dedo para guiar tu Nave; los hechizos se lanzarán automáticamente.</span>
                        </div>
                      </div>

                      <motion.button 
                        whileHover={{ scale: 1.06, boxShadow: '0 0 30px rgba(200,100,255,0.6)' }}
                        whileTap={{ scale: 0.94 }}
                        onClick={startGame}
                        className="px-5 sm:px-10 py-3 sm:py-4 rounded-2xl font-black tracking-widest shadow-lg transition-all text-xs sm:text-sm animate-pulse"
                        style={{background: 'linear-gradient(135deg, #ffd700, #cc44ff)', color: '#08041a', border: '2px solid rgba(255,215,0,0.5)', fontFamily: "'Cinzel', serif"}}
                      >
                        ¡JUGAR!
                      </motion.button>
                    </motion.div>
                  )}

                  {/* GAME OVER SCREEN — Kingdom Hearts style */}
                  {gameState === 'gameover' && (
                    <motion.div 
                      key="gameover-screen"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 backdrop-blur-sm z-20 flex flex-col justify-center items-center p-6 text-center"
                      style={{background: 'rgba(20,5,40,0.93)'}}
                    >
                      <div className="text-4xl sm:text-5xl mb-2 sm:mb-3" style={{filter: 'drop-shadow(0 0 15px rgba(255,50,100,0.8))'}}>💔</div>
                      <h3 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-widest mb-1 sm:mb-2 animate-pulse" style={{fontFamily: "'Cinzel Decorative', serif", background: 'linear-gradient(135deg, #ff4466, #cc44ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', filter: 'drop-shadow(0 0 15px rgba(255,50,100,0.5))'}}>
                        GAME OVER
                      </h3>
                      <p className="font-bold text-[10px] sm:text-xs tracking-widest uppercase mb-4 sm:mb-6" style={{color: '#cc88ff', fontFamily: 'monospace'}}>
                        — El corazón ha caído en la oscuridad —
                      </p>

                      <div className="grid grid-cols-2 gap-2 sm:gap-4 max-w-sm w-full mb-4 sm:mb-8">
                        <div className="p-2.5 sm:p-4 rounded-xl" style={{background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(180,100,255,0.2)'}}>
                          <span className="text-[10px] font-mono font-bold block uppercase" style={{color: '#9977bb'}}>Munny</span>
                          <span className="text-xl sm:text-2xl font-black font-mono" style={{color: '#ffd700'}}>{score}</span>
                        </div>
                        <div className="p-2.5 sm:p-4 rounded-xl" style={{background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(180,100,255,0.2)'}}>
                          <span className="text-[10px] font-mono font-bold block uppercase" style={{color: '#9977bb'}}>Récord</span>
                          <span className="text-xl sm:text-2xl font-mono font-black flex items-center justify-center gap-1" style={{color: '#ffd700'}}>
                            <Trophy size={14} />
                            {highScore}
                          </span>
                        </div>
                      </div>

                      {score >= 500 ? (
                        <p className="font-black text-[10px] sm:text-xs font-mono mb-4 sm:mb-6 px-3 sm:px-4 py-2 rounded-xl text-center" style={{color: '#ffd700', border: '1px solid rgba(255,215,0,0.3)', background: 'rgba(255,215,0,0.05)'}}>
                          ✨ ¡MUNDO DESBLOQUEADO!
                        </p>
                      ) : (
                        <p className="font-bold text-[10px] sm:text-[11px] font-mono mb-4 sm:mb-6 max-w-xs leading-relaxed text-center" style={{color: '#cc88ff'}}>
                          ¡Consigue 500 Munny para desbloquear los secretos del Maestro!
                        </p>
                      )}

                      <motion.button 
                        whileHover={{ scale: 1.05, boxShadow: '0 0 25px rgba(180,100,255,0.5)' }}
                        whileTap={{ scale: 0.95 }}
                        onClick={startGame}
                        className="inline-flex items-center gap-2 px-5 sm:px-8 py-2.5 sm:py-3.5 rounded-2xl bg-white text-gray-900 font-black tracking-widest shadow-lg hover:bg-gray-100 transition-all font-mono text-xs sm:text-sm border-2 border-white"
                      >
                        <RotateCcw size={14} />
                        RE-COMPILAR JUEGO
                      </motion.button>
                    </motion.div>
                  )}

                </AnimatePresence>

                {/* Live HUD panel top inside canvas bounds */}
                {gameState === 'playing' && (
                  <div className="absolute top-4 left-4 right-4 z-20 flex justify-between items-center pointer-events-none">
                    
                    {/* Level & active power-up alerts */}
                    <div className="flex flex-col gap-1 text-left">
                      <span className="text-[10px] font-mono font-black px-2 py-0.5 rounded" style={{color: '#ffd700', background: 'rgba(255,215,0,0.1)', border: '1px solid rgba(255,215,0,0.2)'}}>
                        ✦ MUNDO {level}
                      </span>
                      {activePowerUp && (
                        <motion.span 
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="text-[8px] font-mono font-black px-1.5 py-0.5 rounded uppercase tracking-wider"
                          style={{background: activePowerUp === 'Reflect' ? 'rgba(136,102,255,0.8)' : 'rgba(255,215,0,0.8)', color: activePowerUp === 'Reflect' ? '#fff' : '#08041a'}}
                        >
                          ✨ {activePowerUp}
                        </motion.span>
                      )}
                    </div>

                    {/* Mid Score Display */}
                    <div className="flex flex-col items-center">
                      <span className="text-[8px] font-mono font-bold tracking-wider" style={{color: '#9977bb'}}>MUNNY</span>
                      <span className="text-xl font-mono font-black" style={{color: '#ffd700', textShadow: '0 0 8px rgba(255,215,0,0.5)'}}>
                        {score}
                      </span>
                    </div>

                    {/* Right Lives — Hearts */}
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-[8px] font-mono font-bold tracking-wider" style={{color: '#9977bb'}}>HP</span>
                      <div className="flex gap-1.5">
                        {Array.from({ length: 3 }).map((_, idx) => (
                          <div 
                            key={idx}
                            className="text-base leading-none"
                            style={{
                              color: idx < lives ? (shieldActive ? '#8866ff' : '#ef4444') : '#4b5563',
                              filter: idx < lives
                                ? shieldActive
                                  ? 'drop-shadow(0 0 5px #8866ff)'
                                  : 'drop-shadow(0 0 4px #ef4444)'
                                : 'grayscale(1) opacity(0.2)'
                            }}
                          >
                            {idx < lives ? '♥' : '♡'}
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                )}

              </div>
            </div>

            {/* Game controls / Mute cabinet buttons */}
            <div className="flex justify-between items-center w-full max-w-[500px] mt-3 sm:mt-4 px-2 sm:px-4">
              <div className="text-[9px] sm:text-[10px] font-mono font-semibold text-kh-muted dark:text-[#a085e6] truncate mr-2">
                ✦ JOEL PORTFOLIO 2026 — KINGDOM ARCADE ✦
              </div>
              <button 
                onClick={toggleMute}
                className="p-2 sm:p-2.5 rounded-xl transition-colors shadow bg-white/80 dark:bg-[#281446]/80 border border-kh-border text-accent-600 dark:text-[#cc88ff] hover:bg-accent-500/10 cursor-pointer shrink-0"
                aria-label="Toggle game audio"
              >
                {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
              </button>
            </div>
          </motion.div>

          {/* RIGHT: Highscore scoreboard and ciberpunk rewards cabinet */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="w-full lg:w-[350px] flex flex-col gap-4 sm:gap-6"
          >
            {/* 1. Scoreboard Panel Card — Kingdom Tome */}
            <div className="p-6 rounded-3xl backdrop-blur-md relative overflow-hidden group border border-kh-border bg-kh-bg-card/90 dark:bg-kh-bg-card/75 shadow-sm dark:shadow-none">
              <div className="absolute inset-0 bg-gradient-to-br pointer-events-none" style={{backgroundImage: 'linear-gradient(135deg, rgba(140,50,255,0.03), rgba(255,215,0,0.02))'}} />
              
              <h3 className="text-lg font-black flex items-center gap-2 mb-4" style={{fontFamily: "'Cinzel', serif", color: '#ffd700'}}>
                <Trophy size={18} style={{color: '#ffd700'}} />
                ✦ LIBRO DE MUNNY ✦
              </h3>

              <div className="space-y-3.5">
                <div className="flex justify-between items-center p-3.5 rounded-2xl bg-black/5 dark:bg-black/40 border border-kh-border/50">
                  <div className="flex items-center gap-2">
                    <Star size={14} style={{color: '#ffd700', fill: '#ffd700'}} />
                    <span className="text-xs font-mono font-bold text-kh-muted">MUNNY RÉCORD</span>
                  </div>
                  <span className="text-lg font-mono font-black" style={{color: '#ffd700'}}>{highScore}</span>
                </div>

                <div className="text-left p-4 rounded-2xl space-y-2 bg-black/5 dark:bg-[#040714]/40 border border-kh-border/30">
                  <h4 className="text-[10px] font-mono font-black tracking-wider uppercase mb-3 text-kh-muted">⚡ DRIVE FORMS ESPECIALES:</h4>
                  <div className="flex items-center gap-2 text-xs font-medium text-kh-text">
                    <div className="w-5 h-5 rounded font-black font-mono text-[10px] flex items-center justify-center bg-amber-500/10 text-[#ffd700] border border-amber-500/30">☀</div>
                    <span><strong className="text-accent-600 dark:text-[#ffd700]">[Ragnarok]:</strong> Hechizo Triple durante 8s</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-medium text-kh-text">
                    <div className="w-5 h-5 rounded font-black font-mono text-[10px] flex items-center justify-center bg-purple-500/10 text-purple-600 dark:text-[#cc88ff] border border-purple-500/30">🛡</div>
                    <span><strong className="text-purple-600 dark:text-[#cc88ff]">[Reflect]:</strong> Barrera hexagonal protectora</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-medium text-kh-text">
                    <div className="w-5 h-5 rounded font-black font-mono text-[10px] flex items-center justify-center bg-pink-500/10 text-pink-600 dark:text-[#ff44aa] border border-pink-500/30">♥</div>
                    <span><strong className="text-pink-600 dark:text-[#ff44aa]">[Cure]:</strong> Purifica toda la pantalla de sombras</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Rewards terminal: Unlocks when score >= 500 — Hollow Bastion Door */}
            <div className="p-6 rounded-3xl backdrop-blur-md relative overflow-hidden flex-1 flex flex-col justify-between group border border-kh-border bg-kh-bg-card/90 dark:bg-kh-bg-card/75 shadow-sm dark:shadow-none">
              <div className="absolute inset-0 pointer-events-none" style={{backgroundImage: 'linear-gradient(135deg, rgba(140,50,255,0.03), rgba(255,180,50,0.02))'}} />

              <div className="space-y-4">
                <div className="flex items-center gap-2 text-lg font-black" style={{fontFamily: "'Cinzel', serif", color: '#ffd700'}}>
                  <Terminal size={18} style={{color: unlockedReward ? '#ffd700' : '#8866ff', filter: unlockedReward ? 'drop-shadow(0 0 6px rgba(255,215,0,0.6))' : 'none'}} className={unlockedReward ? "animate-pulse" : ""} />
                  🗝 PUERTA SECRETA
                </div>

                <AnimatePresence mode="wait">
                  {unlockedReward ? (
                    // UNLOCKED STATE — Hollow Bastion Gate Open
                    <motion.div 
                      key="unlocked"
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -15 }}
                      className="space-y-4 text-left font-mono"
                    >
                      <div className="p-3 rounded-2xl text-[11px] font-bold leading-relaxed bg-amber-500/10 border border-amber-500/30 text-accent-600 dark:text-[#ffd700]">
                        ✨ MUNDO DESBLOQUEADO: ¡SECRETOS DEL MAESTRO REVELADOS!
                        <br />
                        <span className="text-purple-600 dark:text-[#cc88ff]">Has derrotado a los Sincorazón con maestría legendaria.</span>
                      </div>

                      <p className="text-xs font-semibold leading-relaxed text-kh-text">
                        Como Maestro de la Keyblade, tienes acceso directo a los archivos secretos.
                      </p>

                      <div className="space-y-3 pt-2">
                        <motion.a 
                          whileHover={{ scale: 1.02, boxShadow: '0 0 20px rgba(255,215,0,0.4)' }}
                          whileTap={{ scale: 0.98 }}
                          href="mailto:joel.barreira@outlook.com?subject=Proyecto%20Desarrollo%20-%20Maestro%20Keyblade"
                          className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl font-black text-xs tracking-wider transition-all"
                          style={{background: 'linear-gradient(135deg, #ffd700, #cc8800)', color: '#08041a', border: '2px solid rgba(255,215,0,0.5)'}}
                        >
                          <Download size={14} />
                          ⚔ SOLICITAR CV MAESTRO
                        </motion.a>

                        <motion.button 
                          whileHover={{ scale: 1.02, boxShadow: '0 0 15px rgba(180,100,255,0.4)' }}
                          whileTap={{ scale: 0.98 }}
                          onClick={copyToClipboard}
                          className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl font-black text-xs tracking-wider transition-all bg-white dark:bg-black/50 border border-kh-border text-kh-text hover:bg-accent-500/10 cursor-pointer"
                        >
                          <Send size={14} />
                          {copiedEmail ? "✓ ¡PERGAMINO COPIADO!" : "📜 COPIAR PERGAMINO DE CONTACTO"}
                        </motion.button>
                      </div>

                    </motion.div>
                  ) : (
                    // LOCKED STATE — Gate of Hollow Bastion sealed
                    <motion.div 
                      key="locked"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="space-y-4 text-left"
                    >
                      <div className="p-4 rounded-2xl text-xs font-mono space-y-2 leading-relaxed bg-black/5 dark:bg-black/40 border border-kh-border text-kh-text">
                        <span className="font-bold block text-red-500 dark:text-red-400">🔒 PUERTA: SELLADA POR LA OSCURIDAD</span>
                        <span>Requiere 500 Munny para desbloquear la cerradura.</span>
                        <div className="w-full h-2.5 rounded-full overflow-hidden mt-3 bg-black/10 dark:bg-white/5 border border-kh-border">
                          <div 
                            className="h-full rounded-full transition-all duration-500"
                            style={{ width: `${Math.min(100, (score / 500) * 100)}%`, background: 'linear-gradient(90deg, #8866ff, #ffd700)', boxShadow: '0 0 8px rgba(200,150,255,0.5)' }}
                          />
                        </div>
                        <div className="flex justify-between items-center text-[10px] font-bold mt-1 text-kh-muted">
                          <span className="text-accent-600 dark:text-[#ffd700]">{score} Munny</span>
                          <span>META: 500 ✦</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

          </motion.div>

        </div>

      </div>
    </section>
  );
}
