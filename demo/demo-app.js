/* ============================================================================
   Демо навигации и оформления «Журнала 24ДММ-2».

   Что здесь есть и чего нет:
   — все экраны приложения на тестовых данных, все кнопки работают;
   — действия меняют только объект DEMO в памяти вкладки;
   — ни одного запроса к GitHub, Supabase или data.json.

   Структура, которую имеет смысл перенести в приложение на шаге 3:
     route()      — один роутер на все экраны, адрес вида #screen/sub
     renderTabs() — один таб-бар на всё приложение (он же боковая панель)
     openSheet()  — нижний лист со смахиванием
     dots()       — счётчики непрочитанного для точек
   ========================================================================== */
'use strict';

// ===== Состояние демо ========================================================
const S = {
  nav: 'nav1',
  style: 'a',
  theme: 'dark',
  gamma: 'blue',
  role: 'student',   // guest | student | admin
  screen: 'home',
  sub: ''
};

const NAV_NAMES  = { nav1: 'Главная-сводка', nav2: 'Ещё', nav3: 'Три пространства', nav4: 'Меню + поиск' };
const STYLE_NAMES = { a: 'Как в Telegram', b: 'Плитки-виджеты', c: 'Минимализм', d: 'Стекло' };
const THEME_NAMES = { light: 'Светлая', dark: 'Тёмная', system: 'Системная' };
const ROLE_NAMES  = { guest: 'Гость', student: 'Студент', admin: 'Админ' };
const GAMMAS = [
  { id: 'blue',    name: 'Синий',        accent: '#0A84FF' },
  { id: 'emerald', name: 'Изумруд',      accent: '#2DD4A0' },
  { id: 'indigo',  name: 'Индиго',       accent: '#7C6CFF' },
  { id: 'amber',   name: 'Янтарь',       accent: '#FFA53D' },
  { id: 'wine',    name: 'Мягкий бордо', accent: '#F2555A' }
];

// ===== Иконки ================================================================
const I = {
  home:      '<path d="M3 10.5L12 3l9 7.5"/><path d="M5.5 9.5V20h13V9.5"/>',
  schedule:  '<rect x="3" y="5" width="18" height="16" rx="3"/><path d="M8 3v4M16 3v4M3 10h18"/>',
  study:     '<path d="M12 4L2.5 9 12 14l9.5-5L12 4z"/><path d="M6 11v5c0 1.5 2.7 3 6 3s6-1.5 6-3v-5"/>',
  profile:   '<circle cx="12" cy="8.5" r="3.8"/><path d="M4.5 20c0-3.6 3.4-5.8 7.5-5.8s7.5 2.2 7.5 5.8"/>',
  stats:     '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
  teachers:  '<path d="M12 4L2.5 9 12 14l9.5-5L12 4z"/><path d="M19 10.5V16"/><path d="M6.5 11.8V16c0 1.5 2.5 2.8 5.5 2.8s5.5-1.3 5.5-2.8v-4.2"/>',
  deadlines: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7v5.2l3.2 2"/>',
  zachetka:  '<path d="M5 4.5h11a3 3 0 013 3V21H8a3 3 0 01-3-3V4.5z"/><path d="M5 18a3 3 0 013-3h11"/>',
  calc:      '<rect x="4" y="3" width="16" height="18" rx="2.5"/><path d="M8 7h8M8 12h2M12 12h2M16 12h0M8 16h2M12 16h2M16 16h0"/>',
  news:      '<path d="M4 6h16v12H8l-4 3V6z"/><path d="M8 10h8M8 13.5h5"/>',
  more:      '<circle cx="5" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="19" cy="12" r="1.6"/>',
  menu:      '<path d="M4 7h16M4 12h16M4 17h16"/>',
  admin:     '<path d="M12 3l7.5 3v6c0 4.4-3.1 7.9-7.5 9-4.4-1.1-7.5-4.6-7.5-9V6L12 3z"/>',
  absences:  '<rect x="3" y="5" width="18" height="16" rx="3"/><path d="M8 3v4M16 3v4M3 10h18"/><path d="M9.5 14.5l2 2 3.5-4"/>',
  certs:     '<path d="M7 3h7l4 4v14H7z"/><path d="M14 3v4h4"/><path d="M10 13l1.6 1.6L15 11"/>',
  pass:      '<rect x="2.5" y="5" width="19" height="14" rx="3"/><circle cx="8.5" cy="12" r="2.4"/><path d="M14 10h4M14 14h4"/>',
  theme:     '<circle cx="12" cy="12" r="4.2"/><path d="M12 2v2.6M12 19.4V22M2 12h2.6M19.4 12H22M4.9 4.9l1.9 1.9M17.2 17.2l1.9 1.9M19.1 4.9l-1.9 1.9M6.8 17.2l-1.9 1.9"/>',
  notify:    '<path d="M18 8a6 6 0 10-12 0c0 7-3 8-3 8h18s-3-1-3-8"/><path d="M13.7 21a2 2 0 01-3.4 0"/>',
  about:     '<circle cx="12" cy="12" r="9"/><path d="M12 11v5"/><circle cx="12" cy="7.8" r=".9" fill="currentColor"/>',
  standing:  '<path d="M8 21V9M16 21V5M12 21v-8"/><path d="M3 21h18"/>',
  starosta:  '<path d="M4 6h16v12H8l-4 3V6z"/>',
  logout:    '<path d="M14 7V5a2 2 0 00-2-2H6a2 2 0 00-2 2v14a2 2 0 002 2h6a2 2 0 002-2v-2"/><path d="M18 15l3-3-3-3M9.5 12H21"/>',
  chev:      '<path d="M9 5l7 7-7 7"/>',
  plus:      '<path d="M12 5v14M5 12h14"/>',
  check:     '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
  search:    '<circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5"/>',
  filter:    '<path d="M4 6h16M7 12h10M10 18h4"/>',
  sort:      '<path d="M7 4v16M7 20l-3-3M7 20l3-3M17 20V4M17 4l-3 3M17 4l3 3"/>',
  report:    '<path d="M7 3h7l4 4v14H7z"/><path d="M14 3v4h4M10 12h5M10 16h5"/>',
  backup:    '<path d="M12 3v11"/><path d="M8 10.5l4 4 4-4"/><path d="M4 17v2.5h16V17"/>',
  group:     '<circle cx="9" cy="8.5" r="3.2"/><path d="M3 19c0-3.1 2.7-5 6-5s6 1.9 6 5"/><path d="M16 6.4a3.2 3.2 0 010 4.2M18 19c0-2.4-.9-4-2.3-5"/>',
  book:      '<path d="M5 4.5h11a3 3 0 013 3V21H8a3 3 0 01-3-3V4.5z"/>'
};
function ico(name, cls) {
  return '<svg class="' + (cls || '') + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
         'stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (I[name] || '') + '</svg>';
}

// ===== Варианты навигации ====================================================
// tabs — максимум 5, подписи всегда видны, один набор на всё приложение.
const NAVS = {
  nav1: {
    tabs: [
      { s: 'home',     label: 'Главная',    icon: 'home' },
      { s: 'schedule', label: 'Расписание', icon: 'schedule' },
      { s: 'study',    label: 'Учёба',      icon: 'study' },
      { s: 'profile',  label: 'Профиль',    icon: 'profile' }
    ]
  },
  nav2: {
    tabs: [
      { s: 'group',     label: 'Статистика', icon: 'stats' },
      { s: 'schedule',  label: 'Домашка',    icon: 'schedule' },
      { s: 'deadlines', label: 'Дедлайны',   icon: 'deadlines' },
      { s: 'profile',   label: 'Кабинет',    icon: 'profile' },
      { s: 'more',      label: 'Ещё',        icon: 'more' }
    ]
  },
  nav3: {
    tabs: [
      { s: 'group',   label: 'Группа', icon: 'group' },
      { s: 'study',   label: 'Учёба',  icon: 'study' },
      { s: 'profile', label: 'Я',      icon: 'profile' }
    ],
    segments: {
      group:   [ { s: 'group', n: 'Статистика' }, { s: 'teachers', n: 'Преподаватели' }, { s: 'news', n: 'Объявления' } ],
      study:   [ { s: 'home', n: 'Сегодня' }, { s: 'schedule', n: 'Расписание' }, { s: 'deadlines', n: 'Дедлайны' }, { s: 'zachetka', n: 'Зачётка' }, { s: 'calc', n: 'Калькулятор' } ],
      profile: [ { s: 'profile', n: 'Сводка' }, { s: 'absences', n: 'Пропуски' }, { s: 'certs', n: 'Справки' }, { s: 'pass', n: 'Пропуск' }, { s: 'settings', n: 'Настройки' } ]
    }
  },
  nav4: {
    drawer: true,
    tabs: [
      { s: 'home',     label: 'Главная',    icon: 'home' },
      { s: 'schedule', label: 'Расписание', icon: 'schedule' },
      { s: 'zachetka', label: 'Зачётка',    icon: 'zachetka' },
      { s: 'profile',  label: 'Профиль',    icon: 'profile' }
    ]
  }
};

// Какой таб подсветить для экрана, которого нет в таб-баре напрямую
const HOST = {
  nav1: { group: 'study', teachers: 'study', deadlines: 'study', zachetka: 'study', calc: 'study', news: 'home',
          absences: 'profile', certs: 'profile', pass: 'profile', settings: 'profile', theme: 'profile',
          notify: 'profile', about: 'profile', account: 'profile', standing: 'study', admin: 'profile' },
  nav2: { home: 'group', study: 'more', teachers: 'more', zachetka: 'more', calc: 'more', news: 'more',
          absences: 'profile', certs: 'profile', pass: 'profile', settings: 'profile', theme: 'more',
          notify: 'more', about: 'more', account: 'profile', standing: 'group', admin: 'more' },
  nav3: { home: 'study', teachers: 'group', news: 'group', zachetka: 'study', calc: 'study', deadlines: 'study',
          schedule: 'study', absences: 'profile', certs: 'profile', pass: 'profile', settings: 'profile',
          theme: 'profile', notify: 'profile', about: 'profile', account: 'profile', standing: 'group',
          more: 'group', study: 'study', admin: 'profile' },
  nav4: { group: 'home', teachers: 'home', deadlines: 'home', news: 'home', calc: 'zachetka', study: 'home',
          more: 'home', absences: 'profile', certs: 'profile', pass: 'profile', settings: 'profile',
          theme: 'profile', notify: 'profile', about: 'profile', account: 'profile', standing: 'home', admin: 'profile' }
};

// Личные экраны: гостю вместо них показывается вход
const PERSONAL = ['profile', 'absences', 'certs', 'pass', 'zachetka', 'calc', 'account', 'settings', 'standing', 'theme', 'notify'];
// Админские экраны
const ADMIN_ONLY = ['admin'];

// Полный список разделов для «Ещё» и бокового меню
const ALL_SECTIONS = [
  { s: 'home',      n: 'Главная',            icon: 'home',      grp: 'Основное' },
  { s: 'schedule',  n: 'Расписание и ДЗ',    icon: 'schedule',  grp: 'Основное' },
  { s: 'deadlines', n: 'Дедлайны и зачёты',  icon: 'deadlines', grp: 'Основное', dot: 'deadlines' },
  { s: 'group',     n: 'Статистика группы',  icon: 'stats',     grp: 'Группа' },
  { s: 'teachers',  n: 'Преподаватели',      icon: 'teachers',  grp: 'Группа' },
  { s: 'news',      n: 'Объявления',         icon: 'news',      grp: 'Группа', dot: 'news' },
  { s: 'standing',  n: 'Место в группе',     icon: 'standing',  grp: 'Группа' },
  { s: 'zachetka',  n: 'Зачётка',            icon: 'zachetka',  grp: 'Учёба' },
  { s: 'calc',      n: 'Калькулятор рейтинга', icon: 'calc',    grp: 'Учёба' },
  { s: 'profile',   n: 'Профиль',            icon: 'profile',   grp: 'Личное' },
  { s: 'absences',  n: 'Мои пропуски',       icon: 'absences',  grp: 'Личное' },
  { s: 'certs',     n: 'Справки',            icon: 'certs',     grp: 'Личное' },
  { s: 'pass',      n: 'MarketPass',         icon: 'pass',      grp: 'Личное' },
  { s: 'theme',     n: 'Оформление',         icon: 'theme',     grp: 'Настройки' },
  { s: 'notify',    n: 'Уведомления',        icon: 'notify',    grp: 'Настройки' },
  { s: 'account',   n: 'Логин и пароль',     icon: 'profile',   grp: 'Настройки' },
  { s: 'about',     n: 'История изменений',  icon: 'about',     grp: 'Настройки' },
  { s: 'admin',     n: 'Админ-панель',       icon: 'admin',     grp: 'Админ', admin: true }
];

