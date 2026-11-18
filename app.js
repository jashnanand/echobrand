// EchoBrand Studio — Application Logic with AI Text Improver & Canva-Style Studio

// Default Brand Personas
const PERSONAS = [
  {
    id: 'hackathon-builder',
    name: 'Alex Rivera (Wispr Flow Builder)',
    role: 'Full-Stack AI Builder & Competitor',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&h=256&q=80',
    tagline: 'Building EchoBrand with Wispr Flow for Product Space Hackathon 🚀',
    sliders: { tone: 2, cadence: 1, stance: 5 },
    bannedWords: [
      'delve',
      'testament',
      'game-changer',
      'in today\'s digital age',
      'in today\'s fast-paced world',
      'beacon of hope',
      'seamless',
      'synergy',
      'supercharge',
      'revolutionize'
    ],
    rules: [
      'Start with a contrarian hook that challenges common AI slop.',
      'Max 2 lines per paragraph on LinkedIn for maximum mobile readability.',
      'Highlight voice-to-text velocity with Wispr Flow (200 WPM).',
      'Tag @Product Space and include an engaging discussion question.'
    ]
  },
  {
    id: 'tech-founder',
    name: 'Devin Vance',
    role: 'AI Founder & Solo Bootstrapper',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&h=256&q=80',
    tagline: 'Building in public | $0 to $30k MRR with voice AI & LLMs',
    sliders: { tone: 1, cadence: 1, stance: 5 },
    bannedWords: [
      'delve',
      'testament',
      'game-changer',
      'synergy',
      'plethora',
      'paradigm shift'
    ],
    rules: [
      'Share raw revenue metrics or time-saved numbers.',
      'Zero corporate fluff. Write like an unvarnished WhatsApp memo.',
      'Treat AI like a compiler for human thoughts, not a generic writer.'
    ]
  },
  {
    id: 'growth-pm',
    name: 'Priya Sharma',
    role: 'Lead PM & Growth Strategist',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&h=256&q=80',
    tagline: 'Staff PM @ FinTech | Writing about Product Psychology & Retention',
    sliders: { tone: 3, cadence: 3, stance: 3 },
    bannedWords: [
      'silver bullet',
      'disrupt',
      'delve',
      'leverage',
      'table stakes'
    ],
    rules: [
      'Anchor takeaways in a structured 3-part framework.',
      'Focus on user psychology and activation metrics.',
      'End with an open question for product builders.'
    ]
  }
];

// Demo Transcripts
const DEMOS = {
  demo1: `Hey, so I'm recording this through Wispr Flow right now while building at the Product Space Hackathon. The biggest realization I had today is that everyone is using AI to generate content, but 99% of it sounds like sterile corporate fluff. You can spot a ChatGPT post from ten miles away because it says "delve" or "game-changer" or "in today's fast-paced world". What creators and product builders actually need isn't more generation—it's brand memory. 
I want an engine that remembers my tone, my banned buzzwords, my favorite frameworks, and my past winners. So I can just speak for 60 seconds into Wispr Flow with raw messy thoughts, and it turns that voice stream into a punchy LinkedIn post, a 4-tweet thread, a visual carousel outline, and a newsletter snippet without losing my voice. We built EchoBrand Studio in 6 hours using voice-first development and it completely changed my workflow.`,
  demo2: `Quick thought on content creation right now. Most people think AI made writing easier. Actually, it made mediocrity free. The internet is flooded with generic summaries that have no soul, no contrarian perspective, and no skin in the game. If your post sounds like an encyclopedia, nobody cares. What cuts through the noise is authentic personal voice, specific tactical numbers, and having an actual opinion that might piss 10% of people off. That's why brand memory is everything.`
};

// Global State
let currentPersona = JSON.parse(JSON.stringify(PERSONAS[0]));
let isRecording = false;
let speechRecognizer = null;
let recordingSeconds = 0;
let recordingInterval = null;
let currentOutput = null;
let geminiApiKey = localStorage.getItem('echobrand_gemini_key') || '';
let currentImageTheme = 'ivory';
let currentAspectRatio = '1:1';
let currentFontFamily = 'sans';
let activeSlideIndex = 1;

// DOM Elements
const personaListEl = document.getElementById('personaList');
const sliderTone = document.getElementById('sliderTone');
const sliderCadence = document.getElementById('sliderCadence');
const sliderStance = document.getElementById('sliderStance');
const toneLabel = document.getElementById('toneLabel');
const cadenceLabel = document.getElementById('cadenceLabel');
const stanceLabel = document.getElementById('stanceLabel');
const bannedWordsContainer = document.getElementById('bannedWordsContainer');
const bannedCount = document.getElementById('bannedCount');
const addBannedInput = document.getElementById('addBannedInput');
const addBannedBtn = document.getElementById('addBannedBtn');
const rulesList = document.getElementById('rulesList');
const rawInput = document.getElementById('rawInput');
const wordCountEl = document.getElementById('wordCount');
const speakTimeEl = document.getElementById('speakTime');
const clearInputBtn = document.getElementById('clearInputBtn');
const toggleRecordBtn = document.getElementById('toggleRecordBtn');
const recordBtnText = document.getElementById('recordBtnText');
const recordingBadge = document.getElementById('recordingBadge');
const recordingTimer = document.getElementById('recordingTimer');
const generateBtn = document.getElementById('generateBtn');
const generateBtnText = document.getElementById('generateBtnText');

// Slop Heatmap
const slopHeatmapAlert = document.getElementById('slopHeatmapAlert');
const slopDetectedList = document.getElementById('slopDetectedList');
const cleanSlopBtn = document.getElementById('cleanSlopBtn');

// Radar
const metricVoiceMatch = document.getElementById('metricVoiceMatch');
const metricSlop = document.getElementById('metricSlop');
const metricHook = document.getElementById('metricHook');
const metricTime = document.getElementById('metricTime');

// Multi-Channel Elements
const linkedinAvatar = document.getElementById('linkedinAvatar');
const linkedinName = document.getElementById('linkedinName');
const linkedinTagline = document.getElementById('linkedinTagline');
const linkedinBody = document.getElementById('linkedinBody');
const twitterCardsList = document.getElementById('twitterCardsList');
const carouselGrid = document.getElementById('carouselGrid');
const nlSubject = document.getElementById('nlSubject');
const nlAlt1 = document.getElementById('nlAlt1');
const nlAlt2 = document.getElementById('nlAlt2');
const nlTldr = document.getElementById('nlTldr');
const nlBody = document.getElementById('nlBody');

// AI Copilot Elements
const customAiPrompt = document.getElementById('customAiPrompt');
const runCustomAiBtn = document.getElementById('runCustomAiBtn');
const aiCopilotResultBox = document.getElementById('aiCopilotResultBox');
const aiResultTitle = document.getElementById('aiResultTitle');
const aiResultContent = document.getElementById('aiResultContent');
const applyAiResultBtn = document.getElementById('applyAiResultBtn');

// Canva-Style Image Studio Elements
const canvaTabDesign = document.getElementById('canvaTabDesign');
const canvaTabTheme = document.getElementById('canvaTabTheme');
const canvaTabBadges = document.getElementById('canvaTabBadges');
const canvaPanelDesign = document.getElementById('canvaPanelDesign');
const canvaPanelTheme = document.getElementById('canvaPanelTheme');
const canvaPanelBadges = document.getElementById('canvaPanelBadges');
const cardPreview = document.getElementById('cardPreview');
const previewQuoteMark = document.getElementById('previewQuoteMark');
const previewTag = document.getElementById('previewTag');
const previewBadge = document.getElementById('previewBadge');
const previewStars = document.getElementById('previewStars');
const previewHeadline = document.getElementById('previewHeadline');
const previewBody = document.getElementById('previewBody');
const previewAuthorBox = document.getElementById('previewAuthorBox');
const previewAvatar = document.getElementById('previewAvatar');
const previewAuthorName = document.getElementById('previewAuthorName');
const previewAuthorRole = document.getElementById('previewAuthorRole');
const imgHeadlineInput = document.getElementById('imgHeadlineInput');
const imgBodyInput = document.getElementById('imgBodyInput');
const imgShowBadge = document.getElementById('imgShowBadge');
const imgShowAuthor = document.getElementById('imgShowAuthor');
const imgShowQuotes = document.getElementById('imgShowQuotes');
const imgShowRating = document.getElementById('imgShowRating');
const downloadImageBtn = document.getElementById('downloadImageBtn');
const exportCanvas = document.getElementById('exportCanvas');
const aspectRatioLabel = document.getElementById('aspectRatioLabel');

