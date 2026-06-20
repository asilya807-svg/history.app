// ===== LESSON JS =====
const params = new URLSearchParams(window.location.search);
const lessonType = params.get('type') || 'theory';
const lessonId = params.get('id') || 'uz-1-1';

const user = JSON.parse(localStorage.getItem('epochUser')) || {
  name:'Explorer', coins:340, completedLessons:[]
};

let currentSlide = 0;
let hearts = 3;
let correctAnswers = 0;
let totalQuestions = 0;
let slides = [];

// ===== LESSON CONTENT DATABASE =====
const lessonContent = {
  'uz-1-1': {
    title: 'Ancient Sogdiana',
    type: 'theory',
    slides: [
      {
        type: 'theory',
        tag: 'Theory',
        headline: 'Welcome to Ancient Sogdiana! 🏺',
        image: '🏺',
        body: `Long before Uzbekistan existed as a country, this land was home to one of the ancient world's great civilizations: <strong>Sogdiana</strong>. Named after the Sogdians — a people of Iranian origin — this region flourished between the 6th century BCE and the 8th century CE. Their heartland lay between the Amu Darya and Syr Darya rivers, with the magnificent cities of Samarkand and Bukhara as their cultural centers.`,
        note: `"Sogdiana" comes from the Old Persian word "Suguda" — meaning "the land of strength"! 💪`
      },
      {
        type: 'theory',
        tag: 'Theory',
        headline: 'Who Were the Sogdians? 🧑‍🤝‍🧑',
        image: '🐪',
        body: `The Sogdians were master <strong>merchants and diplomats</strong>. They dominated trade across the ancient world centuries before the term "Silk Road" was even invented. Sogdian merchants traveled from China to Byzantium, from India to the steppes of Russia — carrying silk, spices, gold, and ideas. Their language became the <strong>lingua franca of the Silk Road</strong> — like English is today for international business.`,
        terms: [
          { word: 'Lingua franca', def: 'A language used as a common language between speakers whose native languages are different' },
          { word: 'Samarkand', def: 'Ancient Sogdian city, one of the oldest continuously inhabited cities in Central Asia' },
          { word: 'Merchant', def: 'A person who trades in commodities, especially one who travels between countries' },
        ]
      },
      {
        type: 'theory',
        tag: 'Theory',
        headline: 'Sogdian Culture & Art 🎨',
        image: '🎨',
        body: `The Sogdians were also celebrated <strong>artists and builders</strong>. Their palace murals, discovered in ruins across Uzbekistan, show vivid scenes of banquets, hunting parties, and mythical creatures. The city of Penjikent (in modern Tajikistan) is often called the <strong>"Pompeii of Central Asia"</strong> because its ruins preserve so much Sogdian art. Sogdian art blended Persian, Greek, Indian, and Chinese influences into something completely unique.`,
        note: `The Sogdians invented an alphabet that influenced Arabic, Hebrew, and even Mongolian scripts. Their ideas spread as far as their caravans! ✍️`
      }
    ]
  },
  'uz-1-2': {
    title: 'Persian Conquest',
    type: 'theory',
    slides: [
      {
        type: 'theory',
        tag: 'Theory',
        headline: 'The Persian Empire Arrives ⚔️',
        image: '👑',
        body: `Around 530 BCE, the mighty <strong>Achaemenid Persian Empire</strong> — led by Cyrus the Great — swept through Central Asia and conquered Sogdiana. This was one of the largest empires the world had ever seen, stretching from Greece to India. Under Persian rule, Sogdiana became a <strong>satrapy</strong> (a province) called "Suguda."`,
        note: `Cyrus the Great was famous for his tolerance. He allowed conquered peoples to keep their religions and customs — rare for ancient rulers! 🕊️`
      }
    ]
  },
  quiz: {
    title: 'Quiz: Ancient Era',
    type: 'quiz',
    slides: [
      {
        type: 'quiz',
        tag: 'Quiz',
        question: 'What were the two most important cities in ancient Sogdiana?',
        options: [
          { letter:'A', text:'Samarkand and Bukhara', correct: true },
          { letter:'B', text:'Baghdad and Damascus' },
          { letter:'C', text:'Kabul and Herat' },
          { letter:'D', text:'Tehran and Tabriz' },
        ],
        explanation: 'Correct! Samarkand and Bukhara were the heart of Sogdian civilization. 🏙️'
      },
      {
        type: 'quiz',
        tag: 'Quiz',
        question: 'The Sogdian language served as what on the Silk Road?',
        options: [
          { letter:'A', text:'A secret code' },
          { letter:'B', text:'A religious script' },
          { letter:'C', text:'A common trade language (lingua franca)', correct: true },
          { letter:'D', text:'A military signal system' },
        ],
        explanation: 'Yes! Sogdian was the Silk Road\'s common language, like English today. 🌏'
      },
      {
        type: 'quiz',
        tag: 'Quiz',
        question: 'What Persian leader conquered Sogdiana around 530 BCE?',
        options: [
          { letter:'A', text:'Darius the Great' },
          { letter:'B', text:'Xerxes I' },
          { letter:'C', text:'Cyrus the Great', correct: true },
          { letter:'D', text:'Artaxerxes II' },
        ],
        explanation: 'That\'s right! Cyrus the Great was known for his tolerant rule over conquered peoples. ⚔️'
      }
    ]
  },
  workbook: {
    title: 'Workbook: Silk Road',
    type: 'workbook',
    slides: [
      {
        type: 'workbook',
        tag: 'Workbook',
        prompt: '✍️ Reflection: The Sogdians were master traders. What do YOU think made them so successful at trading?',
        hint: 'Think about: language, geography, diplomacy, or products they traded...'
      },
      {
        type: 'workbook',
        tag: 'Workbook',
        prompt: '🗺️ Imagine you are a Sogdian merchant in 500 BCE. Describe your journey from Samarkand to China.',
        hint: 'What would you carry? What dangers would you face? Who would you meet?'
      }
    ]
  }
};