// ===== Мелкие помощники ======================================================
const $ = (id) => document.getElementById(id);
const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const MONTHS = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
const MONTHS_N = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
const WDAYS = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
const WDAYS_FULL = ['воскресенье', 'понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота'];

function iso(d) { return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); }
function parseISO(s) { const p = String(s).split('-'); return new Date(+p[0], +p[1] - 1, +p[2]); }
function fmtDate(s) { const d = parseISO(s); return d.getDate() + ' ' + MONTHS[d.getMonth()]; }
function daysLeft(s) { return Math.round((parseISO(s) - new Date(DEMO_TODAY.getFullYear(), DEMO_TODAY.getMonth(), DEMO_TODAY.getDate())) / 86400000); }
function daysWord(n) { const a = Math.abs(n) % 100, b = a % 10; if (a > 10 && a < 20) return 'дней'; if (b === 1) return 'день'; if (b > 1 && b < 5) return 'дня'; return 'дней'; }
function leftText(n) { return n < 0 ? 'просрочено' : n === 0 ? 'сегодня' : n === 1 ? 'завтра' : 'через ' + n + ' ' + daysWord(n); }
function hoursWord(n) { const a = n % 100, b = a % 10; if (a > 10 && a < 20) return 'часов'; if (b === 1) return 'час'; if (b > 1 && b < 5) return 'часа'; return 'часов'; }
function haptic(kind) { try { const t = window.Telegram && window.Telegram.WebApp; if (t && t.HapticFeedback) t.HapticFeedback.impactOccurred(kind || 'light'); } catch (e) {} }

// ===== Непрочитанное =========================================================
function dots() {
  const news = DEMO.announcements.filter((a) => DEMO.seenNews.indexOf(a.id) === -1).length;
  const dl = DEMO.deadlines.filter((d) => DEMO.seenDeadlines.indexOf(d.id) === -1).length;
  return { news: news, deadlines: dl };
}
// Красная точка видна и на самом пункте, и на вкладке, в которой он лежит
function tabHasDot(tabId) {
  const d = dots();
  const nav = S.nav;
  let has = false;
  if (d.news) { const host = (nav === 'nav1' ? 'home' : HOST[nav].news || 'news'); if (host === tabId || tabId === 'news') has = true; }
  if (d.deadlines) { const host = HOST[nav].deadlines || 'deadlines'; if (host === tabId || tabId === 'deadlines') has = true; }
  return has;
}

// ===== Доступ ================================================================
function allowed(screen) {
  if (ADMIN_ONLY.indexOf(screen) !== -1 && S.role !== 'admin') return false;
  return true;
}
function needsLogin(screen) { return S.role === 'guest' && PERSONAL.indexOf(screen) !== -1; }

// ===== Адрес =================================================================
function writeURL(replace) {
  const q = 'nav=' + S.nav + '&style=' + S.style + '&theme=' + S.theme + '&gamma=' + S.gamma + '&role=' + S.role;
  const h = '#' + S.screen + (S.sub ? '/' + S.sub : '');
  const url = location.pathname + '?' + q + h;
  if (replace) history.replaceState(null, '', url); else history.pushState(null, '', url);
}
function readURL() {
  const p = new URLSearchParams(location.search);
  if (NAVS[p.get('nav')]) S.nav = p.get('nav');
  if (STYLE_NAMES[p.get('style')]) S.style = p.get('style');
  if (THEME_NAMES[p.get('theme')]) S.theme = p.get('theme');
  if (GAMMAS.some((g) => g.id === p.get('gamma'))) S.gamma = p.get('gamma');
  if (ROLE_NAMES[p.get('role')]) S.role = p.get('role');
  const h = location.hash.slice(1).split('/');
  if (h[0] && SCREENS[h[0]]) { S.screen = h[0]; S.sub = h[1] || ''; }
  else { S.screen = NAVS[S.nav].tabs[0].s; S.sub = ''; }
}
function go(screen, sub) {
  if (!SCREENS[screen]) return;
  if (!allowed(screen)) return;
  S.screen = screen; S.sub = sub || '';
  haptic('light');
  writeURL(false);
  render();
}