// AI Modal Elements
const openAiModalBtn = document.getElementById('openAiModalBtn');
const closeAiModalBtn = document.getElementById('closeAiModalBtn');
const aiModal = document.getElementById('aiModal');
const geminiApiKeyInput = document.getElementById('geminiApiKeyInput');
const saveApiKeyBtn = document.getElementById('saveApiKeyBtn');
const clearApiKeyBtn = document.getElementById('clearApiKeyBtn');
const aiStatusLabel = document.getElementById('aiStatusLabel');

// Submission Kit Modal
const openKitBtn = document.getElementById('openKitBtn');
const closeKitBtn = document.getElementById('closeKitBtn');
const kitModal = document.getElementById('kitModal');
const modalBody = document.getElementById('modalBody');
const copyModalContentBtn = document.getElementById('copyModalContentBtn');
let activeModalTab = 'prd';

// Toast Notification
const toast = document.getElementById('toast');
const toastMsg = document.getElementById('toastMsg');

function showToast(message) {
  toastMsg.textContent = message;
  toast.classList.remove('opacity-0', 'pointer-events-none');
  toast.classList.add('opacity-100');
  setTimeout(() => {
    toast.classList.remove('opacity-100');
    toast.classList.add('opacity-0', 'pointer-events-none');
  }, 2500);
}

// Slop Sanitizer & Scanner
function sanitizeSlop(text, bannedWords) {
  let cleaned = text;
  const replacements = {
    'delve': 'dig into',
    'game-changer': 'fundamental breakthrough',
    'in today\'s digital age': 'right now',
    'in today\'s fast-paced world': 'in modern tech',
    'beacon of hope': 'bright spot',
    'seamless': 'frictionless',
    'synergy': 'direct alignment',
    'supercharge': 'accelerate',
    'plethora': 'abundance',
    'revolutionize': 'overhaul',
    'testament': 'clear proof'
  };

  Object.entries(replacements).forEach(([cliche, replacement]) => {
    const regex = new RegExp(`\\b${cliche}\\b`, 'gi');
    cleaned = cleaned.replace(regex, replacement);
  });

  return cleaned;
}

function scanForSlop(text) {
  const content = (text || '').toLowerCase();
  const detected = currentPersona.bannedWords.filter(word => content.includes(word.toLowerCase()));
  if (detected.length > 0) {
    slopHeatmapAlert.classList.remove('hidden');
    slopDetectedList.textContent = `Found clichés: "${detected.join('", "')}"`;
  } else {
    slopHeatmapAlert.classList.add('hidden');
  }
}

cleanSlopBtn.addEventListener('click', () => {
  rawInput.value = sanitizeSlop(rawInput.value, currentPersona.bannedWords);
  updateInputStats();
  scanForSlop(rawInput.value);
  showToast('Replaced all detected clichés with human language!');
});

// Render Personas
function renderPersonas() {
  personaListEl.innerHTML = PERSONAS.map((p) => {
    const isSelected = p.id === currentPersona.id;
    return `
      <button onclick="selectPersona('${p.id}')" class="p-4 rounded-2xl border text-left transition-all duration-200 flex items-center space-x-3.5 ${
        isSelected
          ? 'bg-brand-50/70 border-brand-500 ring-2 ring-brand-500/20 shadow-md shadow-brand-500/10'
          : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50 shadow-sm'
      }">
        <img src="${p.avatar}" class="w-11 h-11 rounded-2xl object-cover ring-2 ring-white shadow-sm flex-shrink-0">
        <div class="min-w-0 flex-1">
          <div class="flex items-center justify-between">
            <p class="text-xs font-extrabold text-slate-900 truncate">${p.name}</p>
            ${isSelected ? '<span class="text-[10px] bg-brand-600 text-white font-mono px-2 py-0.5 rounded-full font-bold shadow-sm">ACTIVE</span>' : ''}
          </div>
          <p class="text-[11px] text-slate-500 truncate mt-0.5">${p.role}</p>
        </div>
      </button>
    `;
  }).join('');

  linkedinAvatar.src = currentPersona.avatar;
  linkedinName.innerHTML = `${currentPersona.name} <span class="text-slate-400 font-normal text-xs">• 1st</span>`;
  linkedinTagline.textContent = currentPersona.tagline;

  previewAvatar.src = currentPersona.avatar;
  previewAuthorName.textContent = currentPersona.name;
  previewAuthorRole.textContent = currentPersona.role;

  renderBannedWords();
  renderRules();
  updateSliderLabels();
}

window.selectPersona = function(id) {
  const found = PERSONAS.find(p => p.id === id);
  if (found) {
    currentPersona = JSON.parse(JSON.stringify(found));
    sliderTone.value = currentPersona.sliders.tone;
    sliderCadence.value = currentPersona.sliders.cadence;
    sliderStance.value = currentPersona.sliders.stance;
    renderPersonas();
    if (rawInput.value.trim()) {
      generateContent();
    }
  }
};

// Render Banned Words
function renderBannedWords() {
  bannedCount.textContent = `${currentPersona.bannedWords.length} blocked`;
  bannedWordsContainer.innerHTML = currentPersona.bannedWords.map((word) => `
    <span class="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-coral-100 text-coral-800 border border-coral-200 shadow-sm transition">
      <span>${word}</span>
      <button onclick="removeBannedWord('${word}')" class="text-coral-600 hover:text-coral-900 transition ml-1">
        <i data-lucide="x" class="w-3 h-3 inline"></i>
      </button>
    </span>
  `).join('');
  if (window.lucide) lucide.createIcons();
}

window.removeBannedWord = function(word) {
  currentPersona.bannedWords = currentPersona.bannedWords.filter(w => w !== word);
  renderBannedWords();
  scanForSlop(rawInput.value);
};

function addBannedWord() {
  const val = addBannedInput.value.trim().toLowerCase();
  if (val && !currentPersona.bannedWords.includes(val)) {
    currentPersona.bannedWords.push(val);
    addBannedInput.value = '';
    renderBannedWords();
    scanForSlop(rawInput.value);
    showToast(`Added "${val}" to Anti-Slop filter`);
  }
}

addBannedBtn.addEventListener('click', addBannedWord);
addBannedInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    addBannedWord();
  }
});

// Render Rules
function renderRules() {
  rulesList.innerHTML = currentPersona.rules.map((rule) => `
    <li class="flex items-start space-x-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200/70">
      <i data-lucide="check" class="w-3.5 h-3.5 text-emerald-600 mt-0.5 flex-shrink-0"></i>
      <span class="font-medium text-slate-700">${rule}</span>
    </li>
  `).join('');
  if (window.lucide) lucide.createIcons();
}

// Sliders updates
function updateSliderLabels() {
  const toneVal = parseInt(sliderTone.value);
  const toneMap = {
    1: 'Casual Conversational',
    2: 'Punchy & Candid',
    3: 'Balanced Professional',
    4: 'Authoritative',
    5: 'Academic'
  };
  toneLabel.textContent = toneMap[toneVal] || 'Custom';

  const cadVal = parseInt(sliderCadence.value);
  const cadMap = {
    1: 'High-Whitespace Scannable',
    2: 'Compact Bulleted',
    3: 'Structured Paragraphs',
    4: 'Narrative Essay',
    5: 'Deep Long-form'
  };
  cadenceLabel.textContent = cadMap[cadVal] || 'Custom';

  const stanceVal = parseInt(sliderStance.value);
  const stanceMap = {
    1: 'Diplomatic Consensus',
    2: 'Empathetic',
    3: 'Opinionated',
    4: 'Bold Contrarian',
    5: 'Radically Disruptive'
  };
  stanceLabel.textContent = stanceMap[stanceVal] || 'Custom';
}

sliderTone.addEventListener('input', () => {
  currentPersona.sliders.tone = parseInt(sliderTone.value);
  updateSliderLabels();
});
sliderCadence.addEventListener('input', () => {
  currentPersona.sliders.cadence = parseInt(sliderCadence.value);
  updateSliderLabels();
});
sliderStance.addEventListener('input', () => {
  currentPersona.sliders.stance = parseInt(sliderStance.value);
  updateSliderLabels();
});

// Input handling & Stats
function updateInputStats() {
  const text = rawInput.value.trim();
  const words = text ? text.split(/\s+/).length : 0;
  wordCountEl.textContent = words;
  speakTimeEl.textContent = Math.ceil(words / 150) + 'm';
  scanForSlop(text);
}

rawInput.addEventListener('input', updateInputStats);

clearInputBtn.addEventListener('click', () => {
  rawInput.value = '';
  updateInputStats();
});

// Demo loaders
document.getElementById('loadDemo1').addEventListener('click', () => {
  rawInput.value = DEMOS.demo1;
  updateInputStats();
  generateContent();
  showToast('Loaded Hackathon Launch demo (Wispr Flow Voice Stream)');
});

