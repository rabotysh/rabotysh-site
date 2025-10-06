// version.js — автоматическая подстановка версии по дате последнего изменения страницы
const stamp = new Date(document.lastModified).getTime();

// Добавляем параметр ?v=timestamp ко всем CSS и JS без явной версии
document.querySelectorAll('link[rel="stylesheet"], script[src]').forEach(el => {
  const attr = el.tagName === 'LINK' ? 'href' : 'src';
  let url = el.getAttribute(attr);
  if (!url) return;
  if (!url.includes('?v=')) {
    el.setAttribute(attr, `${url}?v=${stamp}`);
  }
});
