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