// ===== Тема ==================================================================
function applyLook() {
  const root = document.documentElement;
  const scheme = S.theme === 'system'
    ? (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark')
    : S.theme;
  root.setAttribute('data-bs-theme', scheme);
  root.setAttribute('data-gamma', S.gamma);
  root.setAttribute('data-style', S.style);
  root.style.colorScheme = scheme;
}

// ===== Листы =================================================================
let openLayers = [];
function openSheet(title, html, onMount) {
  const wrap = document.createElement('div');
  wrap.innerHTML =
    '<div class="ui-scrim"></div>' +
    '<section class="ui-sheet" role="dialog" aria-modal="true" aria-label="' + esc(title) + '">' +
      '<div class="ui-sheet-grip"></div>' +
      '<header class="ui-sheet-head"><h2 class="ui-sheet-title">' + esc(title) + '</h2>' +
        '<button type="button" class="ui-head-btn" data-close aria-label="Закрыть">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg></button></header>' +
      '<div class="ui-sheet-body">' + html + '</div>' +
    '</section>';
  const scrim = wrap.querySelector('.ui-scrim');
  const sheet = wrap.querySelector('.ui-sheet');
  $('layers').appendChild(wrap);
  requestAnimationFrame(() => { scrim.classList.add('is-on'); sheet.classList.add('is-on'); });

  const close = () => {
    scrim.classList.remove('is-on'); sheet.classList.remove('is-on');
    setTimeout(() => wrap.remove(), 320);
    openLayers = openLayers.filter((l) => l !== close);
    syncBack();
  };
  openLayers.push(close);
  scrim.addEventListener('click', close);
  wrap.querySelector('[data-close]').addEventListener('click', close);
  enableSheetSwipe(sheet, close);
  if (onMount) onMount(sheet, close);
  syncBack();
  return close;
}
// Смахивание вниз закрывает лист
function enableSheetSwipe(sheet, close) {
  let y0 = 0, dy = 0, drag = false;
  const body = sheet.querySelector('.ui-sheet-body');
  sheet.addEventListener('touchstart', (e) => {
    if (body.scrollTop > 0) return;
    y0 = e.touches[0].clientY; dy = 0; drag = true;
    sheet.classList.add('is-drag');
  }, { passive: true });
  sheet.addEventListener('touchmove', (e) => {
    if (!drag) return;
    dy = e.touches[0].clientY - y0;
    if (dy < 0) { dy = 0; return; }
    sheet.style.transform = 'translateY(' + dy + 'px)';
  }, { passive: true });
  sheet.addEventListener('touchend', () => {
    if (!drag) return;
    drag = false;
    sheet.classList.remove('is-drag');
    sheet.style.transform = '';
    if (dy > 110) close();
  });
}
function closeTopLayer() { if (openLayers.length) { openLayers[openLayers.length - 1](); return true; } return false; }

// ===== Кнопка «назад» телефона и Telegram ====================================
function isNested() {
  return NAVS[S.nav].tabs.every((t) => t.s !== S.screen);
}
function syncBack() {
  const nested = isNested() || openLayers.length > 0;
  const drawerNav = NAVS[S.nav].drawer;
  $('btnBack').hidden = !nested;
  $('btnMenu').hidden = !(drawerNav && !nested);
  try {
    const tg = window.Telegram && window.Telegram.WebApp;
    if (tg && tg.BackButton) {
      if (nested) tg.BackButton.show(); else tg.BackButton.hide();
    }
  } catch (e) {}
}
function goBack() {
  if (closeTopLayer()) return;
  history.back();
}

// ===== Таб-бар / боковая панель ==============================================
function renderTabs() {
  const nav = NAVS[S.nav];
  const host = HOST[S.nav][S.screen] || S.screen;
  $('tabbar').innerHTML = nav.tabs.map((t) => {
    const on = (t.s === S.screen || t.s === host);
    const dot = tabHasDot(t.s) ? '<span class="ui-dot-abs"></span>' : '';
    return '<a class="ui-tab' + (on ? ' is-on' : '') + '" href="#' + t.s + '" data-tab="' + t.s + '"' +
           (on ? ' aria-current="page"' : '') + '>' + ico(t.icon) +
           '<span class="ui-tab-lbl">' + esc(t.label) + '</span>' + dot + '</a>';
  }).join('');
}

// ===== Экраны ================================================================
const SCREENS = {};

function card(inner, cls) { return '<section class="ui-card ' + (cls || '') + '">' + inner + '</section>'; }
function rows(items) { return '<div class="ui-rows">' + items.join('') + '</div>'; }
function row(opt) {
  const tag = opt.href ? 'a' : 'button';
  const attr = opt.href ? ' href="' + opt.href + '"' : ' type="button"';
  return '<' + tag + ' class="ui-row"' + attr + (opt.act ? ' data-act="' + opt.act + '"' : '') + (opt.arg ? ' data-arg="' + esc(opt.arg) + '"' : '') + '>' +
    (opt.icon ? '<span class="ui-row-ico">' + ico(opt.icon) + '</span>' : '') +
    '<span class="ui-row-body"><span class="ui-row-title">' + esc(opt.title) + '</span>' +
    (opt.note ? '<span class="ui-row-note">' + esc(opt.note) + '</span>' : '') + '</span>' +
    (opt.dot ? '<span class="ui-dot"></span>' : '') +
    (opt.val ? '<span class="ui-row-val">' + esc(opt.val) + '</span>' : '') +
    (opt.chev === false ? '' : '<span class="ui-row-chev">' + ico('chev') + '</span>') +
    '</' + tag + '>';
}
function tile(opt) {
  return '<a class="ui-tile" href="#' + opt.s + '">' +
    '<span class="ui-tile-ico">' + ico(opt.icon) + '</span>' +
    '<span class="ui-tile-name">' + esc(opt.n) + '</span>' +
    (opt.note ? '<span class="ui-tile-note">' + esc(opt.note) + '</span>' : '') +
    (opt.dot ? '<span class="ui-dot-abs" style="top:12px;right:12px;margin:0"></span>' : '') +
    '</a>';
}
function title(t, sub) { return '<h2 class="ui-title">' + esc(t) + '</h2>' + (sub ? '<p class="ui-sub">' + esc(sub) + '</p>' : ''); }

// --- Расписание: вспомогательное --------------------------------------------
function lessonsOf(weekday) { return DEMO.schedule.filter((l) => l.weekday === weekday).sort((a, b) => a.pair - b.pair); }
function minutesOf(hm) { const p = hm.split(':'); return +p[0] * 60 + +p[1]; }
function lessonState(l, day) {
  // Статус считается только для сегодняшнего дня
  const todayWd = DEMO_TODAY.getDay();
  if (day !== todayWd) return 'other';
  const now = DEMO_TODAY.getHours() * 60 + DEMO_TODAY.getMinutes();
  if (now < minutesOf(l.from)) return 'next';
  if (now > minutesOf(l.to)) return 'past';
  return 'now';
}
function doneKey(l, day) { return day + '-' + l.pair + '-' + l.subject; }
function hwFor(subject) { return DEMO.homework.filter((h) => h.subject === subject)[0] || null; }
function teacherName(id) { const t = DEMO.teachers.filter((x) => x.id === id)[0]; return t ? t.name : ''; }
function currentLesson() {
  const wd = DEMO_TODAY.getDay();
  const list = lessonsOf(wd);
  for (let i = 0; i < list.length; i++) if (lessonState(list[i], wd) === 'now') return { l: list[i], state: 'now' };
  for (let i = 0; i < list.length; i++) if (lessonState(list[i], wd) === 'next') return { l: list[i], state: 'next' };
  return null;
}

// --- Главная / сводка --------------------------------------------------------
SCREENS.home = { name: 'Главная', render: function () {
  const cur = currentLesson();
  const d = dots();
  const myHours = DEMO.absences.reduce((s, a) => s + a.hours, 0);
  const soon = DEMO.deadlines.slice().sort((a, b) => a.date.localeCompare(b.date)).slice(0, 3);
  const unread = DEMO.announcements.filter((a) => DEMO.seenNews.indexOf(a.id) === -1);

  let lessonCard;
  if (cur) {
    const hw = hwFor(cur.l.subject);
    lessonCard =
      '<div class="ui-between" style="margin-bottom:8px">' +
        '<span class="ui-badge ' + (cur.state === 'now' ? 'ui-badge-ok' : 'ui-badge-mut') + '">' + (cur.state === 'now' ? 'Идёт сейчас' : 'Следующая пара') + '</span>' +
        '<span class="ui-muted" style="font-size:var(--fs-small)">' + cur.l.from + '–' + cur.l.to + '</span>' +
      '</div>' +
      '<div style="font-size:var(--fs-body);font-weight:600;color:var(--color-text)">' + esc(cur.l.subject) + '</div>' +
      '<div class="ui-muted" style="font-size:var(--fs-small);margin-top:2px">' + esc(teacherName(cur.l.teacher)) + ' · ауд. ' + esc(cur.l.room) + '</div>' +
      (hw ? '<div class="ui-muted" style="font-size:var(--fs-small);margin-top:8px">ДЗ: ' + esc(hw.text.slice(0, 60)) + '…</div>' : '');
  } else {
    lessonCard = '<div class="ui-muted">Сегодня пар больше нет</div>';
  }

  return title('Привет, Дмитрий', WDAYS_FULL[DEMO_TODAY.getDay()] + ', ' + DEMO_TODAY.getDate() + ' ' + MONTHS[DEMO_TODAY.getMonth()]) +
    '<div class="ui-stack ui-stagger">' +
      '<a class="ui-card" href="#schedule" style="display:block;padding:var(--space-4);text-decoration:none;color:inherit">' + lessonCard + '</a>' +

      '<div class="ui-tiles">' +
        '<a class="ui-tile" href="#absences"><span class="ui-num">' + myHours + '</span><span class="ui-num-cap">' + hoursWord(myHours) + ' пропусков за месяц</span></a>' +
        '<a class="ui-tile" href="#standing"><span class="ui-num">' + (DEMO.students.slice().sort((a, b) => a.hours - b.hours).findIndex((s) => s.id === DEMO.me.id) + 1) + '</span><span class="ui-num-cap">место в группе из ' + DEMO.students.length + '</span></a>' +
      '</div>' +

      card('<div class="ui-card-head">Ближайшие дедлайны' + (d.deadlines ? '<span class="ui-dot"></span>' : '') +
        '<a href="#deadlines" class="ui-btn ui-btn-sm ui-btn-ghost" style="margin-left:auto">Все</a></div>' +
        rows(soon.map((x) => row({
          href: '#deadlines', icon: x.kind === 'zachet' ? 'check' : 'deadlines',
          title: x.title,
          note: x.subject + ' · ' + fmtDate(x.date) + ' · ' + leftText(daysLeft(x.date)),
          dot: DEMO.seenDeadlines.indexOf(x.id) === -1,
          chev: false
        })))) +

      card('<div class="ui-card-head">Объявления' + (d.news ? '<span class="ui-dot"></span>' : '') +
        '<a href="#news" class="ui-btn ui-btn-sm ui-btn-ghost" style="margin-left:auto">Все</a></div>' +
        (unread.length
          ? rows(unread.map((n) => row({ href: '#news', icon: 'news', title: n.title, note: n.text.slice(0, 48) + '…', dot: true, chev: false })))
          : '<div class="ui-empty">Новых объявлений нет</div>')) +
    '</div>';
} };

// --- Расписание и домашка ----------------------------------------------------
let schedDay = DEMO_TODAY.getDay() === 0 ? 1 : DEMO_TODAY.getDay();
SCREENS.schedule = { name: 'Расписание', render: function () {
  const list = lessonsOf(schedDay);
  const days = [1, 2, 3, 4, 5, 6];

  const strip = '<div class="ui-seg" role="tablist">' + days.map((d) =>
    '<button type="button" class="ui-seg-item' + (d === schedDay ? ' is-on' : '') + '" data-act="day" data-arg="' + d + '" role="tab">' +
    WDAYS[d] + '</button>').join('') + '</div>';

  const body = list.length ? list.map((l) => {
    const st = lessonState(l, schedDay);
    const hw = hwFor(l.subject);
    const key = doneKey(l, schedDay);
    const isDone = !!DEMO.done[key];
    return '<article class="ui-card" style="padding:var(--space-4)">' +
      '<div class="ui-between" style="margin-bottom:6px">' +
        '<span class="ui-badge ui-type-' + l.type + '">' + (l.type === 'lecture' ? 'Лекция' : l.type === 'lab' ? 'Лаба' : 'Практика') + '</span>' +
        (st === 'now' ? '<span class="ui-badge ui-badge-ok">Сейчас</span>' : st === 'next' ? '<span class="ui-badge ui-badge-mut">Дальше</span>' : '') +
        '<span class="ui-muted ui-grow" style="text-align:right;font-size:var(--fs-small)">' + l.from + '–' + l.to + '</span>' +
      '</div>' +
      '<button type="button" data-act="lesson" data-arg="' + schedDay + ':' + l.pair + '" style="all:unset;display:block;width:100%;cursor:pointer">' +
        '<div style="font-size:var(--fs-body);font-weight:600;color:var(--color-text)">' + esc(l.subject) + '</div>' +
        '<div class="ui-muted" style="font-size:var(--fs-small);margin-top:2px">' + esc(teacherName(l.teacher)) + ' · ауд. ' + esc(l.room) + '</div>' +
      '</button>' +
      (hw ? '<div style="margin-top:10px;padding-top:10px;border-top:1px solid var(--color-separator)">' +
        '<div class="ui-muted" style="font-size:var(--fs-small);margin-bottom:8px">ДЗ к ' + fmtDate(hw.due) + ': ' + esc(hw.text) + '</div>' +
        '<button type="button" class="ui-btn ui-btn-sm ' + (isDone ? 'ui-btn-ghost' : '') + '" data-act="done" data-arg="' + esc(key) + '">' +
          (isDone ? ico('check') + ' Сделано' : 'Отметить «Сделано»') + '</button>' +
        '</div>' : '') +
      '</article>';
  }).join('') : '<div class="ui-empty">В этот день пар нет</div>';

  const adminBtn = S.role === 'admin'
    ? '<button type="button" class="ui-btn ui-btn-sm ui-btn-line" data-act="hwForm" style="margin-bottom:var(--ui-gap)">' + ico('plus') + ' Добавить ДЗ</button>'
    : '';

  return title('Расписание', 'Семестр 1 · неделя 5') + strip + adminBtn +
    '<div class="ui-stack ui-stagger">' + body + '</div>';
} };

// --- Статистика группы -------------------------------------------------------
let grpSort = 'hours', grpDesc = true, grpSubjects = [];
SCREENS.group = { name: 'Статистика группы', render: function () {
  const list = DEMO.students.slice().sort((a, b) => {
    const v = grpSort === 'name' ? a.name.localeCompare(b.name) : grpSort === 'cert' ? a.cert - b.cert : a.hours - b.hours;
    return grpDesc ? -v : v;
  });
  const total = DEMO.students.reduce((s, x) => s + x.hours, 0);
  const avg = Math.round(total / DEMO.students.length);
  const filterNote = grpSubjects.length ? grpSubjects.length + ' из ' + DEMO.subjects.length : 'все предметы';

  const adminBar = S.role === 'admin'
    ? '<div class="ui-wrap" style="margin-bottom:var(--ui-gap)">' +
      '<button type="button" class="ui-btn ui-btn-sm" data-act="absOne">' + ico('plus') + ' Пропуски</button>' +
      '<button type="button" class="ui-btn ui-btn-sm ui-btn-ghost" data-act="absGroup">Группой</button>' +
      '<button type="button" class="ui-btn ui-btn-sm ui-btn-ghost" data-act="report">Отчёт</button>' +
      '</div>' : '';

  return title('Статистика', 'Данные актуальны на ' + fmtDate(DEMO.dataUpdated)) +
    '<div class="ui-stack ui-stagger">' +
      '<div class="ui-tiles">' +
        '<div class="ui-tile"><span class="ui-num">' + total + '</span><span class="ui-num-cap">' + hoursWord(total) + ' пропусков у группы</span></div>' +
        '<div class="ui-tile"><span class="ui-num">' + avg + '</span><span class="ui-num-cap">в среднем на человека</span></div>' +
      '</div>' +
      adminBar +
      '<div class="ui-wrap">' +
        '<button type="button" class="ui-chip' + (grpSubjects.length ? ' is-on' : '') + '" data-act="filter">' + ico('filter', '') + ' Фильтр: ' + filterNote + '</button>' +
        '<button type="button" class="ui-chip" data-act="sort">' + ico('sort', '') + ' Сортировка</button>' +
      '</div>' +
      card('<div class="ui-table-scroll"><table class="ui-table"><thead><tr>' +
        '<th>№</th><th>Студент</th><th>Часы</th><th>Справки</th></tr></thead><tbody>' +
        list.map((s) => '<tr data-act="student" data-arg="' + s.id + '" style="cursor:pointer">' +
          '<td class="ui-muted">' + s.number + '</td>' +
          '<td style="color:var(--color-text);white-space:normal">' + esc(s.name) + (s.id === DEMO.me.id ? ' <span class="ui-badge ui-badge-mut">вы</span>' : '') + '</td>' +
          '<td><span class="ui-badge ' + (s.hours > 40 ? 'ui-badge-bad' : s.hours > 16 ? 'ui-badge-warn' : 'ui-badge-ok') + '">' + s.hours + '</span></td>' +
          '<td class="ui-muted">' + s.cert + '</td></tr>').join('') +
        '</tbody></table></div>') +
    '</div>';
} };

// --- Место в группе ----------------------------------------------------------
SCREENS.standing = { name: 'Место в группе', render: function () {
  const sorted = DEMO.students.slice().sort((a, b) => a.hours - b.hours);
  const myPlace = sorted.findIndex((s) => s.id === DEMO.me.id) + 1;
  return title('Место в группе', 'Чем меньше пропусков — тем выше') +
    '<div class="ui-stack ui-stagger">' +
      card('<div style="padding:var(--space-5);text-align:center">' +
        '<div class="ui-num" style="font-size:56px">' + myPlace + '</div>' +
        '<div class="ui-num-cap">из ' + sorted.length + ' в группе</div></div>') +
      card(rows(sorted.map((s, i) => row({
        title: (i + 1) + '. ' + s.name, val: s.hours + ' ч', chev: false,
        note: s.id === DEMO.me.id ? 'это вы' : ''
      })))) +
    '</div>';
} };

// --- Преподаватели -----------------------------------------------------------
SCREENS.teachers = { name: 'Преподаватели', render: function () {
  return title('Преподаватели') +
    (S.role === 'admin' ? '<button type="button" class="ui-btn ui-btn-sm ui-btn-line" data-act="teacherForm" style="margin-bottom:var(--ui-gap)">' + ico('plus') + ' Добавить</button>' : '') +
    '<div class="ui-stack ui-stagger">' +
      DEMO.teachers.map((t) => '<article class="ui-card" style="padding:var(--space-4)">' +
        '<div style="font-size:var(--fs-body);font-weight:600;color:var(--color-text)">' + esc(t.name) + '</div>' +
        '<div class="ui-muted" style="font-size:var(--fs-small);margin-top:2px">' + esc(t.subject) + ' · ауд. ' + esc(t.room) + '</div>' +
        (t.note ? '<div class="ui-muted" style="font-size:var(--fs-small);margin-top:8px">' + esc(t.note) + '</div>' : '') +
        '<div class="ui-wrap" style="margin-top:10px">' +
          (t.tg ? '<button type="button" class="ui-btn ui-btn-sm ui-btn-ghost" data-act="toast" data-arg="Откроется чат ' + esc(t.tg) + '">' + esc(t.tg) + '</button>' : '') +
          (S.role === 'admin' ? '<button type="button" class="ui-btn ui-btn-sm ui-btn-line" data-act="teacherForm" data-arg="' + t.id + '">Изменить</button>' : '') +
        '</div></article>').join('') +
    '</div>';
} };

// --- Дедлайны ----------------------------------------------------------------
let dlMonth = DEMO_TODAY.getMonth(), dlYear = DEMO_TODAY.getFullYear();
SCREENS.deadlines = { name: 'Дедлайны и зачёты', render: function () {
  // Открыли раздел — прочитали
  DEMO.deadlines.forEach((d) => { if (DEMO.seenDeadlines.indexOf(d.id) === -1) DEMO.seenDeadlines.push(d.id); });
  const list = DEMO.deadlines.slice().sort((a, b) => a.date.localeCompare(b.date));

  return title('Дедлайны и зачёты') +
    (S.role === 'admin' ? '<button type="button" class="ui-btn ui-btn-sm ui-btn-line" data-act="dlForm" style="margin-bottom:var(--ui-gap)">' + ico('plus') + ' Добавить</button>' : '') +
    '<div class="ui-stack ui-stagger">' +
      card('<div class="ui-card-head"><button type="button" class="ui-btn ui-btn-sm ui-btn-ghost" data-act="dlMonth" data-arg="-1">‹</button>' +
        '<span class="ui-grow" style="text-align:center">' + MONTHS_N[dlMonth] + ' ' + dlYear + '</span>' +
        '<button type="button" class="ui-btn ui-btn-sm ui-btn-ghost" data-act="dlMonth" data-arg="1">›</button></div>' +
        '<div style="padding:var(--space-3) var(--ui-card-pad, 0) var(--space-4)">' + calendarHTML(dlYear, dlMonth, 'dl') + '</div>') +
      list.map((x) => {
        const n = daysLeft(x.date);
        return '<article class="ui-card" style="padding:var(--space-4)">' +
          '<div class="ui-between" style="margin-bottom:6px">' +
            '<span class="ui-badge ' + (x.kind === 'zachet' ? 'ui-badge-warn' : 'ui-badge-mut') + '">' + (x.kind === 'zachet' ? 'Зачёт' : 'Задание') + '</span>' +
            '<span class="ui-badge ' + (n < 0 ? 'ui-badge-bad' : n <= 3 ? 'ui-badge-warn' : 'ui-badge-ok') + '">' + leftText(n) + '</span>' +
          '</div>' +
          '<div style="font-size:var(--fs-body);font-weight:600;color:var(--color-text)">' + esc(x.title) + '</div>' +
          '<div class="ui-muted" style="font-size:var(--fs-small);margin-top:2px">' + esc(x.subject) + ' · ' + fmtDate(x.date) + '</div>' +
          (S.role === 'admin' ? '<div class="ui-wrap" style="margin-top:10px">' +
            '<button type="button" class="ui-btn ui-btn-sm ui-btn-line" data-act="dlForm" data-arg="' + x.id + '">Изменить</button>' +
            '<button type="button" class="ui-btn ui-btn-sm ui-btn-danger" data-act="dlDel" data-arg="' + x.id + '">Удалить</button></div>' : '') +
          '</article>';
      }).join('') +
    '</div>';
} };

function calendarHTML(y, m, kind) {
  const first = new Date(y, m, 1);
  const start = (first.getDay() + 6) % 7;            // неделя с понедельника
  const days = new Date(y, m + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < start; i++) cells.push('<span class="ui-cal-d is-mut"></span>');
  for (let d = 1; d <= days; d++) {
    const key = iso(new Date(y, m, d));
    const hasDl = DEMO.deadlines.some((x) => x.date === key);
    const hasAbs = DEMO.absences.some((x) => x.date === key);
    const isToday = key === iso(DEMO_TODAY);
    const cls = 'ui-cal-d' + (isToday ? ' is-today' : '') +
      (kind === 'dl' && hasDl ? ' has-dl' : '') + (kind === 'abs' && hasAbs ? ' has-abs' : '');
    cells.push('<button type="button" class="' + cls + '" data-act="calDay" data-arg="' + key + '">' + d + '</button>');
  }
  return '<div class="ui-cal-h">' + ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map((w) => '<span>' + w + '</span>').join('') + '</div>' +
         '<div class="ui-cal">' + cells.join('') + '</div>';
}

// --- Объявления --------------------------------------------------------------
SCREENS.news = { name: 'Объявления', render: function () {
  DEMO.announcements.forEach((a) => { if (DEMO.seenNews.indexOf(a.id) === -1) DEMO.seenNews.push(a.id); });
  return title('Объявления') +
    (S.role === 'admin' ? '<button type="button" class="ui-btn ui-btn-sm ui-btn-line" data-act="newsForm" style="margin-bottom:var(--ui-gap)">' + ico('plus') + ' Написать</button>' : '') +
    '<div class="ui-stack ui-stagger">' +
      DEMO.announcements.slice().sort((a, b) => b.date.localeCompare(a.date)).map((n) =>
        '<article class="ui-card" style="padding:var(--space-4)">' +
        '<div class="ui-between" style="margin-bottom:6px">' +
          '<span class="ui-badge ' + (n.target === 'ME' ? 'ui-badge-warn' : 'ui-badge-mut') + '">' + (n.target === 'ME' ? 'Лично' : 'Всей группе') + '</span>' +
          '<span class="ui-muted" style="font-size:var(--fs-small)">' + fmtDate(n.date) + '</span></div>' +
        '<div style="font-size:var(--fs-body);font-weight:600;color:var(--color-text)">' + esc(n.title) + '</div>' +
        '<div class="ui-muted" style="font-size:var(--fs-caption);margin-top:4px;line-height:1.45">' + esc(n.text) + '</div>' +
        (S.role === 'admin' ? '<div class="ui-wrap" style="margin-top:10px"><button type="button" class="ui-btn ui-btn-sm ui-btn-danger" data-act="newsDel" data-arg="' + n.id + '">Удалить</button></div>' : '') +
        '</article>').join('') +
    '</div>';
} };

// --- Зачётка -----------------------------------------------------------------
SCREENS.zachetka = { name: 'Зачётка', render: function () {
  const graded = DEMO.zachetka.filter((z) => z.grade > 0);
  const avg = graded.length ? (graded.reduce((s, z) => s + z.grade, 0) / graded.length).toFixed(2) : '—';
  return title('Зачётка', 'Средний балл ' + avg) +
    '<div class="ui-stack ui-stagger">' +
      card(rows(DEMO.zachetka.map((z) =>
        '<div class="ui-row">' +
          '<span class="ui-row-body"><span class="ui-row-title">' + esc(z.subject) + '</span>' +
          '<span class="ui-row-note">' + esc(z.form) + '</span></span>' +
          '<select class="ui-input" style="width:auto;min-width:92px" data-act="grade" data-arg="' + z.id + '">' +
            [0, 3, 4, 5].map((g) => '<option value="' + g + '"' + (g === z.grade ? ' selected' : '') + '>' + (g === 0 ? '—' : g) + '</option>').join('') +
          '</select>' +
        '</div>'))) +
      '<a class="ui-btn ui-btn-w ui-btn-ghost" href="#calc">' + ico('calc') + ' Калькулятор рейтинга</a>' +
    '</div>';
} };

// --- Калькулятор -------------------------------------------------------------
SCREENS.calc = { name: 'Калькулятор рейтинга', render: function () {
  const sum = DEMO.calc.reduce((s, g) => s + g.value, 0) + DEMO.calcExam;
  const max = DEMO.calc.reduce((s, g) => s + g.max, 0) + DEMO.calcExamMax;
  const pct = Math.round(sum / max * 100);
  const mark = pct >= 85 ? '5 — отлично' : pct >= 70 ? '4 — хорошо' : pct >= 55 ? '3 — удовлетворительно' : 'не хватает баллов';
  return title('Калькулятор рейтинга') +
    '<div class="ui-stack ui-stagger">' +
      card('<div style="padding:var(--space-5);text-align:center">' +
        '<div class="ui-num" style="font-size:52px">' + sum + '</div>' +
        '<div class="ui-num-cap">из ' + max + ' · ' + pct + '% · ' + mark + '</div></div>') +
      card('<div class="ui-card-head">Слагаемые</div>' +
        rows(DEMO.calc.map((g) =>
          '<div class="ui-row"><span class="ui-row-body"><span class="ui-row-title">' + esc(g.label) + '</span>' +
          '<span class="ui-row-note">максимум ' + g.max + '</span></span>' +
          '<input class="ui-input" style="width:84px" type="number" min="0" max="' + g.max + '" value="' + g.value + '" data-act="calcSet" data-arg="' + g.id + '">' +
          '<button type="button" class="ui-btn ui-btn-sm ui-btn-ghost" data-act="calcDel" data-arg="' + g.id + '" aria-label="Убрать">×</button>' +
          '</div>').concat([
          '<div class="ui-row"><span class="ui-row-body"><span class="ui-row-title">Экзамен</span>' +
          '<span class="ui-row-note">максимум ' + DEMO.calcExamMax + '</span></span>' +
          '<input class="ui-input" style="width:84px" type="number" min="0" max="' + DEMO.calcExamMax + '" value="' + DEMO.calcExam + '" data-act="calcExam">' +
          '</div>']))) +
      '<div class="ui-wrap">' +
        '<button type="button" class="ui-btn ui-btn-ghost" data-act="calcAdd">' + ico('plus') + ' Добавить</button>' +
        '<button type="button" class="ui-btn ui-btn-line" data-act="calcClear">Сбросить</button>' +
      '</div>' +
    '</div>';
} };

// --- Учёба: плитки -----------------------------------------------------------
SCREENS.study = { name: 'Учёба', render: function () {
  const d = dots();
  return title('Учёба') +
    '<div class="ui-tiles ui-stagger">' +
      tile({ s: 'zachetka',  n: 'Зачётка',           icon: 'zachetka',  note: 'оценки и средний балл' }) +
      tile({ s: 'calc',      n: 'Калькулятор',       icon: 'calc',      note: 'рейтинг по баллам' }) +
      tile({ s: 'deadlines', n: 'Дедлайны и зачёты', icon: 'deadlines', note: DEMO.deadlines.length + ' активных', dot: d.deadlines > 0 }) +
      tile({ s: 'teachers',  n: 'Преподаватели',     icon: 'teachers',  note: DEMO.teachers.length + ' человек' }) +
      tile({ s: 'group',     n: 'Статистика группы', icon: 'stats',     note: 'пропуски всей группы' }) +
    '</div>';
} };

// --- «Ещё» -------------------------------------------------------------------
SCREENS.more = { name: 'Ещё', render: function () {
  const d = dots();
  const groups = {};
  ALL_SECTIONS.forEach((x) => {
    if (x.admin && S.role !== 'admin') return;
    if (NAVS[S.nav].tabs.some((t) => t.s === x.s)) return;   // то, что уже в таб-баре, не дублируем
    (groups[x.grp] = groups[x.grp] || []).push(x);
  });
  return title('Ещё') + '<div class="ui-stack ui-stagger">' +
    Object.keys(groups).map((g) =>
      '<div><div class="ui-group-label">' + esc(g) + '</div>' +
      card(rows(groups[g].map((x) => row({
        href: '#' + x.s, icon: x.icon, title: x.n,
        dot: x.dot ? d[x.dot] > 0 : false
      })))) + '</div>').join('') +
    '</div>';
} };

// --- Профиль -----------------------------------------------------------------
SCREENS.profile = { name: 'Профиль', render: function () {
  const myHours = DEMO.absences.reduce((s, a) => s + a.hours, 0);
  const pending = DEMO.certs.filter((c) => c.who === DEMO.me.name && c.status === 'pending').length;
  const ava = DEMO.me.avatar
    ? '<img class="ui-ava" src="' + DEMO.me.avatar + '" alt="">'
    : '<span class="ui-ava">' + esc(DEMO.me.initials) + '</span>';

  return '<div class="ui-stack ui-stagger">' +
    card('<div style="padding:var(--space-5);display:flex;align-items:center;gap:var(--space-4)">' +
      '<button type="button" data-act="avatar" style="all:unset;cursor:pointer">' + ava + '</button>' +
      '<div class="ui-grow"><div style="font-size:var(--fs-h2);font-weight:700;color:var(--color-text)">' + esc(DEMO.me.name) + '</div>' +
      '<div class="ui-muted" style="font-size:var(--fs-caption)">' + esc(DEMO.group) + ' · № ' + DEMO.me.number + '</div></div></div>' +
      '<div style="padding:0 var(--space-4) var(--space-4)"><button type="button" class="ui-btn ui-btn-w ui-btn-ghost" data-act="avatar">Сменить фото</button></div>') +

    '<div><div class="ui-group-label">Учёба</div>' + card(rows([
      row({ href: '#absences', icon: 'absences', title: 'Мои пропуски', val: myHours + ' ч' }),
      row({ href: '#certs',    icon: 'certs',    title: 'Справки',      val: pending ? pending + ' на проверке' : 'все приняты' }),
      row({ href: '#standing', icon: 'standing', title: 'Место в группе' }),
      row({ href: '#pass',     icon: 'pass',     title: 'MarketPass' })
    ])) + '</div>' +

    '<div><div class="ui-group-label">Настройки</div>' + card(rows([
      row({ href: '#theme',   icon: 'theme',  title: 'Оформление',   val: THEME_NAMES[S.theme] }),
      row({ href: '#notify',  icon: 'notify', title: 'Уведомления',  val: 'включены' }),
      row({ href: '#account', icon: 'profile', title: 'Логин и пароль' }),
      row({ act: 'starosta',  icon: 'starosta', title: 'Написать старосте' }),
      row({ href: '#about',   icon: 'about',  title: 'История изменений', val: 'v' + DEMO.changelog[0].version })
    ])) + '</div>' +

    (S.role === 'admin' ? '<div><div class="ui-group-label">Админ</div>' + card(rows([
      row({ href: '#admin', icon: 'admin', title: 'Админ-панель' })
    ])) + '</div>' : '') +

    card(rows([ row({ act: 'logout', icon: 'logout', title: 'Выйти', chev: false }) ])) +
  '</div>';
} };

// --- Мои пропуски ------------------------------------------------------------
let absMonth = DEMO_TODAY.getMonth(), absYear = DEMO_TODAY.getFullYear();
SCREENS.absences = { name: 'Мои пропуски', render: function () {
  const total = DEMO.absences.reduce((s, a) => s + a.hours, 0);
  const cert = DEMO.absences.filter((a) => a.cert).reduce((s, a) => s + a.hours, 0);
  return title('Мои пропуски', total + ' ' + hoursWord(total) + ', из них по справке ' + cert) +
    '<div class="ui-stack ui-stagger">' +
      card('<div class="ui-card-head"><button type="button" class="ui-btn ui-btn-sm ui-btn-ghost" data-act="absMonth" data-arg="-1">‹</button>' +
        '<span class="ui-grow" style="text-align:center">' + MONTHS_N[absMonth] + ' ' + absYear + '</span>' +
        '<button type="button" class="ui-btn ui-btn-sm ui-btn-ghost" data-act="absMonth" data-arg="1">›</button></div>' +
        '<div style="padding:var(--space-3) var(--ui-card-pad, 0) var(--space-4)">' + calendarHTML(absYear, absMonth, 'abs') + '</div>') +
      card(rows(DEMO.absences.slice().sort((a, b) => b.date.localeCompare(a.date)).map((a) => row({
        icon: 'absences', title: a.subject, note: fmtDate(a.date), chev: false,
        val: a.hours + ' ч · ' + (a.cert ? 'по справке' : 'без справки')
      })))) +
    '</div>';
} };

// --- Справки -----------------------------------------------------------------
SCREENS.certs = { name: 'Справки', render: function () {
  const mine = DEMO.certs.filter((c) => c.who === DEMO.me.name);
  return title('Справки') +
    '<div class="ui-stack ui-stagger">' +
      card(rows(mine.map((c) => row({
        icon: 'certs', title: fmtDate(c.date), note: c.hours + ' ' + hoursWord(c.hours), chev: false,
        val: c.status === 'ok' ? 'принята' : 'на проверке'
      })))) +
      '<button type="button" class="ui-btn ui-btn-w ui-btn-ghost" data-act="toast" data-arg="В приложении откроется камера для фото справки">Добавить справку</button>' +
    '</div>';
} };

// --- MarketPass --------------------------------------------------------------
SCREENS.pass = { name: 'MarketPass', render: function () {
  return title('MarketPass') +
    '<div class="ui-stack ui-stagger">' +
      '<div class="ui-pass">' +
        '<div><div style="font-size:12px;opacity:.75">Пропуск студента</div>' +
        '<div style="font-size:20px;font-weight:700;margin-top:2px">' + esc(DEMO.me.name) + '</div></div>' +
        '<div class="ui-between"><div><div style="font-size:12px;opacity:.75">Группа</div><div style="font-weight:600">' + esc(DEMO.group) + '</div></div>' +
        '<div style="text-align:right"><div style="font-size:12px;opacity:.75">Номер</div><div style="font-weight:600">' + esc(DEMO.me.studakNumber) + '</div></div></div>' +
      '</div>' +
      '<button type="button" class="ui-btn ui-btn-w" data-act="toast" data-arg="Появится QR-код, действует 60 секунд">Показать QR-код</button>' +
      '<button type="button" class="ui-btn ui-btn-w ui-btn-ghost" data-act="toast" data-arg="Откроется камера для проверки чужого пропуска">Проверить пропуск</button>' +
      '<p class="ui-muted" style="font-size:var(--fs-small);line-height:1.5">Карта переворачивается нажатием, слегка наклоняется за движением телефона. QR живёт 60 секунд и обновляется сам.</p>' +
    '</div>';
} };

// --- Настройки (общая страница для варианта 3) -------------------------------
SCREENS.settings = { name: 'Настройки', render: function () {
  return title('Настройки') + '<div class="ui-stack ui-stagger">' +
    card(rows([
      row({ href: '#theme',   icon: 'theme',   title: 'Оформление',       val: THEME_NAMES[S.theme] }),
      row({ href: '#notify',  icon: 'notify',  title: 'Уведомления',      val: 'включены' }),
      row({ href: '#account', icon: 'profile', title: 'Логин и пароль' }),
      row({ act: 'starosta',  icon: 'starosta', title: 'Написать старосте' }),
      row({ href: '#about',   icon: 'about',   title: 'История изменений', val: 'v' + DEMO.changelog[0].version })
    ])) +
    (S.role === 'admin' ? card(rows([ row({ href: '#admin', icon: 'admin', title: 'Админ-панель' }) ])) : '') +
    card(rows([ row({ act: 'logout', icon: 'logout', title: 'Выйти', chev: false }) ])) +
  '</div>';
} };

// --- Оформление --------------------------------------------------------------
SCREENS.theme = { name: 'Оформление', render: function () {
  return title('Оформление') + '<div class="ui-stack ui-stagger">' +
    '<div><div class="ui-group-label">Тема</div>' + card(rows(
      Object.keys(THEME_NAMES).map((k) => row({
        act: 'setTheme', arg: k, title: THEME_NAMES[k], chev: false,
        val: S.theme === k ? '✓' : ''
      })))) + '</div>' +
    '<div><div class="ui-group-label">Палитра</div>' + card(rows(
      GAMMAS.map((g) => '<button type="button" class="ui-row" data-act="setGamma" data-arg="' + g.id + '">' +
        '<span class="ui-row-ico" style="background:' + g.accent + '"></span>' +
        '<span class="ui-row-body"><span class="ui-row-title">' + esc(g.name) + '</span></span>' +
        (S.gamma === g.id ? '<span class="ui-row-val">✓</span>' : '') + '</button>'))) + '</div>' +
  '</div>';
} };

// --- Уведомления -------------------------------------------------------------
SCREENS.notify = { name: 'Уведомления', render: function () {
  return title('Уведомления') + '<div class="ui-stack ui-stagger">' +
    card(rows([
      row({ act: 'toast', arg: 'Push включены для этого устройства', icon: 'notify', title: 'Push в браузере', val: 'включены', chev: false }),
      row({ act: 'toast', arg: 'Бот напишет за день до дедлайна',    icon: 'news',   title: 'Telegram-бот',    val: 'включён',  chev: false }),
      row({ act: 'toast', arg: 'Напоминание придёт утром в день пары', icon: 'schedule', title: 'Напоминание о ДЗ', val: 'за 1 день', chev: false })
    ])) +
    '<p class="ui-muted" style="font-size:var(--fs-small);line-height:1.5">В демо переключатели только показывают текст — ничего не подписывается и не отправляется.</p>' +
  '</div>';
} };

// --- Логин и пароль ----------------------------------------------------------
SCREENS.account = { name: 'Логин и пароль', render: function () {
  return title('Логин и пароль') + '<div class="ui-stack ui-stagger">' +
    card('<div style="padding:var(--space-4)">' +
      '<label class="ui-label" for="acLogin">Логин</label><input class="ui-input" id="acLogin" value="' + esc(DEMO.me.login) + '">' +
      '<label class="ui-label" for="acPass">Новый пароль</label><input class="ui-input" id="acPass" type="password" placeholder="не меньше 8 символов">' +
      '<button type="button" class="ui-btn ui-btn-w" style="margin-top:var(--space-4)" data-act="toast" data-arg="В демо пароль не меняется">Сохранить</button>' +
      '</div>') +
  '</div>';
} };

// --- История изменений -------------------------------------------------------
SCREENS.about = { name: 'История изменений', render: function () {
  return title('История изменений', 'Версия ' + DEMO.changelog[0].version) +
    '<div class="ui-stack ui-stagger">' +
      DEMO.changelog.map((c) => card('<div style="padding:var(--space-4)">' +
        '<div class="ui-between" style="margin-bottom:8px"><span style="font-weight:700;color:var(--color-text)">Версия ' + esc(c.version) + '</span>' +
        '<span class="ui-muted" style="font-size:var(--fs-small)">' + esc(c.date) + '</span></div>' +
        '<ul style="margin:0;padding-left:18px;color:var(--color-text-secondary);font-size:var(--fs-caption);line-height:1.6">' +
        c.items.map((i) => '<li>' + esc(i) + '</li>').join('') + '</ul></div>')).join('') +
      '<button type="button" class="ui-btn ui-btn-w ui-btn-ghost" data-act="whatsNew">Показать «Что нового»</button>' +
    '</div>';
} };

// --- Вход --------------------------------------------------------------------
SCREENS.login = { name: 'Вход', render: function () {
  return '<div style="padding-top:var(--space-8)">' +
    title('Вход в кабинет', 'Личные разделы доступны после входа') +
    '<div class="ui-stack ui-stagger">' +
      card('<div style="padding:var(--space-4)">' +
        '<label class="ui-label" for="lgLogin">Логин</label><input class="ui-input" id="lgLogin" placeholder="фамилия и инициалы">' +
        '<label class="ui-label" for="lgPass">Пароль</label><input class="ui-input" id="lgPass" type="password" placeholder="пароль">' +
        '<button type="button" class="ui-btn ui-btn-w" style="margin-top:var(--space-4)" data-act="login">Войти</button>' +
        '</div>') +
      card('<div style="padding:var(--space-4)">' +
        '<div style="font-weight:600;color:var(--color-text);margin-bottom:6px">Первый раз?</div>' +
        '<p class="ui-muted" style="font-size:var(--fs-caption);line-height:1.5;margin:0 0 12px">Возьмите код-приглашение у старосты и создайте аккаунт.</p>' +
        '<button type="button" class="ui-btn ui-btn-w ui-btn-ghost" data-act="login">Ввести код</button></div>') +
    '</div></div>';
} };

// --- Админ-панель ------------------------------------------------------------
SCREENS.admin = { name: 'Админ-панель', render: function () {
  const pending = DEMO.certs.filter((c) => c.status === 'pending');
  return title('Админ-панель', 'Быстрые действия — на кнопке «+»') +
    '<div class="ui-stack ui-stagger">' +
      '<div><div class="ui-group-label">Пропуски</div>' + card(rows([
        row({ act: 'absOne',   icon: 'plus',     title: 'Внести пропуски', note: 'одному студенту' }),
        row({ act: 'absGroup', icon: 'group',    title: 'Внести группой',  note: 'нескольким сразу' }),
        row({ act: 'absManage', icon: 'absences', title: 'Удалить пропуски', note: 'по дате или предмету' })
      ])) + '</div>' +
      '<div><div class="ui-group-label">Справки</div>' + card(rows([
        row({ act: 'certsAdmin', icon: 'certs', title: 'Подтверждение справок', val: pending.length + ' ждут' })
      ])) + '</div>' +
      '<div><div class="ui-group-label">Содержимое</div>' + card(rows([
        row({ act: 'newsForm',    icon: 'news',      title: 'Объявления' }),
        row({ act: 'dlForm',      icon: 'deadlines', title: 'Дедлайны и зачёты' }),
        row({ act: 'hwForm',      icon: 'schedule',  title: 'Домашка' }),
        row({ act: 'teacherForm', icon: 'teachers',  title: 'Преподаватели' }),
        row({ act: 'studentForm', icon: 'group',     title: 'Студенты' })
      ])) + '</div>' +
      '<div><div class="ui-group-label">Выгрузки</div>' + card(rows([
        row({ act: 'report', icon: 'report', title: 'Отчёт для деканата', note: 'xlsx и CSV' }),
        row({ act: 'backup', icon: 'backup', title: 'Резервная копия',    note: 'скачать data.json' })
      ])) + '</div>' +
      card(rows([ row({ act: 'logoutAdmin', icon: 'logout', title: 'Выйти из админки', chev: false }) ])) +
    '</div>';
} };

// ===== Отрисовка =============================================================
function render() {
  applyLook();

  // Доступ
  let screen = S.screen;
  if (!SCREENS[screen]) screen = NAVS[S.nav].tabs[0].s;
  if (!allowed(screen)) screen = NAVS[S.nav].tabs[0].s;
  const showLogin = needsLogin(screen);

  // Сегменты (вариант 3)
  const segs = NAVS[S.nav].segments;
  let segHTML = '';
  if (segs) {
    const hostTab = HOST[S.nav][screen] || screen;
    const list = segs[hostTab];
    if (list) {
      segHTML = '<div class="ui-seg" role="tablist">' + list.map((x) =>
        '<button type="button" class="ui-seg-item' + (x.s === screen ? ' is-on' : '') + '" data-go="' + x.s + '" role="tab">' +
        esc(x.n) + (x.s === 'news' && dots().news ? ' •' : '') + (x.s === 'deadlines' && dots().deadlines ? ' •' : '') +
        '</button>').join('') + '</div>';
    }
  }

  const def = SCREENS[showLogin ? 'login' : screen];
  $('headTitle').textContent = showLogin ? 'Вход' : def.name;
  $('view').innerHTML = segHTML + '<div class="ui-view-enter">' + def.render() + '</div>';
  $('view').scrollTop = 0;
  window.scrollTo(0, 0);

  renderTabs();

  // Колокольчик и точка
  $('bellDot').hidden = dots().news === 0;

  // Кнопка «+» только у админа
  $('fab').hidden = S.role !== 'admin';
  $('fab').classList.remove('is-open');

  syncBack();
  renderPanel();
  syncPanelHeight();
}

// ===== Быстрое меню «+» ======================================================
function openFab() {
  haptic('medium');
  $('fab').classList.add('is-open');
  const close = openSheet('Быстрые действия',
    rows([
      row({ act: 'absOne',   icon: 'plus',      title: 'Внести пропуски',  note: 'одному студенту' }),
      row({ act: 'absGroup', icon: 'group',     title: 'Внести группой',   note: 'нескольким сразу' }),
      row({ act: 'newsForm', icon: 'news',      title: 'Объявление' }),
      row({ act: 'dlForm',   icon: 'deadlines', title: 'Дедлайн или зачёт' }),
      row({ act: 'report',   icon: 'report',    title: 'Отчёт для деканата' })
    ]) +
    '<a class="ui-btn ui-btn-w ui-btn-ghost" href="#admin" style="margin-top:var(--space-4)" data-close-after>Вся админ-панель</a>');
  const t = setInterval(() => { if (!document.querySelector('.ui-sheet.is-on')) { $('fab').classList.remove('is-open'); clearInterval(t); } }, 200);
}

// ===== Боковое меню с поиском (вариант 4) ====================================
function openDrawer() {
  const wrap = document.createElement('div');
  const items = ALL_SECTIONS.filter((x) => !(x.admin && S.role !== 'admin'));
  const groups = {};
  items.forEach((x) => { (groups[x.grp] = groups[x.grp] || []).push(x); });
  const listHTML = Object.keys(groups).map((g) =>
    '<div data-grp><div class="ui-group-label">' + esc(g) + '</div>' +
    '<div class="ui-rows">' + groups[g].map((x) =>
      '<a class="ui-row" href="#' + x.s + '" data-name="' + esc(x.n.toLowerCase()) + '">' +
      '<span class="ui-row-ico">' + ico(x.icon) + '</span>' +
      '<span class="ui-row-body"><span class="ui-row-title">' + esc(x.n) + '</span></span>' +
      (x.dot && dots()[x.dot] ? '<span class="ui-dot"></span>' : '') + '</a>').join('') +
    '</div></div>').join('');

  wrap.innerHTML = '<div class="ui-scrim"></div><aside class="ui-drawer" role="dialog" aria-modal="true" aria-label="Разделы">' +
    '<input class="ui-drawer-search" type="search" placeholder="Поиск раздела" aria-label="Поиск раздела" id="drawerSearch">' +
    '<div id="drawerList">' + listHTML + '</div></aside>';
  const scrim = wrap.querySelector('.ui-scrim');
  const drawer = wrap.querySelector('.ui-drawer');
  $('layers').appendChild(wrap);
  requestAnimationFrame(() => { scrim.classList.add('is-on'); drawer.classList.add('is-on'); });

  const close = () => {
    scrim.classList.remove('is-on'); drawer.classList.remove('is-on');
    setTimeout(() => wrap.remove(), 320);
    openLayers = openLayers.filter((l) => l !== close);
    syncBack();
  };
  openLayers.push(close);
  scrim.addEventListener('click', close);
  drawer.addEventListener('click', (e) => { if (e.target.closest('a.ui-row')) close(); });
  wrap.querySelector('#drawerSearch').addEventListener('input', function () {
    const q = this.value.trim().toLowerCase();
    wrap.querySelectorAll('#drawerList a.ui-row').forEach((a) => {
      a.hidden = q !== '' && a.dataset.name.indexOf(q) === -1;
    });
    wrap.querySelectorAll('[data-grp]').forEach((g) => {
      g.hidden = !g.querySelector('a.ui-row:not([hidden])');
    });
  });
  syncBack();
}

// ===== Формы и сообщения =====================================================
function toast(text) {
  const el = document.createElement('div');
  el.textContent = text;
  el.style.cssText = 'position:fixed;left:50%;transform:translateX(-50%);bottom:calc(var(--app-inset-bottom) + 150px);' +
    'z-index:70;max-width:min(92vw,420px);padding:12px 18px;border-radius:14px;background:var(--color-surface-4);' +
    'color:var(--color-text);font:500 14px/1.4 var(--font-sans);box-shadow:0 10px 30px rgba(0,0,0,.3);text-align:center';
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 2600);
}

