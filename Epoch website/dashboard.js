// ===== DASHBOARD JS =====
const user = JSON.parse(localStorage.getItem('epochUser')) || {
  name: 'Explorer', country: 'Uzbekistan', region: 'Samarkand',
  avatar: '🧑‍🏫', coins: 340, streak: 5, completedLessons: ['uz-1-1','uz-1-2']
};

// Country flags
const countryFlags = {
  'Uzbekistan':'🇺🇿','Kazakhstan':'🇰🇿','India':'🇮🇳','Japan':'🇯🇵','Nigeria':'🇳🇬',
  'Brazil':'🇧🇷','Egypt':'🇪🇬','Turkey':'🇹🇷','Mexico':'🇲🇽','Russia':'🇷🇺',
  'default':'🌍'
};

// Lesson data by country
const lessonData = {
  'Uzbekistan': {
    ch1: [
      { id:'uz-1-1', icon:'🏺', label:'Ancient Sogdiana', type:'theory' },
      { id:'uz-1-2', icon:'⚔️', label:'Persian Conquest', type:'theory' },
      { id:'uz-1-3', icon:'🐘', label:'Alexander the Great', type:'theory' },
      { id:'uz-1-4', icon:'📝', label:'Quiz: Ancient Era', type:'quiz' },
      { id:'uz-1-5', icon:'🔒', label:'Revise: Ancient Sogdiana', type:'revision', locked24: true },
    ],
    ch2: [
      { id:'uz-2-1', icon:'🐪', label:'Silk Road Begins', type:'theory' },
      { id:'uz-2-2', icon:'🕌', label:'Islam Arrives', type:'theory' },
      { id:'uz-2-3', icon:'📚', label:'Samanid Golden Age', type:'theory' },
      { id:'uz-2-4', icon:'✍️', label:'Workbook: Silk Road', type:'workbook' },
      { id:'uz-2-5', icon:'🎯', label:'Quiz: Silk Road', type:'quiz' },
    ]
  },
  'default': {
    ch1: [
      { id:'xx-1-1', icon:'🏺', label:'Ancient Origins', type:'theory' },
      { id:'xx-1-2', icon:'⚔️', label:'Early Conflicts', type:'theory' },
      { id:'xx-1-3', icon:'📝', label:'Quiz: Origins', type:'quiz' },
      { id:'xx-1-4', icon:'🔒', label:'Revision', type:'revision', locked24: true },
    ],
    ch2: [
      { id:'xx-2-1', icon:'🌾', label:'Medieval Period', type:'theory' },
      { id:'xx-2-2', icon:'🏰', label:'Great Empires', type:'theory' },
      { id:'xx-2-3', icon:'📝', label:'Quiz: Medieval', type:'quiz' },
    ]
  }
};

const funFacts = [
  "The Silk Road wasn't a single road — it was a network of trade routes connecting East and West!",
  "Uzbekistan's Samarkand is one of the oldest continuously inhabited cities in Central Asia.",
  "The ancient city of Timgad in Algeria was built in a perfect grid pattern by Roman engineers.",
  "The Aztec capital Tenochtitlan had a population larger than most European cities in 1500 CE.",
  "Japan's samurai originally served as mounted archers, not sword-fighters.",
  "The Great Wall of China is not actually visible from space — that's a popular myth!",
  "The Library of Alexandria held an estimated 400,000–700,000 scrolls.",
  "Mali's Mansa Musa was possibly the wealthiest person in all of human history."
];