// Get the right content
function getLessonData() {
  if (lessonType === 'quiz') return lessonContent['quiz'];
  if (lessonType === 'workbook') return lessonContent['workbook'];
  return lessonContent[lessonId] || lessonContent['uz-1-1'];
}

const lesson = getLessonData();
slides = lesson.slides;

function updateProgress() {
  const pct = (currentSlide / slides.length) * 100;
  document.getElementById('lesson-progress').style.width = pct + '%';
}

function updateHearts() {
  const h = document.getElementById('lesson-hearts');
  h.textContent = '❤️'.repeat(hearts) + '🖤'.repeat(3 - hearts);
}

function renderSlide(slide) {
  const wrapper = document.getElementById('lesson-wrapper');
  const footer = document.getElementById('lesson-footer');
  footer.style.display = 'none';
  document.getElementById('answer-feedback').textContent = '';
  document.getElementById('continue-btn').className = 'continue-btn';

  if (slide.type === 'theory') {
    const termsHtml = slide.terms ? `
      <div class="key-terms">
        <h4>📖 Key Terms</h4>
        ${slide.terms.map(t => `
          <div class="term-row">
            <div class="term-word">${t.word}</div>
            <div class="term-def">${t.def}</div>
          </div>
        `).join('')}
      </div>
    ` : '';
    const noteHtml = slide.note ? `<div class="scrapbook-note">${slide.note}</div>` : '';

    wrapper.innerHTML = `
      <div class="theory-card">
        <span class="theory-tag tag-theory">📖 ${slide.tag}</span>
        <div class="theory-image">${slide.image}</div>
        <h2 class="theory-headline">${slide.headline}</h2>
        <p class="theory-body">${slide.body}</p>
        ${termsHtml}
        ${noteHtml}
      </div>
    `;
    footer.style.display = 'flex';
    document.getElementById('continue-btn').textContent = 'Continue →';

  } else if (slide.type === 'quiz') {
    totalQuestions++;
    const letters = ['A','B','C','D'];
    wrapper.innerHTML = `
      <div class="theory-card">
        <span class="theory-tag tag-quiz">🎯 ${slide.tag}</span>
        <div class="quiz-question">${slide.question}</div>
        <div class="quiz-options" id="quiz-opts">
          ${slide.options.map((opt, i) => `
            <div class="quiz-option" onclick="checkAnswer(this, ${opt.correct === true}, '${slide.explanation?.replace(/'/g,"\\'")||''}')" data-correct="${opt.correct === true}">
              <div class="option-letter">${letters[i]}</div>
              ${opt.text}
            </div>
          `).join('')}
        </div>
      </div>
    `;

  } else if (slide.type === 'workbook') {
    wrapper.innerHTML = `
      <div class="theory-card">
        <span class="theory-tag tag-workbook">✍️ ${slide.tag}</span>
        <div class="workbook-prompt">${slide.prompt}</div>
        <div class="workbook-lines">
          <textarea class="workbook-textarea" placeholder="Write your answer here..." id="wb-answer"></textarea>
        </div>
        <p class="workbook-hint">💡 ${slide.hint}</p>
      </div>
    `;
    footer.style.display = 'flex';
    document.getElementById('continue-btn').textContent = 'Submit & Continue →';
    document.getElementById('answer-feedback').innerHTML = '';
  }
}

