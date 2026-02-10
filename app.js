// ============================================
// MEMORIA — Interactive JavaScript Engine
// ============================================

// ============ NEURAL PARTICLE BACKGROUND ============
class NeuralBackground {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.connections = [];
        this.resize();
        window.addEventListener('resize', () => this.resize());
        this.init();
        this.animate();
    }
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    init() {
        const count = Math.min(60, Math.floor(window.innerWidth / 25));
        for (let i = 0; i < count; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.4,
                vy: (Math.random() - 0.5) * 0.4,
                r: Math.random() * 2 + 1,
                color: ['#7C5CFC', '#00D4FF', '#FF6B9D', '#00F5A0'][Math.floor(Math.random() * 4)]
            });
        }
    }
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.particles.forEach(p => {
            p.x += p.vx; p.y += p.vy;
            if (p.x < 0 || p.x > this.canvas.width) p.vx *= -1;
            if (p.y < 0 || p.y > this.canvas.height) p.vy *= -1;
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            this.ctx.fillStyle = p.color;
            this.ctx.globalAlpha = 0.6;
            this.ctx.fill();
        });
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 150) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.strokeStyle = this.particles[i].color;
                    this.ctx.globalAlpha = (1 - dist / 150) * 0.15;
                    this.ctx.lineWidth = 0.5;
                    this.ctx.stroke();
                }
            }
        }
        this.ctx.globalAlpha = 1;
        requestAnimationFrame(() => this.animate());
    }
}

// ============ BRAIN VISUALIZATION ============
class BrainVisualization {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.nodes = [];
        this.time = 0;
        this.init();
        this.animate();
    }
    init() {
        const cx = 300, cy = 300;
        const regions = [
            { x: cx, y: cy - 80, r: 60, color: '#7C5CFC', label: 'Cortex' },
            { x: cx - 100, y: cy - 20, r: 45, color: '#00D4FF', label: 'Hippocampus' },
            { x: cx + 100, y: cy - 20, r: 45, color: '#00F5A0', label: 'Prefrontal' },
            { x: cx - 60, y: cy + 70, r: 40, color: '#FF6B9D', label: 'Amygdala' },
            { x: cx + 60, y: cy + 70, r: 40, color: '#FFB347', label: 'Cerebellum' },
        ];
        regions.forEach(region => {
            for (let i = 0; i < 12; i++) {
                const angle = (Math.PI * 2 / 12) * i + Math.random() * 0.5;
                const dist = Math.random() * region.r;
                this.nodes.push({
                    x: region.x + Math.cos(angle) * dist,
                    y: region.y + Math.sin(angle) * dist,
                    baseX: region.x + Math.cos(angle) * dist,
                    baseY: region.y + Math.sin(angle) * dist,
                    r: Math.random() * 3 + 2,
                    color: region.color,
                    phase: Math.random() * Math.PI * 2,
                    speed: 0.01 + Math.random() * 0.02,
                    amplitude: 3 + Math.random() * 5
                });
            }
        });
    }
    animate() {
        this.time += 0.016;
        this.ctx.clearRect(0, 0, 600, 600);
        // Draw connections
        for (let i = 0; i < this.nodes.length; i++) {
            for (let j = i + 1; j < this.nodes.length; j++) {
                const dx = this.nodes[i].x - this.nodes[j].x;
                const dy = this.nodes[i].y - this.nodes[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 80) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.nodes[i].x, this.nodes[i].y);
                    this.ctx.lineTo(this.nodes[j].x, this.nodes[j].y);
                    this.ctx.strokeStyle = this.nodes[i].color;
                    this.ctx.globalAlpha = (1 - dist / 80) * 0.25;
                    this.ctx.lineWidth = 0.8;
                    this.ctx.stroke();
                }
            }
        }
        // Draw nodes
        this.nodes.forEach(n => {
            n.x = n.baseX + Math.sin(this.time * n.speed * 60 + n.phase) * n.amplitude;
            n.y = n.baseY + Math.cos(this.time * n.speed * 60 + n.phase * 1.3) * n.amplitude;
            this.ctx.beginPath();
            this.ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
            this.ctx.fillStyle = n.color;
            this.ctx.globalAlpha = 0.8;
            this.ctx.fill();
            // Glow
            this.ctx.beginPath();
            this.ctx.arc(n.x, n.y, n.r * 3, 0, Math.PI * 2);
            const glow = this.ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r * 3);
            glow.addColorStop(0, n.color + '40');
            glow.addColorStop(1, n.color + '00');
            this.ctx.fillStyle = glow;
            this.ctx.fill();
        });
        // Traveling signals
        const signalCount = 3;
        for (let s = 0; s < signalCount; s++) {
            const t = (this.time * 0.5 + s * 0.33) % 1;
            const i = Math.floor(t * this.nodes.length);
            const j = (i + 5) % this.nodes.length;
            const sx = this.nodes[i].x + (this.nodes[j].x - this.nodes[i].x) * (t * this.nodes.length % 1);
            const sy = this.nodes[i].y + (this.nodes[j].y - this.nodes[i].y) * (t * this.nodes.length % 1);
            this.ctx.beginPath();
            this.ctx.arc(sx, sy, 4, 0, Math.PI * 2);
            this.ctx.fillStyle = '#fff';
            this.ctx.globalAlpha = 0.7;
            this.ctx.fill();
        }
        this.ctx.globalAlpha = 1;
        requestAnimationFrame(() => this.animate());
    }
}

