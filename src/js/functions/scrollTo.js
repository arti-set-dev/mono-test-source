export const scrollTo = (targetElem, position) => {
  if (!targetElem || !(targetElem instanceof HTMLElement)) {
    console.error('Invalid target element');
    return;
  }

  const elemRect = targetElem.getBoundingClientRect();
  const scrollTop = window.scrollY || window.pageYOffset; // текущая позиция скролла
  const windowHeight = window.innerHeight; // высота окна браузера

  let targetPosition;

  if (position === 'top') {
    targetPosition = scrollTop + elemRect.top; // позиция верхней части элемента
  } else if (position === 'bottom') {
    targetPosition = scrollTop + elemRect.bottom - windowHeight; // позиция нижней части элемента
  } else {
    console.error('Invalid position parameter. Use "top" or "bottom".');
    return;
  }

  window.scrollTo({
    top: targetPosition,
    behavior: 'smooth' // для плавного скроллинга
  });
}
