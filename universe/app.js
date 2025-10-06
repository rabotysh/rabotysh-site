// ===== Упрощённая галерея: поиск, сортировка и фильтры =====

const DATA_URL = '../data/characters.json';

const FALLBACK = [
  { name: 'Работыш',        image: 'rabotysh',        type: 'canon', created: '2024-01-01' },
  { name: 'Работышка',      image: 'rabotyshka',      type: 'canon', created: '2024-03-15' },
  { name: 'Работыш-курьер', image: 'rabotysh-kurier', type: 'fan',   created: '2024-07-10' }
];

const state = { all: [], view: [], sort: 'new', type: '', order: 'desc' };

/* ---------- utils ---------- */
function preferImagesPath(p){
  if (!p) return '';
  if (/^https?:\/\//i.test(p)) return p;
  if (p.startsWith('../')) return p;
  if (p.startsWith('images/')) return '../' + p;
  if (p.startsWith('/images/')) return '..' + p;
  return '../images/' + p;
}
function buildSources(baseOrPath){
  let base = String(baseOrPath || '').trim();
  if (!base) return [];
  base = base.replace(/\.(webp|png|jpe?g)$/i, '');
  return [
    preferImagesPath(base + '.webp'),
    preferImagesPath(base + '.png'),
    preferImagesPath(base + '.jpg')
  ];
}
function parseCreated(v){
  if (v == null) return 0;
  const d = new Date(v); return isNaN(d.getTime()) ? 0 : d.getTime();
}
function mapType(t){ return t === 'canon' ? 'Канон' : t === 'fan' ? 'Фан' : ''; }
function normalizeType(t){
  const k = (t||'').toLowerCase();
  if (k === 'fanart') return 'fan';
  if (['canon','fan'].includes(k)) return k;
  return '';
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
    console.warn('Ошибка загрузки JSON, резерв:', e.message);
    return FALLBACK.map(normalize);
  }
}
function normalize(ch){
  const name = ch.name || 'Без имени';
  const img = ch.thumb || ch.image || ch.img || name.toLowerCase().replace(/\s+/g,'-');
  return {
    name,
    type: normalizeType(ch.type),
    created: parseCreated(ch.created || ch.date || ch.added),
    sources: buildSources(img)
  };
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

  state.view.forEach(ch => {
    const [first, ...fallbacks] = ch.sources;
    const card = document.createElement('article');
    card.className = 'card';
    card.innerHTML = `
      <img class="thumb" src="${first}" alt="${ch.name}" loading="lazy" decoding="async">
      <div class="card-body">
        <h3>${ch.name} <span class="chip">${mapType(ch.type)}</span></h3>
      </div>`;
    grid.appendChild(card);
  });
}

/* ---------- filters ---------- */
function applyFilters(){
  const q = (document.getElementById('q')?.value || '').toLowerCase().trim();
  const type = state.type;

  let list = state.all.filter(ch =>
    (!q || ch.name.toLowerCase().includes(q)) &&
    (!type || ch.type === type)
  );

  // сортировка
  const dir = state.order === 'asc' ? 1 : -1;
  if (state.sort === 'name')
    list.sort((a,b) => a.name.localeCompare(b.name,'ru') * dir);
  else
    list.sort((a,b) => ((a.created||0)-(b.created||0)) * -dir);

  state.view = list;
  render();
}

function wireUI(){
  const q = document.getElementById('q');
  const sort = document.getElementById('sort-by');
  const typeSel = document.getElementById('type-by');
  const reset = document.getElementById('reset');
  const sortDirBtn = document.getElementById('sort-dir');

  q?.addEventListener('input', applyFilters);
  sort?.addEventListener('change', () => { state.sort = sort.value; applyFilters(); });
  typeSel?.addEventListener('change', () => { state.type = typeSel.value; applyFilters(); });

  sortDirBtn?.addEventListener('click', () => {
    state.order = (state.order === 'asc') ? 'desc' : 'asc';
    sortDirBtn.textContent = (state.order === 'asc') ? '▲' : '▼';
    applyFilters();
  });

  reset?.addEventListener('click', () => {
    q.value = '';
    sort.value = 'new';
    typeSel.value = '';
    state.sort = 'new';
    state.type = '';
    state.order = 'desc';
    sortDirBtn.textContent = '▼';
    applyFilters();
  });
}

/* ---------- init ---------- */
(async function init(){
  state.all = await loadData();
  applyFilters();
  wireUI();
})();
