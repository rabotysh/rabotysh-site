// ===== Упрощённая галерея с бейджами (Канон/Фан), фильтром и сортировкой =====

const DATA_URL = '../data/characters.json';

const FALLBACK = [
  { name: 'Работыш',        image: 'rabotysh.webp',        type: 'canon', created: '2024-01-01' },
  { name: 'Работышка',      image: 'rabotyshka.webp',      type: 'canon', created: '2024-03-15' },
  { name: 'Работыш-курьер', image: 'rabotysh-kurier.webp', type: 'fan',   created: '2024-07-10' }
];

const state = { all: [], view: [], sort: 'new', type: '', order: 'desc' };

/* ---------- helpers ---------- */
function normalizeType(t){
  const k = (t||'').toLowerCase();
  if (k === 'fanart') return 'fan';
  if (['canon','fan'].includes(k)) return k;
  return '';
}
function mapTypeLabel(t){ return t === 'canon' ? 'Канон' : t === 'fan' ? 'Фан' : ''; }
function parseCreated(v){ const d = new Date(v); return isNaN(d) ? 0 : +d; }

async function loadData(){
  try{
    const res = await fetch(DATA_URL, { cache:'no-store' });
    if(!res.ok) throw new Error('HTTP '+res.status);
    const raw = await res.json();
    const arr = Array.isArray(raw) ? raw : (raw.characters || []);
    if(!arr.length) throw new Error('JSON пуст');
    return arr.map(normalize);
  }catch(e){
    console.warn('Ошибка загрузки JSON, резерв:', e.message);
    return FALLBACK.map(normalize);
  }
}

function normalize(ch){
  const name = ch.name || 'Без имени';
  const img = ch.image || ch.thumb || ch.img || '';
  const src = img.startsWith('../') ? img : ('../images/' + img.replace(/^images\//,''));
  return {
    name,
    type: normalizeType(ch.type),
    created: parseCreated(ch.created || ch.date || ch.added),
    image: src
  };
}

/* ---------- render ---------- */
function render(){
  const grid = document.getElementById('grid');
  const empty = document.getElementById('empty');
  grid.innerHTML = '';

  if(!state.view.length){ empty.hidden = false; empty.textContent = 'Ничего не найдено.'; return; }
  empty.hidden = true;

  state.view.forEach(ch => {
    const card = document.createElement('article');
    card.className = 'card';
    card.innerHTML = `
      <figure class="thumb-wrap">
        <span class="badge ${ch.type === 'fan' ? 'badge--fan' : ''}">${mapTypeLabel(ch.type)}</span>
        <img class="thumb" src="${ch.image}" alt="${ch.name}" loading="lazy" decoding="async">
      </figure>
      <div class="card-body">
        <h3>${ch.name}</h3>
      </div>
    `;
    grid.appendChild(card);
  });
}

/* ---------- filtering & sorting ---------- */
function applyFilters(){
  const q = (document.getElementById('q')?.value || '').toLowerCase().trim();
  const type = state.type;

  let list = state.all.filter(ch =>
    (!q || ch.name.toLowerCase().includes(q)) &&
    (!type || ch.type === type)
  );

  const dir = state.order === 'asc' ? 1 : -1;
  if (state.sort === 'name') {
    list.sort((a,b) => a.name.localeCompare(b.name,'ru') * dir);
  } else {
    list.sort((a,b) => ((a.created||0)-(b.created||0)) * -dir); // new first by default
  }

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
    state.order = state.order === 'asc' ? 'desc' : 'asc';
    sortDirBtn.textContent = state.order === 'asc' ? '▲' : '▼';
    applyFilters();
  });
  reset?.addEventListener('click', () => {
    if(q) q.value = '';
    if(sort) sort.value = 'new';
    if(typeSel) typeSel.value = '';
    state.sort = 'new';
    state.type = '';
    state.order = 'desc';
    if(sortDirBtn) sortDirBtn.textContent = '▼';
    applyFilters();
  });
}

/* ---------- init ---------- */
(async function init(){
  state.all = await loadData();
  applyFilters();
  wireUI();
})();
