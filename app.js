const paths = [
  {
    id: 'ai', icon: '✳', color: 'green', tag: 'THINK WELL WITH AI', title: 'AI, with your eyes open',
    desc: 'Learn what AI is good at, where it goes wrong, and how to use it without giving away your judgment.',
    level: 'Start from zero', time: '4 small steps', keywords: 'artificial intelligence critical thinking responsible', creative: true,
    resource: { label: 'UNESCO · AI and education', url: 'https://www.unesco.org/en/digital-education/artificial-intelligence' },
    weeks: [
      ['Notice the pattern', 'Pick one AI tool you have seen. Write down what goes in, what comes out, and one thing a person still needs to decide.', 'Try it: explain how a music recommendation might learn what someone likes.'],
      ['Ask better questions', 'Give a tool a goal, useful context, and a clear format. Compare its answer with a vague prompt.', 'Try it: ask for three ways to explain a hard class topic, then check them against your textbook.'],
      ['Check before you trust', 'Look for a claim, source, or calculation that could be wrong. Verify it with a source you trust.', 'Try it: list two likely failure points in an AI generated answer about your subject.'],
      ['Keep people in the loop', 'Choose a small problem where AI might help. Sketch a workflow and mark where a person must review the result.', 'Make: a one page “AI use guide” for a club, class, or project team.']
    ]
  },
  {
    id: 'data', icon: '▦', color: 'lilac', tag: 'ASK BETTER QUESTIONS', title: 'Find the story in data',
    desc: 'Turn a question into a simple chart, then explain what the numbers say—and what they cannot say.',
    level: 'Some numbers help', time: '4 small steps', keywords: 'data analytics statistics chart python', creative: true,
    resource: { label: 'Kaggle Learn · Data courses', url: 'https://www.kaggle.com/learn' },
    weeks: [
      ['Start with a question', 'Choose a question that can be answered with data, such as “Which campus spaces are busiest?”', 'Try it: write what you would measure and what you would leave out.'],
      ['Gather a tiny dataset', 'Use a small public dataset or make a sample of 10 observations. Keep a note of where it came from.', 'Try it: sort the values and calculate the average and the middle value.'],
      ['Make one clear chart', 'Choose a bar chart, line chart, or scatter plot that fits your question. Label units and give it a useful title.', 'Try it: remove anything on the chart that does not help someone understand the point.'],
      ['Tell the honest story', 'Write three sentences: what stands out, what might explain it, and what you still do not know.', 'Make: a single slide with your chart, source, takeaway, and one limitation.']
    ]
  },
  {
    id: 'cyber', icon: '⌑', color: 'peach', tag: 'MAKE THE INTERNET SAFER', title: 'Everyday cybersecurity',
    desc: 'Learn the habits and basic ideas that help protect your accounts, devices, and the people around you.',
    level: 'Start from zero', time: '4 small steps', keywords: 'security online privacy networks safety', creative: false,
    resource: { label: 'Cisco · Skills for All', url: 'https://www.cisco.com/site/us/en/learn/training-certifications/training/skills-for-all.html' },
    weeks: [
      ['Protect your accounts', 'Learn why unique passwords and multi-factor authentication make account takeovers harder.', 'Try it: make a checklist of three accounts you would secure first. Do not share passwords here.'],
      ['Spot a suspicious message', 'Check the sender, request, link destination, and urgency before opening or replying.', 'Try it: invent a harmless example phishing message and circle its warning signs.'],
      ['Map a simple system', 'Draw how a message moves from your device through a network to a website and back.', 'Try it: mark the places where a password or personal detail needs protection.'],
      ['Help your community', 'Pick one useful safety habit to explain clearly to a friend, family member, or student group.', 'Make: a one page “pause before you click” reminder with reporting steps.']
    ]
  },
  {
    id: 'web', icon: '⌘', color: 'yellow', tag: 'MAKE SOMETHING PEOPLE CAN USE', title: 'Build a small, useful website',
    desc: 'Go from a real need to a simple web page that works on a phone, keyboard, and screen reader.',
    level: 'Start from zero', time: '4 small steps', keywords: 'web design html accessibility creative coding', creative: true,
    resource: { label: 'Harvard · CS50x', url: 'https://cs50.harvard.edu/x/' },
    weeks: [
      ['Find a real need', 'Ask someone what small task takes too long or causes confusion. Describe one person and one need.', 'Try it: sketch the page on paper before writing code.'],
      ['Give the page a structure', 'Learn the purpose of headings, links, lists, and buttons. Make the main action easy to find.', 'Try it: write the page content in a plain text outline with meaningful headings.'],
      ['Make it inclusive', 'Check text contrast, keyboard focus, labels, and how the page fits a narrow phone screen.', 'Try it: navigate your page without a mouse and write down any stuck points.'],
      ['Share and improve', 'Show the prototype to a classmate. Ask them to complete one task without your help.', 'Make: a simple portfolio, event page, club guide, or study resource—and one change from feedback.']
    ]
  }
];

