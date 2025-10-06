// version.js — автоматическая подстановка версии по дате
const stamp = new Date(document.lastModified).getTime();

// Найдём все <link> и <script>, где явно не указана версия
document.querySelectorAll('link[rel="stylesheet"], script[src]').forEach(el => {
  const attr = el.tagName === 'LINK' ? 'href' : 'src';
  let url = el.getAttribute(attr);
  if (!url) return;
  if (!url.includes('?v=')) {
    el.setAttribute(attr, `${url}?v=${stamp}`);
  }
});
