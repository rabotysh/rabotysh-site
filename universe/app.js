// ====== НАСТРОЙКИ ======
const DATA_URL = '../data/characters.json'; // путь к файлу с персонажами

let allChars = [];
let filtered = [];

// ====== ПОДГРУЗКА ДАННЫХ ======
async function loadData() {
  try {
    const res = await fetch(DATA_URL);
    allChars = await res.json();
    filtered = allChars;
    renderGrid();
  } catch (err) {
    console.error('Ошибка загрузки данных:', err);
  }
}

// ====== СОЗДАНИЕ КАРТОЧКИ ======
function makeCard(ch) {
  const el = document.createElement('a');
  el.href = '#';
  el.className = 'card';
  el.innerHTML = `
    <img class="thumb" src="../${ch.image}" alt="${ch.name}" loading="lazy" decoding="async">
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

// ====== ОТОБРАЖЕНИЕ СЕТКИ ======
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
    const matchQ = !q || ch.name.toLowerCase().includes(q) ||
      ch.description.toLowerCase().includes(q) ||
      (ch.tags && ch.tags.join(' ').toLowerCase().includes(q));
    return matchDept && matchType && matchQ;
  });

  renderGrid();
}

// ====== СБРОС ======
function resetFilters() {
  document.getElementById('q').value = '';
  document.getElementById('f-dept').value = '';
  document.getElementById('f-type').value = '';
  filtered = allChars;
  renderGrid();
}

// ====== УТИЛИТЫ ======
function formatDept(d) {
  const map = {
    office: 'Офис',
    factory: 'Завод',
    delivery: 'Доставка',
    med: 'Медицина',
    freelance: 'Фриланс',
    other: 'Прочее'
  };
  return map[d] || d || '—';
}

function formatType(t) {
  const map = { canon: 'Канон', fanart: 'Фан' };
  return map[t] || t || '—';
}

// ====== МОДАЛЬНОЕ ОКНО ======
function openModal(ch) {
  const modal = document.getElementById('modal');
  document.getElementById('m-img').src = `../${ch.image}`;
  document.getElementB
