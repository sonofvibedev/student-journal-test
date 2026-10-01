// ===== ОКРУЖЕНИЕ: ЭТО ТЕСТОВАЯ ВЕРСИЯ =====
// Единственный файл, которым тестовый стенд отличается от рабочего сайта.
// Переносишь изменения в рабочую версию — копируешь всё, КРОМЕ этого файла.
//
// Оба сайта лежат на одном домене sonofvibedev.github.io, поэтому localStorage у них общий.
// Чтобы тест не затирал рабочие данные, все ключи здесь получают приставку test_,
// а сессия Supabase хранится под своим именем.
//
// Загружается в <head> ПЕРВЫМ, до app.css и остальных скриптов.

'use strict';

const IS_TEST = true;

// Приставка ко всем ключам localStorage. В рабочей версии — пустая строка.
const LS_PREFIX = 'test_';

// Куда админ сохраняет data.json (saveDataToGitHub)
const GITHUB_OWNER = 'sonofvibedev';
const GITHUB_REPO = 'student-journal-test';
const DATA_PATH = 'data.json';

// Отдельный тестовый проект Supabase: свои аккаунты, свои аватарки, свои пропуска.
// Ключ publishable — открытый по назначению, он и должен лежать в коде страницы.
const SUPABASE_URL = 'https://nmibklkxlxudefkyihpi.supabase.co';
const SUPABASE_KEY = 'sb_publishable_pMtWtkWAxYJo1VvwtkO4Yg_UHA-JGYw';

// Имя ключа, под которым supabase-js хранит сессию. Своё — иначе вход в тест
// выкидывал бы из рабочего сайта и наоборот.
const SB_STORAGE_KEY = LS_PREFIX + 'sb-auth-token';

// --- Обёртки над localStorage: единственное место, где добавляется приставка ---
// Браузер может запретить хранилище (приватный режим), поэтому всё в try/catch.
function lsGet(key, fallback = null) {
  try {
    const v = localStorage.getItem(LS_PREFIX + key);
    return v === null ? fallback : v;
  } catch (e) { return fallback; }
}
function lsSet(key, value) {
  try { localStorage.setItem(LS_PREFIX + key, value); return true; } catch (e) { return false; }
}
function lsRemove(key) {
  try { localStorage.removeItem(LS_PREFIX + key); return true; } catch (e) { return false; }
}
function lsGetJSON(key, fallback) {
  try {
    const v = lsGet(key);
    return v === null ? fallback : JSON.parse(v);
  } catch (e) { return fallback; }
}
function lsSetJSON(key, value) {
  try { return lsSet(key, JSON.stringify(value)); } catch (e) { return false; }
}

// --- Видимые признаки тестовой версии ---
if (IS_TEST) {
  // noindex ставим прямо здесь, в <head>, до разбора <body>: поисковику достаётся
  // та же разметка, что при статическом мета-теге. Плюс в корне лежит robots.txt.
  document.head.insertAdjacentHTML('beforeend',
    '<meta name="robots" content="noindex, nofollow">');

  // Стили плашки держим здесь, а не в app.css: так app.css в тесте и в рабочей
  // версии побайтово одинаковый, и переносить нечего.
  document.head.insertAdjacentHTML('beforeend', '<style>' +
    '#testBanner{position:sticky;top:0;z-index:2000;margin:0 calc(-1 * var(--app-pad, 16px)) 12px;' +
    'padding:calc(6px + var(--app-inset-top, 0px)) 14px 6px;' +
    'background:#840e0a;color:#fff;text-align:center;' +
    'font-size:12px;font-weight:700;letter-spacing:.6px;text-transform:uppercase;' +
    'box-shadow:0 2px 12px rgba(0,0,0,.45)}' +
    '@media print{#testBanner{display:none}}' +
    '</style>');

  document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('testBanner')) return;
    const bar = document.createElement('div');
    bar.id = 'testBanner';
    bar.setAttribute('role', 'note');
    bar.textContent = 'ТЕСТОВАЯ ВЕРСИЯ — данные вымышленные';
    document.body.prepend(bar);
    document.body.classList.add('has-test-banner');
  });
}
