document.addEventListener('DOMContentLoaded', () => {
    // ========== Мобильное меню ==========
    const menuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    if (menuBtn && mobileMenu) {
        menuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('active');
            const icon = menuBtn.querySelector('i');
            if (mobileMenu.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }

    window.closeMenu = function() {
        if (mobileMenu) {
            mobileMenu.classList.remove('active');
            const icon = menuBtn.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    };

    // ========== Прелоадер ==========
    window.addEventListener('load', () => {
        const preloader = document.getElementById('preloader');
        if (preloader) {
            preloader.classList.add('hidden');
        }
    });

    // ========== Анимация при скролле ==========
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    animatedElements.forEach(el => observer.observe(el));

    // ========== Анимированные счётчики ==========
    function animateNumbers() {
        const statNumbers = document.querySelectorAll('.stat-number');
        statNumbers.forEach(el => {
            const target = parseInt(el.getAttribute('data-target'));
            if (isNaN(target)) return;
            let current = 0;
            const increment = Math.ceil(target / 50);
            const updateNumber = () => {
                current += increment;
                if (current >= target) {
                    el.textContent = target + '+';
                    return;
                }
                el.textContent = current;
                requestAnimationFrame(updateNumber);
            };
            updateNumber();
        });
    }

    const statsSection = document.querySelector('.stats');
    if (statsSection) {
        const observerStats = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateNumbers();
                    observerStats.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });
        observerStats.observe(statsSection);
    }

    // ========== Переключатель темы ==========
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('light-theme');
            const icon = themeToggle.querySelector('i');
            icon.classList.toggle('fa-sun');
            icon.classList.toggle('fa-moon');
        });
    }

    // ========== Плавный скролл ==========
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // ========== Закрытие мобильного меню при клике вне ==========
    document.addEventListener('click', (e) => {
        const menu = document.getElementById('mobile-menu');
        const btn = document.getElementById('mobile-menu-btn');
        if (menu && btn && !menu.contains(e.target) && !btn.contains(e.target) && menu.classList.contains('active')) {
            menu.classList.remove('active');
            btn.querySelector('i').classList.remove('fa-times');
            btn.querySelector('i').classList.add('fa-bars');
        }
    });

 // ========== Летающий банан с ранцем ==========
(function() {
    const banana = document.getElementById('flying-banana');
    if (!banana) return;

    // Показываем банан после исчезновения прелоадера
    const preloader = document.getElementById('preloader');
    if (preloader) {
        const observerPreload = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === 'class' && preloader.classList.contains('hidden')) {
                    banana.style.display = 'block';
                    observerPreload.disconnect();
                }
            });
        });
        observerPreload.observe(preloader, { attributes: true });
    } else {
        banana.style.display = 'block';
    }

    // Настройки следования за мышью
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let currentX = mouseX - 30;
    let currentY = mouseY - 30;
    let rafId = null;
    let isFollowingMouse = true;   // Режим: следуем за мышью (true) или сидим у кнопки (false)
    let isLanded = false;          // Флаг, что банан уже приземлился (чтобы не запускать повторно)

    // Обработчик движения мыши
    const mouseMoveHandler = (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        if (!rafId && isFollowingMouse) {
            rafId = requestAnimationFrame(updatePosition);
        }
    };
    document.addEventListener('mousemove', mouseMoveHandler);

    function updatePosition() {
        if (isFollowingMouse) {
            // Плавно двигаемся к курсору
            currentX += (mouseX - 30 - currentX) * 0.1;
            currentY += (mouseY - 30 - currentY) * 0.1;
            banana.style.left = currentX + 'px';
            banana.style.top = currentY + 'px';
        }
        rafId = null;
    }

    // Функция для обновления позиции банана у кнопки (вызывается при скролле/ресайзе)
    function updateBananaPositionNearButton() {
        const submitButton = document.querySelector('.contact__form button');
        if (!submitButton) return;
        const rect = submitButton.getBoundingClientRect();
        const targetX = rect.left - 40; // левее кнопки
        const targetY = rect.top - 30;   // выше кнопки
        banana.style.transition = 'left 0.3s ease, top 0.3s ease';
        banana.style.left = targetX + 'px';
        banana.style.top = targetY + 'px';
        // Убираем transition через небольшую задержку, чтобы не мешать плавности
        setTimeout(() => {
            if (!isFollowingMouse) {
                banana.style.transition = 'none';
            }
        }, 300);
    }

    // Функция посадки у кнопки
    function landNearButton() {
        if (isLanded) return; // уже сидим
        isFollowingMouse = false;
        isLanded = true;
        updateBananaPositionNearButton();
        // Подписываемся на события, чтобы банан оставался у кнопки при скролле и ресайзе
        window.addEventListener('scroll', updateBananaPositionNearButton);
        window.addEventListener('resize', updateBananaPositionNearButton);
    }

    // Функция возврата к курсору
    function returnToCursor() {
        if (!isLanded) return; // уже следуем
        isLanded = false;
        isFollowingMouse = true;
        // Отписываемся от событий
        window.removeEventListener('scroll', updateBananaPositionNearButton);
        window.removeEventListener('resize', updateBananaPositionNearButton);
        // Обновляем текущие координаты от того места, где банан сейчас
        const rect = banana.getBoundingClientRect();
        currentX = rect.left;
        currentY = rect.top;
        banana.style.transition = 'none';
        if (!rafId) {
            rafId = requestAnimationFrame(updatePosition);
        }
    }

    // Следим за появлением формы
    const contactSection = document.getElementById('contact');
    if (contactSection) {
        const observerContact = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    landNearButton();
                } else {
                    returnToCursor();
                }
            });
        }, { threshold: 0.3 });
        observerContact.observe(contactSection);
    }

    // Ставим банан в начальную позицию (центр экрана)
    currentX = window.innerWidth / 2 - 30;
    currentY = window.innerHeight / 2 - 30;
    banana.style.left = currentX + 'px';
    banana.style.top = currentY + 'px';
})();