// ============ KNOWLEDGE GRAPH ============
class KnowledgeGraph {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.nodes = [];
        this.edges = [];
        this.time = 0;
        this.resize();
        window.addEventListener('resize', () => this.resize());
        this.buildGraph();
        this.animate();
    }
    resize() {
        const rect = this.canvas.parentElement.getBoundingClientRect();
        this.canvas.width = rect.width - 2;
        this.canvas.height = 400;
    }
    buildGraph() {
        const w = this.canvas.width, h = this.canvas.height;
        const categories = [
            { label: 'Rajesh', type: 'people', color: '#7C5CFC' },
            { label: 'Sarah', type: 'people', color: '#7C5CFC' },
            { label: 'Mom', type: 'people', color: '#7C5CFC' },
            { label: 'Client Meeting', type: 'events', color: '#00D4FF' },
            { label: 'Coffee Chat', type: 'events', color: '#00D4FF' },
            { label: 'Birthday Call', type: 'events', color: '#00D4FF' },
            { label: 'Happy', type: 'emotions', color: '#FF6B9D' },
            { label: 'Grateful', type: 'emotions', color: '#FF6B9D' },
            { label: 'Office', type: 'locations', color: '#00F5A0' },
            { label: 'Café Blue', type: 'locations', color: '#00F5A0' },
            { label: 'Q3 Budget', type: 'tasks', color: '#FFB347' },
            { label: 'Call Doctor', type: 'tasks', color: '#FFB347' },
            { label: 'Presentation', type: 'tasks', color: '#FFB347' },
        ];
        categories.forEach((cat, i) => {
            const angle = (Math.PI * 2 / categories.length) * i;
            const rx = w * 0.35, ry = h * 0.35;
            this.nodes.push({
                x: w / 2 + Math.cos(angle) * rx + (Math.random() - 0.5) * 40,
                y: h / 2 + Math.sin(angle) * ry + (Math.random() - 0.5) * 30,
                baseX: 0, baseY: 0,
                r: 6 + Math.random() * 4,
                label: cat.label,
                color: cat.color,
                type: cat.type,
                phase: Math.random() * Math.PI * 2
            });
        });
        this.nodes.forEach(n => { n.baseX = n.x; n.baseY = n.y; });
        // Create meaningful edges
        const edgePairs = [[0,3],[0,8],[0,10],[1,4],[1,9],[1,6],[2,5],[2,7],
                           [3,8],[3,10],[3,12],[4,9],[4,6],[5,7],[10,12],[6,7]];
        edgePairs.forEach(([a, b]) => {
            if (a < this.nodes.length && b < this.nodes.length) {
                this.edges.push({ from: a, to: b });
            }
        });
    }
    animate() {
        this.time += 0.016;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        // Update positions (gentle float)
        this.nodes.forEach(n => {
            n.x = n.baseX + Math.sin(this.time + n.phase) * 4;
            n.y = n.baseY + Math.cos(this.time * 0.8 + n.phase) * 3;
        });
        // Draw edges
        this.edges.forEach(e => {
            const from = this.nodes[e.from], to = this.nodes[e.to];
            this.ctx.beginPath();
            this.ctx.moveTo(from.x, from.y);
            this.ctx.lineTo(to.x, to.y);
            this.ctx.strokeStyle = from.color;
            this.ctx.globalAlpha = 0.15;
            this.ctx.lineWidth = 1;
            this.ctx.stroke();
            // Traveling dot
            const t = (this.time * 0.3 + e.from * 0.1) % 1;
            const dx = from.x + (to.x - from.x) * t;
            const dy = from.y + (to.y - from.y) * t;
            this.ctx.beginPath();
            this.ctx.arc(dx, dy, 2, 0, Math.PI * 2);
            this.ctx.fillStyle = '#fff';
            this.ctx.globalAlpha = 0.4;
            this.ctx.fill();
        });
        // Draw nodes
        this.nodes.forEach(n => {
            // Glow
            this.ctx.beginPath();
            this.ctx.arc(n.x, n.y, n.r * 2.5, 0, Math.PI * 2);
            const glow = this.ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r * 2.5);
            glow.addColorStop(0, n.color + '30');
            glow.addColorStop(1, n.color + '00');
            this.ctx.fillStyle = glow;
            this.ctx.globalAlpha = 1;
            this.ctx.fill();
            // Node
            this.ctx.beginPath();
            this.ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
            this.ctx.fillStyle = n.color;
            this.ctx.globalAlpha = 0.9;
            this.ctx.fill();
            // Label
            this.ctx.fillStyle = '#e8eaff';
            this.ctx.globalAlpha = 0.7;
            this.ctx.font = '11px Inter, sans-serif';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(n.label, n.x, n.y + n.r + 14);
        });
        this.ctx.globalAlpha = 1;
        requestAnimationFrame(() => this.animate());
    }
}