function studentPicker(label) {
  return '<label class="ui-label" for="fStudent">' + label + '</label>' +
    '<select class="ui-input" id="fStudent">' + DEMO.students.map((s) => '<option value="' + s.id + '">' + esc(s.name) + '</option>').join('') + '</select>';
}
function subjectPicker() {
  return '<label class="ui-label" for="fSubject">Предмет</label>' +
    '<select class="ui-input" id="fSubject">' + DEMO.subjects.map((s) => '<option>' + esc(s) + '</option>').join('') + '</select>';
}

const FORMS = {
  absOne: () => openSheet('Внести пропуски',
    studentPicker('Студент') + subjectPicker() +
    '<label class="ui-label" for="fDate">Дата</label><input class="ui-input" id="fDate" type="date" value="' + iso(DEMO_TODAY) + '">' +
    '<label class="ui-label" for="fHours">Часы</label>' +
    '<div class="ui-wrap" style="margin-bottom:8px">' + [2, 4, 6, 8].map((h) => '<button type="button" class="ui-chip" data-hours="' + h + '">' + h + '</button>').join('') + '</div>' +
    '<input class="ui-input" id="fHours" type="number" value="2" min="1">' +
    '<label style="display:flex;align-items:center;gap:8px;margin-top:14px"><input type="checkbox" id="fCert"> <span>По справке</span></label>' +
    '<button type="button" class="ui-btn ui-btn-w" style="margin-top:var(--space-4)" data-save="absOne">Сохранить</button>',
    (sheet, close) => {
      sheet.querySelectorAll('[data-hours]').forEach((b) => b.addEventListener('click', () => { sheet.querySelector('#fHours').value = b.dataset.hours; }));
      sheet.querySelector('[data-save]').addEventListener('click', () => {
        const id = sheet.querySelector('#fStudent').value;
        const h = +sheet.querySelector('#fHours').value || 0;
        const st = DEMO.students.filter((s) => s.id === id)[0];
        if (st) { st.hours += h; if (sheet.querySelector('#fCert').checked) st.cert += h; }
        if (id === DEMO.me.id) DEMO.absences.push({ id: 'a' + Date.now(), date: sheet.querySelector('#fDate').value, subject: sheet.querySelector('#fSubject').value, hours: h, cert: sheet.querySelector('#fCert').checked });
        close(); render(); toast('Записано: ' + st.name + ', ' + h + ' ' + hoursWord(h));
      });
    }),

  absGroup: () => openSheet('Внести группой',
    subjectPicker() +
    '<label class="ui-label" for="fDate">Дата</label><input class="ui-input" id="fDate" type="date" value="' + iso(DEMO_TODAY) + '">' +
    '<label class="ui-label" for="fHours">Часы</label><input class="ui-input" id="fHours" type="number" value="2" min="1">' +
    '<div class="ui-label">Кого отметить</div>' +
    '<div class="ui-wrap" style="margin-bottom:8px"><button type="button" class="ui-btn ui-btn-sm ui-btn-ghost" data-all="1">Все</button>' +
    '<button type="button" class="ui-btn ui-btn-sm ui-btn-ghost" data-all="0">Никого</button></div>' +
    '<div class="ui-rows">' + DEMO.students.map((s) =>
      '<label class="ui-row"><input type="checkbox" class="gstud" value="' + s.id + '">' +
      '<span class="ui-row-body"><span class="ui-row-title">' + esc(s.name) + '</span></span></label>').join('') + '</div>' +
    '<button type="button" class="ui-btn ui-btn-w" style="margin-top:var(--space-4)" data-save="absGroup">Сохранить</button>',
    (sheet, close) => {
      sheet.querySelectorAll('[data-all]').forEach((b) => b.addEventListener('click', () => {
        sheet.querySelectorAll('.gstud').forEach((c) => { c.checked = b.dataset.all === '1'; });
      }));
      sheet.querySelector('[data-save]').addEventListener('click', () => {
        const h = +sheet.querySelector('#fHours').value || 0;
        let n = 0;
        sheet.querySelectorAll('.gstud:checked').forEach((c) => {
          const st = DEMO.students.filter((s) => s.id === c.value)[0];
          if (st) { st.hours += h; n++; }
        });
        close(); render(); toast(n ? 'Отмечено студентов: ' + n : 'Никто не выбран');
      });
    }),

  absManage: () => openSheet('Удалить пропуски',
    '<p class="ui-muted" style="font-size:var(--fs-caption);line-height:1.5">Выберите, что убрать. В демо меняются только числа в таблице.</p>' +
    rows(DEMO.absences.map((a) => row({ act: 'absDel', arg: a.id, icon: 'absences', title: a.subject, note: fmtDate(a.date) + ' · ' + a.hours + ' ч', chev: false })))),

  newsForm: () => openSheet('Объявление',
    '<label class="ui-label" for="fTitle">Заголовок</label><input class="ui-input" id="fTitle" placeholder="Коротко о главном">' +
    '<label class="ui-label" for="fText">Текст</label><textarea class="ui-input" id="fText" rows="4"></textarea>' +
    '<label class="ui-label" for="fTarget">Кому</label><select class="ui-input" id="fTarget"><option value="ALL">Всей группе</option><option value="ME">Выбранным студентам</option></select>' +
    '<button type="button" class="ui-btn ui-btn-w" style="margin-top:var(--space-4)" data-save="news">Опубликовать</button>',
    (sheet, close) => sheet.querySelector('[data-save]').addEventListener('click', () => {
      const t = sheet.querySelector('#fTitle').value.trim() || 'Без заголовка';
      DEMO.announcements.unshift({ id: 'n' + Date.now(), date: iso(DEMO_TODAY), target: sheet.querySelector('#fTarget').value, title: t, text: sheet.querySelector('#fText').value.trim() || '—' });
      close(); render(); toast('Объявление опубликовано');
    })),

  dlForm: (id) => {
    const ex = DEMO.deadlines.filter((d) => d.id === id)[0];
    return openSheet(ex ? 'Изменить дедлайн' : 'Дедлайн или зачёт',
      '<label class="ui-label" for="fTitle">Название</label><input class="ui-input" id="fTitle" value="' + esc(ex ? ex.title : '') + '">' +
      subjectPicker() +
      '<label class="ui-label" for="fDate">Дата</label><input class="ui-input" id="fDate" type="date" value="' + esc(ex ? ex.date : iso(DEMO_TODAY)) + '">' +
      '<label class="ui-label" for="fKind">Что это</label><select class="ui-input" id="fKind"><option value="task">Задание</option><option value="zachet"' + (ex && ex.kind === 'zachet' ? ' selected' : '') + '>Зачёт</option></select>' +
      '<button type="button" class="ui-btn ui-btn-w" style="margin-top:var(--space-4)" data-save="dl">Сохранить</button>',
      (sheet, close) => sheet.querySelector('[data-save]').addEventListener('click', () => {
        const o = { title: sheet.querySelector('#fTitle').value.trim() || 'Без названия', subject: sheet.querySelector('#fSubject').value, date: sheet.querySelector('#fDate').value, kind: sheet.querySelector('#fKind').value };
        if (ex) Object.assign(ex, o); else DEMO.deadlines.push(Object.assign({ id: 'd' + Date.now() }, o));
        close(); render(); toast('Сохранено');
      }));
  },

  hwForm: () => openSheet('Домашнее задание',
    subjectPicker() +
    '<label class="ui-label" for="fDue">Срок</label><input class="ui-input" id="fDue" type="date" value="' + iso(DEMO_TODAY) + '">' +
    '<label class="ui-label" for="fText">Задание</label><textarea class="ui-input" id="fText" rows="4"></textarea>' +
    '<button type="button" class="ui-btn ui-btn-w" style="margin-top:var(--space-4)" data-save="hw">Сохранить</button>',
    (sheet, close) => sheet.querySelector('[data-save]').addEventListener('click', () => {
      DEMO.homework.push({ id: 'h' + Date.now(), subject: sheet.querySelector('#fSubject').value, due: sheet.querySelector('#fDue').value, text: sheet.querySelector('#fText').value.trim() || '—' });
      close(); render(); toast('Домашка добавлена');
    })),

  teacherForm: (id) => {
    const ex = DEMO.teachers.filter((t) => t.id === id)[0];
    return openSheet(ex ? 'Изменить преподавателя' : 'Преподаватель',
      '<label class="ui-label" for="fName">ФИО</label><input class="ui-input" id="fName" value="' + esc(ex ? ex.name : '') + '">' +
      subjectPicker() +
      '<label class="ui-label" for="fRoom">Аудитория</label><input class="ui-input" id="fRoom" value="' + esc(ex ? ex.room : '') + '">' +
      '<label class="ui-label" for="fTg">Telegram</label><input class="ui-input" id="fTg" value="' + esc(ex ? ex.tg : '') + '">' +
      '<button type="button" class="ui-btn ui-btn-w" style="margin-top:var(--space-4)" data-save="t">Сохранить</button>',
      (sheet, close) => sheet.querySelector('[data-save]').addEventListener('click', () => {
        const o = { name: sheet.querySelector('#fName').value.trim() || 'Без имени', subject: sheet.querySelector('#fSubject').value, room: sheet.querySelector('#fRoom').value, tg: sheet.querySelector('#fTg').value };
        if (ex) Object.assign(ex, o); else DEMO.teachers.push(Object.assign({ id: 't' + Date.now(), note: '' }, o));
        close(); render(); toast('Сохранено');
      }));
  },

  studentForm: () => openSheet('Студенты',
    rows(DEMO.students.map((s) => row({ act: 'toast', arg: 'Откроется карточка: ' + s.name, icon: 'profile', title: s.name, note: '№ ' + s.number + ' · ' + s.hours + ' ч' }))) +
    '<button type="button" class="ui-btn ui-btn-w" style="margin-top:var(--space-4)" data-act="toast" data-arg="Форма добавления студента">Добавить студента</button>'),

  certsAdmin: () => openSheet('Подтверждение справок',
    rows(DEMO.certs.map((c) => row({
      act: 'certOk', arg: c.id, icon: 'certs', title: c.who,
      note: fmtDate(c.date) + ' · ' + c.hours + ' ' + hoursWord(c.hours),
      val: c.status === 'ok' ? 'принята' : 'принять', chev: false
    })))),

  report: () => openSheet('Отчёт для деканата',
    '<label class="ui-label" for="fFrom">С</label><input class="ui-input" id="fFrom" type="date" value="2026-09-01">' +
    '<label class="ui-label" for="fTo">По</label><input class="ui-input" id="fTo" type="date" value="' + iso(DEMO_TODAY) + '">' +
    '<div class="ui-wrap" style="margin-top:var(--space-4)">' +
    '<button type="button" class="ui-btn" data-act="toast" data-arg="В приложении скачается .xlsx">Скачать xlsx</button>' +
    '<button type="button" class="ui-btn ui-btn-ghost" data-act="toast" data-arg="В приложении скачается .csv">Скачать CSV</button></div>'),

  backup: () => openSheet('Резервная копия',
    '<p class="ui-muted" style="font-size:var(--fs-caption);line-height:1.5">В приложении отсюда скачивается data.json и сохраняется копия в GitHub. В демо ничего не отправляется.</p>' +
    '<button type="button" class="ui-btn ui-btn-w" style="margin-top:var(--space-4)" data-act="toast" data-arg="Файл скачался бы сейчас">Скачать data.json</button>'),

  filter: () => openSheet('Фильтр по предметам',
    '<div class="ui-rows">' + DEMO.subjects.map((s) =>
      '<label class="ui-row"><input type="checkbox" class="fsub" value="' + esc(s) + '"' + (grpSubjects.indexOf(s) !== -1 ? ' checked' : '') + '>' +
      '<span class="ui-row-body"><span class="ui-row-title">' + esc(s) + '</span></span></label>').join('') + '</div>' +
    '<div class="ui-wrap" style="margin-top:var(--space-4)">' +
    '<button type="button" class="ui-btn ui-grow" data-save="f">Применить</button>' +
    '<button type="button" class="ui-btn ui-btn-ghost" data-clear="1">Сбросить</button></div>',
    (sheet, close) => {
      sheet.querySelector('[data-clear]').addEventListener('click', () => { grpSubjects = []; close(); render(); });
      sheet.querySelector('[data-save]').addEventListener('click', () => {
        grpSubjects = Array.prototype.map.call(sheet.querySelectorAll('.fsub:checked'), (c) => c.value);
        close(); render(); toast(grpSubjects.length ? 'Фильтр: ' + grpSubjects.length : 'Фильтр снят');
      });
    }),

  sort: () => openSheet('Сортировка',
    rows([
      row({ act: 'sortSet', arg: 'hours', title: 'По часам',     val: grpSort === 'hours' ? '✓' : '', chev: false }),
      row({ act: 'sortSet', arg: 'cert',  title: 'По справкам',  val: grpSort === 'cert'  ? '✓' : '', chev: false }),
      row({ act: 'sortSet', arg: 'name',  title: 'По фамилии',   val: grpSort === 'name'  ? '✓' : '', chev: false }),
      row({ act: 'sortDir', title: grpDesc ? 'Сначала больше' : 'Сначала меньше', chev: false })
    ])),

  starosta: () => openSheet('Написать старосте',
    rows(DEMO.starostaList.map((p) => row({
      act: 'toast', arg: 'Откроется чат ' + p.tg, icon: 'starosta', title: p.name, note: p.role, val: p.tg
    })))),

  whatsNew: () => {
    const c = DEMO.changelog[0];
    return openSheet('Что нового в версии ' + c.version,
      '<ul style="margin:0 0 var(--space-4);padding-left:18px;color:var(--color-text-2);font-size:var(--fs-body);line-height:1.7">' +
      c.items.map((i) => '<li>' + esc(i) + '</li>').join('') + '</ul>' +
      '<button type="button" class="ui-btn ui-btn-w" data-act="closeTop">Понятно</button>');
  },

  lesson: (arg) => {
    const p = String(arg).split(':');
    const day = +p[0], pair = +p[1];
    const l = lessonsOf(day).filter((x) => x.pair === pair)[0];
    if (!l) return;
    const hw = hwFor(l.subject);
    const key = doneKey(l, day);
    return openSheet(l.subject,
      '<div class="ui-wrap" style="margin-bottom:var(--space-4)">' +
        '<span class="ui-badge ui-type-' + l.type + '">' + (l.type === 'lecture' ? 'Лекция' : l.type === 'lab' ? 'Лаба' : 'Практика') + '</span>' +
        '<span class="ui-badge ui-badge-mut">' + l.from + '–' + l.to + '</span>' +
        '<span class="ui-badge ui-badge-mut">ауд. ' + esc(l.room) + '</span></div>' +
      card(rows([
        row({ title: 'Преподаватель', val: teacherName(l.teacher), chev: false }),
        row({ title: 'День', val: WDAYS_FULL[day], chev: false }),
        row({ title: 'Пара', val: l.pair + '-я', chev: false })
      ])) +
      (hw ? '<div style="margin-top:var(--space-4)"><div class="ui-group-label">Домашнее задание</div>' +
        card('<div style="padding:var(--space-4)"><div class="ui-muted" style="font-size:var(--fs-caption);line-height:1.5">' + esc(hw.text) + '</div>' +
        '<div class="ui-muted" style="font-size:var(--fs-small);margin-top:8px">Срок: ' + fmtDate(hw.due) + '</div></div>') + '</div>' : '') +
      '<button type="button" class="ui-btn ui-btn-w ' + (DEMO.done[key] ? 'ui-btn-ghost' : '') + '" style="margin-top:var(--space-4)" data-act="done" data-arg="' + esc(key) + '">' +
      (DEMO.done[key] ? ico('check') + ' Сделано' : 'Отметить «Сделано»') + '</button>' +
      '<a class="ui-btn ui-btn-w ui-btn-line" style="margin-top:8px" href="#teachers">Карточка преподавателя</a>');
  },

  student: (id) => {
    const s = DEMO.students.filter((x) => x.id === id)[0];
    if (!s) return;
    return openSheet(s.name,
      card(rows([
        row({ title: 'Номер в журнале', val: String(s.number), chev: false }),
        row({ title: 'Часов пропусков', val: String(s.hours), chev: false }),
        row({ title: 'Из них по справке', val: String(s.cert), chev: false }),
        row({ title: 'Без справки', val: String(s.hours - s.cert), chev: false })
      ])) +
      (S.role === 'admin' ? '<div class="ui-wrap" style="margin-top:var(--space-4)">' +
        '<button type="button" class="ui-btn ui-btn-sm" data-act="absOne">Внести пропуск</button>' +
        '<button type="button" class="ui-btn ui-btn-sm ui-btn-ghost" data-act="toast" data-arg="История изменений студента">История</button>' +
        '<button type="button" class="ui-btn ui-btn-sm ui-btn-line" data-act="toast" data-arg="Форма правки студента">Изменить</button></div>' : ''));
  },

  calDay: (key) => {
    const abs = DEMO.absences.filter((a) => a.date === key);
    const dl = DEMO.deadlines.filter((d) => d.date === key);
    if (!abs.length && !dl.length) { toast(fmtDate(key) + ' — ничего нет'); return; }
    return openSheet(fmtDate(key),
      (abs.length ? '<div class="ui-group-label">Пропуски</div>' + card(rows(abs.map((a) => row({ title: a.subject, val: a.hours + ' ч', chev: false, note: a.cert ? 'по справке' : 'без справки' })))) : '') +
      (dl.length ? '<div class="ui-group-label" style="margin-top:var(--space-4)">Дедлайны</div>' + card(rows(dl.map((d) => row({ title: d.title, note: d.subject, chev: false })))) : ''));
  },

  avatar: () => openSheet('Фото профиля',
    '<p class="ui-muted" style="font-size:var(--fs-caption);line-height:1.5">В приложении открывается камера или галерея, фото обрезается в квадрат и уходит в хранилище. В демо — просто пример.</p>' +
    '<div class="ui-wrap" style="margin-top:var(--space-4)">' +
    '<button type="button" class="ui-btn" data-act="toast" data-arg="Откроется галерея">Выбрать фото</button>' +
    '<button type="button" class="ui-btn ui-btn-line" data-act="avaReset">Убрать фото</button></div>')
};

