// Chess Prestige Premium Sound Engine - Professional Synthesis
const AudioCtx = window.AudioContext || window.webkitAudioContext;
let ctx = null;

const getCtx = () => {
    if (!ctx) ctx = new AudioCtx();
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
};

// Sintetizador de alta calidad con Envolvente ADSR y Armónicos
const playPremiumTone = ({ freq, dur = 0.2, type = 'triangle', vol = 0.2, harmonics = true }) => {
    try {
        const c = getCtx();
        const now = c.currentTime;
        
        // Oscilador Principal
        const osc = c.createOscillator();
        const gain = c.createGain();
        
        osc.type = type;
        osc.frequency.setValueAtTime(freq, now);
        
        // Envolvente Premium
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(vol, now + 0.02); // Attack
        gain.gain.exponentialRampToValueAtTime(0.001, now + dur); // Release
        
        osc.connect(gain);
        gain.connect(c.destination);
        
        osc.start(now);
        osc.stop(now + dur);

        // Capa de Armónicos (Solo para efectos especiales)
        if (harmonics) {
            const hOsc = c.createOscillator();
            const hGain = c.createGain();
            hOsc.type = 'sine';
            hOsc.frequency.setValueAtTime(freq * 2.01, now); // Ligera desafinación para grosor
            hGain.gain.setValueAtTime(0, now);
            hGain.gain.linearRampToValueAtTime(vol * 0.5, now + 0.05);
            hGain.gain.exponentialRampToValueAtTime(0.001, now + dur);
            hOsc.connect(hGain);
            hGain.connect(c.destination);
            hOsc.start(now);
            hOsc.stop(now + dur);
        }
    } catch (e) { }
};

export const sounds = {
    move: () => playPremiumTone({ freq: 440, dur: 0.1, type: 'triangle', vol: 0.1, harmonics: false }),
    
    capture: () => {
        playPremiumTone({ freq: 350, dur: 0.15, type: 'sawtooth', vol: 0.12 });
        setTimeout(() => playPremiumTone({ freq: 220, dur: 0.2, type: 'square', vol: 0.1 }), 40);
    },

    check: () => {
        [880, 1100].forEach((f, i) => {
            setTimeout(() => playPremiumTone({ freq: f, dur: 0.2, type: 'sine', vol: 0.15 }), i * 100);
        });
    },

    checkmate: () => {
        const chord = [523.25, 659.25, 783.99, 1046.50]; // Acorde C Mayor
        chord.forEach((f, i) => {
            setTimeout(() => playPremiumTone({ freq: f, dur: 0.8, type: 'triangle', vol: 0.2 }), i * 150);
        });
    },

    defeat: () => {
        const chord = [349.23, 415.30, 523.25]; // F Menor
        chord.forEach((f, i) => {
            setTimeout(() => playPremiumTone({ freq: f / 2, dur: 1.2, type: 'sawtooth', vol: 0.15 }), i * 200);
        });
    },

    draw: () => {
        playPremiumTone({ freq: 440, dur: 0.5, type: 'sine', vol: 0.1 });
        setTimeout(() => playPremiumTone({ freq: 392, dur: 0.5, type: 'sine', vol: 0.1 }), 200);
    },

    jackpot: () => {
        const scale = [523, 659, 784, 1047, 1318, 1568];
        scale.forEach((f, i) => {
            setTimeout(() => playPremiumTone({ freq: f, dur: 0.3, type: 'square', vol: 0.15 }), i * 80);
        });
    },

    click: () => playPremiumTone({ freq: 900, dur: 0.05, type: 'sine', vol: 0.08, harmonics: false }),

    error: () => playPremiumTone({ freq: 150, dur: 0.3, type: 'square', vol: 0.2 }),

    coin: () => {
        playPremiumTone({ freq: 1500, dur: 0.1, type: 'sine', vol: 0.1, harmonics: true });
        setTimeout(() => playPremiumTone({ freq: 1800, dur: 0.15, type: 'sine', vol: 0.08 }), 50);
    },

    gameStart: () => {
        [440, 554, 659].forEach((f, i) => {
            setTimeout(() => playPremiumTone({ freq: f, dur: 0.4, type: 'triangle', vol: 0.15 }), i * 120);
        });
    }
};

export default sounds;