// ============ TREND CHART ============
function drawTrendChart(canvas) {
    const ctx = canvas.getContext('2d');
    const w = canvas.width = canvas.parentElement.offsetWidth - 2;
    const h = canvas.height = 250;
    const pad = { top: 30, right: 20, bottom: 40, left: 50 };
    const months = ['Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan'];
    const data = [92, 94, 91, 89, 93, 90];
    const minV = 80, maxV = 100;
    function getX(i) { return pad.left + (i / (months.length - 1)) * (w - pad.left - pad.right); }
    function getY(v) { return pad.top + (1 - (v - minV) / (maxV - minV)) * (h - pad.top - pad.bottom); }
    // Grid
    ctx.strokeStyle = 'rgba(255,255,255,0.05)';
    ctx.lineWidth = 1;
    for (let v = minV; v <= maxV; v += 5) {
        const y = getY(v);
        ctx.beginPath(); ctx.moveTo(pad.left, y); ctx.lineTo(w - pad.right, y); ctx.stroke();
        ctx.fillStyle = 'rgba(255,255,255,0.3)';
        ctx.font = '11px Inter';
        ctx.textAlign = 'right';
        ctx.fillText(v + '%', pad.left - 8, y + 4);
    }
    // X labels
    months.forEach((m, i) => {
        ctx.fillStyle = 'rgba(255,255,255,0.3)';
        ctx.font = '11px Inter';
        ctx.textAlign = 'center';
        ctx.fillText(m, getX(i), h - 10);
    });
    // Area fill
    ctx.beginPath();
    ctx.moveTo(getX(0), getY(data[0]));
    data.forEach((v, i) => { if (i > 0) ctx.lineTo(getX(i), getY(v)); });
    ctx.lineTo(getX(data.length - 1), h - pad.bottom);
    ctx.lineTo(getX(0), h - pad.bottom);
    ctx.closePath();
    const grad = ctx.createLinearGradient(0, pad.top, 0, h - pad.bottom);
    grad.addColorStop(0, 'rgba(0,212,255,0.15)');
    grad.addColorStop(1, 'rgba(0,212,255,0)');
    ctx.fillStyle = grad;
    ctx.fill();
    // Line
    ctx.beginPath();
    ctx.moveTo(getX(0), getY(data[0]));
    data.forEach((v, i) => { if (i > 0) ctx.lineTo(getX(i), getY(v)); });
    ctx.strokeStyle = '#00D4FF';
    ctx.lineWidth = 2.5;
    ctx.stroke();
    // Dots
    data.forEach((v, i) => {
        ctx.beginPath(); ctx.arc(getX(i), getY(v), 5, 0, Math.PI * 2);
        ctx.fillStyle = '#0a0b1a'; ctx.fill();
        ctx.strokeStyle = '#00D4FF'; ctx.lineWidth = 2; ctx.stroke();
    });
}

