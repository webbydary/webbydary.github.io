/* SMOOTH SCROLL — LENIS */
const lenis = new Lenis({
  autoRaf: true,
  lerp: 0.08,
  smoothWheel: true,
  syncTouch: false,
  anchors: true,
  stopInertiaOnNavigate: true,
  respectReducedMotion: true,
});


/* SVG PAGE TRANSITIONS */

(() => {
  const overlay = document.querySelector(".page-transition");
  const path = document.querySelector(".page-transition__path");

  if (!overlay || !path || typeof gsap === "undefined") return;

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (reducedMotion) return;

  const paths = {
    // Волна начинает появляться слева
    enterStart:
      "M 0 0 H 0 C 0 50 0 50 0 100 H 0 V 0 Z",

    enterMiddle:
      "M 0 0 H 43 C -17 55 183 65 43 100 H 0 V 0 Z",

    // Полное закрытие экрана перед переходом
    coveredEnter:
      "M 0 0 H 100 C 100 50 100 50 100 100 H 0 V 0 Z",

    // Полное закрытие экрана перед открытием новой страницы
    coveredExit:
      "M 100 0 H 0 C 0 50 0 50 0 100 H 100 V 0 Z",

    // Волна уходит за правый край
    exitMiddle:
      "M 100 0 H 50 C 78 43 54 81 50 100 H 100 V 0 Z",

    exitEnd:
      "M 100 0 H 100 C 100 50 100 50 100 100 H 100 V 0 Z"
  };

  let isAnimating = false;

  const showOverlay = () => {
    overlay.style.visibility = "visible";
  };

  const hideOverlay = () => {
    overlay.style.visibility = "hidden";
  };

  const transitionKey = "portfolio-page-transition";

  // Открытие новой страницы: волна уходит вправо
  const shouldReveal = sessionStorage.getItem(transitionKey);

  if (shouldReveal) {
    sessionStorage.removeItem(transitionKey);

    showOverlay();

    gsap.set(path, {
      attr: { d: paths.coveredExit }
    });

    gsap.timeline({
      onComplete: () => {
        hideOverlay();
        isAnimating = false;
      }
    })
      .to(path, {
        duration: 0.25,
        attr: { d: paths.exitMiddle },
        ease: "power1.out"
      })
      .to(path, {
        duration: 0.6,
        attr: { d: paths.exitEnd },
        ease: "power2.inOut"
      });
  }

  // Закрытие текущей страницы перед переходом
  const navigateWithTransition = (url) => {
    if (isAnimating) return;

    isAnimating = true;
    showOverlay();

    gsap.set(path, {
      attr: { d: paths.enterStart }
    });

    gsap.timeline({
      onComplete: () => {
        sessionStorage.setItem(transitionKey, "1");
        window.location.href = url;
      }
    })
      .to(path, {
        duration: 0.6,
        attr: { d: paths.enterMiddle },
        ease: "power2.inOut"
      })
      .to(path, {
        duration: 0.2,
        attr: { d: paths.coveredEnter },
        ease: "power1.in"
      });
  };

  // Перехватываем внутренние ссылки сайта
  document.addEventListener("click", (event) => {
    const link = event.target.closest("a");

    if (!link) return;
    if (event.defaultPrevented) return;
    if (event.button !== 0) return;

    if (
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }

    if (link.target && link.target !== "_self") return;
    if (link.hasAttribute("download")) return;

    const url = new URL(link.href, window.location.href);

    // Не анимируем внешние ссылки
    if (url.origin !== window.location.origin) return;

    // Не анимируем переход к якорю на той же странице
    if (
      url.pathname === window.location.pathname &&
      url.search === window.location.search &&
      url.hash
    ) {
      return;
    }

    // Не анимируем ссылку на текущую страницу
    if (url.href === window.location.href) return;

    event.preventDefault();
    navigateWithTransition(url.href);
  });
})();






const currentPage = window.location.pathname;

const menuLinks = document.querySelectorAll(".menu-button");

menuLinks.forEach((link) => {
  const linkPage = new URL(link.href, window.location.href).pathname;

  const isHomePage =
    (currentPage === "/" || currentPage.endsWith("/index.html")) &&
    linkPage.endsWith("/index.html");

  const isCurrentPage = currentPage === linkPage;

  // Сначала убираем active
  link.classList.remove("is-active");

  // Затем добавляем только текущей странице
  if (isHomePage || isCurrentPage) {
    link.classList.add("is-active");
  }
});

// MOBILE MENU

const mobileMenu = document.querySelector("#mobile-menu");
const mobileMenuButton = document.querySelector(".mobile-menu-button");

if (mobileMenu && mobileMenuButton) {
  mobileMenuButton.addEventListener("click", () => {
    const isOpen = mobileMenu.classList.toggle("is-open");

    mobileMenuButton.classList.toggle("is-open", isOpen);

    mobileMenu.setAttribute("aria-hidden", String(!isOpen));

    mobileMenuButton.setAttribute(
      "aria-label",
      isOpen ? "Закрыть меню" : "Открыть меню",
    );
  });
}

// CURSOR

const canvas = document.querySelector("#cursor-canvas");

if (canvas && window.matchMedia("(pointer: fine)").matches) {
  const ctx = canvas.getContext("2d");

  let mouseMoved = false;

  const pointer = {
    x: 0.5 * window.innerWidth,
    y: 0.5 * window.innerHeight,
  };

  const params = {
    pointsNumber: 40,
    widthFactor: 0.2,
    spring: 0.4,
    friction: 0.5,
  };

  const trail = new Array(params.pointsNumber);

  for (let i = 0; i < params.pointsNumber; i++) {
    trail[i] = {
      x: pointer.x,
      y: pointer.y,
      dx: 0,
      dy: 0,
    };
  }

  window.addEventListener("mousemove", (event) => {
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
        (0.5 + 0.3 * Math.cos(0.002 * t) * Math.sin(0.005 * t)) *
        window.innerWidth;

      pointer.y =
        (0.5 + 0.2 * Math.cos(0.005 * t) + 0.1 * Math.cos(0.01 * t)) *
        window.innerHeight;
    }

    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    // Движение каждой точки за предыдущей
    trail.forEach((point, index) => {
      const previous = index === 0 ? pointer : trail[index - 1];

      const spring = index === 0 ? 0.4 * params.spring : params.spring;

      point.dx += (previous.x - point.x) * spring;
      point.dy += (previous.y - point.y) * spring;

      point.dx *= params.friction;
      point.dy *= params.friction;

      point.x += point.dx;
      point.y += point.dy;
    });

    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    ctx.beginPath();

    ctx.moveTo(trail[0].x, trail[0].y);

    for (let i = 1; i < trail.length - 1; i++) {
      const currentPoint = trail[i];
      const nextPoint = trail[i + 1];

      const centerX = 0.5 * (currentPoint.x + nextPoint.x);

      const centerY = 0.5 * (currentPoint.y + nextPoint.y);

      ctx.quadraticCurveTo(currentPoint.x, currentPoint.y, centerX, centerY);

      // Линия постепенно становится тоньше
      ctx.lineWidth = params.widthFactor * (params.pointsNumber - i);

      ctx.strokeStyle = "rgba(205, 205, 255, 1)";

      ctx.stroke();
    }

    ctx.lineTo(trail[trail.length - 1].x, trail[trail.length - 1].y);

    ctx.stroke();

    requestAnimationFrame(update);
  }

  setupCanvas();
  window.addEventListener("resize", setupCanvas);

  update(0);
}