// ===== Действия ==============================================================
const ACTIONS = {
  day: (v) => { schedDay = +v; render(); },
  done: (key) => { DEMO.done[key] = !DEMO.done[key]; haptic('medium'); closeTopLayer(); render(); toast(DEMO.done[key] ? 'Отмечено «Сделано»' : 'Отметка снята'); },
  lesson: (a) => FORMS.lesson(a),
  student: (a) => FORMS.student(a),
  filter: () => FORMS.filter(),
  sort: () => FORMS.sort(),
  sortSet: (v) => { grpSort = v; closeTopLayer(); render(); },
  sortDir: () => { grpDesc = !grpDesc; closeTopLayer(); render(); },
  dlMonth: (v) => { dlMonth += +v; if (dlMonth < 0) { dlMonth = 11; dlYear--; } if (dlMonth > 11) { dlMonth = 0; dlYear++; } render(); },
  absMonth: (v) => { absMonth += +v; if (absMonth < 0) { absMonth = 11; absYear--; } if (absMonth > 11) { absMonth = 0; absYear++; } render(); },
  calDay: (v) => FORMS.calDay(v),
  grade: null,  // обрабатывается на change
  calcAdd: () => { DEMO.calc.push({ id: 'g' + Date.now(), label: 'Новое слагаемое', value: 0, max: 10 }); render(); },
  calcDel: (id) => { DEMO.calc = DEMO.calc.filter((g) => g.id !== id); render(); },
  calcClear: () => { DEMO.calc.forEach((g) => { g.value = 0; }); DEMO.calcExam = 0; render(); toast('Сброшено'); },
  setTheme: (v) => { S.theme = v; writeURL(true); render(); },
  setGamma: (v) => { S.gamma = v; writeURL(true); render(); },
  starosta: () => FORMS.starosta(),
  whatsNew: () => FORMS.whatsNew(),
  avatar: () => FORMS.avatar(),
  avaReset: () => { DEMO.me.avatar = null; closeTopLayer(); render(); toast('Фото убрано'); },
  login: () => { S.role = 'student'; writeURL(true); render(); toast('Вход выполнен — роль «студент»'); },
  logout: () => { S.role = 'guest'; S.screen = NAVS[S.nav].tabs[0].s; S.sub = ''; writeURL(true); render(); toast('Вы вышли — роль «гость»'); },
  logoutAdmin: () => { S.role = 'student'; S.screen = NAVS[S.nav].tabs[0].s; writeURL(true); render(); toast('Админка выключена'); },
  absOne: () => { closeTopLayer(); FORMS.absOne(); },
  absGroup: () => { closeTopLayer(); FORMS.absGroup(); },
  absManage: () => FORMS.absManage(),
  absDel: (id) => { DEMO.absences = DEMO.absences.filter((a) => a.id !== id); closeTopLayer(); render(); toast('Пропуск удалён'); },
  newsForm: () => { closeTopLayer(); FORMS.newsForm(); },
  newsDel: (id) => { DEMO.announcements = DEMO.announcements.filter((n) => n.id !== id); render(); toast('Объявление удалено'); },
  dlForm: (id) => { closeTopLayer(); FORMS.dlForm(id); },
  dlDel: (id) => { DEMO.deadlines = DEMO.deadlines.filter((d) => d.id !== id); render(); toast('Удалено'); },
  hwForm: () => { closeTopLayer(); FORMS.hwForm(); },
  teacherForm: (id) => { closeTopLayer(); FORMS.teacherForm(id); },
  studentForm: () => FORMS.studentForm(),
  certsAdmin: () => FORMS.certsAdmin(),
  certOk: (id) => { const c = DEMO.certs.filter((x) => x.id === id)[0]; if (c) c.status = 'ok'; closeTopLayer(); render(); toast('Справка принята'); },
  report: () => { closeTopLayer(); FORMS.report(); },
  backup: () => FORMS.backup(),
  toast: (t) => toast(t || 'Готово'),
  closeTop: () => closeTopLayer()
};