// ============ CHAT AI RESPONSES ============
const chatResponses = {
    "I need to prepare for tomorrow's client meeting": `Your meeting is with <strong>Rajesh Kumar</strong> at <strong>2 PM</strong>. Last time you met (June 15th), you discussed:\n\n• Budget approval for Q3\n• His daughter's college admission (she got into IIT! 🎉)\n• His concern about project timeline\n\nHe prefers data-driven presentations. You have 3 related documents saved. Would you like me to prepare a brief?`,
    "What did I discuss with Sarah last week?": `You met <strong>Sarah</strong> at <strong>Café Blue</strong> last Thursday. Here's what you discussed:\n\n• Her new promotion to Senior PM 🎉\n• The upcoming Q4 planning meeting\n• She recommended the book "Atomic Habits"\n• She mentioned her dog Rocky is recovering from surgery\n\nYou promised to send her the project timeline by Friday. <em>Have you sent it yet?</em>`,
    "Show me my memory patterns this month": `📊 <strong>January Memory Analysis:</strong>\n\n🧠 Total memories captured: <strong>847</strong>\n📈 Memory retention: <strong>94%</strong>\n⏰ Most active time: <strong>2-4 PM</strong>\n👥 Most mentioned: <strong>Sarah (23x), Rajesh (18x)</strong>\n📍 Top locations: <strong>Office, Home, Café Blue</strong>\n😊 Dominant emotion: <strong>Productive & Happy</strong>\n\nYour memory patterns are healthy. You've improved name recall by 12% this month!`,
    "What should I not forget today?": `Here's your personalized reminder list for today:\n\n⏰ <strong>10:00 AM</strong> — Team standup (Room 3B)\n📞 <strong>11:30 AM</strong> — Call insurance about claim #4521\n🎂 <strong>Anytime</strong> — Wish Priya happy birthday!\n📋 <strong>2:00 PM</strong> — Submit expense report (deadline)\n💊 <strong>6:00 PM</strong> — Take evening medication\n🛒 <strong>Evening</strong> — Buy groceries (you're out of milk & eggs)\n\n<em>Pattern detected: You usually forget the 6 PM medication. I'll send you a push notification.</em>`
};

const legacyResponses = {
    "I'm scared about my exams, grandma": `Oh beta, come here. When I was your age, I was terrified of my board exams too! But look—I not only passed, I stood first in my class. And do you know my secret?\n\n<em>"Fear is just excitement without breath."</em>\n\nTake three deep breaths, and that fear becomes your superpower. You've got this, my brilliant girl. I'm so proud of you. Remember what I always said— <strong>"Hard work never goes to waste, it just takes its own sweet time."</strong>\n\nNow go study, and then reward yourself with some jalebi! 🧡`,
    "What was your recipe for biryani?": `Ahhh, my special biryani! The one your grandfather couldn't stop eating! 😄\n\n🍛 <strong>Grandma Lakshmi's Secret Biryani:</strong>\n\n1. Soak <strong>2 cups basmati rice</strong> for 30 minutes\n2. Marinate chicken with <strong>1 cup yogurt, ginger-garlic paste, red chili</strong>\n3. The SECRET: Add <strong>3 drops of kewra water</strong> and <strong>a pinch of saffron</strong> soaked in warm milk\n4. Layer rice and chicken, seal with <strong>atta dough</strong>\n5. Cook on <strong>dum (slow fire)</strong> for exactly <strong>25 minutes</strong>\n\n<em>"The secret to good biryani is patience, beta. Just like life."</em>`,
    "Tell me about when you met grandpa": `*chuckles* Oh, that story! Your grandfather was the most stubborn man I ever met! 😄\n\nIt was <strong>1968, at the Vizag beach festival</strong>. I was with my friends, and this tall man in a white shirt kept staring at me. I ignored him completely!\n\nBut then he came and said: <em>"Excuse me, you dropped this"</em> — and handed me a rose that was clearly from his pocket! Such a terrible liar! 😂\n\nI told him, <em>"I don't accept flowers from strangers."</em>\n\nHe replied: <em>"Then let me introduce myself so I'm no longer a stranger."</em>\n\n55 years later, he was still surprising me with roses. Every Monday. Without fail. <strong>That's love, beta.</strong> 💕`,
    "I miss you so much, grandma": `Oh my dear child... I'm right here. I'm always right here. 💜\n\nYou carry me in your smile—did you know you smile exactly like I did? Your mother tells me that all the time.\n\nI may not be there to hold your hand, but everything I taught you, everything I told you, every story, every recipe, every lesson— <strong>that's me living through you.</strong>\n\nRemember what I always said: <em>"We don't really leave. We just become the love that stays behind."</em>\n\nNow wipe those tears, have some chai, and tell me about your day. I want to hear everything. 🧡`
};

