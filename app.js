const DATA_URL = './data/characters.json';
let DB = { characters: [] };

const $ = s => document.querySelector(s);
const grid = $('#grid');
const empty = $('#empty');
const q = $('#q');
const fDept = $('#f-dept');
const fType = $('#f-type');
const resetBtn = $('#reset');
const modal = $('#modal');
const mImg = $('#m-img');
const mName = $('#m-name');
const mDesc = $('#m-desc');
const mDept = $('#m-dept');
const mType = $('#m-type');
const mAuthorRow = $('#m-author-row');
const mAuthor = $('#m-author');
const mLinksRow = $('#m-links-row');
const mLinks = $('#m-links');
const mRelated = $('#m-related');

document.querySelectorAll('[data-jump]').forEach(a=>{
  a.addEventListener('click',e=>{e.preventDefault();document.getElementById(a.dataset.jump)?.scrollIntoView({behavior:'smooth'});});
});

document.querySelectorAll('.pill').forEach(p=>{
  p.addEventListener('click',()=>{fDept.value=p.dataset.dept;render();});
});

[q,fDept,fType].forEach(el=>el.addEventListener('input',render));
resetBtn.addEventListener('click',()=>{q.value='';fDept.value='';fType.value='';render();});

function norm(s){return(s||'').toLowerCase();}
function passFilters(ch){
  const qq=norm(q.value);
  if(qq&&!`${ch.name} ${ch.description} ${(ch.tags||[]).join(' ')}`.toLowerCase().includes(qq))return false;
  if(fDept.value&&ch.department!==fDept.value)return false;
  if(fType.value&&ch.type!==fType.value)return false;
  return true;
}
function formatDept(d){return({office:'Офис',factory:'Завод',delivery:'Доставка',med:'Медицина',freelance:'Фриланс',other:'Другое'}[d]||'—');}
function formatType(t){return({canon:'Канон',fanart:'Фан'}[t]||'—');}

function makeCard(ch){
  const el = document.createElement('a');
  el.href = '#';
  el.className = 'card';

  // Картинка превью
  const img = document.createElement('img');
  img.className = 'thumb';
  img.src = ch.thumb || ch.image;
  img.alt = ch.name;
  img.loading = 'lazy';
  img.decoding = 'async';
  img.fetchPriority = 'low';
  // На мобиле ~50% ширины, на планшете ~33%, на десктопе ~25%
  img.sizes = '(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw';

  el.appendChild(img);

  // Текстовая часть
  el.insertAdjacentHTML('beforeend', `
    <div class="card-body">
      <h3>${ch.name}</h3>
      <p class="desc">${ch.description}</p>
      <div class="meta">
        <span class="chip">${formatDept(ch.department)}</span>
        <span class="chip">${formatType(ch.type)}</span>
      </div>
    </div>
  `);

  el.addEventListener('click', e => { e.preventDefault(); openModal(ch.id); });
  return el;
}


function render(){
  grid.innerHTML='';
  const list=DB.characters.filter(passFilters);
  if(!list.length){empty.hidden=false;return;}
  empty.hidden=true;
  list.forEach(ch=>grid.appendChild(makeCard(ch)));
}

function openModal(id){
  const ch=DB.characters.find(c=>c.id===id);
  if(!ch)return;
  mImg.src=ch.image;mImg.alt=ch.name;mName.textContent=ch.name;mDesc.textContent=ch.description;
  mDept.textContent=formatDept(ch.department);mType.textContent=formatType(ch.type);
  mAuthorRow.style.display=ch.author?'':'none';
  mAuthor.textContent=ch.author?.name||'';
  modal.showModal();
}
document.querySelector('.modal-close').addEventListener('click',()=>modal.close());
modal.addEventListener('click',e=>{if(e.target===modal)modal.close();});

fetch(DATA_URL).then(r=>r.json()).then(d=>{DB=d;render();});
