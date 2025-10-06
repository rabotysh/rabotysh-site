// ===== Упрощённая галерея: поиск, сорт, фильтр по категории =====

const DATA_URL = '../data/characters.json';

const FALLBACK = [
  { name: 'Работыш',        image: 'rabotysh',        type: 'canon', created: '2024-01-01' },
  { name: 'Работышка',      image: 'rabotyshka',      type: 'canon', created: '2024-03-15' },
  { name: 'Работыш-курьер', image: 'rabotysh-kurier', type: 'fan',   created: '2024-07-10' }
];

const state = { all: [], view: [], sort: 'new', type: '' };

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
  // уберём расширение, если есть
  base = base.replace(/\.(webp|png|jpe?g)$/i, '');
  return [
    preferImagesPath(base + '.webp'),
    preferImagesPath(base + '.png'),
    preferImagesPath(base + '.jpg'),
    preferImagesPath(base + '.jpeg')
  ];
}
function parseCreated(v){
  if (v == null) return 0;
  if (typeof v === 'number') return v > 1e12 ? v : v*1000;
  const d = new Date(v); return isNaN(d.getTime()) ? 0 : d.getTime();
}
function mapType(t){
  const k = (t||'').toLowerCase();
  if (k === 'canon') return 'Канон';
  if (k === 'fan' || k === 'fanart') return 'Фан';
  return '';
}
function normalizeType(t){
  const k = (t||'').toLowerCase();
  if (k === 'fanart') return 'fan';
  if (k === 'canon' || k === 'fan') return k;
  return ''; // неизвестное или пустое
}
function badgeHTML(type){
  const label = mapType(type);
  if (!label) return '';
  const cls = type === 'canon' ? 'chip' : 'chip';
  return `<span class="${cls}" style="margin-left:8px">${label}</span>`;
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

function normalize(ch){
  const name = ch.name || 'Без имени';
  const imageBase = ch.thumb || ch.image || ch.img || name.toLowerCase().replace(/\s+/g,'-');
  return {
    name,
    type: normalizeType(ch.type),
    created: parseCreated(ch.created || ch.date || ch.added || ch.createdAt || ch.updatedAt),
    sources: buildSources(imageBase)
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

  state.view.forEach((ch) => {
    const [first, ...fallbacks] = ch.sources;
    const onerr = fallbackChain(fallbacks);
    const card = document.createElement('article');
    card.className = 'card';
    card.innerHTML = `
      <img class="thumb" src="${first}" alt="${ch.name}" loading="lazy" decoding="async" onerror="${onerr}">
      <div class="card-body">
        <h3>${ch.name}${badgeHTML(ch.type)}</h3>
      </div>
    `;
    grid.appendChild(card);
  });
}

function fallbackChain(fallbacks){
  if (!fallbacks.length) return "this.onerror=null; this.src='../images/placeholder.webp'";
  const js = fallbacks.map(p => `this.onerror=null; this.src='${p}'`).join('; ');
  return js + `; this.onerror=null; this.src='../images/placeholder.webp'`;
}

/* ---------- filters ---------- */
function applyFilters(){
  const q = (document.getElementById('q')?.value || '').toLowerCase().trim();
  const type = state.type; // '' | 'canon' | 'fan'

  let list = state.all.filter(ch =>
    (!q || ch.name.toLowerCase().includes(q)) &&
    (!type || ch.type === type)
  );

  if (state.sort === 'name') {
    list.sort((a,b) => a.name.localeCompare(b.name, 'ru'));
  } else {
    list.sort((a,b) => (b.created||0) - (a.created||0));
  }

  state.view = list;
  render();
}

function wireUI(){
  const q = document.getElementById('q');
  const sort = document.getElementById('sort-by');
  const typeSel = document.getElementById('type-by');
  const reset = document.getElementById('reset');

  q?.addEventListener('input', applyFilters);
  sort?.addEventListener('change', () => { state.sort = sort.value; applyFilters(); });
  typeSel?.addEventListener('change', () => { state.type = typeSel.value; applyFilters(); });
  reset?.addEventListener('click', () => {
    if (q) q.value = '';
    if (sort) sort.value = 'new';
    if (typeSel) typeSel.value = '';
    state.sort = 'new';
    state.type = '';
    applyFilters();
  });
}

/* ---------- start ---------- */
(async function init(){
  state.all = await loadData();
  state.sort = 'new';
  state.type = '';
  applyFilters();
  wireUI();
})();
