export function initNewsletterPopup(){
  const root=document.getElementById('luxraj-newsletter');
  if(!root||root.dataset.initialized==='true')return;
  root.dataset.initialized='true';
  const get=(id)=>root.querySelector('#'+id);
  let returnFocusTarget=null,previousBodyOverflow='',closeTimer=null,patHandTimeout=null;

/******************************************************************
     * 1. CUTE SYNTHESIZED SOUND ENGINE (Web Audio API - No External Files)
     ******************************************************************/
    class CuteSoundBox {
      constructor() {
        this.enabled = true;
        this.ctx = null;
      }

      init() {
        if (!this.ctx && (window.AudioContext || window.webkitAudioContext)) {
          const AudioCtx = window.AudioContext || window.webkitAudioContext;
          this.ctx = new AudioCtx();
        }
        if (this.ctx && this.ctx.state === 'suspended') {
          this.ctx.resume();
        }
      }

      // Cute bubble pop
      playPop(startFreq = 420, endFreq = 780) {
        if (!this.enabled) return;
        try {
          this.init();
          const now = this.ctx.currentTime;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(startFreq, now);
          osc.frequency.exponentialRampToValueAtTime(endFreq, now + 0.08);

          gain.gain.setValueAtTime(0.12, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(now);
          osc.stop(now + 0.095);
        } catch (e) {}
      }

      // Cozy wooden door knock + chime when opening the House Popup
      playDoorKnock() {
        if (!this.enabled) return;
        try {
          this.init();
          [150, 175].forEach((freq, i) => {
            const now = this.ctx.currentTime + i * 0.11;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, now);
            osc.frequency.exponentialRampToValueAtTime(60, now + 0.06);
            gain.gain.setValueAtTime(0.18, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now);
            osc.stop(now + 0.075);
          });
          setTimeout(() => this.playPop(520, 880), 230);
        } catch (e) {}
      }

      // Cookie munch sound
      playMunch() {
        if (!this.enabled) return;
        try {
          this.init();
          [260, 340, 290].forEach((freq, i) => {
            const now = this.ctx.currentTime + i * 0.09;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, now);
            osc.frequency.exponentialRampToValueAtTime(freq * 1.4, now + 0.06);
            gain.gain.setValueAtTime(0.12, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now);
            osc.stop(now + 0.075);
          });
        } catch (e) {}
      }

      // Tiny sad violin melody
      playTinyViolin() {
        if (!this.enabled) return;
        try {
          this.init();
          const notes = [659.25, 622.25, 587.33, 523.25];
          notes.forEach((freq, i) => {
            const now = this.ctx.currentTime + i * 0.14;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(freq, now);
            gain.gain.setValueAtTime(0.04, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.13);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now);
            osc.stop(now + 0.135);
          });
        } catch (e) {}
      }

      // Happy Victory Chime
      playVictory() {
        if (!this.enabled) return;
        try {
          this.init();
          const notes = [523.25, 659.25, 783.99, 1046.5];
          notes.forEach((freq, i) => {
            const now = this.ctx.currentTime + i * 0.08;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now);
            gain.gain.setValueAtTime(0.13, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now);
            osc.stop(now + 0.32);
          });
        } catch (e) {}
      }
    }

    const sound = new CuteSoundBox();

    /******************************************************************
     * 2. BREVO CONFIGURATION & GAME STATE ("LUXY")
     ******************************************************************/
    // Demo preview only. No subscriber data is transmitted or stored.

    let charmScore = 20;
    let begStage = 0;
    let cookiesFed = 0;
    let headPats = 0;
    let isSubscribed = false;
    let isHouseOpen = false;
    const unlockedStickers = new Set();

    const BEGGING_MOVES = [
      {
        headline: "Move #1: Luxy's Giant Shimmering Puppy Eyes! 🥺",
        speech: '"Look at these giant watery eyes in my cottage window! I practiced in the mirror for 3 hours just for you!"',
        btnLabel: "Okay, Those Eyes Worked!",
        charmBonus: 15
      },
      {
        headline: "Move #2: The Hand-Drawn Cardboard Sign! 📦",
        speech: '"I made this sign out of a cereal box! Will trade our best visual explanations for 1 cozy email!"',
        btnLabel: "Accept Luxy's Trade!",
        charmBonus: 15
      },
      {
        headline: "Move #3: The World's Smallest Violin! 🎻",
        speech: '"♪ ♫ Playing a tiny, squeaky serenade from my cottage window... can you hear my dedication? ♪"',
        btnLabel: "Bravo! Sign Me Up!",
        charmBonus: 15
      },
      {
        headline: "Move #4: Bribing You With Barnaby the Frog! 🐸",
        speech: '"Okay, what if I invite my roommate Barnaby the polite wizard frog? He loves engineering discoveries!"',
        btnLabel: "Do It For Barnaby!",
        charmBonus: 15
      },
      {
        headline: "Move #5: Royal VIP Mail Slot Treatment! 👑",
        speech: '"Look! I just crowned the brass mail slot! Luxy will give your inbox the royal cottage treatment!"',
        btnLabel: "Claim My Royal Spot!",
        charmBonus: 15
      },
      {
        headline: "Move #6: The Full Dramatic Pancake Flop! 🏳️",
        speech: '"*FLOP* Okay I am officially out of moves on my cottage floor... please just one tiny click? 🥺👉👈"',
        btnLabel: "Cheer Luxy Up & Join!",
        charmBonus: 20
      }
    ];

    const COOKIE_QUIPS = [
      '"NOM NOM NOM! 🍪 Oh!! Warm chocolate chip! Welcome to my cottage forever!"',
      '"CRUNCH CRUNCH! 🍪 That was delicious! Wait until you see the visual explanations we’re baking!"',
      '"YUM!! 🍪 Luxy is now 80% cookie and 20% excitement to be your pen-pal!"',
      '"MUNCH! 🍪 You spoil me! I promise our Luxraj.com dispatches are just as sweet as this cookie!"'
    ];

    const PAT_QUIPS = [
      '"*Happy squishy purring noises* 🥰 That’s the best head pat in the whole neighborhood!"',
      '"Hehe! 🖐️ My LUXY postman cap almost wiggled off! Thank you!"',
      '"Boi-oi-oing! 💖 Head pats give me +100 energy to deliver engineering discoveries!"',
      '"Aww yiss! ✨ You’re officially my favorite cottage guest today!"'
    ];

    /******************************************************************
     * 3. DOM ELEMENTS
     ******************************************************************/
    const housePopupBackdrop = get('house-popup-backdrop');
    const houseModalCard = get('house-modal-card');
    const closeHousePopupBtn = get('close-house-popup-btn');

    const mainHeadline = get('main-headline');
    const charmStatusLabel = get('charm-status-label');
    const charmPercentBadge = get('charm-percent-badge');
    const charmBarFill = get('charm-bar-fill');
    const charmHeartIcon = get('charm-heart-icon');

    const characterStage = get('character-stage');
    const floatingFxLayer = get('floating-fx-layer');
    const speechBubble = get('speech-bubble');
    const speechText = get('speech-text');

    const luxySvg = get('luxy-svg');
    const luxyEyesTrack = get('luxy-eyes-track');
    const luxyMouth = get('luxy-mouth');
    const puppyEyeLeft = get('puppy-eye-left');
    const puppyEyeRight = get('puppy-eye-right');
    const starEyeLeft = get('star-eye-left');
    const starEyeRight = get('star-eye-right');

    // Stage Props
    const propCardboardSign = get('prop-cardboard-sign');
    const propViolin = get('prop-violin');
    const propFrog = get('prop-frog');
    const propWhiteFlag = get('prop-white-flag');
    const propSadSign = get('prop-sad-sign');
    const propBestiesBanner = get('prop-besties-banner');
    const inputVipCrown = get('input-vip-crown');
    const vipCarpetBadge = get('vip-carpet-badge');

    const patHandEl = get('pat-hand-el');
    const flyingCookieEl = get('flying-cookie-el');

    // Buttons & Counters
    const btnBegHarder = get('btn-beg-harder');
    const btnCookie = get('btn-cookie');
    const btnPat = get('btn-pat');
    const begStepCounter = get('beg-step-counter');
    const cookieCounter = get('cookie-counter');
    const patCounter = get('pat-counter');

    // Form Elements
    const emailInput = get('email-input');
    const emailEmojiStatus = get('email-emoji-status');
    const submitBtnLabel = get('submit-btn-label');
    const subscribeForm = get('subscribe-form');
    const emailErrorMsg = get('email-error-msg');

    /******************************************************************
     * 4. HOUSE POPUP OPEN / CLOSE LOGIC
     ******************************************************************/
    function openHousePopup(trigger = document.activeElement) {
      if (isHouseOpen) return;
      isHouseOpen = true;
      returnFocusTarget = trigger instanceof HTMLElement ? trigger : document.activeElement;
      previousBodyOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      housePopupBackdrop.classList.remove('hidden');
      requestAnimationFrame(() => { houseModalCard.classList.remove('house-modal-hidden'); houseModalCard.classList.add('house-modal-visible'); });
      sound.playDoorKnock();
      window.setTimeout(() => { triggerSquishAnimation(); spawnFloatingEmojis(['🏠','💖','✨'],4); closeHousePopupBtn.focus(); },220);
    }
    function closeHousePopup() {
      if (!isHouseOpen) return;
      isHouseOpen = false;
      resetLuxyEyes();
      sound.playPop(520,300);
      houseModalCard.classList.remove('house-modal-visible'); houseModalCard.classList.add('house-modal-hidden');
      window.clearTimeout(closeTimer);
      closeTimer=window.setTimeout(()=>{
        if(isHouseOpen)return;
        housePopupBackdrop.classList.add('hidden'); document.body.style.overflow=previousBodyOverflow;
        if(returnFocusTarget&&document.contains(returnFocusTarget))returnFocusTarget.focus();
        returnFocusTarget=null;
      },300);
    }
    document.addEventListener('click',(event)=>{
      const target=event.target instanceof Element?event.target:null;
      const trigger=target&&target.closest('[data-newsletter-open]');
      if(!trigger)return;
      event.preventDefault(); openHousePopup(trigger);
    });
    closeHousePopupBtn.addEventListener('click',closeHousePopup);
    // Close when clicking backdrop outside the house
    housePopupBackdrop.addEventListener('click', (e) => {
      if (e.target === housePopupBackdrop) {
        closeHousePopup();
      }
    });

    document.addEventListener('keydown',(event)=>{
      if(!isHouseOpen)return;
      if(event.key==='Escape'){event.preventDefault();closeHousePopup();return;}
      if(event.key!=='Tab')return;
      const focusable=Array.from(houseModalCard.querySelectorAll('a[href],button:not([disabled]),input:not([disabled]),[tabindex]:not([tabindex="-1"])')).filter(el=>!el.closest('.hidden')&&el.getAttribute('aria-hidden')!=='true');
      if(!focusable.length){event.preventDefault();closeHousePopupBtn.focus();return;}
      const first=focusable[0],last=focusable[focusable.length-1];
      if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}
      else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}
    });
    /******************************************************************
     * 5. HELPER FUNCTIONS: FLOATING EMOJIS, CHARM METER & STICKERS
     ******************************************************************/
    function spawnFloatingEmojis(emojis = ['💖', '✨'], count = 4) {
      for (let i = 0; i < count; i++) {
        const el = document.createElement('div');
        el.textContent = emojis[i % emojis.length];
        el.className = 'absolute text-xl sm:text-2xl pointer-events-none select-none';
        const leftPct = 28 + Math.random() * 44;
        const topPct = 35 + Math.random() * 25;
        el.style.left = `${leftPct}%`;
        el.style.top = `${topPct}%`;
        el.style.animation = `floatUpFade ${0.75 + Math.random() * 0.4}s ease-out forwards`;
        floatingFxLayer.appendChild(el);
        setTimeout(() => el.remove(), 1200);
      }
    }

    function triggerSquishAnimation() {
      if (begStage === 6 && !isSubscribed) return;
      luxySvg.classList.remove('luxy-idle', 'luxy-squish');
      void luxySvg.offsetWidth;
      luxySvg.classList.add('luxy-squish');
      setTimeout(() => {
        if (!isSubscribed && begStage !== 6) {
          luxySvg.classList.remove('luxy-squish');
          luxySvg.classList.add('luxy-idle');
        }
      }, 560);
    }

    function updateSpeech(text) {
      speechText.textContent = text;
      speechBubble.style.transform = 'scale(1.04)';
      setTimeout(() => {
        speechBubble.style.transform = 'scale(1)';
      }, 160);
    }

    function addCharm(amount) {
      charmScore = Math.min(100, charmScore + amount);
      charmPercentBadge.textContent = `${charmScore}%`;
      charmBarFill.style.width = `${charmScore}%`;

      charmHeartIcon.style.transform = 'scale(1.35)';
      setTimeout(() => { charmHeartIcon.style.transform = 'scale(1)'; }, 220);

      if (charmScore < 45) {
        charmStatusLabel.textContent = "Luxy's Charm Effort: Trying Hard!";
      } else if (charmScore < 75) {
        charmStatusLabel.textContent = "Luxy's Charm Effort: Super Earnest!";
      } else if (charmScore < 100) {
        charmStatusLabel.textContent = "Luxy's Charm Effort: Irresistible!!";
      } else {
        charmStatusLabel.textContent = "MAX CHARM REACHED! Official Housemates! 💖";
      }
    }

    function unlockSticker(id) {
      if (unlockedStickers.has(id)) return;
      unlockedStickers.add(id);
      const el = get(id);
      if (el) {
        el.classList.remove('opacity-45', 'bg-cream/70', 'border-cocoa/30');
        el.classList.add('opacity-100', 'bg-butterLight', 'border-cocoa', 'shadow-[0_3px_0_#2D232E]', 'sticker-pop');
      }
      get('sticker-count-label').textContent = `${unlockedStickers.size} / 6 Unlocked`;
    }

    /******************************************************************
     * 6. BUTTON 1: "CONVINCE ME HARDER" (6 ESCALATING CUTE STAGES)
     ******************************************************************/
    btnBegHarder.addEventListener('click', () => {
      const moveIndex = begStage % BEGGING_MOVES.length;
      begStage = moveIndex + 1;
      const move = BEGGING_MOVES[moveIndex];

      begStepCounter.textContent = `Move ${begStage}/6`;
      mainHeadline.textContent = move.headline;
      updateSpeech(move.speech);
      if (!isSubscribed) {
        submitBtnLabel.textContent = move.btnLabel;
      }

      addCharm(move.charmBonus);
      unlockSticker('sticker-puppy');

      // Reset temporary stage props before applying current stage
      propCardboardSign.setAttribute('opacity', '0');
      propViolin.setAttribute('opacity', '0');
      propWhiteFlag.setAttribute('opacity', '0');
      propSadSign.setAttribute('opacity', '0');
      luxySvg.classList.remove('luxy-flop');

      if (begStage === 1) {
        sound.playPop(480, 880);
        puppyEyeLeft.setAttribute('opacity', '1');
        puppyEyeRight.setAttribute('opacity', '1');
        luxyMouth.setAttribute('d', 'M 122 128 Q 130 122 138 128');
        triggerSquishAnimation();
        spawnFloatingEmojis(['🥺', '💧', '✨'], 5);
      } else if (begStage === 2) {
        sound.playPop(520, 760);
        propCardboardSign.setAttribute('opacity', '1');
        triggerSquishAnimation();
        spawnFloatingEmojis(['📦', '💌', '✨'], 5);
      } else if (begStage === 3) {
        sound.playTinyViolin();
        propViolin.setAttribute('opacity', '1');
        luxyMouth.setAttribute('d', 'M 122 129 Q 130 120 138 129');
        triggerSquishAnimation();
        spawnFloatingEmojis(['🎻', '♪', '♫', '🎶'], 6);
      } else if (begStage === 4) {
        sound.playPop(350, 690);
        propFrog.classList.remove('hidden');
        unlockSticker('sticker-frog');
        luxyMouth.setAttribute('d', 'M 118 124 Q 124 132 130 124 Q 136 132 142 124');
        triggerSquishAnimation();
        spawnFloatingEmojis(['🐸', '🪄', '✨'], 6);
      } else if (begStage === 5) {
        sound.playVictory();
        inputVipCrown.classList.remove('hidden');
        vipCarpetBadge.classList.remove('hidden');
        unlockSticker('sticker-crown');
        triggerSquishAnimation();
        spawnFloatingEmojis(['👑', '✨', '💎'], 6);
      } else if (begStage === 6) {
        sound.playPop(600, 240);
        propWhiteFlag.setAttribute('opacity', '1');
        luxySvg.classList.remove('luxy-idle', 'luxy-squish');
        luxySvg.classList.add('luxy-flop');
        spawnFloatingEmojis(['🏳️', '🥺', '👉👈'], 6);
      }
    });

    /******************************************************************
     * 7. BUTTON 2: "GIVE LUXY A COOKIE"
     ******************************************************************/
    btnCookie.addEventListener('click', () => {
      cookiesFed++;
      cookieCounter.textContent = `${cookiesFed} Fed`;
      sound.playMunch();
      addCharm(12);
      unlockSticker('sticker-cookie');

      if (begStage === 6 && !isSubscribed) {
        luxySvg.classList.remove('luxy-flop');
        propWhiteFlag.setAttribute('opacity', '0');
      }

      flyingCookieEl.classList.remove('hidden');
      flyingCookieEl.style.animation = 'none';
      void flyingCookieEl.offsetWidth;
      flyingCookieEl.style.animation = 'cookieArc 0.55s ease-in-out forwards';

      luxyMouth.setAttribute('d', 'M 122 122 A 8 8 0 1 0 138 122 A 8 8 0 1 0 122 122');
      setTimeout(() => {
        triggerSquishAnimation();
        luxyMouth.setAttribute('d', 'M 116 122 Q 130 138 144 122');
        spawnFloatingEmojis(['🍪', '💖', '✨', '😋'], 6);
        updateSpeech(COOKIE_QUIPS[(cookiesFed - 1) % COOKIE_QUIPS.length]);
      }, 420);
    });

    /******************************************************************
     * 8. BUTTON 3: "PAT LUXY'S HEAD" & WINDOW CLICK
     ******************************************************************/
    function performHeadPat() {
      headPats++;
      patCounter.textContent = `${headPats} Pats`;
      sound.playPop(540, 920);
      addCharm(10);
      unlockSticker('sticker-pat');

      if (begStage === 6 && !isSubscribed) {
        luxySvg.classList.remove('luxy-flop');
        propWhiteFlag.setAttribute('opacity', '0');
      }

      patHandEl.classList.remove('hidden');
      triggerSquishAnimation();
      luxyMouth.setAttribute('d', 'M 118 124 Q 124 132 130 124 Q 136 132 142 124');
      spawnFloatingEmojis(['💖', '🌸', '✨'], 5);
      updateSpeech(PAT_QUIPS[(headPats - 1) % PAT_QUIPS.length]);

      clearTimeout(patHandTimeout);
      patHandTimeout = setTimeout(() => {
        patHandEl.classList.add('hidden');
      }, 950);
    }

    btnPat.addEventListener('click', performHeadPat);
    characterStage.addEventListener('click', performHeadPat);

    /******************************************************************
     * 9. SMOOTH EYE TRACKING & EMAIL INPUT LIVE REACTIONS
     ******************************************************************/
    let eyeTargetX = 0;
    let eyeTargetY = 0;
    let eyeCurrentX = 0;
    let eyeCurrentY = 0;
    let eyeAnimationFrame = 0;

    function animateEyeTracking() {
      eyeCurrentX += (eyeTargetX - eyeCurrentX) * 0.28;
      eyeCurrentY += (eyeTargetY - eyeCurrentY) * 0.28;

      luxyEyesTrack.setAttribute(
        'transform',
        `translate(${eyeCurrentX.toFixed(2)}, ${eyeCurrentY.toFixed(2)})`
      );

      if (Math.abs(eyeTargetX - eyeCurrentX) > 0.03 || Math.abs(eyeTargetY - eyeCurrentY) > 0.03) {
        eyeAnimationFrame = window.requestAnimationFrame(animateEyeTracking);
      } else {
        eyeCurrentX = eyeTargetX;
        eyeCurrentY = eyeTargetY;
        luxyEyesTrack.setAttribute(
          'transform',
          `translate(${eyeCurrentX.toFixed(2)}, ${eyeCurrentY.toFixed(2)})`
        );
        eyeAnimationFrame = 0;
      }
    }

    function moveLuxyEyes(event) {
      if (!isHouseOpen || !luxySvg || !luxyEyesTrack) return;
      if (event.pointerType === 'touch' && !event.isPrimary) return;

      const rect = luxySvg.getBoundingClientRect();
      if (!rect.width || !rect.height) return;

      // Convert viewport pixels into the mascot SVG's 260 × 220 viewBox units.
      const dx = (event.clientX - (rect.left + rect.width / 2)) * (260 / rect.width);
      const dy = (event.clientY - (rect.top + rect.height / 2)) * (220 / rect.height);
      const angle = Math.atan2(dy, dx);
      const distance = Math.min(6, Math.hypot(dx, dy) / 40);

      eyeTargetX = Math.cos(angle) * distance;
      eyeTargetY = Math.sin(angle) * distance;

      if (!eyeAnimationFrame) {
        eyeAnimationFrame = window.requestAnimationFrame(animateEyeTracking);
      }
    }

    function resetLuxyEyes(event) {
      // A touch ending should relax the eyes; mouse movement should keep tracking.
      if (event?.pointerType && event.pointerType !== 'touch') return;

      eyeTargetX = 0;
      eyeTargetY = 0;

      if (!eyeAnimationFrame) {
        eyeAnimationFrame = window.requestAnimationFrame(animateEyeTracking);
      }
    }

    // Pointer Events cover mouse, pen and touch without a separate mobile code path.
    window.addEventListener('pointermove', moveLuxyEyes, { passive: true });
    window.addEventListener('pointerdown', moveLuxyEyes, { passive: true });
    window.addEventListener('pointerup', resetLuxyEyes, { passive: true });
    window.addEventListener('pointercancel', resetLuxyEyes, { passive: true });
    window.addEventListener('pointerleave', (event) => {
      if (event.pointerType !== 'touch') resetLuxyEyes();
    }, { passive: true });
    window.addEventListener('blur', resetLuxyEyes);
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) resetLuxyEyes();
    });

    emailInput.addEventListener('focus', () => {
      sound.playPop(600, 820);
      if (begStage === 6 && !isSubscribed) {
        luxySvg.classList.remove('luxy-flop');
      }
      updateSpeech('"Ooh!! You touched the brass mail slot! *Luxy peeks out the cottage window excitedly*"');
    });

    emailInput.addEventListener('input', (e) => {
      const val = e.target.value.trim();
      emailErrorMsg.classList.add('hidden');
      sound.playPop(700, 860);

      const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(val);
      if (val.length === 0) {
        emailEmojiStatus.textContent = '✉️';
        starEyeLeft.setAttribute('opacity', '0');
        starEyeRight.setAttribute('opacity', '0');
      } else if (!isValid) {
        emailEmojiStatus.textContent = '👀';
        starEyeLeft.setAttribute('opacity', '0');
        starEyeRight.setAttribute('opacity', '0');
        updateSpeech('"Tap tap tap! That email is looking super cozy in the mail slot..."');
      } else {
        emailEmojiStatus.textContent = '🤩';
        starEyeLeft.setAttribute('opacity', '1');
        starEyeRight.setAttribute('opacity', '1');
        puppyEyeLeft.setAttribute('opacity', '0');
        puppyEyeRight.setAttribute('opacity', '0');
        updateSpeech('"GASP!! 🤩 That is a 10/10 valid email! Push it through the mail slot!"');
        spawnFloatingEmojis(['✨', '🤩'], 3);
      }
    });

    /******************************************************************
     * 10. BREVO (SENDINBLUE) SUBMISSION & VIP HOUSE KEY REWARD
     ******************************************************************/
    subscribeForm.addEventListener('submit',async(e)=>{
      e.preventDefault();
      const val=emailInput.value.trim();
      const valid=/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(val);
      if(!valid){sound.playPop(300,180);emailErrorMsg.textContent="🥺 Oops! Luxy needs a real email with an '@' and domain (like you@example.com)!";emailErrorMsg.classList.remove('hidden');emailInput.focus();return;}
      if(isSubscribed)return;
      const submitButton=get('submit-btn');submitButton.disabled=true;submitBtnLabel.textContent='Trying the demo... 📬';emailErrorMsg.classList.add('hidden');
      await new Promise(resolve=>window.setTimeout(resolve,380));
      isSubscribed=true;sound.playVictory();addCharm(100);unlockSticker('sticker-bestie');launchConfetti();
      luxySvg.classList.remove('luxy-idle','luxy-squish','luxy-flop');luxySvg.classList.add('luxy-happy');
      propCardboardSign.setAttribute('opacity','0');propViolin.setAttribute('opacity','0');propWhiteFlag.setAttribute('opacity','0');propSadSign.setAttribute('opacity','0');propBestiesBanner.setAttribute('opacity','1');starEyeLeft.setAttribute('opacity','1');starEyeRight.setAttribute('opacity','1');
      mainHeadline.textContent='YAY!! Luxy has a demo celebration! 🎉';
      updateSpeech('That was only a preview, '+val.split('@')[0]+'! No address was sent or saved. 💖');
      submitBtnLabel.textContent='Demo Celebration!';get('vip-member-email').textContent=val;get('vip-card-number').textContent='#PREVIEW';
      get('vip-stats-line').textContent='Preview played with '+cookiesFed+' cookies, '+headPats+' head pats & '+unlockedStickers.size+'/6 stickers!';
      get('vip-membership-card').classList.remove('hidden');get('rss-box').classList.add('hidden');submitButton.disabled=false;
    });
    // Reset Game Button
    get('reset-game-btn').addEventListener('click', () => {
      isSubscribed = false;
      begStage = 0;
      emailInput.value = '';
      emailEmojiStatus.textContent = '✉️';
      propBestiesBanner.setAttribute('opacity', '0');
      starEyeLeft.setAttribute('opacity', '0');
      starEyeRight.setAttribute('opacity', '0');
      luxySvg.classList.remove('luxy-happy', 'luxy-flop');
      luxySvg.classList.add('luxy-idle');
      get('vip-membership-card').classList.add('hidden');
      mainHeadline.textContent = "Welcome inside! Can we be inbox friends? 🥺";
      updateSpeech('"Ready for round two! Click any button below to play with Luxy!"');
      submitBtnLabel.textContent = "Okay, You Charmed Me!";
      get('submit-btn').disabled = false;
    });

    // Playful "No thanks, I hate cute things (make Luxy cry)" link on the porch
    const noThanksLink = get('no-thanks-link');
    const rssBox = get('rss-box');

    noThanksLink.addEventListener('mouseenter', () => {
      if (isSubscribed) return;
      sound.playPop(500, 320);
      puppyEyeLeft.setAttribute('opacity', '1');
      puppyEyeRight.setAttribute('opacity', '1');
      propSadSign.setAttribute('opacity', '1');
      luxyMouth.setAttribute('d', 'M 120 130 Q 130 120 140 130');
      updateSpeech('"WAIT!! 🥺 Don\'t click that scary porch button! Try giving me 1 cookie first?!"');
    });

    noThanksLink.addEventListener('mouseleave', () => {
      propSadSign.setAttribute('opacity', '0');
    });

    noThanksLink.addEventListener('click', () => {
      sound.playPop(380, 240);
      rssBox.classList.remove('hidden');
      updateSpeech('"Aw okay! I left our RSS feed link on the porch below in case you want to read anonymously!"');
    });

    /******************************************************************
     * 11. SOUND TOGGLE, CLIPBOARD & BREVO CONFIG MODAL
     ******************************************************************/
    const soundBtn = get('sound-btn');
    soundBtn.addEventListener('click', () => {
      sound.enabled = !sound.enabled;
      get('sound-emoji').textContent = sound.enabled ? '🔊' : '🔇';
      get('sound-text').textContent = sound.enabled ? 'Sound On' : 'Muted';
      if (sound.enabled) sound.playPop();
    });

    function copyToClipboard(text, onDone) {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand('copy');
        if (onDone) onDone();
      } catch (e) {}
      document.body.removeChild(ta);
    }

    get('copy-rss-btn').addEventListener('click', (e) => {
      copyToClipboard('https://luxraj.com/rss.xml', () => {
        e.target.textContent = 'Copied! ✅';
        setTimeout(() => { e.target.textContent = 'Copy RSS Link 📋'; }, 2000);
      });
    });

    /******************************************************************
     * 12. CONFETTI CANNON
     ******************************************************************/
    const confettiCanvas = get('confetti-canvas');
    const cCtx = confettiCanvas.getContext('2d');
    let confettiPieces = [];
    let confettiFrame = null;

    function resizeConfetti() {
      confettiCanvas.width = window.innerWidth;
      confettiCanvas.height = window.innerHeight;
    }

    function launchConfetti(){
      const colors=['#FF7EB6','#FFD166','#06D6A0','#38BDF8','#E05A47'];
      for(let i=0;i<80;i++)confettiPieces.push({x:window.innerWidth/2,y:window.innerHeight*.45,vx:(Math.random()-.5)*16,vy:-Math.random()*14-4,size:7+Math.random()*6,color:colors[i%colors.length],rot:Math.random()*6.28,vRot:(Math.random()-.5)*.25,life:1});
      if(!confettiFrame)confettiFrame=window.requestAnimationFrame(renderConfetti);
    }
    function renderConfetti(){
      cCtx.clearRect(0,0,confettiCanvas.width,confettiCanvas.height);
      for(let i=confettiPieces.length-1;i>=0;i--){const p=confettiPieces[i];p.x+=p.vx;p.y+=p.vy;p.vy+=.32;p.rot+=p.vRot;p.life-=.014;if(p.life<=0){confettiPieces.splice(i,1);continue;}cCtx.save();cCtx.translate(p.x,p.y);cCtx.rotate(p.rot);cCtx.globalAlpha=Math.max(0,p.life);cCtx.fillStyle=p.color;cCtx.fillRect(-p.size/2,-p.size/2,p.size,p.size);cCtx.restore();}
      if(confettiPieces.length)confettiFrame=window.requestAnimationFrame(renderConfetti);else confettiFrame=null;
    }
    window.addEventListener('resize',resizeConfetti);
    resizeConfetti();

}
