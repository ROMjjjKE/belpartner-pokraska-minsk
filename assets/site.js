document.documentElement.classList.add('js');

/* меню */
(function () {
  var b = document.getElementById('burger'), n = document.getElementById('nav');
  if (!b || !n) return;
  b.addEventListener('click', function () { n.classList.toggle('open'); });
  n.addEventListener('click', function (e) { if (e.target.tagName === 'A') n.classList.remove('open'); });
})();

/* год */
(function () { var y = document.getElementById('yr'); if (y) y.textContent = new Date().getFullYear(); })();

/* примерочная цвета */
(function () {
  var sw = document.getElementById('sw'), fin = document.getElementById('finish');
  var body = document.getElementById('bodyPaint'), gloss = document.getElementById('glossLayer');
  var read = document.getElementById('pRead'), note = document.getElementById('pNote');
  if (!sw || !body || !read) return;

  var state = { color: '#1C1F22', name: 'Чёрный металлик', kind: 'met', finish: 'gloss' };
  var NOTES = {
    met: 'Металлик даёт глубину и «искру» под углом. Такой цвет сложнее: нужна выкраска и сравнение под лампой, иначе на солнце видно переход.',
    pearl: 'Перламутр меняет оттенок по углу. Требует одинакового числа слоёв базы — иначе деталь «уезжает» в другой тон при боковом свете.',
    sol: 'Солид — однородный цвет без зерна. Проще всего попасть в тон, но на нём заметнее любая волна подготовки.'
  };

  function render() {
    body.setAttribute('fill', state.color);
    gloss.setAttribute('opacity', state.finish === 'gloss' ? '.35' : '.08');
    read.textContent = state.name + ' · ' + (state.finish === 'gloss' ? 'глянец' : 'мат');
    note.textContent = state.finish === 'matte'
      ? 'Мат и сатин не полируются: все неровности подготовки остаются видимыми, зато нет блика и «глубины» металлика.'
      : NOTES[state.kind];
  }

  sw.addEventListener('click', function (e) {
    var btn = e.target.closest('button[data-c]');
    if (!btn) return;
    [].forEach.call(sw.querySelectorAll('button'), function (b) { b.setAttribute('aria-pressed', 'false'); });
    btn.setAttribute('aria-pressed', 'true');
    state.color = btn.getAttribute('data-c');
    state.name = btn.getAttribute('data-n');
    state.kind = btn.getAttribute('data-k');
    render();
  });

  if (fin) fin.addEventListener('click', function (e) {
    var btn = e.target.closest('button[data-f]');
    if (!btn) return;
    [].forEach.call(fin.querySelectorAll('button'), function (b) { b.setAttribute('aria-pressed', 'false'); });
    btn.setAttribute('aria-pressed', 'true');
    state.finish = btn.getAttribute('data-f');
    render();
  });

  render();
})();

/* форма */
(function () {
  var f = document.getElementById('reqForm');
  if (!f) return;
  var note = document.getElementById('note');
  f.addEventListener('submit', function (e) {
    e.preventDefault();
    var el = document.getElementById('q-el'), part = document.getElementById('q-part');
    var name = document.getElementById('q-name'), tel = document.getElementById('q-tel');
    var map = [['f-el', el.value.trim()], ['f-part', part.value.trim()], ['f-name', name.value.trim()], ['f-tel', tel.value.trim()]];
    var ok = true;
    map.forEach(function (pair) {
      var box = document.getElementById(pair[0]);
      if (!pair[1]) { box.classList.add('err'); ok = false; } else { box.classList.remove('err'); }
    });
    if (!ok) {
      note.textContent = 'Заполните четыре поля: что нужно, элемент, имя и телефон.';
      note.classList.add('on');
      return;
    }
    var text = 'Заявка: покраска кузова\nЧто нужно: ' + el.value + '\nЭлемент: ' + part.value +
               '\nИмя: ' + name.value + '\nТелефон: ' + tel.value;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).catch(function () {});
      }
    } catch (err) {}
    note.textContent = 'Заявка готова и скопирована. Вставьте её в сообщение или позвоните: +375 (29) 658-08-18';
    note.classList.add('on');
  });
})();

/* reveal */
(function () {
  var items = document.querySelectorAll('.fx');
  if (!items.length) return;
  if (!('IntersectionObserver' in window)) {
    [].forEach.call(items, function (i) { i.classList.add('in'); });
    return;
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
  }, { rootMargin: '0px 0px -8% 0px' });
  [].forEach.call(items, function (i) { io.observe(i); });
})();