// ===== События ===============================================================
document.addEventListener('click', (e) => {
  const closeAfter = e.target.closest('[data-close-after]');
  if (closeAfter) closeTopLayer();

  const goEl = e.target.closest('[data-go]');
  if (goEl) { go(goEl.dataset.go); return; }

  const actEl = e.target.closest('[data-act]');
  if (actEl) {
    const name = actEl.dataset.act;
    if (ACTIONS[name]) { e.preventDefault(); haptic('light'); ACTIONS[name](actEl.dataset.arg); return; }
  }

  const link = e.target.closest('a[href^="#"]');
  if (link) {
    const h = link.getAttribute('href').slice(1).split('/');
    if (SCREENS[h[0]]) { e.preventDefault(); go(h[0], h[1]); }
  }
});

// Поля ввода
document.addEventListener('change', (e) => {
  const el = e.target.closest('[data-act]');
  if (!el) return;
  if (el.dataset.act === 'grade') {
    const z = DEMO.zachetka.filter((x) => x.id === el.dataset.arg)[0];
    if (z) { z.grade = +el.value; render(); }
  }
});
document.addEventListener('input', (e) => {
  const el = e.target.closest('[data-act]');
  if (!el) return;
  if (el.dataset.act === 'calcSet') {
    const g = DEMO.calc.filter((x) => x.id === el.dataset.arg)[0];
    if (g) { g.value = Math.max(0, Math.min(g.max, +el.value || 0)); }
  }
  if (el.dataset.act === 'calcExam') DEMO.calcExam = Math.max(0, Math.min(DEMO.calcExamMax, +el.value || 0));
});

