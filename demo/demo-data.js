// Демо-данные. Только в памяти: никаких запросов к GitHub и Supabase,
// никаких записей в data.json. Любое действие в демо меняет этот объект и всё.
'use strict';

const DEMO = {
  group: '24ДММ-2',

  me: {
    id: 's07',
    name: 'Поленышев Дмитрий',
    initials: 'ПД',
    number: 7,
    login: 'd.polenyshev',
    avatar: null,          // dataURL после загрузки
    starosta: false,
    studakNumber: '24ДММ2-007',
    studakYear: '2024'
  },

  // --- Группа -------------------------------------------------------------
  students: [
    { id: 's01', name: 'Авдеева Мария',      number: 1,  hours: 12, cert: 6,  admin: false },
    { id: 's02', name: 'Белов Артём',        number: 2,  hours: 34, cert: 0,  admin: false },
    { id: 's03', name: 'Волкова Ника',       number: 3,  hours: 0,  cert: 0,  admin: false },
    { id: 's04', name: 'Гринёв Павел',       number: 4,  hours: 58, cert: 12, admin: false },
    { id: 's05', name: 'Дорохова Алиса',     number: 5,  hours: 8,  cert: 8,  admin: false },
    { id: 's06', name: 'Ермаков Кирилл',     number: 6,  hours: 22, cert: 0,  admin: false },
    { id: 's07', name: 'Поленышев Дмитрий',  number: 7,  hours: 16, cert: 10, admin: true  },
    { id: 's08', name: 'Жукова Светлана',    number: 8,  hours: 44, cert: 4,  admin: false },
    { id: 's09', name: 'Зимин Олег',         number: 9,  hours: 6,  cert: 0,  admin: false },
    { id: 's10', name: 'Исаева Полина',      number: 10, hours: 28, cert: 14, admin: false },
    { id: 's11', name: 'Котов Руслан',       number: 11, hours: 72, cert: 0,  admin: false },
    { id: 's12', name: 'Лебедева Вера',      number: 12, hours: 2,  cert: 2,  admin: false }
  ],

  subjects: [
    'Проектирование интерфейсов',
    'Веб-разработка',
    'Базы данных',
    'Иностранный язык',
    'Физическая культура',
    'Экономика отрасли'
  ],

  // Подробные пропуски студента (для «Мои пропуски» и календаря)
  absences: [
    { id: 'a1', date: '2026-09-29', subject: 'Веб-разработка',               hours: 2, cert: false },
    { id: 'a2', date: '2026-09-24', subject: 'Иностранный язык',             hours: 2, cert: true  },
    { id: 'a3', date: '2026-09-24', subject: 'Экономика отрасли',            hours: 2, cert: true  },
    { id: 'a4', date: '2026-09-17', subject: 'Физическая культура',          hours: 2, cert: false },
    { id: 'a5', date: '2026-09-10', subject: 'Проектирование интерфейсов',   hours: 4, cert: true  },
    { id: 'a6', date: '2026-09-03', subject: 'Базы данных',                  hours: 4, cert: false }
  ],

  // --- Справки ------------------------------------------------------------
  certs: [
    { id: 'c1', date: '2026-09-24', hours: 4, status: 'pending', who: 'Поленышев Дмитрий' },
    { id: 'c2', date: '2026-09-10', hours: 4, status: 'ok',      who: 'Поленышев Дмитрий' },
    { id: 'c3', date: '2026-09-29', hours: 6, status: 'pending', who: 'Гринёв Павел' },
    { id: 'c4', date: '2026-09-22', hours: 2, status: 'pending', who: 'Исаева Полина' }
  ],

  // --- Преподаватели ------------------------------------------------------
  teachers: [
    { id: 't1', name: 'Смирнова Ольга Петровна',  subject: 'Проектирование интерфейсов', room: '312', tg: '@o_smirnova',  note: 'Пересдачи по вторникам 15:00' },
    { id: 't2', name: 'Карпов Денис Игоревич',    subject: 'Веб-разработка',             room: '218', tg: '@d_karpov',    note: 'Отчёты принимает только в GitHub' },
    { id: 't3', name: 'Лазарев Виктор Сергеевич', subject: 'Базы данных',                room: '201', tg: '@v_lazarev',   note: 'Зачёт автоматом при 4 лабах' },
    { id: 't4', name: 'Юсупова Алина Маратовна',  subject: 'Иностранный язык',           room: '115', tg: '@a_yusupova',  note: '' },
    { id: 't5', name: 'Громов Егор Валерьевич',   subject: 'Физическая культура',        room: 'Зал', tg: '',             note: 'Справку нести сразу' },
    { id: 't6', name: 'Назарова Инна Львовна',    subject: 'Экономика отрасли',          room: '409', tg: '@i_nazarova',  note: '' }
  ],

  // --- Расписание ---------------------------------------------------------
  // weekday: 1=Пн … 6=Сб. type: lecture | practice | lab
  schedule: [
    { weekday: 1, pair: 1, from: '08:30', to: '10:00', subject: 'Проектирование интерфейсов', teacher: 't1', room: '312', type: 'lecture'  },
    { weekday: 1, pair: 2, from: '10:10', to: '11:40', subject: 'Веб-разработка',             teacher: 't2', room: '218', type: 'lab'      },
    { weekday: 1, pair: 3, from: '12:10', to: '13:40', subject: 'Иностранный язык',           teacher: 't4', room: '115', type: 'practice' },

    { weekday: 2, pair: 1, from: '08:30', to: '10:00', subject: 'Базы данных',                teacher: 't3', room: '201', type: 'lecture'  },
    { weekday: 2, pair: 2, from: '10:10', to: '11:40', subject: 'Базы данных',                teacher: 't3', room: '201', type: 'lab'      },
    { weekday: 2, pair: 4, from: '13:50', to: '15:20', subject: 'Физическая культура',        teacher: 't5', room: 'Зал', type: 'practice' },

    { weekday: 3, pair: 1, from: '08:30', to: '10:00', subject: 'Экономика отрасли',          teacher: 't6', room: '409', type: 'lecture'  },
    { weekday: 3, pair: 2, from: '10:10', to: '11:40', subject: 'Проектирование интерфейсов', teacher: 't1', room: '312', type: 'practice' },

    { weekday: 4, pair: 2, from: '10:10', to: '11:40', subject: 'Веб-разработка',             teacher: 't2', room: '218', type: 'lecture'  },
    { weekday: 4, pair: 3, from: '12:10', to: '13:40', subject: 'Веб-разработка',             teacher: 't2', room: '218', type: 'lab'      },
    { weekday: 4, pair: 4, from: '13:50', to: '15:20', subject: 'Иностранный язык',           teacher: 't4', room: '115', type: 'practice' },

    { weekday: 5, pair: 1, from: '08:30', to: '10:00', subject: 'Базы данных',                teacher: 't3', room: '201', type: 'practice' },
    { weekday: 5, pair: 2, from: '10:10', to: '11:40', subject: 'Экономика отрасли',          teacher: 't6', room: '409', type: 'practice' },

    { weekday: 6, pair: 1, from: '09:00', to: '10:30', subject: 'Физическая культура',        teacher: 't5', room: 'Зал', type: 'practice' }
  ],

  // --- Домашка ------------------------------------------------------------
  homework: [
    { id: 'h1', subject: 'Веб-разработка',             due: '2026-10-05', text: 'Свёрстать карточку товара, адаптив от 360 px. Прислать ссылку на GitHub Pages.' },
    { id: 'h2', subject: 'Базы данных',                due: '2026-10-06', text: 'Лаба 3: нормализация до 3НФ, скрипт создания таблиц.' },
    { id: 'h3', subject: 'Проектирование интерфейсов', due: '2026-10-07', text: 'Прототип экрана списка в Figma, 2 состояния.' },
    { id: 'h4', subject: 'Иностранный язык',           due: '2026-10-08', text: 'Unit 4, упражнения 3–7 письменно.' },
    { id: 'h5', subject: 'Экономика отрасли',          due: '2026-10-12', text: 'Расчёт точки безубыточности по своему варианту.' }
  ],

  // Отметки «Сделано» — только в памяти
  done: {},

  // --- Дедлайны и зачёты --------------------------------------------------
  deadlines: [
    { id: 'd1', title: 'Лаба 3 «Нормализация»',        subject: 'Базы данных',                date: '2026-10-06', kind: 'task'  },
    { id: 'd2', title: 'Прототип экрана списка',       subject: 'Проектирование интерфейсов', date: '2026-10-07', kind: 'task'  },
    { id: 'd3', title: 'Контрольная Unit 1–4',         subject: 'Иностранный язык',           date: '2026-10-14', kind: 'task'  },
    { id: 'd4', title: 'Зачёт',                        subject: 'Физическая культура',        date: '2026-10-21', kind: 'zachet'},
    { id: 'd5', title: 'Зачёт с оценкой',              subject: 'Веб-разработка',             date: '2026-11-05', kind: 'zachet'},
    { id: 'd6', title: 'Курсовая: защита',             subject: 'Экономика отрасли',          date: '2026-12-18', kind: 'zachet'}
  ],

  // --- Объявления ---------------------------------------------------------
  announcements: [
    { id: 'n1', date: '2026-10-01', target: 'ALL',      title: 'Перенос пары',        text: 'Веб-разработка в четверг с 10:10 переносится в 218 кабинет. Ноутбуки обязательны.' },
    { id: 'n2', date: '2026-09-30', target: 'ALL',      title: 'Справки за сентябрь', text: 'Сдать до 10 октября старосте. После этой даты деканат не принимает.' },
    { id: 'n3', date: '2026-09-28', target: 'ALL',      title: 'Субботник',           text: 'В субботу вместо физкультуры — субботник. Сбор у входа в 9:00.' },
    { id: 'n4', date: '2026-10-01', target: 'ME',       title: 'Лично тебе',          text: 'Дмитрий, по лабе 3 нужна доработка: не хватает скрипта создания таблиц.' }
  ],
  seenNews: ['n2', 'n3'],   // n1 и n4 — непрочитанные
  seenDeadlines: ['d3', 'd4', 'd5', 'd6'],  // d1 и d2 — новые

  // --- Зачётка ------------------------------------------------------------
  zachetka: [
    { id: 'z1', subject: 'Проектирование интерфейсов', grade: 5, form: 'Экзамен' },
    { id: 'z2', subject: 'Веб-разработка',             grade: 4, form: 'Зачёт с оценкой' },
    { id: 'z3', subject: 'Базы данных',                grade: 5, form: 'Экзамен' },
    { id: 'z4', subject: 'Иностранный язык',           grade: 4, form: 'Зачёт' },
    { id: 'z5', subject: 'Физическая культура',        grade: 0, form: 'Зачёт' },
    { id: 'z6', subject: 'Экономика отрасли',          grade: 0, form: 'Экзамен' }
  ],

  // Калькулятор рейтинга
  calc: [
    { id: 'g1', label: 'Текущий контроль', value: 42, max: 50 },
    { id: 'g2', label: 'Лабораторные',     value: 18, max: 20 }
  ],
  calcExam: 24,     // баллы за экзамен
  calcExamMax: 30,

  // --- Прочее -------------------------------------------------------------
  dataUpdated: '2026-10-02',
  starostaList: [
    { id: 'p1', name: 'Волкова Ника', role: 'Староста',     tg: '@n_volkova' },
    { id: 'p2', name: 'Белов Артём',  role: 'Зам. старосты', tg: '@a_belov' }
  ],

  changelog: [
    { version: '1.3', date: '02.10.2026', items: ['Один таб-бар на всё приложение', 'Плавающая кнопка «+» у админа', 'Боковая панель на широком экране'] },
    { version: '1.2', date: '02.10.2026', items: ['Расписание «сейчас»', 'Карточка занятия', 'Пять палитр оформления'] },
    { version: '1.1', date: '28.09.2026', items: ['Домашка', 'Темы оформления', 'Напоминания'] },
    { version: '1.0', date: '21.09.2026', items: ['Первая версия журнала'] }
  ]
};

// В демо «сегодня» фиксировано, чтобы расписание и дедлайны всегда выглядели
// одинаково и скриншоты были воспроизводимы.
const DEMO_TODAY = new Date(2026, 9, 2, 11, 5);   // 2 октября 2026, четверг, 11:05