const storageKey = 'fieldnotes-progress-v1';
const defaultState = { selected: null, done: {} };
let state;
try { state = { ...defaultState, ...JSON.parse(localStorage.getItem(storageKey) || '{}') }; }
catch { state = { ...defaultState }; }
const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const esc = (value) => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
function save() { try { localStorage.setItem(storageKey, JSON.stringify(state)); } catch { toast('This browser could not save your progress.'); } updateProgress(); }
function getPath(id) { return paths.find(path => path.id === id); }
function completed(id) { return state.done[id] || []; }
function toast(message) { const node = $('#toast'); node.textContent = message; node.classList.add('show'); clearTimeout(toast.timer); toast.timer = setTimeout(() => node.classList.remove('show'), 2800); }

function renderPaths() {
  const term = $('#path-search').value.trim().toLowerCase();
  const activeFilter = $('.filter-tab.active')?.dataset.filter || 'all';
  const visible = paths.filter(path => {
    const matchesText = `${path.title} ${path.desc} ${path.tag} ${path.keywords}`.toLowerCase().includes(term);
    const matchesFilter = activeFilter === 'all' || (activeFilter === 'beginner' ? path.level === 'Start from zero' : path.creative);
    return matchesText && matchesFilter;
  });
  $('#path-grid').innerHTML = visible.map(path => {
    const done = completed(path.id).length;
    return `<article class="path-card"><div class="path-top"><span class="path-icon ${path.color}" aria-hidden="true">${path.icon}</span><button class="save-button" data-save="${path.id}" aria-label="${state.selected === path.id ? 'Currently learning' : 'Save'} ${esc(path.title)}" aria-pressed="${state.selected === path.id}" title="Save this learning path">${state.selected === path.id ? '✳' : '☆'}</button></div><div class="path-tag">${esc(path.tag)}</div><h3>${esc(path.title)}</h3><p>${esc(path.desc)}</p><div class="path-meta"><span>${esc(path.level)}</span><span>·</span><span>${done}/4 steps</span></div><button class="path-open" data-open="${path.id}">Open this path <span aria-hidden="true">→</span></button></article>`;
  }).join('');
  $('#empty-state').hidden = visible.length !== 0;
  $$('[data-open]').forEach(button => button.addEventListener('click', () => openPath(button.dataset.open)));
  $$('[data-save]').forEach(button => button.addEventListener('click', () => { state.selected = button.dataset.save; save(); renderPaths(); toast('Path saved to your field guide.'); }));
}

function openPath(id) {
  const path = getPath(id); if (!path) return;
  state.selected = id; save(); renderPaths();
  $('#track-detail').innerHTML = `<div class="track-detail-kicker">${esc(path.tag)}</div><h2 id="track-title">${esc(path.title)}</h2><p class="track-intro">${esc(path.desc)} Follow the steps in any order, or simply pick one that sounds interesting. Your progress is saved on this device.</p><div class="track-details-row"><span>✳ ${esc(path.level)}</span><span>↗ 4 practical steps</span><span>⌑ Free to explore</span></div>${path.weeks.map((week, index) => `<div class="track-week"><div class="track-week-head"><input class="week-check" type="checkbox" data-step="${index}" id="step-${path.id}-${index}" ${completed(id).includes(index) ? 'checked' : ''}><label for="step-${path.id}-${index}"><b>${index + 1}. ${esc(week[0])}</b><small>${esc(week[1])}</small></label></div><p>${esc(week[2])}</p></div>`).join('')}<a class="track-resource" href="${esc(path.resource.url)}" target="_blank" rel="noopener noreferrer">${esc(path.resource.label)} ↗</a><div><button class="button button-dark" id="track-close">Save and close <span>✓</span></button></div>`;
  $('#track-dialog').showModal();
  $$('.week-check', $('#track-detail')).forEach(check => check.addEventListener('change', () => {
    const done = new Set(completed(id));
    if (check.checked) done.add(Number(check.dataset.step)); else done.delete(Number(check.dataset.step));
    state.done[id] = [...done].sort(); save(); renderPaths();
  }));
  $('#track-close').addEventListener('click', () => $('#track-dialog').close());
}