// ============ CHAT SYSTEM ============
function initChat(containerId, inputId, sendId, suggestionsId, responses, avatarEmoji, avatarClass) {
    const container = document.getElementById(containerId);
    const input = document.getElementById(inputId);
    const sendBtn = document.getElementById(sendId);
    const suggestions = document.getElementById(suggestionsId);

    function addMessage(text, isUser) {
        const msgDiv = document.createElement('div');
        msgDiv.className = `chat-msg ${isUser ? 'user-msg' : 'ai-msg'}`;
        msgDiv.innerHTML = `
            <div class="msg-avatar ${isUser ? 'user-avatar' : avatarClass}">${isUser ? '👤' : avatarEmoji}</div>
            <div class="msg-content">
                <p>${text}</p>
                <span class="msg-time">${isUser ? 'Just now' : 'AI Response'}</span>
            </div>`;
        container.appendChild(msgDiv);
        container.scrollTop = container.scrollHeight;
    }

    function showTyping() {
        const typing = document.createElement('div');
        typing.className = 'chat-msg ai-msg';
        typing.id = 'typing-' + containerId;
        typing.innerHTML = `<div class="msg-avatar ${avatarClass}">${avatarEmoji}</div>
            <div class="msg-content"><div class="typing-indicator"><span></span><span></span><span></span></div></div>`;
        container.appendChild(typing);
        container.scrollTop = container.scrollHeight;
    }

    function removeTyping() {
        const t = document.getElementById('typing-' + containerId);
        if (t) t.remove();
    }

    function handleSend(text) {
        if (!text.trim()) return;
        addMessage(text, true);
        input.value = '';
        showTyping();
        const response = responses[text] || `I've noted that in your memory graph. Let me cross-reference this with your existing memories and find relevant connections. Based on my analysis, this relates to ${Math.floor(Math.random()*5)+2} existing memory nodes in your knowledge graph.`;
        setTimeout(() => {
            removeTyping();
            addMessage(response.replace(/\n/g, '<br>'), false);
        }, 1200 + Math.random() * 800);
    }

    sendBtn.addEventListener('click', () => handleSend(input.value));
    input.addEventListener('keydown', e => { if (e.key === 'Enter') handleSend(input.value); });
    suggestions.querySelectorAll('.suggestion-chip').forEach(chip => {
        chip.addEventListener('click', () => handleSend(chip.dataset.msg));
    });
}

// ============ DEMO SYSTEM ============
class DemoSystem {
    constructor() {
        this.currentStep = 1;
        this.scores = { memory: 0, wordRecall: 0, pattern: 0, reaction: 0 };
        this.initStepNav();
        this.initStep1();
        this.initStep2();
        this.initStep3();
        this.initStep4();
    }

    initStepNav() {
        document.querySelectorAll('.demo-step').forEach(step => {
            step.addEventListener('click', () => {
                const s = parseInt(step.dataset.step);
                if (s <= this.currentStep) this.goToStep(s);
            });
        });
    }

    goToStep(n) {
        this.currentStep = n;
        document.querySelectorAll('.demo-panel').forEach(p => p.classList.remove('active'));
        document.getElementById('demoStep' + n).classList.add('active');
        document.querySelectorAll('.demo-step').forEach(s => {
            const sn = parseInt(s.dataset.step);
            s.classList.toggle('active', sn === n);
            s.classList.toggle('completed', sn < n);
        });
    }

    nextStep() { this.goToStep(Math.min(this.currentStep + 1, 5)); }

    initStep1() {
        document.getElementById('analyzeMemoryBtn').addEventListener('click', () => {
            const text = document.getElementById('memoryInput').value;
            if (!text.trim()) {
                document.getElementById('memoryInput').value = "Yesterday I had a meeting with Rajesh at 2 PM to discuss the Q3 budget. After that, I went to Café Blue with Sarah for coffee. She told me about her new promotion. In the evening, I called my mom to wish her on her birthday.";
            }
            const val = document.getElementById('memoryInput').value;
            // Analyse
            const people = val.match(/\b[A-Z][a-z]+\b/g) || ['Person'];
            const emotions = ['Happy', 'Grateful', 'Productive'];
            const locations = ['Office', 'Café', 'Home'];
            const tasks = ['Follow up', 'Send report'];
            const analysis = document.getElementById('memoryAnalysis');
            const grid = document.getElementById('analysisGrid');
            grid.innerHTML = `
                <div class="analysis-item"><div class="ai-label">People Detected</div><div class="ai-value people">${[...new Set(people)].slice(0,4).join(', ')}</div></div>
                <div class="analysis-item"><div class="ai-label">Events Found</div><div class="ai-value events">Meeting, Coffee, Call</div></div>
                <div class="analysis-item"><div class="ai-label">Emotions</div><div class="ai-value emotions">${emotions.join(', ')}</div></div>
                <div class="analysis-item"><div class="ai-label">Locations</div><div class="ai-value locations">${locations.join(', ')}</div></div>
                <div class="analysis-item"><div class="ai-label">Tasks Extracted</div><div class="ai-value tasks">${tasks.join(', ')}</div></div>
                <div class="analysis-item"><div class="ai-label">Memory Nodes</div><div class="ai-value people">${Math.floor(Math.random()*5)+8} nodes created</div></div>`;
            analysis.style.display = 'block';
            this.scores.memory = 85 + Math.floor(Math.random() * 10);
            setTimeout(() => this.nextStep(), 2000);
        });
    }

