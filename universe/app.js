document.addEventListener('DOMContentLoaded', () => {
  const grid = document.getElementById('grid');
  const empty = document.getElementById('empty');
  const q = document.getElementById('q');
  const sortBy = document.getElementById('sort-by');
  const sortDirBtn = document.getElementById('sort-dir');
  const typeBy = document.getElementById('type-by');
  const reset = document.getElementById('reset');

  // 🔹 true = по возрастанию, false = по убыванию
  let ascending = false;

  // 🔹 Твои персонажи
  const items = [
    {
      name: 'Работыш',
      slug: 'rabotysh',
      category: 'canon',
      date: '2024-01-01',
      img: '../images/rabotysh.webp'
    },
    {
      name: 'Работышка',
      slug: 'rabotyshka',
      category: 'canon',
      date: '2024-01-02',
      img: '../images/rabotyshka.webp'
    },
    {
      name: 'Работыш-курьер',
      slug: 'courier',
      category: 'fan',
      date: '2024-01-10',
      img: '../images/courier.webp'
    },
    {
      name: 'Медработыш',
      slug: 'medrabotysh',
      category: 'fan',
      date: '2024-02-01',
      img: '../images/medrabotysh.webp'
    }
  ];

  // 🔹 Отображение карточек
  function render() {
    const search = q.value.trim().toLowerCase();
    const typeFilter = typeBy.value;
    const sortField = sortBy.value;

    let filtered = items.filter(x => {
      const matchesName = x.name.toLowerCase().includes(search);
      const matchesType = !typeFilter || x.category === typeFilter;
      return matchesName && matchesType;
    });

    // 🔹 Сортировка
    filtered.sort((a, b) => {
      let valA = sortField === 'name' ? a.name : a.date;
      let valB = sortField === 'name' ? b.name : b.date;
      if (sortField === 'name') {
        return ascending ? valA.localeCompare(valB) : valB.localeCompare(valA);
      } else {
        return ascending ? new Date(valA) - new Date(valB) : new Date(valB) - new Date(valA);
      }
    });

    // 🔹 Отрисовка
    grid.innerHTML = '';
    if (filtered.length === 0) {
      empty.hidden = false;
      return;
    } else empty.hidden = true;

    filtered.forEach(x => {
      const el = document.createElement('div');
      el.className = 'card';

      el.innerHTML = `
        <div class="thumb-wrap">
          <img class="thumb" src="${x.img}" alt="${x.name}">
          <div class="badge ${x.category === 'fan' ? 'badge--fan' : ''}">
            ${x.category === 'fan' ? 'Фан' : 'Канон'}
          </div>
        </div>
        <div class="card-body">
          <h3>${x.name}</h3>
        </div>
      `;
      grid.appendChild(el);
    });
  }

  // 🔹 События
  [q, sortBy, typeBy].forEach(e => e.addEventListener('input', render));
  reset.addEventListener('click', () => {
    q.value = '';
    typeBy.value = '';
    sortBy.value = 'new';
    ascending = false;
    render();
  });
  sortDirBtn.addEventListener('click', () => {
    ascending = !ascending;
    sortDirBtn.textContent = ascending ? '▲' : '▼';
    render();
  });

  render();
});
