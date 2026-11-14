(() => {
  const root = document.getElementById('mainContent');
  const id = new URLSearchParams(location.search).get('id');
  const product = Object.hasOwn(PRODUCTS, id) ? PRODUCTS[id] : null;
  const crumbs = (name) =>
    `<nav class="breadcrumbs" aria-label="Хлебные крошки"><a class="breadcrumbs__link" href="index.html">Главная</a><a class="breadcrumbs__link" href="catalog.html">Каталог</a><span>${name}</span></nav>`;
  if (!product) {
    document.title = 'Товар не найден';
    root.innerHTML = `${crumbs('Товар не найден')}<section class="section"><h1>Товар не найден</h1><p>Откройте <a href="catalog.html">каталог</a>.</p></section>`;
    return;
  }
  document.title = product.name + ' - Учебный интернет-магазин';
  document.querySelector('meta[name="description"]').content = product.meta;
  const image = (p, cls, lazy = false) =>
    `<img class="${cls}" src="${p.image}" srcset="${p.image.replace('products/', 'responsive/').replace('.jpg', '-320.webp')} 320w, ${p.image.replace('products/', 'responsive/').replace('.jpg', '-640.webp')} 640w" sizes="(min-width:768px) 50vw,100vw" alt="${p.imageAlt}" ${lazy ? 'loading="lazy"' : ''}>`;
  const badge = (p, cls) =>
    p.badge
      ? `<span class="${cls} ${cls}--${p.badge === 'sale' ? 'sale' : 'new'}">${p.badge === 'sale' ? 'Скидка' : 'Новинка'}</span>`
      : '';
  const table = (caption, head, rows) =>
    `<div class="table-scroll"><table class="product-table"><caption class="product-table__caption">${caption}</caption><thead><tr>${head.map((h) => `<th class="product-table__head" scope="col">${h}</th>`).join('')}</tr></thead><tbody>${rows
      .map(
        (row) =>
          `<tr class="product-table__row"><th class="product-table__head" scope="row">${row[0]}</th>${row
            .slice(1)
            .map((c) => `<td class="product-table__cell">${c}</td>`)
            .join('')}</tr>`,
      )
      .join('')}</tbody></table></div>`;
  const sizes = SIZE_TABLES[product.sizes];
  const comparison = COMPARE_IDS.includes(id)
    ? table(
        'Куртка, пальто и пуховик',
        [
          'Параметр',
          ...COMPARE_IDS.map(
            (key) =>
              `<a href="product.html?id=${key}">${PRODUCTS[key].name}${key === id ? ' (эта модель)' : ''}</a>`,
          ),
        ],
        [
          ['Цена', ...COMPARE_IDS.map((key) => PRODUCTS[key].price)],
          ...COMPARE_ROWS.map((label) => [
            label,
            ...COMPARE_IDS.map(
              (key) =>
                PRODUCTS[key].specs.find((row) => row[0] === label)?.[1] || '',
            ),
          ]),
        ],
      )
    : '';
  root.innerHTML = `${crumbs(product.name)}<section class="product"><div class="product__media">${badge(product, 'product__badge')}${image(product, 'product__image')}</div><div class="product__info"><h1 class="product__title">${product.name}</h1><p class="product__price">${product.price}</p><p>${product.description}</p><a class="button button--primary" href="order.html?product=${encodeURIComponent(id)}">Оформить заказ</a></div></section><section class="section"><h2 class="section__title">Характеристики</h2>${table(product.specsCaption, ['Параметр', 'Значение'], product.specs)}</section>${comparison ? `<section class="section"><h2>Сравнение верхней одежды</h2>${comparison}</section>` : ''}${sizes ? `<details class="size-guide"><summary class="size-guide__summary">Таблица размеров</summary><div class="size-guide__content">${table(sizes.caption, sizes.head, sizes.rows)}<p><a href="size.html#size-${product.sizes}">Как выбрать размер</a></p></div></details>` : ''}<section class="section"><h2 class="section__title">Похожие товары</h2><div class="products-grid">${product.related
    .map((key) => {
      const p = PRODUCTS[key];
      return `<article class="product-card">${badge(p, 'product-card__badge')}<a href="product.html?id=${key}">${image(p, 'product-card__image', true)}</a><h3 class="product-card__title">${p.name}</h3><p class="product-card__description">${p.summary}</p><p class="product-card__price">${p.price}</p><a class="button button--primary product-card__button" href="product.html?id=${key}">Подробнее</a></article>`;
    })
    .join('')}</div></section>`;
})();