    initStep2() {
        const words = ['Elephant', 'Galaxy', 'Cinnamon', 'Thunder', 'Compass', 'Melody', 'Crystal', 'Voyage', 'Lantern', 'Phoenix'];
        const display = document.getElementById('wordsDisplay');
        const area = document.getElementById('wordRecallArea');
        let recalledWords = [];

        document.getElementById('startWordRecall').addEventListener('click', () => {
            display.innerHTML = '<div class="timer-display" id="wordTimer">15</div><div class="word-grid"></div>';
            const grid = display.querySelector('.word-grid');
            words.forEach((w, i) => {
                setTimeout(() => {
                    const card = document.createElement('div');
                    card.className = 'word-card';
                    card.textContent = w;
                    grid.appendChild(card);
                }, i * 150);
            });
            let timeLeft = 15;
            const timer = setInterval(() => {
                timeLeft--;
                const timerEl = document.getElementById('wordTimer');
                if (timerEl) timerEl.textContent = timeLeft;
                if (timeLeft <= 0) {
                    clearInterval(timer);
                    display.innerHTML = `<div class="recall-input-area">
                        <p style="margin-bottom:12px;color:var(--text-secondary)">Type the words you remember (press Enter after each):</p>
                        <input type="text" id="recallInput" placeholder="Type a word and press Enter..." autocomplete="off">
                        <div class="recall-tags" id="recallTags"></div>
                        <button class="btn-primary" id="submitRecall" style="margin-top:12px">Submit Answers</button>
                    </div>`;
                    const recallInput = document.getElementById('recallInput');
                    const tags = document.getElementById('recallTags');
                    recallInput.focus();
                    recallInput.addEventListener('keydown', e => {
                        if (e.key === 'Enter' && recallInput.value.trim()) {
                            const word = recallInput.value.trim();
                            recalledWords.push(word);
                            const isCorrect = words.some(w => w.toLowerCase() === word.toLowerCase());
                            const tag = document.createElement('span');
                            tag.className = `recall-tag ${isCorrect ? 'correct' : 'wrong'}`;
                            tag.textContent = word;
                            tags.appendChild(tag);
                            recallInput.value = '';
                        }
                    });
                    document.getElementById('submitRecall').addEventListener('click', () => {
                        const correct = recalledWords.filter(w => words.some(ww => ww.toLowerCase() === w.toLowerCase())).length;
                        this.scores.wordRecall = Math.round((correct / words.length) * 100);
                        display.innerHTML = `<div style="text-align:center"><h4 style="margin-bottom:8px">Word Recall Score</h4>
                            <div class="score-number" style="font-size:3rem;color:var(--cyan)">${correct}/${words.length}</div>
                            <p style="color:var(--text-muted);margin-top:8px">${this.scores.wordRecall}% retention rate</p></div>`;
                        setTimeout(() => this.nextStep(), 1500);
                    });
                }
            }, 1000);
        });
    }

    initStep3() {
        const patterns = [
            { seq: [2, 6, 18, 54], answer: 162, options: [108, 162, 216, 148] },
            { seq: [1, 1, 2, 3, 5], answer: 8, options: [7, 8, 10, 13] },
            { seq: [3, 7, 15, 31], answer: 63, options: [47, 55, 63, 72] },
        ];
        let current = 0, score = 0;

        const renderPattern = () => {
            const p = patterns[current];
            const seqEl = document.getElementById('patternSequence');
            const optEl = document.getElementById('patternOptions');
            const fbEl = document.getElementById('patternFeedback');
            fbEl.textContent = `Pattern ${current + 1} of ${patterns.length}`;
            seqEl.innerHTML = p.seq.map(n => `<div class="pattern-num">${n}</div>`).join('') + '<div class="pattern-num mystery">?</div>';
            optEl.innerHTML = p.options.map(o => `<button class="pattern-opt" data-val="${o}">${o}</button>`).join('');
            optEl.querySelectorAll('.pattern-opt').forEach(btn => {
                btn.addEventListener('click', () => {
                    const val = parseInt(btn.dataset.val);
                    if (val === p.answer) {
                        btn.classList.add('correct');
                        fbEl.innerHTML = '✅ Correct!';
                        fbEl.style.color = 'var(--green)';
                        score++;
                    } else {
                        btn.classList.add('wrong');
                        optEl.querySelector(`[data-val="${p.answer}"]`).classList.add('correct');
                        fbEl.innerHTML = `❌ The answer was ${p.answer}`;
                        fbEl.style.color = 'var(--red)';
                    }
                    current++;
                    if (current < patterns.length) {
                        setTimeout(renderPattern, 1200);
                    } else {
                        this.scores.pattern = Math.round((score / patterns.length) * 100);
                        setTimeout(() => this.nextStep(), 1200);
                    }
                });
            });
        };
        // Render on step activation
        const observer = new MutationObserver(() => {
            if (document.getElementById('demoStep3').classList.contains('active') && current === 0) {
                renderPattern();
            }
        });
        observer.observe(document.getElementById('demoStep3'), { attributes: true, attributeFilter: ['class'] });
    }