$('fab').addEventListener('click', openFab);
$('btnBell').addEventListener('click', () => go('news'));
$('btnBack').addEventListener('click', goBack);
$('btnMenu').addEventListener('click', openDrawer);

window.addEventListener('popstate', () => { readURL(); render(); });
window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', () => { if (S.theme === 'system') applyLook(); });

// Свайп между вкладками
(function enableTabSwipe() {
  let x0 = 0, y0 = 0, active = false;
  const view = $('view');
  view.addEventListener('touchstart', (e) => {
    if (e.touches.length !== 1) return;
    x0 = e.touches[0].clientX; y0 = e.touches[0].clientY; active = true;
  }, { passive: true });
  view.addEventListener('touchend', (e) => {
    if (!active) return;
    active = false;
    const dx = e.changedTouches[0].clientX - x0;
    const dy = e.changedTouches[0].clientY - y0;
    if (Math.abs(dx) < 70 || Math.abs(dy) > 50) return;
    const tabs = NAVS[S.nav].tabs;
    const host = HOST[S.nav][S.screen] || S.screen;
    let i = tabs.findIndex((t) => t.s === host);
    if (i === -1) return;
    i += dx < 0 ? 1 : -1;
    if (i < 0 || i >= tabs.length) return;
    go(tabs[i].s);
  }, { passive: true });
})();

