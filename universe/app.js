// ===== Универсальный рендер Вселенной Работышей =====

// Откуда брать данные (можно заменить на свой JSON)
const DATA_URL = '../data/characters.json';

// Глобальное состояние
const state = { all: [], view: [] };

// ----- Утилиты -----
function buildImgSrc(input) {
  if (!input) return '';
  let p = String(input).trim();

  // если абсолютный url — оставляем
  if (/^https?:\/\//i.test(p)) return p;

  // если уже с префиксом ../ — оставляем
  if (p.startsWith('../')) return p;

  // если начинается с images/ или /images/ — добавим ../
  if (p.startsWith('images/')) return '../' + p;
  if (p.startsWith('/images/')) return '..' + p;

  // иначе считаем, что это имя файла
  return '../images/' + p;
}

function chip(t) { return t ? `<span class="chip">${t}</span>` : ''; }

// Нормализация персонажа из любых ключей
function normalize(ch) {
  return {
    name: ch.name || 'Без имени',
    description: ch.description || ch.desc || '',
    dept: ch.dept || ch.department || '',
    type: ch.type || '',
    image: buildImgSrc(ch.thumb || ch.image || ch.img || '')
  };
}

// ----- Загрузка данных -----
async function load() {
  try {
    const res = await fetch(DATA_URL, { cache: 'no-store' });
    const raw = await res.json();
    const arr = Array.isArray(raw) ? raw : (raw.characters || []);
    state.all = arr.map(normalize);
    state.view = state.all.slice();
    render();
    wireFilters();
  } catch (e) {
    console.error('Load error:', e);
    document.getElementById('grid').innerHTML = '';
    const empty = document.getElementById('empty');
    if (empty) {
      empty.hidden = false;
      empty.textContent = 'Не удалось загрузить данные. Проверь /data/characters.json';
    }
  }
}

// ----- Рендер -----
function render() {
  const grid = document.getElementById('grid');
  const empty = document.getElementById('empty');
  if (!grid) return;

  grid.innerHTML = '';
  if (!state.view.length) {
    if (empty) empty.hidden = false;
    return;
  }
  if (empty) empty.hidden = true;

  state.view.forEach((ch, i) => {
    const el = document.createElement('article');
    el.className = 'card';
    el.dataset.idx = String(i);
    el.innerHTML = `
      <img class="thumb" src="${ch.image}" alt="${ch.name}" loading="lazy" decoding="async" />
      <div class="card-body">
        <h3>${ch.name}</h3>
        <p class="desc">${ch.description}</p>
        <div class="meta">
          ${chip(ch.dept)} ${chip(ch.type)}
        </div>
      </div>
    `;
    grid.appendChild(el);
  });
}

// ----- Фильтры -----
function wireFilters() {
  const q = document.getElementById('q');
  const fDept = document.getElementById('f-dept');
  const fType = document.getElementById('f-type');
  const reset = document.getElementById('reset');

  const apply = () => {
    const text = (q?.value || '').toLowerCase().trim();
    const dept = fDept?.value || '';
    const type = fType?.value || '';
    state.view = state.all.fil
