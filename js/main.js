const currentPage = window.location.pathname;

const menuLinks = document.querySelectorAll('.menu-button');

menuLinks.forEach((link) => {
  const linkPage = new URL(link.href, window.location.href).pathname;

  const isHomePage =
    (currentPage === '/' || currentPage.endsWith('/index.html')) &&
    linkPage.endsWith('/index.html');

  const isCurrentPage =
    currentPage === linkPage;

  // Сначала убираем active
  link.classList.remove('is-active');

  // Затем добавляем только текущей странице
  if (isHomePage || isCurrentPage) {
    link.classList.add('is-active');
  }
});



const mobileMenu = document.querySelector('#mobile-menu');
const mobileMenuButton = document.querySelector('.mobile-menu-button');

if (mobileMenu && mobileMenuButton) {
  mobileMenuButton.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('is-open');

    mobileMenuButton.classList.toggle('is-open', isOpen);

    mobileMenu.setAttribute('aria-hidden', String(!isOpen));

    mobileMenuButton.setAttribute(
      'aria-label',
      isOpen ? 'Закрыть меню' : 'Открыть меню'
    );
  });
}


const caseGalleryItems = document.querySelectorAll(
  '.case-card__gallery-item'
);

caseGalleryItems.forEach((item) => {
  item.addEventListener('pointermove', (event) => {
    const rect = item.getBoundingClientRect();

    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    item.style.setProperty('--x', `${x}px`);
    item.style.setProperty('--y', `${y}px`);
  });
});

const caseImages = document.querySelectorAll('.case-card__images');

caseImages.forEach((image) => {
  image.addEventListener('pointermove', (event) => {
    const rect = image.getBoundingClientRect();

    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    image.style.setProperty('--x', `${x}px`);
    image.style.setProperty('--y', `${y}px`);
  });
});