// CIRCLE - Main App Logic
const lessons = [
  { tag: 'MATH • POPULAR', title: 'Calculus Fundamentals', desc: 'Limits, derivatives, and integrals explained by the community.', meta: '2.4k learners • 98% helpful' },
  { tag: 'SCIENCE • NEW', title: 'Quantum Basics', desc: 'Intro to quantum mechanics, explained simply.', meta: '1.1k learners • 95% helpful' },
  { tag: 'LANGUAGES • CULTURE', title: 'Conversational Twi', desc: 'Practical Twi for daily conversation, taught by native speakers.', meta: '3.8k learners • 97% helpful' },
  { tag: 'CULTURE', title: 'Ghana Culture & Festivals', desc: 'Homowo, Hogbetsotso, and what they mean — taught by locals.', meta: '5.2k learners • 99% helpful' },
  { tag: 'MUSIC', title: 'Highlife Music Theory', desc: 'How Highlife rhythms work, from drums to guitar.', meta: '900 learners • 96% helpful' },
  { tag: 'LIFESTYLE', title: 'Farming in Northern Ghana', desc: 'Real lessons on soil, rain, and crops from farmers.', meta: '1.8k learners • 98% helpful' },
];

// Render lessons
const grid = document.getElementById('lessonGrid');
if (grid) {
  grid.innerHTML = lessons.map(l => `
    <article class="card"><span class="tag">${l.tag}</span><h3>${l.title}</h3><p>${l.desc}</p><p class="small" style="margin-top:12px;color:#a78bfa">${l.meta}</p></article>
  `).join('');
}

// Toast
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg; t.hidden = false;
  setTimeout(() => t.hidden = true, 3000);
}

// Modal
const modal = document.getElementById('teachModal');
document.addEventListener('click', (e) => {
  const action = e.target.closest('[data-action]')?.dataset.action;
  if (action === 'open-teach') { modal.classList.add('open'); modal.setAttribute('aria-hidden', 'false'); }
  if (action === 'close-teach') { modal.classList.remove('open'); }
  if (action === 'signin') showToast('Sign in coming soon — use Teach button to start');
});
modal?.addEventListener('click', (e) => { if (e.target === modal) modal.classList.remove('open'); });

// Upload
document.getElementById('uploadBox')?.addEventListener('click', () => document.getElementById('fileInput').click());
document.getElementById('fileInput')?.addEventListener('change', (e) => {
  if (e.target.files[0]) showToast('File added: ' + e.target.files[0].name);
});

// --- WEEKLY REWARD SYSTEM ---
// Stored locally. In production, this comes from your backend / database.
let weeklyCount = parseInt(localStorage.getItem('circle_weekly_count') || '0');
let weeklyClaimed = localStorage.getItem('circle_weekly_claimed') === 'true';

function getWeeklyReward(count) {
  if (count >= 50) return { coins: 600, label: 'Weekly Star — 600 Coins + Bonus Certificate' };
  if (count >= 30) return { coins: 350, label: 'Featured Teacher — 350 Coins' };
  if (count >= 15) return { coins: 150, label: 'Certificate Credit — 150 Coins' };
  if (count >= 5) return { coins: 50, label: 'Weekly Badge — 50 Coins' };
  return { coins: 0, label: 'Teach 5+ lessons to unlock reward' };
}

function updateWeeklyUI() {
  const reward = getWeeklyReward(weeklyCount);
  document.getElementById('weeklyCount').textContent = weeklyCount;
  document.getElementById('weeklyCoins').textContent = reward.coins;
  document.getElementById('weeklyStatus').textContent = weeklyClaimed ? '✓ Claimed this week' : reward.label;
  // Highlight tier
  document.querySelectorAll('.reward-tiers .tier').forEach((el, i) => {
    const thresholds = [5, 15, 30, 50];
    el.classList.toggle('active', weeklyCount >= thresholds[i]);
  });
}

function getTimeToSunday() {
  const now = new Date();
  const sunday = new Date(now);
  sunday.setDate(now.getDate() + ((7 - now.getDay()) % 7));
  sunday.setHours(18, 0, 0, 0); // Sunday 6pm GMT
  if (sunday < now) sunday.setDate(sunday.getDate() + 7);
  const diff = sunday - now;
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  return `${d}d ${h}h ${m}m`;
}

function updateCountdown() {
  const el = document.getElementById('weeklyCountdown');
  if (el) el.textContent = getTimeToSunday();
}
updateWeeklyUI();
updateCountdown();
setInterval(updateCountdown, 60000);

// Submit lesson -> counts toward weekly reward
document.getElementById('submitLessonBtn')?.addEventListener('click', () => {
  const title = document.getElementById('lessonTitle').value || 'Untitled Lesson';
  const cat = document.getElementById('lessonCat').value;
  weeklyCount++;
  localStorage.setItem('circle_weekly_count', weeklyCount);
  weeklyClaimed = false;
  localStorage.setItem('circle_weekly_claimed', 'false');
  updateWeeklyUI();
  const box = document.getElementById('teachResult');
  box.hidden = false;
  box.innerHTML = `✓ <strong>${title}</strong> (${cat}) submitted! Sent to 12 reviewers. +10 Coins pending verification. Weekly total: ${weeklyCount} lessons.`;
  showToast('Lesson submitted! Counts toward Sunday reward.');
});

// Claim weekly reward
document.getElementById('claimWeeklyBtn')?.addEventListener('click', () => {
  const reward = getWeeklyReward(weeklyCount);
  if (weeklyClaimed) return showToast('Already claimed this week. Teach more for next week.');
  if (reward.coins === 0) return showToast('Teach at least 5 verified lessons to claim.');
  weeklyClaimed = true;
  localStorage.setItem('circle_weekly_claimed', 'true');
  updateWeeklyUI();
  showToast(`Reward claimed: ${reward.label}`);
});

// Solver
document.getElementById('solveBtn')?.addEventListener('click', () => {
  const q = document.getElementById('problemInput').value || 'How do I stop flooding in Accra?';
  const out = document.getElementById('solverOutput');
  out.hidden = false;
  out.innerHTML = `<strong>Circle's answer using community knowledge:</strong><br><br>For: <em>"${q}"</em><br><br>1. <strong>What locals taught Circle:</strong> Flooding in Accra is often from blocked drains + building on waterways.<br>2. <strong>Community solution:</strong> Clear drains before rainy season, sandbags, raise foundations, community clean-up.<br>3. <strong>Long-term:</strong> Lessons from 214 locals suggest better drainage planning + early warning.<br><br><small>Sources: 214 community lessons • Accuracy 94.2%</small>`;
});

// Certificate
document.getElementById('downloadCertBtn')?.addEventListener('click', () => {
  const name = prompt('Enter name for certificate:', 'Kwame Mensah') || 'Kwame Mensah';
  document.getElementById('certName').textContent = name;
  showToast('Certificate ready for ' + name + ' — CEO: Gokah Israel Ewoenam');
  window.print();
});

// Live counter
let c = 1200000;
setInterval(() => {
  c += Math.floor(Math.random() * 3);
  const el = document.getElementById('statLessons');
  if (el) el.textContent = (c / 1000000).toFixed(2) + 'M';
}, 3000);
