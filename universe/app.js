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
      date:'2025-10-03',
      author:'Автор: Степан Панов',
      desc:'Классический офисный Работыш: белая рубашка, синий галстук. Символ усталого профессионала.'
    },
    {
      name:'Работышка',
      img:'../images/rabotyshka.webp',
      category:'canon',
      date:'2025-10-04',
      author:'Автор: Степан Панов',
      desc:'Милая коллега, мечтающая пробраться наверх по карьерной лестнице'
    },
    {
      name:'Курьерыш',
      img:'../images/kuryerysh.webp',
      category:'canon',
      date:'2025-10-05',
      author:'Автор: Степан Панов',
      desc:'Принёс ваши пряники'
    },
    {
      name:'Безработыш',
      img:'../images/bezrabotysh.webp',
      category:'canon',
      date:'2025-10-05',
      author:'Автор: Степан Панов',
      desc:'Чилловый парень'
    },
    {
      name:'Заводыш',
      img:'../images/zavodysh.webp',
      category:'canon',
      date:'2025-10-05',
      author:'Автор: Степан Панов',
      desc:'Его завод никогда не кончится'
    },
    {
      name:'Шефыш',
      img:'../images/shefysh.webp',
      category:'canon',
      date:'2025-10-05',
      author:'Автор: Степан Панов',
      desc:'Степень прожарки - полностью выгоревший'
    },
    {
      name:'Докторыш',
      img:'../images/doktorysh.webp',
      category:'canon',
      date:'2025-10-05',
      author:'Автор: Степан Панов',
      desc:'Сестра, кофеин внутривенно! И что-нибудь пациенту'
    },
    {
      name:'Навозыш',
      img:'../images/navozysh.webp',
      category:'canon',
      date:'2025-10-05',
      author:'Автор: Степан Панов',
      desc:'Разгребает кучи'
    },
    {
      name:'Строителиш',
      img:'../images/stroitelish.webp',
      category:'canon',
      date:'2025-10-05',
      author:'Автор: Степан Панов',
      desc:'Строит из себя на работе хрен пойми кого, а на деле милый котёночек'
    },
    {
      name:'Баристыш',
      img:'../images/baristysh.webp',
      category:'canon',
      date:'2025-10-05',
      author:'Автор: Степан Панов',
      desc:'Заправляет работяг'
    },
    {
      name:'Учителиш',
      img:'../images/uchitelish.webp',
      category:'canon',
      date:'2025-10-05',
      author:'Автор: Степан Панов',
      desc:'А голову ты дома не забыл?'
    },
    {
      name:'Роботыш',
      img:'../images/robotysh.webp',
      category:'canon',
      date:'2025-10-05',
      author:'Автор: Степан Панов',
      desc:'Им было выпито 15 литров чая, посмотрено 3 миллиона мемов и сделано 174 грустных селфи'
    },
    {
      name:'Космонавтыш',
      img:'../images/kosmonavtysh.webp',
      category:'canon',
      date:'2025-10-05',
      author:'Автор: Степан Панов',
      desc:'Улетает с планеты, где нет вакансии "Ничё не делать и получать бабки"'
    },
    {
      name:'Сеньорыш',
      img:'../images/senyorysh.webp',
      category:'canon',
      date:'2025-10-05',
      author:'Автор: Степан Панов',
      desc:'Hola Amigos!'
    },
    {
      name:'Бабуля',
      img:'../images/babulya.webp',
      category:'canon',
      date:'2025-10-05',
      author:'Автор: Степан Панов',
      desc:'Работа, работа, уходи на Федота'
    },
    {
      name:'Акулыш',
      img:'../images/akulysh.webp',
      category:'canon',
      date:'2025-10-05',
      author:'Автор: Степан Панов',
      desc:'Акула бизнеса'
    },
    {
      name:'Клоуныш',
      img:'../images/klounysh.webp',
      category:'canon',
      date:'2025-10-05',
      author:'Автор: Степан Панов',
      desc:'Рассмешит любого, показав свою зарплату'
    },
    {
      name:'Юристыш',
      img:'../images/yuristysh.webp',
      category:'canon',
      date:'2025-10-05',
      author:'Автор: Степан Панов',
      desc:'Вы имеете право хранить ворчание'
    },
    {
      name:'Отпускныш',
      img:'../images/otpusknysh.webp',
      category:'canon',
      date:'2025-10-05',
      author:'Автор: Степан Панов',
      desc:'Наконец-то'
    },
    {
      name:'Агентыш',
      img:'../images/agentysh.webp',
      category:'canon',
      date:'2025-10-05',
      author:'Автор: Степан Панов',
      desc:'Вы ничего не видели'
    },
    {
      name:'Блэкметалыш',
      img:'../images/blekmetalysh.webp',
      category:'canon',
      date:'2025-10-07',
      author:'Автор: Степан Панов',
      desc:'...'
    },
    {
      name:'Кассирыш',
      img:'../images/kassirysh.webp',
      category:'canon',
      date:'2025-10-07',
      author:'Автор: Степан Панов',
      desc:'Касса свободная, а он нет'
    },
    {
      name:'Малярыш',
      img:'../images/malyarysh.webp',
      category:'canon',
      date:'2025-10-07',
      author:'Автор: Степан Панов',
      desc:'Валик крутится, копейки мутятся'
    },
    {
      name:'РЖДшыш',
      img:'../images/rzhdshysh.webp',
      category:'canon',
      date:'2025-10-07',
      author:'Автор: Степан Панов',
      desc:'Любит поезда'
    },
    {
      name:'Сварыш',
      img:'../images/svarysh.webp',
      category:'canon',
      date:'2025-10-07',
      author:'Автор: Степан Панов',
      desc:'Давно в этом варится'
    },
    {
      name:'Священныш',
      img:'../images/svyaschennysh.webp',
      category:'canon',
      date:'2025-10-07',
      author:'Автор: Степан Панов',
      desc:'Богат духовно'
    },
    {
      name:'Татуировыш',
      img:'../images/tatuirovysh.webp',
      category:'canon',
      date:'2025-10-07',
      author:'Автор: Степан Панов',
      desc:'С ним не шутите, а то набьёт что-нибудь'
    },
    {
      name:'Бойцовыш',
      img:'../images/taylerdyordenysh.webp',
      category:'canon',
      date:'2025-10-07',
      author:'Автор: Степан Панов',
      desc:'Лишь утратив всё до конца, мы обретаем свободу'
    },
    {
      name:'Техподдержиш',
      img:'../images/tehpodderzhysh.webp',
      category:'canon',
      date:'2025-10-07',
      author:'Автор: Степан Панов',
      desc:'Вы не пробовали перезагрузить?'
    },
    {
      name:'Вкусныш',
      img:'../images/vkusnysh.webp',
      category:'canon',
      date:'2025-10-07',
      author:'Автор: Степан Панов',
      desc:'Устал и точка'
    },
    {
      name:'Медсестрёныш',
      img:'../images/medsestryonysh.webp',
      category:'fan',
      date:'2025-10-08',
      author:'Автор: Марьяна Кравченко',
      desc:'Комарик укусит и всё'
    },
    {
      name:'Удалёныш',
      img:'../images/udalyonysh.webp',
      category:'fan',
      date:'2025-10-09',
      author:'Автор: ТикТок: ZANAVESKA (@za_naveska)',
      desc:'Он очень любит свой макбук, всегда пунктуален и точен в расчётах, на видео звонках обычно в кадре только по пояс (почему-то)), любит выбраться куда-то на природу, но работа не позволяет. Любит шашлык'
    },
    {
      name:'Крастпанкыш',
      img:'../images/krastpankysh.webp',
      category:'fan',
      date:'2025-10-10',
      author:'Автор: Foksyan4ik',
      desc:'Любит нойз(noise) и свою кошечку готку'
    },
    {
      name:'Фотосалоныш',
      img:'../images/fotosalonysh.webp',
      category:'fan',
      date:'2025-10-10',
      author:'Автор: Nero Zero',
      desc:'Вкалывает в фотосалоне чтобы потом потратить все деньги на озон вб и али 💅'
    },
    {
      name:'Скрипачишка',
      img:'../images/skripachishka.webp',
      category:'fan',
      date:'2025-10-10',
      author:'Автор: tatifari',
      desc:'Это скрипачишка, у нее абьюзивные отношения с музыкой(и с размером зп)'
    },
    {
      name:'Спортиш',
      img:'../images/sportish.webp',
      category:'fan',
      date:'2025-10-10',
      author:'Автор: taska',
      desc:'Спорт это смысл жизни'
    },
    {
      name:' Ачучонсыш',
      img:'../images/achuchonsysh.webp',
      category:'fan',
      date:'2025-10-10',
      author:'Автор: ялфри боится тишины',
      desc:'Он просто chill guy, которого обеспечивает мама'
    },
    {
      name:'Тыменявидыш?',
      img:'../images/tymenyavidysh.webp',
      category:'fan',
      date:'2025-10-10',
      author:'Автор: Василиск(?)',
      desc:'Я устал.....\nСлишком много.....\nРаботы.....\nЗадач.....\nСколько ещё?.....\n...\nГде я?...\nЭй.........\nКто-нибудь?.......\n...\nТы меня видишь?'
    },
    {
      name:'ДНСыш',
      img:'../images/dnsysh.webp',
      category:'fan',
      date:'2025-10-10',
      author:'Автор: Ксения Панова',
      desc:'Вам что-то подсказать?'
    },
    {
      name:'Землеустроиш',
      img:'../images/zemleustroish.webp',
      category:'fan',
      date:'2025-10-10',
      author:'Автор: lutreolina',
      desc:'Никогда не теряется - у него все по координатам'
    },
    {
      name:'Зажигалыш',
      img:'../images/zazhigalysh.webp',
      category:'fan',
      date:'2025-10-10',
      author:'Автор: Mashkidze',
      desc:'Зажигалыш, лучший друг Отпускныша, в клубах барах и караоке 25/7 \nОн выбрал быть счастливым, но откуда у него деньги на всё это?🤔'
    },
    {
      name:'Тонилайфыш',
      img:'../images/tonilayfysh.webp',
      category:'fan',
      date:'2025-10-10',
      author:'Автор: Ксения Панова',
      desc:'Вкатился'
    },
    {
      name:'Пчеловодыш',
      img:'../images/pchelovodysh.webp',
      category:'fan',
      date:'2025-10-10',
      author:'Автор: burmolga',
      desc:'Пчеловодыш держит свою пасеку, жужжит вместе со своими пчелками и обожает чай с медом'
    },
    {
      name:'Масюныш',
      img:'../images/masyunysh.webp',
      category:'fan',
      date:'2025-10-10',
      author:'Автор: Ксения Панова',
      desc:'Это что, серия кроссовер?'
    },
    {
      name:'Лабораторыш',
      img:'../images/laboratorysh.webp',
      category:'fan',
      date:'2025-10-10',
      author:'Автор: kattel',
      desc:'Чихает в пробирки и чашки петри, шапочка держится на добром слове'
    },
    {
      name:'Задротыш',
      img:'../images/zadrotysh.webp',
      category:'fan',
      date:'2025-10-10',
      author:'Автор: odyssao',
      desc:'он выиграл все катки в доте, выпил все энергетики в ближайших магазинах. Он просто бедный задротыш'
    },
    {
      name:'Фелинидыш',
      img:'../images/felinidysh.webp',
      category:'fan',
      date:'2025-10-10',
      author:'Автор: Ксения Панова',
      desc:'Ждёт свою порцию зелёного сойлента'
    },
    {
      name:'Хаоситыш',
      img:'../images/haositysh.webp',
      category:'fan',
      date:'2025-10-10',
      author:'Автор: Ксения Панова',
      desc:'Почитатель Хаоса Неделимого'
    },
    {
      name:'Скоропомыш',
      img:'../images/skoropomysh.webp',
      category:'fan',
      date:'2025-10-10',
      author:'Автор: Сыжко Ирина',
      desc:'Сутки, как белка в колесе, но на колёсах и в машине СМП'
    },
    {
      name:'Баристыш альт',
      img:'../images/baristyshalt.webp',
      category:'fan',
      date:'2025-10-10',
      author:'Автор: dimaagay',
      desc:'Пирсинг, тату, цветные волосы - значит кофе точно будет вкусный'
    },
    {
      name:'Инопланетыш',
      img:'../images/inoplanetysh.webp',
      category:'canon',
      date:'2025-10-12',
      author:'Автор: Степан Панов',
      desc:'Zip zip zap'
    },
    {
      name:'Вожатыш',
      img:'../images/vozhatysh.webp',
      category:'fan',
      date:'2025-10-12',
      author:'Автор: DasPruss',
      desc:'Он вожатый, он устал, он здесь ради вайба'
    },
    {
      name:'Литературыш',
      img:'../images/literaturysh.webp',
      category:'fan',
      date:'2025-10-12',
      author:'Автор: мила музыка',
      desc:'В смысле был ещё один Сенека?…..'
    },
    {
      name:'Нефорыш',
      img:'../images/neforysh.webp',
      category:'fan',
      date:'2025-10-12',
      author:'Автор: frontallobedestroyer228',
      desc:'Источник дохода Нефорыша неизвестен даже Зажигалышу…'
    },
    {
      name:'Художныш',
      img:'../images/hudozhnysh.webp',
      category:'fan',
      date:'2025-10-12',
      author:'Автор: @pauline_nicol',
      desc:'Перед вами художныш :) Несмотря на то, что он носит комбинезон - всё равно перепачкался в краске. Художныш живет совсем небогато, но это не мешает ему быть преданным своему делу'
    },
    {
      name:'Зелёныш',
      img:'../images/zelyonysh.webp',
      category:'fan',
      date:'2025-10-12',
      author:'Автор: glowstick',
      desc:'Любит зИлЕнИй цвет своей ковточки'
    },
    {
      name:'Пионерыш',
      img:'../images/pionerysh.webp',
      category:'fan',
      date:'2025-10-12',
      author:'Автор: Ксения Панова',
      desc:'Никогда не готов'
    },
    {
      name:'Эмыш',
      img:'../images/emysh.webp',
      category:'fan',
      date:'2025-10-12',
      author:'Автор: Ксения Панова',
      desc:'Втайне слушает Ранеток'
    },
    {
      name:'Готыш',
      img:'../images/gotysh.webp',
      category:'fan',
      date:'2025-10-12',
      author:'Автор: Ксения Панова',
      desc:'Его душа чернее ночи, априори'
    },
    {
      name:'Гламурыш',
      img:'../images/glamurysh.webp',
      category:'fan',
      date:'2025-10-12',
      author:'Автор: Ксеникс',
      desc:' Я такая розовая, блин класс'
    },
    {
      name:'Крабыш',
      img:'../images/krabysh.webp',
      category:'canon',
      date:'2025-10-12',
      author:'Автор: Степан Пановd',
      desc:'ДАРЫ МОРЯ, НЕДОРОГО!'
    }
  ];

  // === Нормализация: добавляем таймстамп из даты и исходный индекс (для тай-брейка) ===
  const normalized = items.map((it, idx) => ({
    ...it,
    _ts: Date.parse(it.date || 0), // из 'YYYY-MM-DD' получаем число
    _i: idx                         // исходный порядок в массиве
  }));

  function badgeMini(cat){
    return `<span class="badge ${cat === 'fan' ? 'badge--fan' : ''}">${cat === 'fan' ? 'Фан' : 'Канон'}</span>`;
  }

  function apply(){
    const search = q.value.trim().toLowerCase();
    const type = typeBy.value;

    let list = normalized.filter(x =>
      (!search || x.name.toLowerCase().includes(search)) &&
      (!type || x.category === type)
    );

    const field = sortBy.value;

    // Сортируем:
    // - name: алфавит
    // - new (по умолчанию): по дате (новее выше), а при равенстве даты — по исходному порядку (кто позже добавлен — выше)
    list.sort((a, b) => {
      if (field === 'name') {
        const r = (a.name || '').localeCompare(b.name || '', 'ru', {sensitivity:'base'});
        return ascending ? r : -r;
      } else {
        if (a._ts !== b._ts) {
          const r = b._ts - a._ts; // новее выше
          return ascending ? -r : r;
        }
        // тай-брейк: кто позже появился в массиве, тот выше
        const r = b._i - a._i;
        return ascending ? -r : r;
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