function init() {
  // Set user data in UI
  document.getElementById('streak-count').textContent = user.streak || 0;
  document.getElementById('coin-count').textContent = user.coins || 0;
  document.getElementById('lb-coins').textContent = user.coins || 0;
  document.getElementById('nav-avatar').textContent = user.avatar;
  document.getElementById('drop-avatar').textContent = user.avatar;
  document.getElementById('drop-name').textContent = user.name;
  document.getElementById('drop-loc').textContent = `📍 ${user.region || ''}, ${user.country || ''}`;
  document.getElementById('drop-coins').textContent = user.coins || 0;
  document.getElementById('dash-avatar').textContent = user.avatar;
  document.getElementById('sb-course').textContent = user.country || 'Uzbekistan';
  document.getElementById('sb-region').textContent = user.region || 'Select a region';
  const flag = countryFlags[user.country] || countryFlags['default'];
  document.getElementById('sb-flag').textContent = flag;

  // Fun fact
  document.getElementById('fun-fact').textContent = funFacts[Math.floor(Math.random() * funFacts.length)];

  // Build learning path
  const lessons = lessonData[user.country] || lessonData['default'];
  buildPath(lessons.ch1, 'learning-path');
  buildPath(lessons.ch2, 'learning-path-2');

  // Explorer level
  const level = Math.floor((user.completedLessons?.length || 0) / 2) + 1;
  document.getElementById('explorer-level').textContent = level;
}

function buildPath(nodes, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = '';

  const zigzag = [0, 80, 140, 80, 0, -80, -140, -80]; // pixel offsets for zigzag
  nodes.forEach((node, i) => {
    const completed = (user.completedLessons || []).includes(node.id);
    const prevCompleted = i === 0 || (user.completedLessons || []).includes(nodes[i-1]?.id);
    const isActive = !completed && prevCompleted && !node.locked24;
    const isLocked = !completed && !prevCompleted;

    // Connector line
    if (i > 0) {
      const conn = document.createElement('div');
      conn.className = 'path-connector';
      container.appendChild(conn);
    }

    // Node wrap
    const wrap = document.createElement('div');
    wrap.className = 'node-wrap-inner';
    wrap.style.marginLeft = `${zigzag[i % zigzag.length]}px`;
    wrap.style.transition = `margin 0.5s ease ${i*0.1}s`;

    let nodeClass = 'lesson-node';
    if (completed) nodeClass += ' completed';
    else if (node.locked24) nodeClass += ' locked-24';
    else if (isActive) nodeClass += ' active';
    else if (isLocked) nodeClass += ' locked';

    const typeColor = {
      theory: '', quiz: 'quiz-node', workbook: 'wb-node', revision: ''
    };

    const link = document.createElement('a');
    link.className = nodeClass;
    link.href = getNodeHref(node, completed, isActive);
    if (isLocked || (node.locked24 && !completed)) {
      link.href = '#';
      link.onclick = (e) => {
        e.preventDefault();
        if (node.locked24) {
          alert('🔒 This revision unlocks 24 hours after you complete the lesson. Come back tomorrow!');
        } else {
          alert('🔒 Complete the previous lesson first!');
        }
      };
    }

    const tooltip = document.createElement('div');
    tooltip.className = 'node-tooltip';
    tooltip.textContent = node.label + (node.locked24 ? ' (unlocks in 24h)' : '');

    link.innerHTML = node.icon;
    link.appendChild(tooltip);

    const label = document.createElement('div');
    label.className = 'node-label';
    label.textContent = node.label;

    wrap.appendChild(link);
    wrap.appendChild(label);
    container.appendChild(wrap);
  });
}

function getNodeHref(node, completed, isActive) {
  if (node.type === 'quiz') return `lesson.html?type=quiz&id=${node.id}`;
  if (node.type === 'workbook') return `lesson.html?type=workbook&id=${node.id}`;
  if (node.type === 'revision') return `lesson.html?type=revision&id=${node.id}`;
  return `lesson.html?type=theory&id=${node.id}`;
}

function toggleProfile() {
  document.getElementById('profile-dropdown').classList.toggle('open');
}

document.addEventListener('click', (e) => {
  const drop = document.getElementById('profile-dropdown');
  const btn = document.getElementById('nav-avatar');
  if (!drop.contains(e.target) && e.target !== btn) {
    drop.classList.remove('open');
  }
});

init();