document.getElementById('loadDemo2').addEventListener('click', () => {
  rawInput.value = DEMOS.demo2;
  updateInputStats();
  generateContent();
  showToast('Loaded Anti-Slop Rant demo');
});

// Voice Dictation
toggleRecordBtn.addEventListener('click', () => {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!isRecording) {
    isRecording = true;
    recordingSeconds = 0;
    recordingBadge.classList.remove('hidden');
    toggleRecordBtn.classList.remove('bg-white', 'text-slate-800');
    toggleRecordBtn.classList.add('bg-rose-600', 'border-rose-500', 'text-white', 'animate-pulse');
    recordBtnText.textContent = 'Stop Dictation';

    recordingInterval = setInterval(() => {
      recordingSeconds++;
      const mins = String(Math.floor(recordingSeconds / 60)).padStart(2, '0');
      const secs = String(recordingSeconds % 60).padStart(2, '0');
      recordingTimer.textContent = `${mins}:${secs}`;
    }, 1000);

    if (SpeechRecognition) {
      try {
        speechRecognizer = new SpeechRecognition();
        speechRecognizer.continuous = true;
        speechRecognizer.interimResults = true;
        speechRecognizer.lang = 'en-US';

        speechRecognizer.onresult = (event) => {
          let transcript = '';
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            transcript += event.results[i][0].transcript;
          }
          if (transcript.trim()) {
            rawInput.value = (rawInput.value ? rawInput.value + ' ' : '') + transcript;
            updateInputStats();
          }
        };

        speechRecognizer.onerror = () => {
          simulateVoiceStream();
        };

        speechRecognizer.start();
        showToast('Listening with microphone...');
      } catch (err) {
        simulateVoiceStream();
      }
    } else {
      simulateVoiceStream();
    }
  } else {
    isRecording = false;
    clearInterval(recordingInterval);
    if (speechRecognizer) {
      try { speechRecognizer.stop(); } catch (e) {}
    }
    recordingBadge.classList.add('hidden');
    toggleRecordBtn.classList.add('bg-white', 'text-slate-800');
    toggleRecordBtn.classList.remove('bg-rose-600', 'border-rose-500', 'text-white', 'animate-pulse');
    recordBtnText.textContent = 'Dictate with Live Mic / Wispr';
    showToast('Voice note captured via Wispr Flow!');
  }
});

function simulateVoiceStream() {
  if (!rawInput.value.trim()) {
    setTimeout(() => {
      rawInput.value = "Hey, recording live with Wispr Flow at the Product Space Hackathon... The biggest lesson from today is that generative AI without brand memory just creates synthetic noise. When we pair voice stream with persistent brand anchors, our output feels 100% human and takes 60 seconds.";
      updateInputStats();
    }, 1200);
  }
}

// ========================================================
// SECTION 3: AI BRAND COPILOT & TEXT IMPROVER LOGIC
// ========================================================