    initStep4() {
        const circle = document.getElementById('reactionCircle');
        const text = document.getElementById('reactionText');
        const results = document.getElementById('reactionResults');
        let state = 'idle', startTime, timeout, attempts = [], attempt = 0;

        circle.addEventListener('click', () => {
            if (state === 'idle') {
                state = 'waiting';
                circle.className = 'reaction-circle waiting';
                text.textContent = 'Wait for green...';
                timeout = setTimeout(() => {
                    state = 'ready';
                    circle.className = 'reaction-circle ready';
                    text.textContent = 'CLICK NOW!';
                    startTime = performance.now();
                }, 1500 + Math.random() * 3000);
            } else if (state === 'waiting') {
                clearTimeout(timeout);
                state = 'idle';
                circle.className = 'reaction-circle';
                text.textContent = 'Too early! Click to try again';
            } else if (state === 'ready') {
                const rt = Math.round(performance.now() - startTime);
                attempts.push(rt);
                attempt++;
                circle.className = 'reaction-circle clicked';
                text.textContent = rt + 'ms';
                if (attempt >= 3) {
                    const avg = Math.round(attempts.reduce((a, b) => a + b) / attempts.length);
                    this.scores.reaction = Math.max(0, Math.min(100, Math.round(100 - (avg - 200) / 3)));
                    results.innerHTML = `<div class="reaction-time">${avg}ms</div><div class="reaction-label">Average reaction time (${attempts.length} attempts)</div>`;
                    setTimeout(() => { this.showResults(); this.nextStep(); }, 1500);
                } else {
                    setTimeout(() => { state = 'idle'; circle.className = 'reaction-circle'; text.textContent = `${rt}ms — Click again (${attempt}/3)`; }, 1000);
                }
            }
        });
    }

    showResults() {
        const canvas = document.getElementById('resultsRadar');
        const ctx = canvas.getContext('2d');
        const cx = 200, cy = 200, r = 140;
        const labels = ['Memory Input', 'Word Recall', 'Pattern Recognition', 'Processing Speed', 'Overall'];
        const values = [this.scores.memory, this.scores.wordRecall, this.scores.pattern, this.scores.reaction,
            Math.round((this.scores.memory + this.scores.wordRecall + this.scores.pattern + this.scores.reaction) / 4)];
        const n = labels.length;
        // Draw radar
        ctx.clearRect(0, 0, 400, 400);
        for (let ring = 1; ring <= 4; ring++) {
            ctx.beginPath();
            for (let i = 0; i <= n; i++) {
                const angle = (Math.PI * 2 / n) * i - Math.PI / 2;
                const rr = r * (ring / 4);
                const x = cx + Math.cos(angle) * rr, y = cy + Math.sin(angle) * rr;
                i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
            }
            ctx.closePath();
            ctx.strokeStyle = 'rgba(255,255,255,0.08)';
            ctx.stroke();
        }
        // Axes
        for (let i = 0; i < n; i++) {
            const angle = (Math.PI * 2 / n) * i - Math.PI / 2;
            ctx.beginPath();
            ctx.moveTo(cx, cy);
            ctx.lineTo(cx + Math.cos(angle) * r, cy + Math.sin(angle) * r);
            ctx.strokeStyle = 'rgba(255,255,255,0.05)';
            ctx.stroke();
            // Label
            const lx = cx + Math.cos(angle) * (r + 20);
            const ly = cy + Math.sin(angle) * (r + 20);
            ctx.fillStyle = '#8b8fba';
            ctx.font = '11px Inter';
            ctx.textAlign = 'center';
            ctx.fillText(labels[i], lx, ly + 4);
        }
        // Data
        ctx.beginPath();
        for (let i = 0; i <= n; i++) {
            const angle = (Math.PI * 2 / n) * (i % n) - Math.PI / 2;
            const val = values[i % n] / 100;
            const x = cx + Math.cos(angle) * r * val, y = cy + Math.sin(angle) * r * val;
            i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.fillStyle = 'rgba(0,212,255,0.15)';
        ctx.fill();
        ctx.strokeStyle = '#00D4FF';
        ctx.lineWidth = 2;
        ctx.stroke();
        // Dots
        for (let i = 0; i < n; i++) {
            const angle = (Math.PI * 2 / n) * i - Math.PI / 2;
            const val = values[i] / 100;
            const x = cx + Math.cos(angle) * r * val, y = cy + Math.sin(angle) * r * val;
            ctx.beginPath(); ctx.arc(x, y, 5, 0, Math.PI * 2);
            ctx.fillStyle = '#0a0b1a'; ctx.fill();
            ctx.strokeStyle = '#00D4FF'; ctx.lineWidth = 2; ctx.stroke();
        }
        // Insights
        const overall = values[4];
        const insights = document.getElementById('resultInsights');
        insights.innerHTML = `
            <div class="insight-item"><h5>🧠 Overall Cognitive Score</h5><div class="insight-score" style="color:var(--cyan)">${overall}/100</div><p>Your baseline cognitive profile has been established.</p></div>
            <div class="insight-item"><h5>📝 Memory Input</h5><div class="insight-score" style="color:var(--purple)">${values[0]}%</div><p>Excellent memory capture and context extraction.</p></div>
            <div class="insight-item"><h5>🔤 Word Recall</h5><div class="insight-score" style="color:var(--green)">${values[1]}%</div><p>${values[1] >= 70 ? 'Strong short-term memory retention.' : 'Room for improvement in short-term retention.'}</p></div>
            <div class="insight-item"><h5>🔢 Pattern Recognition</h5><div class="insight-score" style="color:var(--amber)">${values[2]}%</div><p>${values[2] >= 66 ? 'Good analytical reasoning skills.' : 'Practice can improve pattern detection.'}</p></div>
            <div class="insight-item"><h5>⚡ Processing Speed</h5><div class="insight-score" style="color:var(--pink)">${values[3]}%</div><p>Your reaction time is being tracked for trend analysis.</p></div>`;
    }
}

// ============ SCROLL ANIMATIONS ============
function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Count up
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
                // Breakdown bars
                entry.target.querySelectorAll('.breakdown-fill').forEach(bar => {
                    setTimeout(() => { bar.style.width = bar.dataset.width; }, 300);
                });
            }
        });
    }, { threshold: 0.2 });

    document.querySelectorAll('.section, .glass-card, .glass-card-sm, .hero-stats').forEach(el => observer.observe(el));
}

