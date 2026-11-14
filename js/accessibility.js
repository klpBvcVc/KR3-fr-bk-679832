document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.table-scroll').forEach((region) => {
    region.tabIndex = 0;
    region.setAttribute('role', 'region');
    region.setAttribute(
      'aria-label',
      `${region.querySelector('caption')?.textContent || 'Таблица'} - прокрутка по горизонтали`,
    );
  });
  const header = document.querySelector('.site-header'),
    nav = document.getElementById('mainNav'),
    toggle = document.querySelector('.nav-toggle');
  const measure = () =>
    document.documentElement.style.setProperty(
      '--header-height',
      `${header.offsetHeight}px`,
    );
  new ResizeObserver(measure).observe(header);
  measure();
  const banner = document.querySelector('.top-bar');
  const measureBanner = () =>
    document.body.style.setProperty(
      '--top-offset',
      banner && getComputedStyle(banner).display !== 'none'
        ? `${banner.offsetHeight}px`
        : '0px',
    );
  if (banner) {
    new ResizeObserver(measureBanner).observe(banner);
    banner.addEventListener('change', measureBanner);
  }
  measureBanner();
  const close = () => {
    nav.classList.remove('site-nav--open');
    toggle.setAttribute('aria-expanded', 'false');
    measure();
  };
  toggle.addEventListener('click', () =>
    toggle.setAttribute(
      'aria-expanded',
      String(nav.classList.toggle('site-nav--open')),
    ),
  );
  nav.addEventListener('click', (event) => {
    const link = event.target.closest('a[href]');
    if (
      !link ||
      !nav.classList.contains('site-nav--open') ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      event.metaKey
    )
      return;
    event.preventDefault();
    close();
    requestAnimationFrame(() => location.assign(link.href));
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && nav.classList.contains('site-nav--open')) {
      close();
      toggle.focus();
    }
  });
  window.matchMedia('(min-width:1024px)').addEventListener('change', close);
  const form = document.getElementById('order-form');
  if (!form) return;
  const fields = [...form.elements].filter(
    (field) => field.willValidate && field.id,
  );
  const summary = document.createElement('div');
  summary.className = 'form-errors';
  summary.tabIndex = -1;
  summary.hidden = true;
  summary.setAttribute('role', 'alert');
  summary.setAttribute('aria-label', 'Ошибки заполнения формы');
  form.prepend(summary);

  fields.forEach((field) => {
    const error = document.createElement('span');
    error.id = `${field.id}-error`;
    error.className = 'field-error';
    error.hidden = true;
    field.closest('.order-form__field')?.append(error);
    const hint = field
      .closest('.order-form__field')
      ?.querySelector('.order-form__hint');
    if (hint) hint.id ||= `${field.id}-hint`;
    field.setAttribute(
      'aria-describedby',
      [field.getAttribute('aria-describedby'), hint?.id, error.id]
        .filter(Boolean)
        .join(' '),
    );
    field.addEventListener('input', () => {
      if (field.validity.valid) {
        field.removeAttribute('aria-invalid');
        field.classList.remove('is-invalid');
        error.hidden = true;
        error.textContent = '';
      }
      if (form.checkValidity()) summary.hidden = true;
    });
  });

  function message(field) {
    if (field.validity.valueMissing)
      return field.type === 'checkbox'
        ? 'Подтвердите согласие на обработку данных.'
        : 'Заполните это поле.';
    if (field.validity.typeMismatch)
      return 'Введите корректный адрес электронной почты.';
    if (field.validity.patternMismatch)
      return 'Введите телефон в формате +7 (900) 000-00-00.';
    if (field.validity.tooShort)
      return `Введите не менее ${field.minLength} символов.`;
    return field.validationMessage;
  }

  // Проверяем ошибки до обработчика успешной отправки в main.js.
  form.addEventListener(
    'submit',
    (event) => {
      summary.replaceChildren();
      const invalid = fields.filter((field) => !field.validity.valid);
      fields.forEach((field) => {
        const error = document.getElementById(`${field.id}-error`);
        const bad = !field.validity.valid;
        field.classList.toggle('is-invalid', bad);
        if (bad) field.setAttribute('aria-invalid', 'true');
        else field.removeAttribute('aria-invalid');
        error.hidden = !bad;
        error.textContent = bad ? message(field) : '';
      });
      summary.hidden = invalid.length === 0;
      if (!invalid.length) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      const title = document.createElement('p');
      title.textContent = 'Исправьте поля формы:';
      const list = document.createElement('ul');
      invalid.forEach((field) => {
        const item = document.createElement('li');
        const link = document.createElement('a');
        link.href = `#${field.id}`;
        link.textContent = `${field.labels?.[0]?.textContent.trim() || field.getAttribute('aria-label')}: ${message(field)}`;
        link.addEventListener('click', (event) => {
          event.preventDefault();
          field.focus();
        });
        item.append(link);
        list.append(item);
      });
      summary.append(title, list);
      summary.focus();
    },
    true,
  );

  const success = document.getElementById('success-message');
  success.setAttribute('role', 'status');
  success.tabIndex = -1;
  success.textContent =
    'Учебная заявка заполнена. Данные не отправляются на сервер.';
  form.addEventListener('submit', () => {
    if (form.checkValidity()) success.focus();
  });
});