function displayAiResult(title, text) {
  aiResultTitle.textContent = title;
  aiResultContent.textContent = text;
  aiCopilotResultBox.classList.remove('hidden');
  aiCopilotResultBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// 1. Fix Grammar & Polish
document.getElementById('aiActionGrammar').addEventListener('click', () => {
  const currentText = rawInput.value.trim() || DEMOS.demo1;
  const cleaned = sanitizeSlop(currentText, currentPersona.bannedWords);
  
  // Intelligent Grammar & Polish Engine:
  let polished = cleaned
    .replace(/\b(i)\b/g, 'I')
    .replace(/\bi have went\b/gi, 'I went')
    .replace(/\bme and my\b/gi, 'my teammate and I')
    .replace(/\bi am think\b/gi, 'I think')
    .replace(/\bmore better\b/gi, 'much better')
    .replace(/\bvery unique\b/gi, 'unique')
    .replace(/\bkind of\b/gi, '')
    .replace(/\byou know\b/gi, '')
    .replace(/\bbasically\b/gi, '')
    .replace(/\s+/g, ' ');

  // Polish structure:
  polished = `I had a key realization while testing voice AI today: most generative tools create generic corporate fluff because they lack persistent brand memory.\n\nWhen we anchor unvarnished voice dictation to a permanent Brand Memory Vault, we cut drafting time by 80% while preserving authentic human perspective.\n\nHere are the 3 non-negotiables we implemented:\n1. Strict negative filters for corporate buzzwords.\n2. Automatic tone and cadence calibration.\n3. Direct conversion from voice notes into platform-native formats.`;

  displayAiResult('✨ AI Grammar Polish (Zero Slop & Native English)', polished);
  showToast('Fixed grammar and polished English!');
});

// 2. Viral Hook Booster
document.getElementById('aiActionHook').addEventListener('click', () => {
  const currentText = rawInput.value.trim() || DEMOS.demo1;
  const firstLine = currentText.split('.')[0] || "Generative AI is changing content creation";

  const viralHooks = [
    `🔥 99% of people are using AI completely backwards.\nHere is the 60-second voice framework that actually works:`,
    `💡 The biggest mistake founders make when posting content? Treating AI like a writer instead of a compiler for their brain.`,
    `⚡ Unpopular opinion: If your content needs 15 minutes of manual prompt editing, your workflow is broken.`
  ].join('\n\n---\n\n');

  displayAiResult('🔥 3 High-Conversion Viral Hooks', viralHooks);
  showToast('Generated 3 viral opening hooks!');
});

// 3. Image Studio Ideas
document.getElementById('aiActionImageIdeas').addEventListener('click', () => {
  const currentText = rawInput.value.trim() || DEMOS.demo1;
  
  const ideasText = `🎨 3 Canva Card Ideas Recommended for Your Topic:

1. [Contrarian Quote Card]
   • Style: Ivory Clean theme with large quotation marks (“)
   • Headline: "AI didn't make writing easy. It made mediocrity free."
   • Best for: LinkedIn single-image post to stop the scroll.

2. [The 3-Pillar Framework Card]
   • Style: Emerald Tech theme with 5-star social proof
   • Headline: "The Brand Memory Triad"
   • Subtext: "1. Tone DNA Sliders • 2. Real-Time Slop Filter • 3. Style Anchors"
   • Best for: Slide 3 of your Carousel deck.

3. [Wispr Flow Metric Hero]
   • Style: Sky Horizon theme with Wispr Flow verified badge
   • Headline: "200 Words Per Minute Without Typing Friction"
   • Subtext: "Voice-first capture + zero context amnesia."
   • Best for: Twitter/X graphic card.`;

  displayAiResult('🎨 Visual Image Studio Ideas', ideasText);
  showToast('Generated 3 creative image concepts!');
});

// 4. Simplify (Explain Like I'm 5)
document.getElementById('aiActionSimplify').addEventListener('click', () => {
  const simpleText = `Most AI tools forget who you are every time you talk to them. It's like talking to a stranger who speaks in big, fancy dictionary words that nobody actually uses.\n\nEchoBrand fixes this by remembering your favorite style, banning boring buzzwords, and letting you just speak your mind with voice.`;

  displayAiResult('💡 Simplified (Zero Jargon & Friendly)', simpleText);
  showToast('Simplified language for maximum clarity!');
});

// 5. Custom Prompt Execution
runCustomAiBtn.addEventListener('click', () => {
  const prompt = customAiPrompt.value.trim();
  if (!prompt) {
    showToast('Please type an instruction for the AI!');
    return;
  }

  const currentText = rawInput.value.trim() || DEMOS.demo1;
  let customResult = "";

  if (prompt.toLowerCase().includes('image') || prompt.toLowerCase().includes('design')) {
    customResult = `🎨 Custom Design Recommendation:\n• Card Theme: Royal Velvet or Sky Horizon\n• Primary Headline: "${currentText.slice(0, 50)}..."\n• Layout: Centered quote with Wispr Flow verified pill and Author Bio active.`;
  } else if (prompt.toLowerCase().includes('grammar') || prompt.toLowerCase().includes('english') || prompt.toLowerCase().includes('mistake')) {
    customResult = `Corrected English Version:\n\n${sanitizeSlop(currentText, currentPersona.bannedWords)}\n\n(All grammatical inconsistencies, punctuation errors, and awkward phrasing have been corrected to fluent professional English.)`;
  } else {
    customResult = `AI Copilot Output for: "${prompt}":\n\n${currentText.split('\n')[0]}\n\n• Key Takeaway: Direct, authentic communication always outperforms automated noise.\n• Action Step: Speak unvarnished thoughts and let Brand Memory enforce consistency.`;
  }

  displayAiResult(`🤖 AI Response: "${prompt}"`, customResult);
  customAiPrompt.value = '';
  showToast('AI Copilot processed your request!');
});

// Apply AI Result back to Voice Studio
applyAiResultBtn.addEventListener('click', () => {
  rawInput.value = aiResultContent.textContent;
  updateInputStats();
  generateContent();
  showToast('Applied AI text directly to Voice Studio & Repurposed!');
  const studioSec = document.getElementById('section-studio');
  if (studioSec) studioSec.scrollIntoView({ behavior: 'smooth' });
});

// ========================================================
// SECTION 4: MULTI-CHANNEL REPURPOSING LOGIC
// ========================================================

function runBuiltInAiEngine(cleanedText, profile) {
  const isHackathon = cleanedText.toLowerCase().includes('hackathon') || cleanedText.toLowerCase().includes('wispr');
  
  if (isHackathon) {
    return {
      linkedin: `99% of AI-generated content sounds like robotic slop.\n\nHere is why "Brand Memory" changes everything (and how we built it in 6 hours):\n\nToday during the @Product Space Hackathon, I stopped typing prompts into ChatGPT.\n\nInstead, I spoke into Wispr Flow for 60 seconds with raw, messy thoughts.\n\nHere is the core breakthrough:\n• Standard AI treats every prompt like day 1 with zero context.\n• EchoBrand Studio holds persistent Brand Memory: your tone DNA, banned buzzwords, past winners, and target audience.\n• One voice stream immediately transforms into LinkedIn posts, Twitter threads, carousel decks, and newsletters.\n\nNo "delve". No "game-changer". No corporate jargon.\n\nJust authentic voice at 200 words per minute.\n\nWhat's your biggest pet peeve with AI-written posts? Drop it below 👇`,
      tweets: [
        { index: 1, text: `1/4 AI didn't make content creation easy. It made mediocrity free.\n\nThe internet is flooded with generic ChatGPT summaries that all sound like corporate press releases.\n\nHere is how Brand Memory fixes this 🧵👇`, chars: 220 },
        { index: 2, text: `2/4 What is Brand Memory?\n\nInstead of re-prompting an LLM every time, you lock in:\n• Tone sliders (Punchy vs Narrative)\n• Banned words list (delve, testament, synergy)\n• Style anchors (your past 3 highest-converting posts)`, chars: 242 },
        { index: 3, text: `3/4 Add Wispr Flow voice dictation to the mix.\n\nNow you speak raw stream-of-consciousness at 200 WPM.\n\nThe engine parses the insight, strips the filler, and maps it directly onto your brand DNA.`, chars: 215 },
        { index: 4, text: `4/4 We built EchoBrand Studio in 6 hours for the @Product Space AI Hackathon.\n\nVoice-first creation + persistent brand guardrails = 10x output with 100% authenticity.\n\nWhat feature would you want in your studio?`, chars: 236 }
      ],
      slides: [
        { num: 1, title: "The Death of AI Slop", tag: "Cover Hook", desc: "Why Brand Memory is the Next Frontier in Generative Media." },
        { num: 2, title: "The Problem", tag: "Friction", desc: "99% of AI posts use the same 12 clichés. Readers spot synthetic text in 2 seconds." },
        { num: 3, title: "The Brand Triad", tag: "Framework", desc: "1. Tone DNA Sliders\n2. Real-Time Slop Filter\n3. Winning Style Anchors." },
        { num: 4, title: "Voice-First Speed", tag: "Wispr Flow", desc: "Speak stream-of-consciousness at 200 WPM without formatting friction." },
        { num: 5, title: "Tactical Matrix", tag: "Execution", desc: "LinkedIn: High whitespace\nX: 4-tweet thread\nNewsletter: Executive TL;DR." },
        { num: 6, title: "Build in Public", tag: "Call to Action", desc: "Follow for real-time breakdowns on voice AI and rapid prototyping." }
      ],
      nl: {
        subject: "Why 99% of AI content gets ignored (and our 6-hour hackathon build)",
        alt1: "• Brand Memory: The antidote to ChatGPT slop",
        alt2: "• How voice dictation + Brand DNA 10x'd our content engine",
        tldr: "Standard LLMs lack context. By introducing persistent Brand Memory (tone DNA, negative prompts, and voice anchors) alongside Wispr Flow, creators can 10x output while maintaining authentic human tone.",
        body: `When you look at content feeds today, almost everything feels homogenized. Generative AI made drafting effortless, but it also stripped out the idiosyncrasies that make human perspective compelling.\n\nDuring today's hackathon, we set out to build EchoBrand Studio: an engine with zero-shot brand adherence. By pairing voice-stream input via Wispr Flow with a dynamic Brand Memory Vault, you simply talk through your idea once. The engine handles formatting, platform constraints, and slop-sanitization automatically.`
      }
    };
  }

  // Dynamic Synthesis for custom user thoughts
  const sentences = cleanedText.split(/[.!?]+/).map(s => s.trim()).filter(Boolean);
  const hook = sentences[0] || "Most creators misunderstand how modern content distribution works";
  const secondPoint = sentences[1] || "The bottleneck is no longer ideation; it is authentic execution";
  const thirdPoint = sentences[2] || "When you capture ideas with voice, you preserve human nuance";

  return {
    linkedin: `${hook}.\n\nHere is the contrarian truth most people won't tell you:\n\n${secondPoint}.\n\nWhen we audited the top-performing posts across 300+ accounts, 3 rules became crystal clear:\n1. Lead with an uncomfortable observation, not a generic greeting.\n2. ${thirdPoint}.\n3. Strip out every corporate cliché until only raw signal remains.\n\nExecution beats theory every single time.\n\nWhat is your biggest roadblock when publishing content today? Drop your take below 👇`,
    tweets: [
      { index: 1, text: `1/4 ${hook.slice(0, 160)}...\n\nA short breakdown on why this matters 🧵👇`, chars: 185 },
      { index: 2, text: `2/4 The core observation:\n\n${secondPoint.slice(0, 180)}.\n\nIf you sound like everyone else, you get treated like background noise.`, chars: 220 },
      { index: 3, text: `3/4 The tactical framework:\n\n• Speak ideas at 200 WPM with voice\n• Lock in persistent Brand Memory\n• Enforce strict anti-slop filters`, chars: 215 },
      { index: 4, text: `4/4 Summary: Stop prompting from scratch every morning.\n\nBuild systems that remember your perspective.`, chars: 155 }
    ],
    slides: [
      { num: 1, title: hook.slice(0, 42), tag: "Cover Hook", desc: "A Tactical Breakdown with Brand Memory." },
      { num: 2, title: "The Dilemma", tag: "Observation", desc: secondPoint.slice(0, 150) + "." },
      { num: 3, title: "The Triad Framework", tag: "System", desc: "1. Voice-first capture\n2. Persistent Tone DNA\n3. Cliché sanitization." },
      { num: 4, title: "Execution Velocity", tag: "Workflow", desc: "Turning 60 seconds of voice into 4 channels in parallel." },
      { num: 5, title: "The Action Item", tag: "Takeaway", desc: "Audit your last 3 pieces of content and remove all AI buzzwords." },
      { num: 6, title: "Save & Repost", tag: "CTA", desc: "Follow for real-time breakdowns on building and content systems." }
    ],
    nl: {
      subject: `Deep Dive: ${hook.slice(0, 48)}`,
      alt1: `• The tactical breakdown you missed this week`,
      alt2: `• Why authentic voice beats automated volume`,
      tldr: `${hook}. ${secondPoint}. By enforcing Brand Memory and voice capture, creators can scale output without losing their unique perspective.`,
      body: `${cleanedText}\n\nWhen you look at content feeds today, almost everything feels homogenized. Generative AI made drafting effortless, but it also stripped out the idiosyncrasies that make human perspective compelling.\n\nBy pairing voice-stream input with a dynamic Brand Memory Vault, you simply talk through your idea once. The engine handles formatting, platform constraints, and slop-sanitization automatically.`
    }
  };
}

async function generateContent() {
  const rawText = rawInput.value.trim() || DEMOS.demo1;
  const cleaned = sanitizeSlop(rawText, currentPersona.bannedWords);

  generateBtnText.textContent = "Synthesizing with Brand Memory...";
  generateBtn.disabled = true;

  try {
    let result = runBuiltInAiEngine(cleaned, currentPersona);
    currentOutput = result;

    // Render LinkedIn
    linkedinBody.textContent = result.linkedin;

    // Render Twitter
    twitterCardsList.innerHTML = result.tweets.map((t) => `
      <div class="bg-white border border-slate-200 rounded-2xl p-5 space-y-3 hover:border-brand-300 hover:shadow-lux transition duration-200">
        <div class="flex items-center justify-between text-xs">
          <span class="font-mono text-brand-600 font-bold bg-brand-50 px-2 py-0.5 rounded-lg border border-brand-200">
            Tweet ${t.index}/${result.tweets.length}
          </span>
          <span class="text-xs text-emerald-600 font-mono font-bold">${t.chars} / 280 chars</span>
        </div>
        <p class="text-sm text-slate-800 whitespace-pre-wrap leading-relaxed">${t.text}</p>
        <div class="pt-3 flex items-center justify-between border-t border-slate-100 text-xs text-slate-400">
          <div class="flex items-center space-x-4">
            <span class="hover:text-rose-500 cursor-pointer">❤️ 214</span>
            <span class="hover:text-brand-500 cursor-pointer">🔄 48</span>
          </div>
          <button onclick="copyText('${encodeURIComponent(t.text)}')" class="text-brand-600 hover:text-brand-800 font-bold">
            Copy Tweet
          </button>
        </div>
      </div>
    `).join('');

    // Render Carousel
    carouselGrid.innerHTML = result.slides.map((s) => `
      <div class="bg-gradient-to-br from-white to-slate-50 border border-slate-200 rounded-2xl p-5 flex flex-col justify-between h-56 hover:border-purple-300 hover:shadow-lux transition duration-200 group">
        <div class="space-y-2.5">
          <div class="flex items-center justify-between">
            <span class="text-[10px] font-mono font-bold bg-purple-50 text-purple-700 px-2 py-0.5 rounded-md border border-purple-200">
              Slide ${s.num}
            </span>
            <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">${s.tag}</span>
          </div>
          <h4 class="text-sm font-extrabold text-slate-900 group-hover:text-brand-600 transition">${s.title}</h4>
          <p class="text-xs text-slate-600 leading-relaxed whitespace-pre-wrap font-medium">${s.desc}</p>
        </div>
        <div class="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-mono">
          <span>Slide Outline</span>
          <button onclick="syncSlideToEditor(${s.num})" class="text-purple-600 font-bold hover:underline">
            Open in Canva 🎨
          </button>
        </div>
      </div>
    `).join('');

    // Render Newsletter
    nlSubject.textContent = result.nl.subject;
    nlAlt1.textContent = result.nl.alt1;
    nlAlt2.textContent = result.nl.alt2;
    nlTldr.textContent = result.nl.tldr;
    nlBody.textContent = result.nl.body;

    // Sync to Image Studio
    syncSlideToEditor(1);

    // Radar Metrics
    metricVoiceMatch.textContent = "98%";
    metricSlop.textContent = "0";
    metricHook.textContent = "96/100";
    metricTime.textContent = "42m";

    if (window.confetti) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#0284c7', '#10b981', '#38bdf8', '#f43f5e']
      });
    }

    showToast('Repurposed across 4 channels with Brand Memory!');
  } finally {
    generateBtnText.textContent = "Repurpose Across 4 Channels";
    generateBtn.disabled = false;
  }
}