function updateProgress() {
  const active = getPath(state.selected);
  const allSteps = paths.length * 4;
  const totalDone = paths.reduce((sum, path) => sum + completed(path.id).length, 0);
  $('#overall-bar').style.width = `${Math.round(totalDone / allSteps * 100)}%`;
  $('#overall-label').textContent = `${totalDone} of ${allSteps} small steps checked off`;
  $('#progress-title').textContent = active ? active.title : (totalDone ? 'A little progress adds up' : 'A good place to begin');
  const activeArea = $('#active-progress');
  if (!active && !totalDone) {
    activeArea.innerHTML = '<div class="progress-item"><span>✳</span><div><b>Your first step is waiting</b><small>Choose any path. You can change it anytime.</small></div></div>';
    return;
  }
  activeArea.innerHTML = paths.filter(path => state.selected === path.id || completed(path.id).length).map(path => {
    const n = completed(path.id).length;
    return `<div class="progress-item"><span>${path.icon}</span><div><b>${esc(path.title)}</b><small>${n === 4 ? 'Path complete — lovely work.' : `${n} of 4 steps complete`}</small></div><span class="mini-progress">${n === 4 ? '✓ done' : `${Math.round(n / 4 * 100)}%`}</span></div>`;
  }).join('');
}

function startQuiz() { $('#quiz-result').hidden = true; $('#quiz-dialog').showModal(); }
$('#quiz-open').addEventListener('click', startQuiz);
$$('.quiz-option').forEach(button => button.addEventListener('click', () => {
  const path = getPath(button.dataset.track); if (!path) return;
  state.selected = path.id; save(); renderPaths();
  const result = $('#quiz-result');
  result.innerHTML = `<b>A lovely place to start: ${esc(path.title)}</b><br>${esc(path.desc)}<br><a href="#paths" data-quiz-open="${path.id}">See this path →</a>`;
  result.hidden = false;
  result.querySelector('a').addEventListener('click', event => { event.preventDefault(); $('#quiz-dialog').close(); openPath(path.id); });
}));

$$('.filter-tab').forEach(button => button.addEventListener('click', () => {
  $$('.filter-tab').forEach(tab => { const active = tab === button; tab.classList.toggle('active', active); tab.setAttribute('aria-pressed', String(active)); });
  renderPaths();
}));
$('#path-search').addEventListener('input', renderPaths);
$('#clear-progress').addEventListener('click', () => {
  if (!state.selected && Object.keys(state.done).length === 0) { toast('There is no saved progress to reset.'); return; }
  state = { ...defaultState }; save(); renderPaths(); toast('Saved progress cleared from this device.');
});
$('#export-progress').addEventListener('click', () => {
  const data = { exportedAt: new Date().toISOString(), note: 'Your Fieldnotes learning progress. Stored and exported locally by your request.', paths: paths.map(path => ({ title: path.title, completedSteps: completed(path.id).map(index => path.weeks[index][0]) })).filter(path => path.completedSteps.length) };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob); const link = document.createElement('a'); link.href = url; link.download = 'fieldnotes-progress.json'; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000); toast('Your progress file is ready.');
});
$('#privacy-link').addEventListener('click', event => { event.preventDefault(); $('#privacy-dialog').showModal(); });
$('#privacy-close').addEventListener('click', () => $('#privacy-dialog').close());
$('#menu-toggle').addEventListener('click', event => {
  const button = event.currentTarget; const nav = $('#mobile-nav'); const opening = button.getAttribute('aria-expanded') !== 'true';
  button.setAttribute('aria-expanded', String(opening)); button.setAttribute('aria-label', opening ? 'Close menu' : 'Open menu'); button.textContent = opening ? '×' : '☰'; nav.hidden = !opening;
});
$$('.mobile-nav a').forEach(link => link.addEventListener('click', () => { $('#mobile-nav').hidden = true; $('#menu-toggle').setAttribute('aria-expanded', 'false'); $('#menu-toggle').setAttribute('aria-label', 'Open menu'); $('#menu-toggle').textContent = '☰'; }));
$('#year').textContent = new Date().getFullYear();
renderPaths(); updateProgress();
