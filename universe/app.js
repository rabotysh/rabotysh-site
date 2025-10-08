document.addEventListener('DOMContentLoaded', () => {
  const grid = document.getElementById('grid');
  const empty = document.getElementById('empty');

  const q = document.getElementById('q');
  const sortBy = document.getElementById('sort-by');
  const sortDirBtn = document.getElementById('sort-dir');
  const typeBy = document.getElementById('type-by');
  const reset = document.getElementById('reset');

  const sheet = document.getElementById('sheet');
  const sheetImg = document.getElementById('sheet-img');
  const sheetTitle = document.getElementById('sheet-title');
  const sheetBadge = document.getElementById('sheet-badge');
  const sheetAuthor = document.getElementById('sheet-author');
  const sheetDesc = document.getElementById('sheet-desc');
  const sheetClose = document.getElementById('sheet-close');

  let ascending = false;

  const items = [
    {
      name:'Работыш',
      img:'../images/rabotysh.webp',
      category:'canon',
      date:'2025-05-10',
      author:'Автор: Степан Панов',
      desc:'Классический офисный Работыш: белая рубашка, синий галстук. Символ усталого профессионала.'
    },
    {
      name:'Работышка',
      img:'../images/rabotyshka.webp',
      category:'canon',
      date:'2024-06-10',
      author:'Автор: Степан Панов',
      desc:'Милая коллега, мечтающая пробраться наверх по карьерной лестнице'
    },
    {
      name:'Курьерыш',
      img:'../images/kuryerysh.webp',
      category:'canon',
      date:'2024-07-10',
      author:'Автор: Степан Панов',
      desc:'На нём всеё держится'
    },
    {
      name:'Безработыш',
      img:'../images/bezrabotysh.webp',
      category:'canon',
      date:'2024-07-10',
      author:'Автор: Степан Панов',
      desc:'Чилловый парень'
    },
    {
      name:'Заводыш',
      img:'../images/zavodysh.webp',
      category:'canon',
      date:'2024-07-10',
      author:'Автор: Степан Панов',
      desc:'Его завод никогда не кончится'
    },
    {
      name:'Шефыш',
      img:'../images/shefysh.webp',
      category:'canon',
      date:'2024-07-10',
      author:'Автор: Степан Панов',
      desc:'Степень прожарки - полностью выгоревший'
    },
    {
      name:'Докторыш',
      img:'../images/doktorysh.webp',
      category:'canon',
      date:'2024-07-10',
      author:'Автор: Степан Панов',
      desc:'Сестра, кофеин внутривенно! И что-нибудь пациенту'
    },
    {
      name:'Навозыш',
      img:'../images/navozysh.webp',
      category:'canon',
      date:'2024-07-10',
      author:'Автор: Степан Панов',
      desc:'Разгребает кучи'
    },
    {
      name:'Строителиш',
      img:'../images/stroitelish.webp',
      category:'canon',
      date:'2024-07-10',
      author:'Автор: Степан Панов',
      desc:'Построил график. Разрушил нервы'
    },
    {
      name:'Баристыш',
      img:'../images/baristysh.webp',
      category:'canon',
      date:'2024-07-10',
      author:'Автор: Степан Панов',
      desc:'Заправляет работяг'
    },
    {
      name:'Учителиш',
      img:'../images/uchitelish.webp',
      category:'canon',
      date:'2024-07-10',
      author:'Автор: Степан Панов',
      desc:'А голову ты дома не забыл?'
    },
    {
      name:'Работыш',
      img:'../images/robotysh.webp',
      category:'canon',
      date:'2024-07-10',
      author:'Автор: Степан Панов',
      desc:'Им было выпито 15 литров чая, посмотрено 3 миллиона мемов и сделано 174 грустных селфи'
    },
    {
      name:'Космонавтыш',
      img:'../images/kosmonavtysh.webp',
      category:'canon',
      date:'2024-07-10',
      author:'Автор: Степан Панов',
      desc:'Улетает с планеты, где нет вакансии "Ничё не делать и получать бабки"'
    },
    {
      name:'Сеньорыш',
      img:'../images/senyorysh.webp',
      category:'canon',
      date:'2024-07-10',
      author:'Автор: Степан Панов',
      desc:'Hola Amigos!'
    },
    {
      name:'Бабуля',
      img:'../images/babulya.webp',
      category:'canon',
      date:'2024-07-10',
      author:'Автор: Степан Панов',
      desc:'Работа, работа, уходи на Федота'
    },
    {
      name:'Акулыш',
      img:'../images/akulysh.webp',
      category:'canon',
      date:'2024-07-10',
      author:'Автор: Степан Панов',
      desc:'Акула бизнеса'
    },
    {
      name:'Клоуныш',
      img:'../images/klounysh.webp',
      category:'canon',
      date:'2024-07-10',
      author:'Автор: Степан Панов',
      desc:'Рассмешит любого, показав свою зарплату'
    },
    {
      name:'Юристыш',
      img:'../images/yuristysh.webp',
      category:'canon',
      date:'2024-07-10',
      author:'Автор: Степан Панов',
      desc:'Вы имеете право хранить ворчание'
    },
    {
      name:'Отпускныш',
      img:'../images/otpusknysh.webp',
      category:'canon',
      date:'2024-07-10',
      author:'Автор: Степан Панов',
      desc:'Наконец-то'
    },
    {
      name:'Агентыш',
      img:'../images/agentysh.webp',
      category:'canon',
      date:'2024-07-10',
      author:'Автор: Степан Панов',
      desc:'Вы ничего не видели'
    }
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

    const field = sortBy.value;
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
      card.addEventListener('click', () => openSheet(x));
      grid.appendChild(card);
    });
  }

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
  sheet.addEventListener('click', e => {
    const inside = e.target.closest('.sheet__card');
    if (!inside) closeSheet();
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !sheet.hidden) closeSheet();
  });

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