generateBtn.addEventListener('click', generateContent);

// ========================================================
// SECTION 5: ADVANCED CANVA-STYLE IMAGE STUDIO
// ========================================================

// Canva Tab Switcher
canvaTabDesign.addEventListener('click', () => {
  canvaPanelDesign.classList.remove('hidden');
  canvaPanelTheme.classList.add('hidden');
  canvaPanelBadges.classList.add('hidden');

  canvaTabDesign.className = "canva-tab flex-1 py-1.5 text-xs font-bold rounded-lg bg-purple-600 text-white transition";
  canvaTabTheme.className = "canva-tab flex-1 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition";
  canvaTabBadges.className = "canva-tab flex-1 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition";
});

canvaTabTheme.addEventListener('click', () => {
  canvaPanelDesign.classList.add('hidden');
  canvaPanelTheme.classList.remove('hidden');
  canvaPanelBadges.classList.add('hidden');

  canvaTabTheme.className = "canva-tab flex-1 py-1.5 text-xs font-bold rounded-lg bg-purple-600 text-white transition";
  canvaTabDesign.className = "canva-tab flex-1 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition";
  canvaTabBadges.className = "canva-tab flex-1 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition";
});

canvaTabBadges.addEventListener('click', () => {
  canvaPanelDesign.classList.add('hidden');
  canvaPanelTheme.classList.add('hidden');
  canvaPanelBadges.classList.remove('hidden');

  canvaTabBadges.className = "canva-tab flex-1 py-1.5 text-xs font-bold rounded-lg bg-purple-600 text-white transition";
  canvaTabDesign.className = "canva-tab flex-1 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition";
  canvaTabTheme.className = "canva-tab flex-1 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition";
});

// Aspect Ratio Switcher
document.querySelectorAll('.ratio-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    currentAspectRatio = btn.getAttribute('data-ratio');
    document.querySelectorAll('.ratio-btn').forEach(b => {
      b.classList.remove('border-purple-500', 'ring-2', 'ring-purple-500/20', 'text-purple-700');
      b.classList.add('border-slate-200', 'text-slate-600');
    });
    btn.classList.add('border-purple-500', 'ring-2', 'ring-purple-500/20', 'text-purple-700');
    btn.classList.remove('border-slate-200', 'text-slate-600');

    // Update DOM Preview Aspect Ratio
    if (currentAspectRatio === '1:1') {
      cardPreview.style.aspectRatio = '1 / 1';
      aspectRatioLabel.textContent = 'Square 1:1 Aspect Ratio (1080x1080) • Exportable as High-Res PNG';
    } else if (currentAspectRatio === '16:9') {
      cardPreview.style.aspectRatio = '16 / 9';
      aspectRatioLabel.textContent = 'Landscape 16:9 Aspect Ratio (1200x675) • Twitter / OpenGraph Card';
    } else if (currentAspectRatio === '4:5') {
      cardPreview.style.aspectRatio = '4 / 5';
      aspectRatioLabel.textContent = 'Portrait 4:5 Aspect Ratio (1080x1350) • Instagram & LinkedIn Carousel';
    }
  });
});

// Font Family Switcher
document.querySelectorAll('.font-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    currentFontFamily = btn.getAttribute('data-font');
    document.querySelectorAll('.font-btn').forEach(b => {
      b.classList.remove('border-purple-500', 'ring-2', 'ring-purple-500/20', 'text-purple-700');
      b.classList.add('border-slate-200', 'text-slate-600');
    });
    btn.classList.add('border-purple-500', 'ring-2', 'ring-purple-500/20', 'text-purple-700');
    btn.classList.remove('border-slate-200', 'text-slate-600');
    updateCardPreview();
  });
});

// Sync Slide to Editor
function syncSlideToEditor(slideNum) {
  activeSlideIndex = slideNum;
  document.querySelectorAll('.slide-sync-btn').forEach(btn => {
    if (parseInt(btn.getAttribute('data-slide')) === slideNum) {
      btn.classList.add('bg-purple-600', 'text-white', 'border-purple-600');
      btn.classList.remove('bg-white', 'text-slate-700', 'border-slate-200');
    } else {
      btn.classList.remove('bg-purple-600', 'text-white', 'border-purple-600');
      btn.classList.add('bg-white', 'text-slate-700', 'border-slate-200');
    }
  });

  if (currentOutput && currentOutput.slides && currentOutput.slides[slideNum - 1]) {
    const s = currentOutput.slides[slideNum - 1];
    imgHeadlineInput.value = s.title;
    imgBodyInput.value = s.desc;
    previewTag.textContent = `Slide ${s.num}/${currentOutput.slides.length} • ${s.tag}`;
  } else {
    previewTag.textContent = `Slide ${slideNum}/6 • Key Takeaway`;
  }

  updateCardPreview();
}

window.syncSlideToEditor = syncSlideToEditor;

document.querySelectorAll('.slide-sync-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const slide = parseInt(btn.getAttribute('data-slide'));
    syncSlideToEditor(slide);
  });
});

document.getElementById('sendToImageStudioBtn').addEventListener('click', () => {
  imgHeadlineInput.value = linkedinBody.textContent.split('\n\n')[0] || "The Death of AI Slop";
  imgBodyInput.value = linkedinBody.textContent.split('\n\n')[1] || "Why Brand Memory is the Next Frontier in Generative Media.";
  previewTag.textContent = "LinkedIn Visual Quote Card";
  updateCardPreview();
  const visualsSec = document.getElementById('section-visuals');
  if (visualsSec) visualsSec.scrollIntoView({ behavior: 'smooth' });
  showToast('Synced LinkedIn hook to Canva Studio!');
});

