// version.js — автоматически обновляет версию CSS
(function() {
  const d = new Date();
  const v = `${d.getFullYear()}${String(d.getMonth()+1).padStart(2,'0')}${String(d.getDate()).padStart(2,'0')}${String(d.getHours()).padStart(2,'0')}`;
  document.write(`<link rel="stylesheet" href="styles.css?v=${v}">`);
})();
