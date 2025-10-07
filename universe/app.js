// Вселенная: поиск, фильтр по категории, сортировка (с направлением)
// + расширенная карточка (клик по персонажу открывает модальное окно с автором и описанием)

document.addEventListener('DOMContentLoaded', () => {
  const grid = document.getElementById('grid');
  const empty = document.getElementById('empty');

  const q = document.getElementById('q');
  const sortBy = document.getElementById('sort-by');
  const sortDirBtn = document.getElementById('sort-dir');
  const typeBy = document.getElementById('type-by');
  const reset = document.getElementById('reset');

  // Модальная карточка
  const sheet = document.getElementById('sheet');
  const sheetImg = document.getElementById('sheet-img');
  const sheetTitle = document.getElementById('sheet-title');
  const sheetBadge = document.getElementById('sheet-badge');
  const sheetAuthor = document.getElementById('sheet-author');
  const sheetDesc = document.getElementById('sheet-desc');
  const sheetClose = document.getElementById('sheet-close');

  // false — по убыванию (новые сверху), true — по возрастанию
  let ascending = false;

  // ДАННЫЕ: одна большая картинка + автор и описание
  const items = [
    {
      name:'Работыш',
      img:'../images/rabotysh.webp',
      category:'canon',
      date:'2024-01-01',
      author:'Автор: Степан Панов',
      desc:'Классический офисный Работыш: белая рубашка, синий галстук. Символ усталого профессионала.'
    },
    {
      name:'Работышка',
      img:'../images/rabotyshka.webp',
      category:'canon',
      date:'2024-03-15',
      author:'Автор: Степан Панов',
      desc:'Светлый вариант с розовым галстуком — более мягкий, но столь же трудолюбивый персонаж.'
    },
    {
      name:'Работыш-курьер',
      img:'../images/rabotysh-kurier.webp',
      category:'fan',
      date:'2024-07-10',
      author:'Автор: Сообщество',
      desc:'В жёлтом жилете, носит посылки даже под дождём. Поклонническая интерпретация персонажа.'
    },
    // можно добавлять дальше по шаблону
  ];

  function badgeMini(cat){
    return `<span class="badge ${cat === 'fan' ? 'badge--fan' : ''}">${cat === 'fan' ? 'Фан' : 'Канон'}</span>`;
  }

  function apply(){
    const search = q.value.trim().toLowerCase();
    const type = typeBy.value;

    let list = items.filter(x =>
      (!search || x.name.toLowerCase().includes(search)) &&
      (!type || x.category === type)
    );

    const field = sortBy.value; // 'new' | 'name'
    list.sort((a,b) => {
      if (field === 'name') {
        const r = a.name.localeCompare(b.name,'ru');
        return ascending ? r : -r;
      } else {
        const r = new Date(a.date) - new Date(b.date);
        return ascending ? r : -r;
      }
    });

    render(list);
  }

  function render(list){
    grid.innerHTML = '';
    if (!list.length){ empty.hidden = false; return; }
    empty.hidden = true;

    list.forEach((x, idx) => {
      const card = document.createElement('article');
      card.className = 'card';
      card.dataset.index = String(idx);
      card.innerHTML = `
        <figure class="thumb-wrap">
          ${badgeMini(x.category)}
          <img class="thumb" src="${x.img}" alt="${x.name}" loading="lazy" decoding="async">
        </figure>
        <div class="card-body"><h3>${x.name}</h3></div>
      `;
      // только клик — открывает расширенную карточку
      card.addEventListener('click', () => openSheet(x));
      grid.appendChild(card);
    });
  }

  // Расширенная карточка (модалка)
  function openSheet(item){
    sheetImg.src = item.img;
    sheetImg.alt = item.name;
    sheetTitle.textContent = item.name;

    sheetBadge.textContent = (item.category === 'fan') ? 'Фан' : 'Канон';
    sheetBadge.classList.toggle('sheet__badge--fan', item.category === 'fan');

    sheetAuthor.textContent = item.author || '';
    sheetDesc.textContent = item.desc || '';

    sheet.hidden = false;
    document.body.style.overflow = 'hidden';
  }
  function closeSheet(){
    sheet.hidden = true;
    sheetImg.src = '';
    document.body.style.overflow = '';
  }

  sheetClose.addEventListener('click', closeSheet);
  sheet.addEventListener('click', (e) => {
    const inside = e.target.closest('.sheet__card');
    if (!inside) closeSheet(); // клик по подложке
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !sheet.hidden) closeSheet();
  });

  // Управление фильтрами
  q.addEventListener('input', apply);
  typeBy.addEventListener('change', apply);
  sortBy.addEventListener('change', apply);
  sortDirBtn.addEventListener('click', () => {
    ascending = !ascending;
    sortDirBtn.textContent = ascending ? '▲' : '▼';
    apply();
  });
  reset.addEventListener('click', () => {
    q.value = '';
    typeBy.value = '';
    sortBy.value = 'new';
    ascending = false;
    sortDirBtn.textContent = '▼';
    apply();
  });

  apply();
});