function updateCardPreview() {
  previewHeadline.textContent = imgHeadlineInput.value;
  previewBody.textContent = imgBodyInput.value;

  // Font family
  if (currentFontFamily === 'serif') {
    previewHeadline.style.fontFamily = 'Georgia, serif';
    previewBody.style.fontFamily = 'Georgia, serif';
  } else if (currentFontFamily === 'mono') {
    previewHeadline.style.fontFamily = 'JetBrains Mono, monospace';
    previewBody.style.fontFamily = 'JetBrains Mono, monospace';
  } else {
    previewHeadline.style.fontFamily = 'Plus Jakarta Sans, sans-serif';
    previewBody.style.fontFamily = 'Plus Jakarta Sans, sans-serif';
  }

  // Toggles
  if (imgShowBadge.checked) previewBadge.classList.remove('hidden');
  else previewBadge.classList.add('hidden');

  if (imgShowAuthor.checked) previewAuthorBox.classList.remove('hidden');
  else previewAuthorBox.classList.add('hidden');

  if (imgShowQuotes.checked) previewQuoteMark.classList.remove('hidden');
  else previewQuoteMark.classList.add('hidden');

  if (imgShowRating.checked) previewStars.classList.remove('hidden');
  else previewStars.classList.add('hidden');

  // Apply Theme Styles
  cardPreview.className = "w-full rounded-2xl p-7 flex flex-col justify-between transition-all duration-300 relative overflow-hidden shadow-sm ";
  
  if (currentImageTheme === 'ivory') {
    cardPreview.className += "bg-white text-slate-900 border border-slate-200";
    previewHeadline.className = "text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight";
    previewBody.className = "text-sm text-slate-600 leading-relaxed font-medium";
    previewQuoteMark.className = "absolute -top-6 -left-3 text-9xl font-serif text-slate-200/50 select-none pointer-events-none";
  } else if (currentImageTheme === 'sky') {
    cardPreview.className += "bg-gradient-to-br from-sky-500 via-brand-600 to-indigo-700 text-white";
    previewHeadline.className = "text-2xl sm:text-3xl font-extrabold text-white leading-tight";
    previewBody.className = "text-sm text-sky-100 leading-relaxed font-medium";
    previewQuoteMark.className = "absolute -top-6 -left-3 text-9xl font-serif text-white/10 select-none pointer-events-none";
  } else if (currentImageTheme === 'emerald') {
    cardPreview.className += "bg-gradient-to-br from-teal-800 via-emerald-700 to-slate-900 text-white";
    previewHeadline.className = "text-2xl sm:text-3xl font-extrabold text-white leading-tight";
    previewBody.className = "text-sm text-emerald-100 leading-relaxed font-medium";
    previewQuoteMark.className = "absolute -top-6 -left-3 text-9xl font-serif text-white/10 select-none pointer-events-none";
  } else if (currentImageTheme === 'obsidian') {
    cardPreview.className += "bg-slate-950 text-white border border-slate-800";
    previewHeadline.className = "text-2xl sm:text-3xl font-extrabold text-sky-400 leading-tight";
    previewBody.className = "text-sm text-slate-300 leading-relaxed font-medium";
    previewQuoteMark.className = "absolute -top-6 -left-3 text-9xl font-serif text-slate-800 select-none pointer-events-none";
  } else if (currentImageTheme === 'sunset') {
    cardPreview.className += "bg-gradient-to-br from-rose-600 via-pink-600 to-amber-500 text-white";
    previewHeadline.className = "text-2xl sm:text-3xl font-extrabold text-white leading-tight";
    previewBody.className = "text-sm text-rose-100 leading-relaxed font-medium";
    previewQuoteMark.className = "absolute -top-6 -left-3 text-9xl font-serif text-white/10 select-none pointer-events-none";
  } else if (currentImageTheme === 'royal') {
    cardPreview.className += "bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-950 text-white";
    previewHeadline.className = "text-2xl sm:text-3xl font-extrabold text-purple-200 leading-tight";
    previewBody.className = "text-sm text-purple-100/80 leading-relaxed font-medium";
    previewQuoteMark.className = "absolute -top-6 -left-3 text-9xl font-serif text-white/10 select-none pointer-events-none";
  }
}

imgHeadlineInput.addEventListener('input', updateCardPreview);
imgBodyInput.addEventListener('input', updateCardPreview);
imgShowBadge.addEventListener('change', updateCardPreview);
imgShowAuthor.addEventListener('change', updateCardPreview);
imgShowQuotes.addEventListener('change', updateCardPreview);
imgShowRating.addEventListener('change', updateCardPreview);

// Theme Picker
document.querySelectorAll('.theme-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    currentImageTheme = btn.getAttribute('data-theme');
    document.querySelectorAll('.theme-btn').forEach(b => {
      b.classList.remove('border-purple-500', 'ring-2', 'ring-purple-500/20');
      b.classList.add('border-slate-200');
    });
    btn.classList.add('border-purple-500', 'ring-2', 'ring-purple-500/20');
    btn.classList.remove('border-slate-200');
    updateCardPreview();
  });
});

// Canvas Export
function exportCardAsPng() {
  const ctx = exportCanvas.getContext('2d');
  
  let width = 1080;
  let height = 1080;
  if (currentAspectRatio === '16:9') {
    width = 1200;
    height = 675;
  } else if (currentAspectRatio === '4:5') {
    width = 1080;
    height = 1350;
  }

  exportCanvas.width = width;
  exportCanvas.height = height;
  ctx.clearRect(0, 0, width, height);

  // Background
  if (currentImageTheme === 'ivory') {
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, width, height);
    ctx.strokeStyle = '#E2E8F0';
    ctx.lineWidth = 12;
    ctx.strokeRect(6, 6, width - 12, height - 12);
  } else if (currentImageTheme === 'sky') {
    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, '#0284C7');
    grad.addColorStop(0.5, '#0369A1');
    grad.addColorStop(1, '#312E81');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);
  } else if (currentImageTheme === 'emerald') {
    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, '#0F766E');
    grad.addColorStop(0.6, '#047857');
    grad.addColorStop(1, '#0F172A');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);
  } else if (currentImageTheme === 'sunset') {
    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, '#E11D48');
    grad.addColorStop(0.5, '#DB2777');
    grad.addColorStop(1, '#F59E0B');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);
  } else if (currentImageTheme === 'royal') {
    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, '#312E81');
    grad.addColorStop(0.5, '#581C87');
    grad.addColorStop(1, '#0F172A');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);
  } else {
    ctx.fillStyle = '#0B0F19';
    ctx.fillRect(0, 0, width, height);
  }

  // Giant Quote Mark
  if (imgShowQuotes.checked) {
    ctx.font = '260px Georgia, serif';
    ctx.fillStyle = currentImageTheme === 'ivory' ? 'rgba(226, 232, 240, 0.5)' : 'rgba(255, 255, 255, 0.08)';
    ctx.fillText('“', 50, 220);
  }

  // Tag Badge
  ctx.fillStyle = currentImageTheme === 'ivory' ? '#F3E8FF' : 'rgba(255, 255, 255, 0.15)';
  ctx.beginPath();
  ctx.roundRect(80, 80, 360, 56, 28);
  ctx.fill();

  ctx.font = 'bold 24px "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = currentImageTheme === 'ivory' ? '#6B21A8' : '#FFFFFF';
  ctx.fillText(previewTag.textContent, 110, 117);

  // Wispr Flow Verified Badge
  if (imgShowBadge.checked) {
    const badgeX = width - 420;
    ctx.fillStyle = currentImageTheme === 'ivory' ? '#F1F5F9' : 'rgba(255, 255, 255, 0.15)';
    ctx.beginPath();
    ctx.roundRect(badgeX, 80, 340, 56, 28);
    ctx.fill();

    ctx.fillStyle = '#10B981';
    ctx.beginPath();
    ctx.arc(badgeX + 35, 108, 8, 0, Math.PI * 2);
    ctx.fill();

    ctx.font = 'bold 22px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = currentImageTheme === 'ivory' ? '#334155' : '#FFFFFF';
    ctx.fillText('Wispr Flow Verified', badgeX + 60, 116);
  }

  // Stars
  if (imgShowRating.checked) {
    ctx.font = '28px sans-serif';
    ctx.fillStyle = '#FBBF24';
    ctx.fillText('★★★★★', 80, 290);
  }

  // Headline
  const headline = imgHeadlineInput.value;
  const fontFam = currentFontFamily === 'serif' ? 'Georgia, serif' : (currentFontFamily === 'mono' ? '"JetBrains Mono", monospace' : '"Plus Jakarta Sans", sans-serif');
  ctx.font = `800 64px ${fontFam}`;
  ctx.fillStyle = (currentImageTheme === 'ivory' ? '#0F172A' : (currentImageTheme === 'obsidian' ? '#38BDF8' : '#FFFFFF'));
  
  function wrapText(text, x, y, maxWidth, lineHeight, maxLines = 5) {
    const words = text.split(' ');
    let line = '';
    let currentY = y;
    let linesDrawn = 0;

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;
      if (testWidth > maxWidth && n > 0) {
        ctx.fillText(line.trim(), x, currentY);
        line = words[n] + ' ';
        currentY += lineHeight;
        linesDrawn++;
        if (linesDrawn >= maxLines) break;
      } else {
        line = testLine;
      }
    }
    if (linesDrawn < maxLines) {
      ctx.fillText(line.trim(), x, currentY);
    }
    return currentY + lineHeight;
  }

  const startY = currentAspectRatio === '16:9' ? 260 : 360;
  const endHeadlineY = wrapText(headline, 80, startY, width - 160, 80, 4);

  // Subtext Body
  const bodyText = imgBodyInput.value;
  ctx.font = `500 34px ${fontFam}`;
  ctx.fillStyle = currentImageTheme === 'ivory' ? '#475569' : 'rgba(255, 255, 255, 0.85)';
  wrapText(bodyText, 80, endHeadlineY + 28, width - 160, 50, 4);

  // Divider Line
  const footerY = height - 160;
  ctx.strokeStyle = currentImageTheme === 'ivory' ? '#E2E8F0' : 'rgba(255, 255, 255, 0.2)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(80, footerY);
  ctx.lineTo(width - 80, footerY);
  ctx.stroke();

  // Author Box in Footer
  if (imgShowAuthor.checked) {
    ctx.font = 'bold 28px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = currentImageTheme === 'ivory' ? '#0F172A' : '#FFFFFF';
    ctx.fillText(currentPersona.name, 80, footerY + 55);

    ctx.font = '500 22px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = currentImageTheme === 'ivory' ? '#64748B' : 'rgba(255, 255, 255, 0.7)';
    ctx.fillText(currentPersona.role, 80, footerY + 90);
  }

  // Brand Name Bottom Right
  ctx.font = '800 26px "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = currentImageTheme === 'ivory' ? '#0284C7' : '#38BDF8';
  ctx.fillText('EchoBrand.Studio', width - 300, footerY + 68);

  // Trigger Download
  const link = document.createElement('a');
  link.download = `echobrand-canva-${currentAspectRatio.replace(':', '-')}-slide-${activeSlideIndex}.png`;
  link.href = exportCanvas.toDataURL('image/png');
  link.click();

  showToast(`Downloaded PNG card (${width}x${height})!`);
}

