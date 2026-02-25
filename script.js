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
            themeToggle.querySelector('i').classList.toggle('fa-sun');
            themeToggle.querySelector('i').classList.toggle('fa-moon');
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
});