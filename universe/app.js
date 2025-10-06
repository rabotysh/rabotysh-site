// ====== ПУТИ ======
const DATA_URL = '../data/characters.json'; // { "characters": [ ... ] }

// ====== СОСТОЯНИЕ ======
let allChars = [];
let filtered = [];

// ====== ЗАГРУЗКА ДАННЫХ ======
async function loadData() {
  try {
    const res = await fetch(DATA_URL);
    const data = await res.json();         // <-- ВАЖНО: читаем поле characters
    allChars = Array.isArray(data) ? data : (data.characters || []);
    filtered = allChars;
    renderGrid();
  } catch (err) {
    console.error('Ошибка загрузки данных:', err);
  }
}

// ====== КАРТОЧКА ======
function makeCard(ch) {
  const el = document.createElement('a');
  el.href = '#';
  el.className = 'card';
  el.innerHTML = `
    <img class="thumb"
         src="../${(ch.thumb || ch.image)}"
         alt="${ch.name}"
         loading="lazy" decoding="async" fetchpriority="low"
         sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw">
    <div class="card-body">
      <h3>${ch.name}</h3>
      <p class="desc">${ch.description}</p>
      <div class="meta">
        <span class="chip">${formatDept(ch.department)}</span>
        <span class="chip">${formatType(ch.type)}</span>
      </div>
    </div>
  `;
  el.addEventListener('click', (e) => {
    e.preventDefault();
    openModal(ch);
  });
  return el;
}

// ====== СЕТКА ======
function renderGrid() {
  const grid = document.getElementById('grid');
  const empty = document.getElementById('empty');
  grid.innerHTML = '';

  if (!filtered.length) {
    empty.hidden = false;
    return;
  }
  empty.hidden = true;
  filtered.forEach(ch => grid.appendChild(makeCard(ch)));
}

// ====== ФИЛЬТРЫ ======
function applyFilters() {
  const q = document.getElementById('q').value.toLowerCase();
  const dept = document.getElementById('f-dept').value;
  const type = document.getElementById('f-type').value;

  filtered = allChars.filter(ch => {
    const matchDept = !dept || ch.department === dept;
    const matchType = !type || ch.type === type;
    const hay = `${ch.name} ${ch.description} ${(ch.tags||[]).join(' ')}`.toLowerCase();
    const matchQ = !q || hay.includes(q);
    return matchDept && matchType && matchQ;
  });

  renderGrid();
}

function resetFilters() {
  document.getElementById('q').value = '';
  document.getElementById('f-dept').value = '';
  document.getElementById('f-type').value = '';
  filtered = allChars;
  renderGrid();
}

// ====== УТИЛИТЫ ======
function formatDept(d){return({office:'Офис',factory:'Завод',delivery:'Доставка',med:'Медицина',freelance:'Фриланс',other:'Прочее'}[d]||'—');}
function formatType(t){return({canon:'Канон',fanart:'Фан'}[t]||'—');}

// ====== МОДАЛКА ======
function openModal(ch){
  const modal = document.getElementById('modal');
  document.getElementById('m-img').src = `../${ch.image}`;
  document.getElementById('m-name').textContent = ch.name;
  document.getElementById('m-desc').textContent = ch.description;
  document.getElementById('m-dept').textContent = formatDept(ch.department);
  document.getElementById('m-type').textContent = formatType(ch.type);

  const authorRow = document.getElementById('m-author-row');
  const linksRow = document.getElementById('m-links-row');

  if (ch.author){
    authorRow.hidden = false;
    document.getElementById('m-author').textContent = ch.author;
  } else authorRow.hidden = true;

  if (ch.links && ch.links.length){
    linksRow.hidden = false;
    document.getElementById('m-links').innerHTML = ch.links
      .map(l => `<a href="${l}" target="_blank" rel="noopener">ссылка</a>`).join(', ');
  } else linksRow.hidden = true;

  modal.showModal();
}

document.addEventListener('click', e => {
  if (e.target.matches('.modal-close')) document.getElementById('modal').close();
});

document.addEventListener('input', e => {
  if (['q','f-dept','f-type'].includes(e.target.id)) applyFilters();
});
document.addEventListener('click', e => {
  if (e.target.id === 'reset') resetFilters();
  if (e.target.matches('.pill')){
    document.getElementById('f-dept').value = e.target.dataset.dept || '';
    applyFilters();
  }
});

// ====== СТАРТ ======
document.addEventListener('DOMContentLoaded', loadData);