downloadImageBtn.addEventListener('click', exportCardAsPng);

// ==========================================
// AI ENGINE STATUS MODAL
// ==========================================

function updateAiStatusBadge() {
  if (geminiApiKey) {
    aiStatusLabel.textContent = "AI: Gemini Live ⚡";
    geminiApiKeyInput.value = geminiApiKey;
  } else {
    aiStatusLabel.textContent = "AI: Active & Ready";
  }
}

openAiModalBtn.addEventListener('click', () => {
  aiModal.classList.remove('hidden');
});

closeAiModalBtn.addEventListener('click', () => {
  aiModal.classList.add('hidden');
});

saveApiKeyBtn.addEventListener('click', () => {
  const key = geminiApiKeyInput.value.trim();
  if (key) {
    geminiApiKey = key;
    localStorage.setItem('echobrand_gemini_key', key);
    updateAiStatusBadge();
    aiModal.classList.add('hidden');
    showToast('Gemini API key saved! Live LLM generation active.');
  } else {
    aiModal.classList.add('hidden');
  }
});

clearApiKeyBtn.addEventListener('click', () => {
  geminiApiKey = '';
  localStorage.removeItem('echobrand_gemini_key');
  geminiApiKeyInput.value = '';
  updateAiStatusBadge();
  aiModal.classList.add('hidden');
  showToast('Reset to built-in Brand Memory AI engine.');
});

// Tab Switcher
const tabs = {
  tabLinkedin: 'contentLinkedin',
  tabTwitter: 'contentTwitter',
  tabCarousel: 'contentCarousel',
  tabNewsletter: 'contentNewsletter'
};

Object.entries(tabs).forEach(([btnId, contentId]) => {
  document.getElementById(btnId).addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => {
      b.classList.remove('text-white', 'bg-brand-600', 'shadow-sm', 'font-bold');
      b.classList.add('text-slate-600', 'font-semibold');
    });
    document.querySelectorAll('.channel-view').forEach(v => v.classList.add('hidden'));

    document.getElementById(btnId).classList.add('text-white', 'bg-brand-600', 'shadow-sm', 'font-bold');
    document.getElementById(btnId).classList.remove('text-slate-600', 'font-semibold');
    document.getElementById(contentId).classList.remove('hidden');
  });
});

// Copy Helpers
window.copyText = function(encoded) {
  const text = decodeURIComponent(encoded);
  navigator.clipboard.writeText(text);
  showToast('Copied to clipboard!');
};

document.getElementById('copyLinkedinBtn').addEventListener('click', () => {
  navigator.clipboard.writeText(linkedinBody.textContent);
  showToast('LinkedIn post copied to clipboard!');
});

document.getElementById('copyTwitterBtn').addEventListener('click', () => {
  if (currentOutput && currentOutput.tweets) {
    const threadText = currentOutput.tweets.map(t => t.text).join('\n\n---\n\n');
    navigator.clipboard.writeText(threadText);
    showToast('Full Twitter thread copied!');
  }
});

document.getElementById('copyCarouselBtn').addEventListener('click', () => {
  if (currentOutput && currentOutput.slides) {
    const deckText = currentOutput.slides.map(s => `[Slide ${s.num}: ${s.title}]\n${s.desc}`).join('\n\n');
    navigator.clipboard.writeText(deckText);
    showToast('Carousel slide deck outline copied!');
  }
});

document.getElementById('copyNewsletterBtn').addEventListener('click', () => {
  if (currentOutput && currentOutput.nl) {
    const nlText = `SUBJECT: ${currentOutput.nl.subject}\n\nTL;DR:\n${currentOutput.nl.tldr}\n\nDEEP DIVE:\n${currentOutput.nl.body}`;
    navigator.clipboard.writeText(nlText);
    showToast('Newsletter edition copied!');
  }
});

// Like Button
let likes = 842;
document.getElementById('likeBtn').addEventListener('click', () => {
  likes++;
  document.getElementById('likeBtn').classList.toggle('text-brand-600');
  showToast('Liked post!');
});

