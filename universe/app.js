// Путь к данным (файл в корне)
const DATA_URL = '../data/characters.json';

let ALL = [];
let VIEW = [];

async function loadData(){
  const res = await fetch(DATA_URL);
  const data = await res.json();
  ALL = Array.isArray(data) ? data : (data.characters || []);
  VIEW = ALL.slice();
  render();
}

function dept(d){return({office:'Офис',factory:'Завод',delivery:'Доставка',med:'Медицина',freelance:'Фриланс',other:'Прочее'}[d]||'—');}
function type(t){return({canon:'Канон',fanart:'Фан'}[t]||'—');}

function makeCard(ch){
  const a = document.createElement('a');
  a.href = '#';
  a.className = 'card';
  a.innerHTML = `
    <img class="thumb" src="../${ch.thumb || ch.image}" alt="${ch.name}" loading="lazy" decoding="async">
    <div class="card-body">
      <h3>${ch.name}</h3>
      <p class="desc">${ch.description || ''}</p>
      <div class="meta">
        <span class="chip">${dept(ch.department)}</span>
        <span class="chip">${type(ch.type)}</span>
      </div>
    </div>`;
  a.addEventListener('click', e => { e.preventDefault(); openModal(ch); });
  return a;
}

function render(){
  const grid = document.getElementById('grid');
  const empty = document.getElementById('empty');
  grid.innerHTML = '';
  if(!VIEW.length){ empty.hidden = false; return; }
  empty.hidden = true;
  VIEW.forEach(ch => grid.appendChild(makeCard(ch)));
}

function applyFilters(){
  const q = document.getElementById('q').value.toLowerCase();
  const fd = document.getElementById('f-dept').value;
  const ft = document.getElementById('f-type').value;

  VIEW = ALL.filter(ch => {
    const okDept = !fd || ch.department === fd;
    const okType = !ft || ch.type === ft;
    const hay = `${ch.name} ${ch.description||''} ${(ch.tags||[]).join(' ')}`.toLowerCase();
    const okQ = !q || hay.includes(q);
    return okDept && okType && okQ;
  });
  render();
}

function resetFilters(){
  document.getElementById('q').value = '';
  document.getElementById('f-dept').value = '';
  document.getElementById('f-type').value = '';
  VIEW = ALL.slice();
  render();
}

function openModal(ch){
  document.getElementById('m-img').src = `../${ch.image}`;
  document.getElementById('m-name').textContent = ch.name;
  document.getElementById('m-desc').textContent = ch.description || '';
  document.getElementById('m-dept').textContent = dept(ch.department);
  document.getElementById('m-type').textContent = type(ch.type);

  const ar = document.getElementById('m-author-row');
  const lr = document.getElementById('m-links-row');
  if (ch.author){ ar.hidden = false; document.getElementById('m-author').textContent = ch.author; } else ar.hidden = true;
  if (ch.links && ch.links.length){
    lr.hidden = false;
    document.getElementById('m-links').innerHTML = ch.links.map(u=>`<a href="${u}" target="_blank" rel="noopener">ссылка</a>`).join(', ');
  } else lr.hidden = true;

  document.getElementById('modal').showModal();
}

/* события */
document.addEventListener('DOMContentLoaded', loadData);
document.addEventListener('input', e => {
  if (['q','f-dept','f-type'].includes(e.target.id)) applyFilters();
});
document.addEventListener('click', e => {
  if (e.target.id === 'reset') resetFilters();
  if (e.target.matches('.pill')){
    document.getElementById('f-dept').value = e.target.dataset.dept || '';
    applyFilters();
  }
  if (e.target.matches('.modal-close')) document.getElementById('modal').close();
});
// Глобальное состояние
const state = { all: [], view: [] };

/* пример рендера карточек — важно добавить data-idx */
function render(){
  const grid = document.getElementById('grid');
  grid.innerHTML = '';
  state.view.forEach((ch, i) => {
    const el = document.createElement('article');
    el.className = 'card';
    el.dataset.idx = i; // <-- это используется при клике
    el.innerHTML = `
      <img class="thumb" src="${ch.img || ch.image}" alt="${ch.name}">
      <div class="card-body">
        <h3>${ch.name}</h3>
        <p class="desc">${ch.description || ch.desc || ''}</p>
        <div class="meta">
          ${chip(ch.dept || ch.department || '')}
          ${chip(ch.type || '')}
        </div>
      </div>`;
    grid.appendChild(el);
  });
  function chip(t){ return t ? `<span class="chip">${t}</span>` : ''; }
}

/* Делегирование клика по карточкам */
document.getElementById('grid').addEventListener('click', (e) => {
  const card = e.target.closest('.card');
  if (!card) return;
  const idx = Number(card.dataset.idx);
  const item = state.view[idx];
  if (item) openModal(item);
});

/* Открытие/закрытие модалки */
const modal = document.getElementById('modal');
const mImg = document.getElementById('m-img');
const mName = document.getElementById('m-name');
const mDesc = document.getElementById('m-desc');
const mDept = document.getElementById('m-dept');
const mType = document.getElementById('m-type');
const mLinks = document.getElementById('m-links');

function openModal(ch){
  mImg.src = ch.img || ch.image || '';
  mImg.alt = ch.name || '';
  mName.textContent = ch.name || '';
  mDesc.textContent = ch.description || ch.desc || '';
  mDept.textContent = ch.dept || ch.department || '';
  mType.textContent = ch.type || '';
  mLinks.innerHTML = Array.isArray(ch.links)
    ? ch.links.map(a => `<a href="${a.href}" class="btn btn-quiet" target="_blank" rel="noopener">${a.title||'Ссылка'}</a>`).join(' ')
    : '';
  modal.showModal();
}

document.getElementById('m-close').addEventListener('click', () => modal.close());
modal.addEventListener('click', (e) => { // клик по фону закрывает
  const rect = modal.getBoundingClientRect();
  if (e.clientX < rect.left || e.clientX > rect.right || e.clientY < rect.top || e.clientY > rect.bottom) {
    modal.close();
  }
});
document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && modal.open) modal.close(); });
