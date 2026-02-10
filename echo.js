// ============================================
// ECHO — Universal Communication Intelligence
// Interactive JavaScript Engine
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // Init all Echo systems
    initEchoWaveCanvas();
    initEyeTracking();
    initScenarioDemo();
    initTranslator();
    initEmotionAnalyzer();
    initEmotionRadar();
    initEmergencyDemo();
    initEchoScrollAnimations();
    initEchoSmoothScroll();
    initEchoNav();
});

// ============ ECHO WAVE CANVAS ============
function initEchoWaveCanvas() {
    const canvas = document.getElementById('echoWaveCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const cx = 275, cy = 275;
    let time = 0;

    function draw() {
        ctx.clearRect(0, 0, 550, 550);
        time += 0.012;

        // Concentric sound rings
        for (let i = 0; i < 5; i++) {
            const radius = 60 + i * 45 + Math.sin(time * 2 + i * 0.5) * 8;
            const alpha = 0.15 - i * 0.025;
            ctx.beginPath();
            ctx.arc(cx, cy, radius, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(0,212,255,${alpha})`;
            ctx.lineWidth = 2;
            ctx.stroke();
        }

        // Floating particles
        for (let i = 0; i < 30; i++) {
            const angle = (Math.PI * 2 / 30) * i + time * 0.3;
            const dist = 100 + Math.sin(time * 1.5 + i) * 60 + i * 4;
            const px = cx + Math.cos(angle) * dist;
            const py = cy + Math.sin(angle) * dist;
            const size = 1.5 + Math.sin(time + i) * 1;
            const colors = ['#00D4FF', '#7C5CFC', '#FF6B9D', '#00F5A0'];
            ctx.beginPath();
            ctx.arc(px, py, size, 0, Math.PI * 2);
            ctx.fillStyle = colors[i % 4];
            ctx.globalAlpha = 0.5 + Math.sin(time * 2 + i) * 0.2;
            ctx.fill();
        }

        // Center orb
        const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 50);
        grad.addColorStop(0, 'rgba(0,212,255,0.4)');
        grad.addColorStop(0.5, 'rgba(124,92,252,0.2)');
        grad.addColorStop(1, 'transparent');
        ctx.beginPath();
        ctx.arc(cx, cy, 50, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.globalAlpha = 1;
        ctx.fill();

        // Center icon
        ctx.font = '32px serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#fff';
        ctx.globalAlpha = 0.9;
        ctx.fillText('🎤', cx, cy);

        // Waveform ring
        ctx.beginPath();
        for (let a = 0; a < Math.PI * 2; a += 0.02) {
            const wave = Math.sin(a * 8 + time * 4) * 10 + Math.sin(a * 3 - time * 2) * 6;
            const r = 55 + wave;
            const x = cx + Math.cos(a) * r;
            const y = cy + Math.sin(a) * r;
            a === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.strokeStyle = 'rgba(124,92,252,0.35)';
        ctx.lineWidth = 1.5;
        ctx.globalAlpha = 1;
        ctx.stroke();

        requestAnimationFrame(draw);
    }
    draw();
}

// ============ EYE TRACKING AAC ============
function initEyeTracking() {
    const grid = document.getElementById('eyeGrid');
    if (!grid) return;
    const sentenceEl = document.getElementById('eyeSentence');
    const predictionEl = document.getElementById('eyePrediction');
    const speakBtn = document.getElementById('eyeSpeak');
    const clearBtn = document.getElementById('eyeClear');
    let selectedWords = [];
    let gazeTimer = null;

    const predictions = {
        'Pain': 'AI Prediction: "I am in pain. Can you help me?"',
        'Hungry': 'AI Prediction: "I am hungry. Can I have something to eat?"',
        'Thirsty': 'AI Prediction: "I am very thirsty. Can I have some water?"',
        'Cold': 'AI Prediction: "I feel cold. Can I have a blanket?"',
        'Hot': 'AI Prediction: "I feel too hot. Can you adjust the temperature?"',
        'Help': 'AI Prediction: "I need help right now. Please come quickly."',
        'Happy': 'AI Prediction: "I am feeling happy today. Thank you!"',
        'Sad': 'AI Prediction: "I am feeling sad. I want to talk to someone."',
        'Yes': 'AI Prediction: "Yes, that is correct."',
        'No': 'AI Prediction: "No, I don\'t want that."',
        'Tired': 'AI Prediction: "I am very tired. I want to rest."',
        'Love': 'AI Prediction: "I love you. Thank you for being here."',
    };

    const confEl = document.querySelector('.eye-confidence strong');

    grid.querySelectorAll('.eye-cell').forEach(cell => {
        cell.addEventListener('mouseenter', () => {
            cell.classList.add('gazing');
            gazeTimer = setTimeout(() => {
                cell.classList.remove('gazing');
                cell.classList.add('selected');
                const word = cell.dataset.word;
                selectedWords.push(word);
                sentenceEl.textContent = selectedWords.join(' → ');
                predictionEl.textContent = predictions[word] || '';
                confEl.textContent = (88 + Math.floor(Math.random() * 10)) + '%';
                setTimeout(() => cell.classList.remove('selected'), 600);
            }, 800);
        });
        cell.addEventListener('mouseleave', () => {
            clearTimeout(gazeTimer);
            cell.classList.remove('gazing');
        });
        cell.addEventListener('click', () => {
            clearTimeout(gazeTimer);
            cell.classList.remove('gazing');
            cell.classList.add('selected');
            const word = cell.dataset.word;
            selectedWords.push(word);
            sentenceEl.textContent = selectedWords.join(' → ');
            predictionEl.textContent = predictions[word] || '';
            confEl.textContent = (88 + Math.floor(Math.random() * 10)) + '%';
            setTimeout(() => cell.classList.remove('selected'), 600);
        });
    });

    speakBtn.addEventListener('click', () => {
        if (selectedWords.length === 0) return;
        const lastWord = selectedWords[selectedWords.length - 1];
        const text = predictions[lastWord]?.replace('AI Prediction: ', '').replace(/"/g, '') || selectedWords.join(', ');
        if ('speechSynthesis' in window) {
            const utt = new SpeechSynthesisUtterance(text);
            utt.rate = 0.9;
            speechSynthesis.speak(utt);
        }
        speakBtn.textContent = '🔊 Speaking...';
        setTimeout(() => speakBtn.textContent = '🔊 Speak', 2000);
    });

    clearBtn.addEventListener('click', () => {
        selectedWords = [];
        sentenceEl.textContent = 'Select icons to build your message...';
        predictionEl.textContent = '';
        confEl.textContent = '--';
    });
}

// ============ ICU SCENARIO DEMO ============
function initScenarioDemo() {
    const btn = document.getElementById('startScenario');
    const timeline = document.getElementById('scenarioTimeline');
    if (!btn || !timeline) return;

    const steps = [
        { type: 'patient-step', icon: '👁️', text: '<strong>Eye Tracking:</strong> Raj gazes at the "Pain" icon…', delay: 800 },
        { type: 'echo-step', icon: '🤖', text: '<strong>Echo AI:</strong> "Where is the pain, Raj?"', delay: 1500 },
        { type: 'patient-step', icon: '👁️', text: '<strong>Eye Tracking:</strong> Raj gazes at "Chest" area…', delay: 2300 },
        { type: 'echo-step', icon: '🤖', text: '<strong>Echo AI:</strong> "Pain in chest? How severe?" (shows severity scale)', delay: 3200 },
        { type: 'patient-step', icon: '👀', text: '<strong>Blink Detection:</strong> Raj blinks twice → <strong>SEVERE</strong>', delay: 4200 },
        { type: 'alert-step', icon: '🚨', text: '<strong>URGENT ALERT:</strong> "Patient reports severe chest pain. Alerting cardiac team immediately."', delay: 5200 },
        { type: 'echo-step', icon: '📋', text: '<strong>Auto-documented</strong> in medical chart. <strong>Translated</strong> to doctor in medical terminology. Nurse <strong>alert sent.</strong>', delay: 6500 },
    ];

    btn.addEventListener('click', () => {
        btn.style.display = 'none';
        timeline.innerHTML = '';
        steps.forEach((step, i) => {
            setTimeout(() => {
                const div = document.createElement('div');
                div.className = `scenario-step ${step.type}`;
                div.innerHTML = `<span class="step-icon">${step.icon}</span><div class="step-text">${step.text}</div>`;
                timeline.appendChild(div);
                timeline.scrollTop = timeline.scrollHeight;
            }, step.delay);
        });
        setTimeout(() => {
            btn.style.display = 'block';
            btn.textContent = '🔄 Replay Scenario';
        }, 7500);
    });
}

// ============ TRANSLATOR ============
function initTranslator() {
    const input = document.getElementById('transInput');
    const output = document.getElementById('transOutput');
    const alertEl = document.getElementById('medicalAlert');
    const alertText = document.getElementById('alertText');
    if (!input || !output) return;

    const scenarios = {
        chest_pain: {
            input_tamil: 'மார்பு வலிக்குது, மூச்சு விட கஷ்டமா இருக்கு. ரொம்ப பயமா இருக்கு.',
            input_telugu: 'ఛాతీలో నొప్పిగా ఉంది, శ్వాస తీసుకోవడం కష్టంగా ఉంది.',
            input_hindi: 'छाती में बहुत दर्द है, साँस लेने में तकलीफ़ हो रही है।',
            input_japanese: '胸が痛い、息が苦しい。とても怖いです。',
            input_spanish: 'Me duele mucho el pecho, no puedo respirar bien. Tengo mucho miedo.',
            translation: `<strong>🚨 CRITICAL MEDICAL TRANSLATION:</strong><br><br>"Patient reports <strong>crushing chest pain</strong> and <strong>shortness of breath</strong>. Patient expresses <strong>severe anxiety and fear</strong>."<br><br><span style="color:var(--red)">⚡ HIGH PROBABILITY: Cardiac Event</span><br><span style="color:var(--amber)">😰 Emotional State: Severe distress, panic</span><br><span style="color:var(--cyan)">🏥 Recommended: Immediate ECG, cardiac enzymes</span>`,
            alert: 'CARDIAC ALERT: Patient presenting with chest pain and dyspnea. Emotional state: severe distress. Cardiac team notified. Priority: IMMEDIATE.',
            emotion: 'Distress', urgency: 'CRITICAL'
        },
        allergy: {
            input_tamil: 'உதடு வீங்கிடுச்சு, உடம்பு முழுக்க அரிப்பா இருக்கு. ஏதோ சாப்பிட்டேன்.',
            input_telugu: 'పెదవులు ఉబ్బిపోతున్నాయి, ఒంటికి దురద. ఏదో తిన్నాను.',
            input_hindi: 'होंठ सूज गए हैं, पूरे शरीर में खुजली है। कुछ खा लिया था।',
            input_japanese: '唇が腫れてきた、全身がかゆい。何か食べた後です。',
            input_spanish: 'Se me hincharon los labios, me pica todo el cuerpo. Comí algo.',
            translation: `<strong>⚠️ ALLERGY ALERT TRANSLATION:</strong><br><br>"Patient reports <strong>lip swelling</strong> and <strong>full-body itching/urticaria</strong> after <strong>food ingestion</strong>."<br><br><span style="color:var(--red)">⚡ POSSIBLE: Anaphylactic reaction</span><br><span style="color:var(--amber)">😟 Emotional State: Worried, anxious</span><br><span style="color:var(--cyan)">🏥 Recommended: Check airway, epinephrine on standby</span>`,
            alert: 'ALLERGY ALERT: Possible anaphylaxis. Lip angioedema + urticaria post food ingestion. Epinephrine standby. Priority: URGENT.',
            emotion: 'Anxiety', urgency: 'URGENT'
        },
        accident: {
            input_tamil: 'போர்ணா விழுந்துட்டேன், கால் நகரல. ரொம்ப வலிக்குது. தலையில ரத்தம் வருது.',
            input_telugu: 'రోడ్డు ప్రమాదం, కాలు కదలడం లేదు. చాలా నొప్పి. తల నుంచి రక్తం.',
            input_hindi: 'सड़क पर गिर गया, पैर हिल नहीं रहा। बहुत दर्द है। सिर से खून आ रहा है।',
            input_japanese: '事故で転んだ、足が動かない。とても痛い。頭から血が出ている。',
            input_spanish: 'Me caí en la calle, no puedo mover la pierna. Mucho dolor. Me sale sangre de la cabeza.',
            translation: `<strong>🚑 TRAUMA ALERT TRANSLATION:</strong><br><br>"Patient reports <strong>road accident</strong>. <strong>Lower extremity immobility</strong> (possible fracture). <strong>Head laceration with active bleeding</strong>. <strong>Severe pain</strong>."<br><br><span style="color:var(--red)">⚡ MULTI-TRAUMA: Head injury + suspected fracture</span><br><span style="color:var(--amber)">😖 Emotional State: Severe pain, shock</span><br><span style="color:var(--cyan)">🏥 Recommended: C-spine precaution, CT head, X-ray limb</span>`,
            alert: 'TRAUMA ALERT: Road accident. Head laceration + suspected lower limb fracture. C-spine precaution needed. Priority: IMMEDIATE.',
            emotion: 'Severe pain', urgency: 'IMMEDIATE'
        }
    };

    const emotBadge = document.querySelector('.emotion-badge');
    const urgBadge = document.querySelector('.urgency-badge');

    document.querySelectorAll('.scenario-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const key = btn.dataset.scenario;
            const s = scenarios[key];
            if (!s) return;
            const lang = document.getElementById('inputLang').value;
            input.value = s['input_' + lang] || s.input_tamil;

            // Show processing animation
            output.innerHTML = '<p style="color:var(--cyan);text-align:center"><span class="typing-dots">⏳ Processing translation with emotion & context analysis...</span></p>';

            setTimeout(() => {
                output.innerHTML = s.translation;
                emotBadge.textContent = '😰 Emotion: ' + s.emotion;
                urgBadge.textContent = '🚨 Urgency: ' + s.urgency;
                alertEl.style.display = 'flex';
                alertText.textContent = s.alert;
            }, 1500);
        });
    });

    document.getElementById('transSpeak')?.addEventListener('click', () => {
        if ('speechSynthesis' in window) {
            const text = output.textContent.replace(/[🚨⚡😰🏥⚠️😟🚑😖]/g, '');
            const utt = new SpeechSynthesisUtterance(text);
            utt.rate = 0.85;
            speechSynthesis.speak(utt);
        }
    });

    document.getElementById('transAlert')?.addEventListener('click', () => {
        if (alertEl.style.display !== 'flex') {
            alertEl.style.display = 'flex';
            alertText.textContent = 'Emergency medical alert sent to on-duty physician and cardiac/trauma team.';
        }
    });
}

// ============ EMOTION ANALYZER ============
function initEmotionAnalyzer() {
    const input = document.getElementById('emotionInput');
    const analyzeBtn = document.getElementById('analyzeEmotion');
    const result = document.getElementById('emotionResult');
    const barsContainer = document.getElementById('emotionBars');
    const insightEl = document.getElementById('emotionInsight');
    if (!input || !analyzeBtn) return;

    const analyses = {
        "I'm fine, don't worry about me": {
            emotions: [
                { label: 'Sadness', surface: 5, hidden: 72, color: '#00D4FF' },
                { label: 'Loneliness', surface: 3, hidden: 65, color: '#7C5CFC' },
                { label: 'Suppression', surface: 90, hidden: 80, color: '#FF6B9D' },
                { label: 'Anxiety', surface: 8, hidden: 55, color: '#FFB347' },
                { label: 'Happiness', surface: 85, hidden: 12, color: '#00F5A0' },
            ],
            insight: '🔍 <strong>Incongruence Detected:</strong> Text says "fine" but language patterns indicate emotional suppression. The phrase "don\'t worry about me" is a classic deflection marker. <strong>Hidden state: Sadness + Loneliness.</strong> The person likely needs support but doesn\'t want to burden others.',
            stress: { tremor: 35, pitch: 60, rate: 20, breath: 45 }
        },
        "I can handle everything by myself, I don't need anyone's help": {
            emotions: [
                { label: 'Overwhelm', surface: 5, hidden: 78, color: '#FF6B9D' },
                { label: 'Pride', surface: 80, hidden: 30, color: '#00F5A0' },
                { label: 'Exhaustion', surface: 10, hidden: 70, color: '#7C5CFC' },
                { label: 'Fear of vuln.', surface: 3, hidden: 85, color: '#00D4FF' },
                { label: 'Anger', surface: 40, hidden: 55, color: '#FFB347' },
            ],
            insight: '🔍 <strong>Defense Mechanism Active:</strong> Hyper-independence language often indicates past hurt or fear of vulnerability. The emphatic "by myself" suggests the person is overwhelmed but equates asking for help with weakness. <strong>Hidden state: Overwhelm + Fear of Vulnerability.</strong>',
            stress: { tremor: 25, pitch: 70, rate: 65, breath: 30 }
        },
        "Whatever, it doesn't matter anyway, nothing ever works out": {
            emotions: [
                { label: 'Hopelessness', surface: 20, hidden: 88, color: '#7C5CFC' },
                { label: 'Depression', surface: 15, hidden: 82, color: '#FF6B9D' },
                { label: 'Anger', surface: 60, hidden: 45, color: '#FFB347' },
                { label: 'Apathy', surface: 85, hidden: 30, color: '#00D4FF' },
                { label: 'Desire for help', surface: 2, hidden: 70, color: '#00F5A0' },
            ],
            insight: '🔍 <strong>⚠️ Concerning Pattern:</strong> Absolute language ("nothing EVER") combined with dismissive tone ("whatever") strongly indicates learned helplessness and possible depressive episode. <strong>Hidden state: Hopelessness + Depression.</strong> Recommend gentle check-in and professional support resources.',
            stress: { tremor: 50, pitch: 15, rate: 25, breath: 55 }
        },
        "I'm so happy for them, they really deserve this promotion more than me": {
            emotions: [
                { label: 'Jealousy', surface: 2, hidden: 72, color: '#00F5A0' },
                { label: 'Inadequacy', surface: 5, hidden: 80, color: '#FF6B9D' },
                { label: 'Happiness', surface: 90, hidden: 25, color: '#00D4FF' },
                { label: 'Self-doubt', surface: 8, hidden: 75, color: '#7C5CFC' },
                { label: 'Resentment', surface: 3, hidden: 45, color: '#FFB347' },
            ],
            insight: '🔍 <strong>Comparative Self-Diminishment:</strong> Adding "more than me" reveals comparison and inadequacy. The surface happiness is genuine but mixed with deep self-doubt. <strong>Hidden state: Inadequacy + Jealousy (unexpressed).</strong> This person would benefit from recognition of their own achievements.',
            stress: { tremor: 15, pitch: 45, rate: 40, breath: 20 }
        }
    };

    function analyze(text) {
        const data = analyses[text] || {
            emotions: [
                { label: 'Curiosity', surface: 60, hidden: 55, color: '#00D4FF' },
                { label: 'Neutral', surface: 70, hidden: 40, color: '#7C5CFC' },
                { label: 'Interest', surface: 50, hidden: 45, color: '#00F5A0' },
                { label: 'Anxiety', surface: 15, hidden: 30, color: '#FFB347' },
                { label: 'Sincerity', surface: 65, hidden: 60, color: '#FF6B9D' },
            ],
            insight: '🔍 <strong>Analysis:</strong> The text shows ' + (text.length > 30 ? 'complex' : 'moderate') + ' emotional signatures. Surface emotion appears ' + (text.includes('!') ? 'energetic' : 'measured') + '. Hidden patterns suggest underlying ' + (text.includes('?') ? 'uncertainty and seeking' : 'processing and reflection') + '.',
            stress: { tremor: 20, pitch: 35, rate: 45, breath: 25 }
        };
        return data;
    }

    function renderAnalysis(data) {
        result.style.display = 'block';
        barsContainer.innerHTML = '';
        data.emotions.forEach(emo => {
            const row = document.createElement('div');
            row.className = 'emo-bar-row';
            row.innerHTML = `
                <span class="emo-bar-label">${emo.label}</span>
                <div class="emo-bar-track"><div class="emo-bar-fill" style="width:0%;background:${emo.color}55" data-w="${emo.surface}%"></div></div>
                <span class="emo-bar-val" style="color:${emo.color}">${emo.surface}%</span>
                <div class="emo-bar-track"><div class="emo-bar-fill" style="width:0%;background:${emo.color}" data-w="${emo.hidden}%"></div></div>
                <span class="emo-bar-val" style="color:${emo.color}">${emo.hidden}%</span>`;
            barsContainer.appendChild(row);
        });
        setTimeout(() => {
            barsContainer.querySelectorAll('.emo-bar-fill').forEach(bar => {
                bar.style.width = bar.dataset.w;
            });
        }, 100);
        insightEl.innerHTML = data.insight;

        // Update stress bars
        const s = data.stress;
        animateStress('tremorBar', s.tremor);
        animateStress('pitchBar', s.pitch);
        animateStress('rateBar', s.rate);
        animateStress('breathBar', s.breath);

        // Update emotion radar
        updateEmotionRadar(data.emotions);
    }

    function animateStress(id, val) {
        const el = document.getElementById(id);
        if (el) {
            el.style.transition = 'width 0.8s ease';
            el.style.width = val + '%';
        }
    }

    analyzeBtn.addEventListener('click', () => {
        const text = input.value.trim();
        if (!text) return;
        renderAnalysis(analyze(text));
    });
    input.addEventListener('keydown', e => {
        if (e.key === 'Enter') {
            const text = input.value.trim();
            if (text) renderAnalysis(analyze(text));
        }
    });

    document.querySelectorAll('.emotion-preset').forEach(btn => {
        btn.addEventListener('click', () => {
            const text = btn.dataset.text;
            input.value = text;
            renderAnalysis(analyze(text));
        });
    });
}

// ============ EMOTION RADAR ============
function initEmotionRadar() {
    const canvas = document.getElementById('emotionRadar');
    if (!canvas) return;
    drawEmotionRadarChart(canvas, [50, 50, 50, 50, 50], [50, 50, 50, 50, 50]);
}

function updateEmotionRadar(emotions) {
    const canvas = document.getElementById('emotionRadar');
    if (!canvas) return;
    const surface = emotions.map(e => e.surface);
    const hidden = emotions.map(e => e.hidden);
    drawEmotionRadarChart(canvas, surface, hidden);
}

function drawEmotionRadarChart(canvas, surface, hidden) {
    const ctx = canvas.getContext('2d');
    const cx = 200, cy = 200, r = 140;
    const labels = ['Emotion 1', 'Emotion 2', 'Emotion 3', 'Emotion 4', 'Emotion 5'];
    const n = labels.length;

    ctx.clearRect(0, 0, 400, 400);

    // Grid rings
    for (let ring = 1; ring <= 4; ring++) {
        ctx.beginPath();
        for (let i = 0; i <= n; i++) {
            const a = (Math.PI * 2 / n) * i - Math.PI / 2;
            const rr = r * ring / 4;
            const x = cx + Math.cos(a) * rr, y = cy + Math.sin(a) * rr;
            i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.strokeStyle = 'rgba(255,255,255,0.06)';
        ctx.stroke();
    }

    // Axes
    for (let i = 0; i < n; i++) {
        const a = (Math.PI * 2 / n) * i - Math.PI / 2;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r);
        ctx.strokeStyle = 'rgba(255,255,255,0.04)';
        ctx.stroke();
    }

    // Surface shape
    ctx.beginPath();
    for (let i = 0; i <= n; i++) {
        const a = (Math.PI * 2 / n) * (i % n) - Math.PI / 2;
        const val = (surface[i % n] || 50) / 100;
        const x = cx + Math.cos(a) * r * val, y = cy + Math.sin(a) * r * val;
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fillStyle = 'rgba(255,107,157,0.12)';
    ctx.fill();
    ctx.strokeStyle = '#FF6B9D';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Hidden shape
    ctx.beginPath();
    for (let i = 0; i <= n; i++) {
        const a = (Math.PI * 2 / n) * (i % n) - Math.PI / 2;
        const val = (hidden[i % n] || 50) / 100;
        const x = cx + Math.cos(a) * r * val, y = cy + Math.sin(a) * r * val;
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fillStyle = 'rgba(124,92,252,0.12)';
    ctx.fill();
    ctx.strokeStyle = '#7C5CFC';
    ctx.lineWidth = 2;
    ctx.stroke();
}

// ============ EMERGENCY DEMO ============
function initEmergencyDemo() {
    const startBtn = document.getElementById('startEmergency');
    const patientMsgs = document.getElementById('patientMessages');
    const doctorMsgs = document.getElementById('doctorMessages');
    const echoMeta = document.getElementById('echoMeta');
    const progressRing = document.querySelector('.echo-progress-ring');
    if (!startBtn) return;

    const tabBtns = document.querySelectorAll('.tab-btn[data-etab]');
    let currentScenario = 'cardiac';

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentScenario = btn.dataset.etab;
            patientMsgs.innerHTML = '';
            doctorMsgs.innerHTML = '';
            startBtn.style.display = 'block';
            startBtn.textContent = '▶ Start Emergency Scenario';
        });
    });

    const scenarios = {
        cardiac: [
            { side: 'patient', text: '🗣️ "மார்பு வலிக்குது, மூச்சு விட கஷ்டமா இருக்கு"', meta: '🔄 Processing Tamil...', progress: 30 },
            { side: 'doctor', text: '📋 <strong>ECHO:</strong> "Patient reports crushing chest pain and difficulty breathing. HIGH PROBABILITY: Cardiac event."', meta: '😰 Emotion: Severe distress', progress: 60 },
            { side: 'patient', text: '😰 "ரொம்ப பயமா இருக்கு... காப்பாத்துங்க"', meta: '🔄 Detecting panic...', progress: 75 },
            { side: 'doctor', text: '🚨 <strong>ECHO ALERT:</strong> "Patient is expressing fear for life. Panic detected. Urgency level: MAXIMUM. Cardiac team auto-notified."', meta: '🚨 CARDIAC ALERT SENT', progress: 100 },
            { side: 'doctor', text: '👨‍⚕️ "Can you ask him when the pain started?"', meta: '🔄 Translating to Tamil...', progress: 50 },
            { side: 'patient', text: '🔊 Echo speaks in Tamil: "வலி எப்போ ஆரம்பிச்சுது?"<br>Patient: "ஒரு மணி நேரமா"', meta: '✅ Bi-directional complete', progress: 100 },
            { side: 'doctor', text: '📋 <strong>ECHO:</strong> "Pain started approximately 1 hour ago. Auto-recording vitals request sent to nursing station. ECG ordered."', meta: '📁 Medical chart updated', progress: 100 },
        ],
        allergy: [
            { side: 'patient', text: '🗣️ "होंठ सूज गए हैं, सांस लेना मुश्किल हो रहा है"', meta: '🔄 Processing Hindi...', progress: 30 },
            { side: 'doctor', text: '⚠️ <strong>ECHO:</strong> "Patient reports lip swelling and breathing difficulty. POSSIBLE: Anaphylactic reaction. Airway compromise risk."', meta: '😟 Emotion: Frightened', progress: 60 },
            { side: 'patient', text: '😰 "कुछ खाया था... पता नहीं क्या था"', meta: '🔄 Analyzing food trigger...', progress: 80 },
            { side: 'doctor', text: '🚨 <strong>ECHO:</strong> "Food-triggered allergic reaction. Unknown allergen. Recommending: Epinephrine standby, airway monitoring, allergy panel."', meta: '💉 EPIPEN ALERT', progress: 100 },
        ],
        stroke: [
            { side: 'patient', text: '🗣️ "తల తిరుగుతోంది... ఒక వైపు చేయి పనిచేయడం లేదు" (slurred)', meta: '🔄 Processing Telugu...', progress: 30 },
            { side: 'doctor', text: '🧠 <strong>ECHO:</strong> "Patient reports dizziness and unilateral arm weakness. Speech is slurred. HIGH ALERT: Possible cerebrovascular accident (stroke)."', meta: '🧠 STROKE PROTOCOL', progress: 70 },
            { side: 'patient', text: '😰 Speech becoming incoherent...', meta: '⚠️ Speech deteriorating', progress: 85 },
            { side: 'doctor', text: '🚨 <strong>ECHO:</strong> "FAST assessment positive. Time-critical: CT scan STAT. Neurology consult. Last known well time being calculated from conversation timestamps."', meta: '🏥 STROKE TEAM PAGED', progress: 100 },
        ]
    };

    startBtn.addEventListener('click', () => {
        startBtn.style.display = 'none';
        patientMsgs.innerHTML = '';
        doctorMsgs.innerHTML = '';
        const steps = scenarios[currentScenario];

        steps.forEach((step, i) => {
            setTimeout(() => {
                const msg = document.createElement('div');
                msg.className = `em-msg ${step.side === 'patient' ? 'patient-msg' : 'doctor-msg'}`;
                msg.innerHTML = step.text;

                if (step.side === 'patient') {
                    patientMsgs.appendChild(msg);
                    patientMsgs.scrollTop = patientMsgs.scrollHeight;
                } else {
                    doctorMsgs.appendChild(msg);
                    doctorMsgs.scrollTop = doctorMsgs.scrollHeight;
                }

                echoMeta.innerHTML = `<span class="em-tag">${step.meta}</span>`;

                // Animate progress ring
                if (progressRing) {
                    const circumference = 2 * Math.PI * 42;
                    const offset = circumference - (step.progress / 100) * circumference;
                    progressRing.style.strokeDashoffset = offset;
                }
            }, (i + 1) * 2000);
        });

        setTimeout(() => {
            startBtn.style.display = 'block';
            startBtn.textContent = '🔄 Replay Scenario';
        }, (steps.length + 1) * 2000);
    });
}

// ============ SCROLL ANIMATIONS ============
function initEchoScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Count ups
                entry.target.querySelectorAll('.count-up, [data-target]').forEach(el => {
                    const target = parseInt(el.dataset.target);
                    if (!target || el.dataset.counted) return;
                    el.dataset.counted = 'true';
                    let current = 0;
                    const step = target / 60;
                    const interval = setInterval(() => {
                        current += step;
                        if (current >= target) { current = target; clearInterval(interval); }
                        el.textContent = Math.round(current);
                    }, 25);
                });
            }
        });
    }, { threshold: 0.15 });

    document.querySelectorAll('.section, .glass-card, .glass-card-sm, .hero-stats, .echo-pillar-card').forEach(el => observer.observe(el));
}

// ============ SMOOTH SCROLL ============
function initEchoSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', e => {
            e.preventDefault();
            const target = document.querySelector(a.getAttribute('href'));
            if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });
}

// ============ NAV ============
function initEchoNav() {
    const nav = document.getElementById('mainNav');
    if (!nav) return;
    window.addEventListener('scroll', () => {
        nav.classList.toggle('scrolled', window.scrollY > 50);
    });
}
