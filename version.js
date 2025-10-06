// SAFE cache-bust: без document.write, просто добавляем <link> в <head>
(function () {
  var d = new Date();
  var v = d.getFullYear().toString()
        + ('0' + (d.getMonth()+1)).slice(-2)
        + ('0' + d.getDate()).slice(-2)
        + ('0' + d.getHours()).slice(-2);
  var link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'styles.css?v=' + v;   // важно: без ведущего /
  document.head.appendChild(link);
})();
