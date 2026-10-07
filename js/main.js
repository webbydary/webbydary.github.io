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


// MOBILE MENU

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



// VELOCITY LINE CURSOR

const canvas = document.querySelector('#cursor-canvas');

if (canvas && window.matchMedia('(pointer: fine)').matches) {
  const ctx = canvas.getContext('2d');

  let width = 0;
  let height = 0;

  const mouse = {
    x: window.innerWidth / 2,
    y: window.innerHeight / 2
  };

  const current = {
    x: mouse.x,
    y: mouse.y
  };

  const history = [];
  const maxHistory = 28;

  function resizeCanvas() {
    const dpr = window.devicePixelRatio || 1;

    width = window.innerWidth;
    height = window.innerHeight;

    canvas.width = width * dpr;
    canvas.height = height * dpr;

    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  window.addEventListener('resize', resizeCanvas);

  window.addEventListener('pointermove', (event) => {
    mouse.x = event.clientX;
    mouse.y = event.clientY;
  });

  function render() {
    ctx.clearRect(0, 0, width, height);

    // Плавно догоняем курсор
    current.x += (mouse.x - current.x) * 0.14;
    current.y += (mouse.y - current.y) * 0.14;

    history.unshift({
      x: current.x,
      y: current.y
    });

    if (history.length > maxHistory) {
      history.pop();
    }

    if (history.length > 1) {
      ctx.beginPath();

      ctx.moveTo(history[0].x, history[0].y);

      for (let i = 1; i < history.length - 1; i++) {
        const point = history[i];
        const nextPoint = history[i + 1];

        const centerX = (point.x + nextPoint.x) / 2;
        const centerY = (point.y + nextPoint.y) / 2;

        ctx.quadraticCurveTo(
          point.x,
          point.y,
          centerX,
          centerY
        );
      }

      ctx.strokeStyle = 'rgba(217, 255, 146)';
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      ctx.stroke();
    }

    requestAnimationFrame(render);
  }

  resizeCanvas();
  render();
}