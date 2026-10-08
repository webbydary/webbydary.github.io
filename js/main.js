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



// CURSOR

const canvas = document.querySelector('#cursor-canvas');

if (canvas && window.matchMedia('(pointer: fine)').matches) {
    const ctx = canvas.getContext('2d');

    let mouseMoved = false;

    const pointer = {
        x: 0.5 * window.innerWidth,
        y: 0.5 * window.innerHeight
    };

    const params = {
        pointsNumber: 40,
        widthFactor: 0.2,
        spring: 0.4,
        friction: 0.5
    };

    const trail = new Array(params.pointsNumber);

    for (let i = 0; i < params.pointsNumber; i++) {
        trail[i] = {
            x: pointer.x,
            y: pointer.y,
            dx: 0,
            dy: 0
        };
    }

    window.addEventListener('mousemove', (event) => {
        mouseMoved = true;

        pointer.x = event.clientX;
        pointer.y = event.clientY;
    });

    function setupCanvas() {
        const dpr = window.devicePixelRatio || 1;

        canvas.width = window.innerWidth * dpr;
        canvas.height = window.innerHeight * dpr;

        canvas.style.width = `${window.innerWidth}px`;
        canvas.style.height = `${window.innerHeight}px`;

        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function update(t) {

        // Небольшое движение курсора до первого движения мыши
        if (!mouseMoved) {
            pointer.x =
                (0.5 + 0.3 * Math.cos(0.002 * t) * Math.sin(0.005 * t))
                * window.innerWidth;

            pointer.y =
                (0.5 + 0.2 * Math.cos(0.005 * t) + 0.1 * Math.cos(0.01 * t))
                * window.innerHeight;
        }

        ctx.clearRect(
            0,
            0,
            window.innerWidth,
            window.innerHeight
        );

        // Движение каждой точки за предыдущей
        trail.forEach((point, index) => {
            const previous =
                index === 0
                    ? pointer
                    : trail[index - 1];

            const spring =
                index === 0
                    ? 0.4 * params.spring
                    : params.spring;

            point.dx += (previous.x - point.x) * spring;
            point.dy += (previous.y - point.y) * spring;

            point.dx *= params.friction;
            point.dy *= params.friction;

            point.x += point.dx;
            point.y += point.dy;
        });

        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        ctx.beginPath();

        ctx.moveTo(
            trail[0].x,
            trail[0].y
        );

        for (let i = 1; i < trail.length - 1; i++) {
            const currentPoint = trail[i];
            const nextPoint = trail[i + 1];

            const centerX =
                0.5 * (currentPoint.x + nextPoint.x);

            const centerY =
                0.5 * (currentPoint.y + nextPoint.y);

            ctx.quadraticCurveTo(
                currentPoint.x,
                currentPoint.y,
                centerX,
                centerY
            );

            // Линия постепенно становится тоньше
            ctx.lineWidth =
                params.widthFactor *
                (params.pointsNumber - i);

            ctx.strokeStyle = 'rgba(205, 205, 255, 1)';

            ctx.stroke();
        }

        ctx.lineTo(
            trail[trail.length - 1].x,
            trail[trail.length - 1].y
        );

        ctx.stroke();

        requestAnimationFrame(update);
    }

    setupCanvas();
    window.addEventListener('resize', setupCanvas);

    update(0);
}





const hero = document.querySelector('.hero__placeholder');

if (hero) {
  const updateHeroScale = () => {
    const scale = Math.min(hero.clientWidth / 390, 1);
    hero.style.setProperty('--hero-mobile-scale', scale);
  };

  updateHeroScale();

  window.addEventListener('resize', updateHeroScale);
}