function checkAnswer(el, isCorrect, explanation) {
  // Disable all options
  document.querySelectorAll('.quiz-option').forEach(o => {
    o.classList.add('disabled');
    o.onclick = null;
  });

  const footer = document.getElementById('lesson-footer');
  const feedback = document.getElementById('answer-feedback');
  const btn = document.getElementById('continue-btn');
  footer.style.display = 'flex';

  if (isCorrect) {
    el.classList.add('correct');
    correctAnswers++;
    feedback.innerHTML = `<span class="feedback-correct">✅ ${explanation || 'Correct! Well done!'}</span>`;
    btn.className = 'continue-btn';
    btn.textContent = 'Continue →';
  } else {
    el.classList.add('wrong');
    hearts = Math.max(0, hearts - 1);
    updateHearts();
    // Show correct answer
    document.querySelectorAll('.quiz-option').forEach(o => {
      if (o.dataset.correct === 'true') o.classList.add('correct');
    });
    feedback.innerHTML = `<span class="feedback-wrong">❌ Not quite! ${explanation || 'Check the correct answer above.'}</span>`;
    btn.className = 'continue-btn wrong-btn';
    btn.textContent = 'Continue →';
  }
}

function nextSlide() {
  currentSlide++;
  updateProgress();
  if (currentSlide >= slides.length) {
    showComplete();
  } else {
    renderSlide(slides[currentSlide]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

function showComplete() {
  // Save progress
  if (!user.completedLessons) user.completedLessons = [];
  if (!user.completedLessons.includes(lessonId)) {
    user.completedLessons.push(lessonId);
  }
  const coinsEarned = lessonType === 'quiz'
    ? correctAnswers * 10
    : lessonType === 'workbook' ? 15 : 20;
  user.coins = (user.coins || 0) + coinsEarned;
  localStorage.setItem('epochUser', JSON.stringify(user));

  const accuracy = totalQuestions > 0
    ? Math.round((correctAnswers / totalQuestions) * 100) + '%'
    : '100%';

  document.getElementById('lesson-wrapper').innerHTML = `
    <div class="complete-screen">
      <div class="complete-trophy">🏆</div>
      <h2 class="complete-title">Lesson Complete!</h2>
      <p style="color:#8a6a3a;margin-bottom:16px;font-size:16px;">Great work, ${user.name || 'Explorer'}! You're making history!</p>
      <div class="complete-stats">
        ${totalQuestions > 0 ? `<div class="complete-stat"><div class="stat-num">${accuracy}</div><div class="stat-lbl">Accuracy</div></div>` : ''}
        <div class="complete-stat"><div class="stat-num">${slides.length}</div><div class="stat-lbl">Slides done</div></div>
        <div class="complete-stat"><div class="stat-num">${hearts}/3</div><div class="stat-lbl">Hearts left</div></div>
      </div>
      <div class="coins-earned">💰 +${coinsEarned} coins earned!</div>
      <div style="display:flex;gap:16px;justify-content:center;flex-wrap:wrap">
        <a href="dashboard.html" class="btn-primary" style="font-size:18px;padding:16px 32px;">Back to Path 🗺️</a>
        <a href="dashboard.html" class="btn-secondary" style="font-size:18px;padding:16px 32px;">Next Lesson →</a>
      </div>
    </div>
  `;
  document.getElementById('lesson-footer').style.display = 'none';
}

// ===== INIT =====
renderSlide(slides[0]);
updateProgress();
updateHearts();