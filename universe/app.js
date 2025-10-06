// ===== Вселенная Работышей — устойчивый рендер (под WebP) =====

// 1) Путь к JSON (если будет)
const DATA_URL = '../data/characters.json';

// 2) РЕЗЕРВНЫЕ ДАННЫЕ
const FALLBACK = [
  {
    name: 'Работыш',
    description: 'Коричневый кот в белой рубашке и синем галстуке — символ офисной усталости.',
    dept: 'office',
    type: 'canon',
    image: 'rabotysh.webp'
  },
  {
    name: 'Работышка',
    description: 'Светлый кот с розовым галстуком. Амбициозен и энергичен.',
    dept: 'office',
    type: 'canon',
    image: 'rabotyshka.webp'
  },
  {
    name: 'Работыш-курьер',
    description: 'В жёлтом жилете, носит посылки даже в дождь.',
    dept: 'delivery',
    type: 'fan',
    image: 'rabotysh-kurier.webp'
  }
];

// ===== УТИЛИТЫ =====
function buildImgSrc(input) {
  if (!input) return '';
  let p = String(input).trim();

  // Абсолютные URL оставляем
  if (/^https?:\/\//i.test(p)) return p;

  // Уже с ../ — оставляем
  if (p.startsWith('../')) return p;

  // Если явно указано .png — используем как есть
  if (p.endsWith('.png')) return '../images/' + p;

  // Добавляем .webp, если нет расширения
  if (!/\.(webp|png|jpg|jpeg)$/i.test(p)) p += '.webp';

  // Если начинается с images/
  if (p.startsWith('images/')) return '../' + p;

  return '../images/' + p;
}

function normalize(ch) {
  return {
    name: ch.name || 'Без имени',
    description: ch.description || ch.desc || '',
    dept: (ch.dept || ch.department || '').trim(),
    type: (ch.type || '').trim(),
    image: buildImgSrc(ch.thumb || ch.image || ch.img || '')
  };
}

// ====== ЗАГРУЗКА ======
async function tryLoadJson() {
  try {
    const res = await fetch(DATA_URL, { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const raw = await res.json();
    const arr = Array.isArray(raw) ? raw : (raw.characters || []);
    if (!arr || !arr.length) throw new Error('JSON пуст');
    return arr.map(normalize);
  } catch (e) {
    console.warn('Не удалось загрузить JSON, использую резервные данные:', e.message);
    return FALLBACK.map(normalize);
  }
}

// ====== РЕНДЕР ======
const state = { all: [], view: [] };

function chip(t) { return t ? `<span class="chip">${t}</span>` : ''; }

function render() {
  const grid = document.getElementById('grid');
  const empty = document.getElementById('empty');
  if (!grid) return;

  grid.innerHTML = '';
  if (!state.view.length) {
    if (empty) {
      empty.hidden = false;
      empty.textContent = 'Здесь пока пусто.';
    }
    return;
  }
  if (empty) empty.hidden = true;

  state.view.forEach((ch, i) => {
    const el = document.createElement('article');
    el.className = 'card';
    el.dataset.idx = String(i);
    el.innerHTML = `
      <img class="thumb" src="${ch.image}" alt="${ch.name}" loading="lazy" decoding="async"
           onerror="this.onerror=null;this.src='../images/placeholder.webp';">
      <div class="card-body">
        <h3>${ch.name}</h3>
        <p class="desc">${ch.description}</p>
        <div class="meta">
          ${chip(mapDept(ch.dept))} ${chip(mapType(ch.type))}
        </div>
      </div>
    `;
    grid.appendChild(el);
  });
}

function mapDept(d) {
  switch ((d||'').toLowerCase()) {
    case 'office': return 'Офис';
    case 'factory': return 'Завод';
    case 'delivery': return 'Доставка';
    case 'med': return 'Медицина';
    case 'freelance': return 'Фриланс';
    case 'other': return 'Прочее';
    default: return d;
  }
}
function mapType(t) {
  switch ((t||'').toLowerCase()) {
    case 'canon': return 'Канон';
    case 'fan':
    case 'fanart': return 'Фан';
    default: return t;
  }
}

// ====== ФИЛЬТРЫ + МОДАЛКА ======
function wire() {
  const q = document.getElementById('q');
  const fDept = document.getElementById('f-dept');
  const fType = document.getElementById('f-type');
  const reset = document.getElementById('reset');

  const apply = () => {
    const text = (q?.value || '').toLowerCase().trim();
    const dept = fDept?.value || '';
    const type = fType?.value || '';
    state.view = state.all.filter(ch => {
      const okText = !text || (ch.name + ' ' + ch.description).toLowerCase().includes(text);
      const okDept = !dept || (ch.dept.toLowerCase() === dept.toLowerCase());
      const okType = !type || (ch.type.toLowerCase() === type.toLowerCase());
      return okText && okDept && okType;
    });
    render();
  };

  q?.addEventListener('input', apply);
  fDept?.addEventListener('change', apply);
  fType?.addEventListener('change', apply);
  reset?.addEventListener('click', () => {
    if (q) q.value = '';
    if (fDept) fDept.value = '';
    if (fType) fType.value = '';
    state.view = state.all.slice();
    render();
  });

  // клики по карточкам
  const grid = document.getElementById('grid');
  const modal = document.getElementById('modal');
  if (grid && modal) {
    grid.addEventListener('click', (e) => {
      const card = e.target.closest('.card');
      if (!card) return;
      const idx = Number(card.dataset.idx);
      openModal(state.view[idx]);
    });

    document.getElementById('m-close')?.addEventListener('click', () => modal.close());
  }
}

function openModal(ch) {
  if (!ch) return;
  const modal = document.getElementById('modal');
  document.getElementById('m-img').src = ch.image || '';
  document.getElementById('m-name').textContent = ch.name || '';
  document.getElementById('m-desc').textContent = ch.description || '';
  document.getElementById('m-dept').textContent = mapDept(ch.dept) || '';
  document.getElementById('m-type').textContent = mapType(ch.type) || '';
  modal.showModal();
}

// ====== СТАРТ ======
(async function init(){
  state.all = await tryLoadJson();
  state.view = state.all.slice();
  render();
  wire();
})();
