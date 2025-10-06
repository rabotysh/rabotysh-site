// ===== Упрощённая галерея Вселенной =====
// без кликов, без описаний, без отделов — только поиск и сортировка

const DATA_URL = '../data/characters.json';

// резервные данные на случай отсутствия JSON
const FALLBACK = [
  { name: 'Работыш',        image: 'rabotysh',        type: 'canon',    created: '2024-01-01' },
  { name: 'Работышка',      image: 'rabotyshka',      type: 'canon',    created: '2024-03-15' },
  { name: 'Работыш-курьер', image: 'rabotysh-kurier', type: 'fan',      created: '2024-07-10' }
];

const state = { all: [], view: [], sort: 'new' };

/* ---------- utils ---------- */
function preferImagesPath(p){
  if (!p) return '';
  if (/^https?:\/\//i.test(p)) return p;
  if (p.startsWith('../')) return p;
  if (p.startsWith('images/')) return '../' + p;
  if (p.startsWith('/images/')) return '..' + p;
  return '../images/' + p;
}

// умеет работать с именем без расширения и с любым из .webp/.png/.jpg
function buildSources(baseOrPath){
  let base = String(baseOrPath || '').trim();
  if (!base) return [];
  // если уже полный путь с расширением — вернём кандидатов от него
  if (/\.(webp|png|jpe?g)$/i.test(base)) {
    base = base.replace(/\.(webp|png|jpe?g)$/i, '');
  }
  return [
    preferImagesPath(base + '.webp'),
    preferImagesPath(base + '.png'),
    preferImagesPath(base + '.jpg'),
    preferImagesPath(base + '.jpeg')
  ];
}

function parseCreated(v){
  if (v == null) return 0;
  // поддержим ISO-строку, unix (сек/мс), число
  if (typeof v === 'number') {
    return v > 1e12 ? v : v*1000; // сек → мс
  }
  const d = new Date(v);
  return isNaN(d.getTime()) ? 0 : d.getTime();
}

// нормализация записи персонажа
function normalize(ch){
  const name = ch.name || 'Без имени';
  const imageBase = ch.thumb || ch.image || ch.img || name.toLowerCase().replace(/\s+/g,'-');
  const created = parseCreated(ch.created || ch.date || ch.added || ch.createdAt || ch.updatedAt);
  return {
    name,
    type: (ch.type || '').toLowerCase(), // не отображаем, но оставим для будущего
    created,
    sources: buildSources(imageBase)
  };
}

/* ---------- data load ---------- */
async function loadData(){
  try{
    const res = await fetch(DATA_URL, { cache: 'no-store' });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const json = await res.json();
    const arr = Array.isArray(json) ? json : (json.characters || []);
    if (!arr.length) throw new Error('JSON пуст');
    return arr.map(normalize);
  }catch(e){
    console.warn('Не удалось загрузить JSON, использую резерв:', e.message);
    return FALLBACK.map(normalize);
  }
}

/* ---------- render ---------- */
function render(){
  const grid = document.getElementById('grid');
  const empty = document.getElementById('empty');

  grid.innerHTML = '';
  if (!state.view.length){
    empty.hidden = false;
    empty.textContent = 'Ничего не найдено.';
    return;
  }
  empty.hidden = true;

  state.view.forEach((ch) => {
    const [first, ...fallbacks] = ch.sources;
    const onerr = fallbackChain(fallbacks);
    const card = document.createElement('article');
    card.className = 'card';
    card.innerHTML = `
      <img class="thumb" src="${first}" alt="${ch.name}" loading="lazy" decoding="async" onerror="${onerr}">
      <div class="card-body">
        <h3>${ch.name}</h3>
      </div>
    `;
    grid.appendChild(card);
  });
}

// onerror: пробуем следующий формат → заглушка
function fallbackChain(fallbacks){
  if (!fallbacks.length) return "this.onerror=null; this.src='../images/placeholder.webp'";
  const js = fallbacks.map(p => `this.onerror=null; this.src='${p}'`).join('; ');
  return js + `; this.onerror=null; this.src='../images/placeholder.webp'`;
}

/* ---------- controls ---------- */
function applyFilters(){
  const q = (document.getElementById('q')?.value || '').toLowerCase().trim();

  // поиск только по имени
  let list = state.all.filter(ch => !q || ch.name.toLowerCase().includes(q));

  // сортировка
  if (state.sort === 'name') {
    list.sort((a,b) => a.name.localeCompare(b.name, 'ru'));
  } else {
    // по новизне — по полю created (большее новее), если его нет — без изменений
    list.sort((a,b) => (b.created||0) - (a.created||0));
  }

  state.view = list;
  render();
}

function wireUI(){
  const q = document.getElementById('q');
  const sort = document.getElementById('sort-by');
  const reset = document.getElementById('reset');

  q?.addEventListener('input', applyFilters);
  sort?.addEventListener('change', () => { state.sort = sort.value; applyFilters(); });
  reset?.addEventListener('click', () => {
    if (q) q.value = '';
    if (sort) sort.value = 'new';
    state.sort = 'new';
    applyFilters();
  });
}

/* ---------- start ---------- */
(async function init(){
  state.all = await loadData();
  state.sort = 'new';
  applyFilters();
  wireUI();
})();
