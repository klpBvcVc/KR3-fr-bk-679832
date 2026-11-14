(() => {
  const select = document.getElementById('product');
  const id = new URLSearchParams(location.search).get('product');
  const option = [...select.options].find((o) => o.value && o.value === id);
  if (!option) return;
  select.value = id;
  const link = document.createElement('a');
  link.className = 'breadcrumbs__link';
  link.href = `product.html?id=${encodeURIComponent(id)}`;
  link.textContent = option.textContent;
  document.querySelector('.breadcrumbs__current').before(link);
})();