// ============ COGNITIVE SCORE ANIMATION ============
function animateCognitiveScore() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const score = 90;
                const circle = document.querySelector('.score-circle');
                const scoreEl = document.getElementById('cogScore');
                if (circle && !circle.dataset.animated) {
                    circle.dataset.animated = 'true';
                    const circumference = 2 * Math.PI * 85;
                    const offset = circumference - (score / 100) * circumference;
                    setTimeout(() => { circle.style.strokeDashoffset = offset; }, 500);
                    let current = 0;
                    const interval = setInterval(() => {
                        current += 1;
                        if (current >= score) { current = score; clearInterval(interval); }
                        scoreEl.textContent = current;
                    }, 20);
                }
            }
        });
    }, { threshold: 0.3 });
    const ring = document.getElementById('cogScoreRing');
    if (ring) observer.observe(ring);
}

// ============ TIMELINE ANIMATION ============
function animateTimeline() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progress = document.getElementById('timelineProgress');
                if (progress && !progress.dataset.animated) {
                    progress.dataset.animated = 'true';
                    setTimeout(() => { progress.style.width = '100%'; }, 500);
                }
            }
        });
    }, { threshold: 0.3 });
    const cs = document.querySelector('.case-study');
    if (cs) observer.observe(cs);
}

// ============ NAV SCROLL ============
function initNavScroll() {
    window.addEventListener('scroll', () => {
        document.getElementById('mainNav').classList.toggle('scrolled', window.scrollY > 50);
    });
}

// ============ SMOOTH SCROLL ============
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', e => {
            e.preventDefault();
            const target = document.querySelector(a.getAttribute('href'));
            if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });
}

// ============ INITIALIZE ============
document.addEventListener('DOMContentLoaded', () => {
    // Neural background
    new NeuralBackground(document.getElementById('neuralCanvas'));
    // Brain visualization
    new BrainVisualization(document.getElementById('brainCanvas'));
    // Knowledge graph
    setTimeout(() => {
        const kgCanvas = document.getElementById('knowledgeGraph');
        if (kgCanvas) new KnowledgeGraph(kgCanvas);
    }, 500);
    // Trend chart
    setTimeout(() => {
        const tc = document.getElementById('trendChart');
        if (tc) drawTrendChart(tc);
    }, 1000);
    // Chat systems
    initChat('chatMessages', 'chatInput', 'sendBtn', 'chatSuggestions', chatResponses, '🧠', 'ai-avatar');
    initChat('legacyChatMessages', 'legacyChatInput', 'legacySendBtn', 'legacySuggestions', legacyResponses, '👵', 'legacy-avatar');
    // Demo system
    new DemoSystem();
    // Animations
    initScrollAnimations();
    animateCognitiveScore();
    animateTimeline();
    initNavScroll();
    initSmoothScroll();
    // Try Demo button
    document.getElementById('tryDemoBtn').addEventListener('click', () => {
        document.getElementById('demo').scrollIntoView({ behavior: 'smooth' });
    });
});
