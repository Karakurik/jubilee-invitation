(() => {
  'use strict';

  // ЗАМЕНИТЕ на username организатора без @, например: gulnara_event
  const TELEGRAM_USERNAME = 'your_username';
  const DEFAULT_GUEST = 'Рамиль';

  const params = new URLSearchParams(window.location.search);
  const rawName = (params.get('name') || params.get('guest') || DEFAULT_GUEST).trim();
  const guestName = rawName.slice(0, 60) || DEFAULT_GUEST;

  document.querySelectorAll('[data-guest-name]').forEach((node) => {
    node.textContent = guestName;
  });

  const input = document.querySelector('#guest-input');
  input.value = guestName;
  document.title = `${guestName}, приглашение на юбилей`;

  const toggle = document.querySelector('[data-theme-toggle]');
  const root = document.documentElement;
  let theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

  const applyTheme = () => {
    root.dataset.theme = theme;
    toggle.innerHTML = `<span aria-hidden="true">${theme === 'dark' ? '☀' : '☾'}</span>`;
    toggle.setAttribute('aria-label', theme === 'dark' ? 'Включить светлую тему' : 'Включить тёмную тему');
  };
  applyTheme();
  toggle.addEventListener('click', () => {
    theme = theme === 'dark' ? 'light' : 'dark';
    applyTheme();
  });

  const revealItems = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add('is-visible'));
  }

  document.querySelector('#rsvp-form').addEventListener('submit', (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get('guest') || '').trim();
    const attendance = String(data.get('attendance') || '');
    const count = String(data.get('count') || '1');
    const text = `Здравствуйте! Это ${name}. Ответ на приглашение: ${attendance}. Количество гостей: ${count}.`;

    if (TELEGRAM_USERNAME === 'your_username') {
      alert('Укажите TELEGRAM_USERNAME в файле script.js перед публикацией.');
      return;
    }

    const url = `https://t.me/${TELEGRAM_USERNAME}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  });
})();