// ===== Панель переключателей =================================================
function renderPanel() {
  $('dpNow').textContent = NAV_NAMES[S.nav] + ' · ' + STYLE_NAMES[S.style] + ' · ' + THEME_NAMES[S.theme] + ' · ' + ROLE_NAMES[S.role];
  const mk = (box, map, cur, key, swatch) => {
    $(box).innerHTML = Object.keys(map).map((k) =>
      '<button type="button" class="dp-opt' + (cur === k ? ' is-on' : '') + '" data-set="' + key + '" data-val="' + k + '">' +
      (swatch ? '<span class="dp-swatch" style="background:' + swatch[k] + '"></span>' : '') + esc(map[k]) + '</button>').join('');
  };
  mk('dpNav', NAV_NAMES, S.nav, 'nav');
  mk('dpStyle', STYLE_NAMES, S.style, 'style');
  mk('dpTheme', THEME_NAMES, S.theme, 'theme');
  const gm = {}, gs = {};
  GAMMAS.forEach((g) => { gm[g.id] = g.name; gs[g.id] = g.accent; });
  mk('dpGamma', gm, S.gamma, 'gamma', gs);
  mk('dpRole', ROLE_NAMES, S.role, 'role');
}
// Высота панели демо нужна боковой панели от 1024 px, чтобы они не наложились
function syncPanelHeight() {
  document.documentElement.style.setProperty('--dp-h', $('dp').offsetHeight + 'px');
}
window.addEventListener('resize', syncPanelHeight);

$('dpToggle').addEventListener('click', function () {
  const open = $('dp').classList.toggle('is-open');
  this.setAttribute('aria-expanded', open ? 'true' : 'false');
  syncPanelHeight();
});
$('dp').addEventListener('click', (e) => {
  const b = e.target.closest('[data-set]');
  if (!b) return;
  const k = b.dataset.set, v = b.dataset.val;
  S[k] = v;
  // Экран мог пропасть из новой навигации или стать недоступным для роли
  if (k === 'nav' && !SCREENS[S.screen]) S.screen = NAVS[S.nav].tabs[0].s;
  if (k === 'role' && !allowed(S.screen)) S.screen = NAVS[S.nav].tabs[0].s;
  writeURL(true);
  render();
});

// ===== Telegram ==============================================================
(function setupTelegram() {
  try {
    const tg = window.Telegram && window.Telegram.WebApp;
    if (!tg) return;
    tg.ready();
    tg.expand();
    if (tg.disableVerticalSwipes) tg.disableVerticalSwipes();   // вертикальный свайп выключен
    if (tg.BackButton) tg.BackButton.onClick(goBack);
  } catch (e) {}
})();

// ===== Старт =================================================================
readURL();
render();