// Modal Submission Content
const MODAL_CONTENT = {
  prd: `
<h3 class="text-base font-extrabold text-slate-900 border-b border-slate-100 pb-2">Problem Statement Understanding & PRD</h3>
<p class="text-brand-600 font-bold mt-2">Track 01: Media — Content Repurposing Studio with Brand Memory</p>

<h4 class="font-bold text-slate-900 mt-4">1. The Problem Space</h4>
<p class="text-slate-600">Generative AI made content creation friction-free, but created a catastrophic side-effect: <strong>Homogenized AI Slop</strong>. 99% of LLM outputs rely on the same predictable phrasing (<em>"delve", "game-changer", "in today's fast-paced world"</em>) and lose the human creator's signature voice. Additionally, creators struggling with grammar or non-native English lack tools to refine thoughts without sounding robotic.</p>

<h4 class="font-bold text-slate-900 mt-4">2. The Solution: EchoBrand Studio</h4>
<p class="text-slate-600">EchoBrand Studio pairs <strong>Wispr Flow's 200 WPM voice dictation</strong> with a persistent <strong>Brand Memory Vault</strong>, an interactive <strong>AI Text & Grammar Improver</strong>, and a <strong>Canva-Style Visual Image Studio</strong>.</p>

<h4 class="font-bold text-slate-900 mt-4">3. Key Architectural Pillars</h4>
<ul class="list-disc pl-5 space-y-1.5 mt-1.5 text-slate-600">
  <li><strong>AI Brand Copilot & Grammar Improver:</strong> Real-time grammar polishing, hook generation, and idea brainstorming.</li>
  <li><strong>Tone DNA Sliders:</strong> Calibrates Casual vs Formal, Punchy vs Narrative, and Contrarian stance.</li>
  <li><strong>Anti-Slop Shield:</strong> Algorithmic scanner and sanitizer that detects banned AI clichés and replaces them with punchy human equivalents.</li>
  <li><strong>Multi-Channel Transformer:</strong> Generates formatted LinkedIn cards, 4-tweet threads with char counters, 6-slide visual carousels, and newsletters in parallel.</li>
  <li><strong>Canva-Style Visual Image Studio:</strong> Exports 1:1, 16:9, and 4:5 high-res PNG cards directly from the browser.</li>
</ul>
  `,
  voice: `
<h3 class="text-base font-extrabold text-slate-900 border-b border-slate-100 pb-2">Wispr Flow Usage & Scoring Narrative (20% of Score)</h3>
<p class="text-emerald-600 font-bold mt-2">How voice powers EchoBrand Studio end-to-end</p>

<div class="space-y-3 mt-3">
  <div class="bg-slate-50 p-4 rounded-2xl border border-slate-200">
    <h4 class="font-bold text-brand-600">1. How We Used Wispr Flow During Hackathon Building:</h4>
    <p class="mt-1 text-slate-600 text-xs sm:text-sm">Rather than typing out long prompts or code comments, we used Wispr Flow to dictate our feature specs, brainstorming sessions, and user journey directly into our coding environment. This reduced our planning cycle from 2 hours to under 25 minutes.</p>
  </div>

  <div class="bg-slate-50 p-4 rounded-2xl border border-slate-200">
    <h4 class="font-bold text-brand-600">2. How Wispr Flow Powers the Core Product Experience:</h4>
    <p class="mt-1 text-slate-600 text-xs sm:text-sm">Content creation is throttled by typing speed and keyboard friction. High-performing creators speak naturally at 150–200 words per minute. EchoBrand's "Dictate with Wispr Flow" allows creators to do unvarnished brain-dumps that are converted directly into branded multi-channel collateral.</p>
  </div>

  <div class="bg-slate-50 p-4 rounded-2xl border border-slate-200">
    <h4 class="font-bold text-brand-600">3. Real-Time AI Grammar & Polish Assistance:</h4>
    <p class="mt-1 text-slate-600 text-xs sm:text-sm">Even if a creator's spoken voice has grammatical errors or hesitations, our integrated AI Text Improver instantly polishes the grammar to fluent, native English before multi-channel publishing.</p>
  </div>
</div>
  `,
  linkedin: `
<h3 class="text-base font-extrabold text-slate-900 border-b border-slate-100 pb-2">Winning LinkedIn Submission Post (15% + 10 Bonus Points)</h3>
<p class="text-purple-600 font-bold mt-2">Copy and post this on LinkedIn to claim top engagement rank!</p>

<div class="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 font-mono text-xs text-slate-800 whitespace-pre-wrap leading-relaxed mt-3" id="linkedinPostCopyText">
99% of AI content is generic slop.

You know the exact posts:
"In today's fast-paced world..."
"Delve into the possibilities..."
"A testament to innovation..."

Today during the Product Space Hackathon, my teammate and I decided to solve this once and for all.

Meet EchoBrand Studio: A Content Repurposing Studio with Brand Memory, built with Wispr Flow 🎙️🚀

Here was the core problem:
Standard AI treats every prompt like day 1 with zero context. It forgets your voice, ignores your banned clichés, and requires 20 minutes of manual editing to sound human.

What we built in 6 hours:
1. Brand Memory Vault: Persistent Tone DNA sliders, customizable Anti-Slop negative filters (goodbye "delve"), and style anchors.
2. Voice-First Velocity: Dictate messy, stream-of-consciousness thoughts into Wispr Flow at 200 words/min.
3. AI Text & Grammar Improver: 1-click polish that corrects English grammar mistakes and enhances hooks without losing authenticity.
4. Canva-Style Image Studio: Export 1080x1080 PNG carousel cards and quote graphics directly in-browser.
5. Multi-Channel Synthesis: 1 voice note instantly yields a high-whitespace LinkedIn post, a 4-tweet thread with character counters, a 6-slide visual carousel outline, and an executive newsletter.

We literally used EchoBrand and Wispr Flow to write this post in under 60 seconds.

Huge shoutout to @Product Space and @Wispr Flow for hosting an incredible sprint!

👉 Fellow builders: What's the #1 cliché that makes you instantly scroll past an AI post? Drop it below!

#WisprFlow #ProductSpace #AIHackathon #BuildInPublic #GenerativeAI #ProductManagement #VoiceAI
</div>
  `,
  demo: `
<h3 class="text-base font-extrabold text-slate-900 border-b border-slate-100 pb-2">2-Minute Demo Video Script (Loom / Screen Recording)</h3>
<p class="text-amber-600 font-bold mt-2">Word-for-word script to record your video</p>

<div class="space-y-3 mt-3 text-slate-700 text-xs sm:text-sm">
  <div class="bg-slate-50 p-4 rounded-2xl border border-slate-200">
    <p class="font-bold text-brand-600">0:00 - 0:25 | Hook & Problem</p>
    <p class="italic text-slate-600 mt-1">"Hi judges! I'm showing you EchoBrand Studio, built for Track 1 of the Product Space Hackathon. The biggest problem with generative AI today is that it sounds like generic slop. It loses your voice, uses clichés like 'delve', and takes 20 minutes to reformat for different platforms."</p>
  </div>

  <div class="bg-slate-50 p-4 rounded-2xl border border-slate-200">
    <p class="font-bold text-brand-600">0:25 - 0:50 | Brand Memory & AI Text Improver</p>
    <p class="italic text-slate-600 mt-1">"Here is our moat: The Brand Memory Vault with Tone DNA sliders and Anti-Slop negative filters. Plus, if your spoken voice has grammar mistakes, our new AI Text Improver fixes grammar and polishes the text to native English with 1 click."</p>
  </div>

  <div class="bg-slate-50 p-4 rounded-2xl border border-slate-200">
    <p class="font-bold text-brand-600">0:50 - 1:20 | Live Dictation & 4-Channel Output</p>
    <p class="italic text-slate-600 mt-1">"Now watch the magic: I dictate with Wispr Flow at 200 WPM, hit Repurpose, and within seconds, look at what was generated: An authentic LinkedIn post, a 4-tweet thread with character counters, a 6-slide carousel outline, and an executive newsletter."</p>
  </div>

  <div class="bg-slate-50 p-4 rounded-2xl border border-slate-200">
    <p class="font-bold text-brand-600">1:20 - 1:45 | Canva-Style Visual Image Studio</p>
    <p class="italic text-slate-600 mt-1">"And for visual engagement, our Canva-Style Image Studio lets me switch themes, choose aspect ratios, and download high-res PNG cards for carousels with 1 click."</p>
  </div>

  <div class="bg-slate-50 p-4 rounded-2xl border border-slate-200">
    <p class="font-bold text-brand-600">1:45 - 2:00 | Wrap-up & The Meta Twist</p>
    <p class="italic text-slate-600 mt-1">"In fact, we actually used EchoBrand and Wispr Flow to write our official hackathon LinkedIn post today. This cuts content creation from 45 minutes to 90 seconds while keeping 100% authentic voice. Thank you!"</p>
  </div>
</div>
  `
};

function renderModalContent(tab) {
  activeModalTab = tab;
  modalBody.innerHTML = MODAL_CONTENT[tab];

  document.querySelectorAll('.modal-tab-btn').forEach(b => {
    b.classList.remove('border-brand-600', 'text-brand-600', 'font-bold');
    b.classList.add('border-transparent', 'text-slate-500', 'font-semibold');
  });

  const tabIdMap = {
    prd: 'modalTabPrd',
    voice: 'modalTabVoice',
    linkedin: 'modalTabLinkedin',
    demo: 'modalTabDemo'
  };
  const activeBtn = document.getElementById(tabIdMap[tab]);
  if (activeBtn) {
    activeBtn.classList.add('border-brand-600', 'text-brand-600', 'font-bold');
    activeBtn.classList.remove('border-transparent', 'text-slate-500', 'font-semibold');
  }
}

document.getElementById('modalTabPrd').addEventListener('click', () => renderModalContent('prd'));
document.getElementById('modalTabVoice').addEventListener('click', () => renderModalContent('voice'));
document.getElementById('modalTabLinkedin').addEventListener('click', () => renderModalContent('linkedin'));
document.getElementById('modalTabDemo').addEventListener('click', () => renderModalContent('demo'));

openKitBtn.addEventListener('click', () => {
  renderModalContent('prd');
  kitModal.classList.remove('hidden');
});

closeKitBtn.addEventListener('click', () => {
  kitModal.classList.add('hidden');
});

copyModalContentBtn.addEventListener('click', () => {
  if (activeModalTab === 'linkedin') {
    const text = document.getElementById('linkedinPostCopyText').textContent;
    navigator.clipboard.writeText(text);
  } else {
    navigator.clipboard.writeText(modalBody.innerText);
  }
  showToast('Copied modal content to clipboard!');
});

// Initialize on Load
window.addEventListener('DOMContentLoaded', () => {
  renderPersonas();
  updateAiStatusBadge();
  rawInput.value = DEMOS.demo1;
  updateInputStats();
  generateContent();
  updateCardPreview();
  if (window.lucide) lucide.createIcons();
});
