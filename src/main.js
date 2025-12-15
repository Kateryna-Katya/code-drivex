document.addEventListener('DOMContentLoaded', () => {
    // 1. ИНИЦИАЛИЗАЦИЯ ИКОНОК
    lucide.createIcons();

    // 2. SMOOTH SCROLL (LENIS)
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smooth: true,
    });
    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // 3. МОБИЛЬНОЕ МЕНЮ (ИСПРАВЛЕНО)
    const burger = document.querySelector('.burger');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-menu__link');
    const body = document.body;

    function toggleMenu() {
        burger.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        // Блокируем скролл фона
        if (mobileMenu.classList.contains('active')) {
            lenis.stop();
            body.style.overflow = 'hidden';
        } else {
            lenis.start();
            body.style.overflow = '';
        }
    }

    burger.addEventListener('click', toggleMenu);

    // Закрытие при клике на ссылку
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            toggleMenu();
        });
    });

    // 4. GSAP ANIMATIONS
    gsap.registerPlugin(ScrollTrigger);

    // Анимация заголовка Hero (SplitType)
    const typeSplit = new SplitType('.split-text', { types: 'lines, words, chars' });
    
    gsap.from(typeSplit.chars, {
        opacity: 0,
        y: 50,
        rotation: 5,
        duration: 1,
        stagger: 0.05,
        ease: 'back.out(1.7)',
        delay: 0.2
    });

    gsap.from('.hero__desc, .hero__btns, .hero__badge', {
        opacity: 0,
        y: 30,
        duration: 1,
        stagger: 0.2,
        delay: 0.8,
        ease: 'power3.out'
    });

    // Анимация секций при скролле
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        gsap.from(section.querySelectorAll('.section__title, .section__subtitle'), {
            scrollTrigger: {
                trigger: section,
                start: 'top 80%',
            },
            y: 50,
            opacity: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: 'power2.out'
        });
    });

    // Анимация карточек (stagger)
    gsap.utils.toArray('.about__grid, .blog__grid').forEach(grid => {
        gsap.from(grid.children, {
            scrollTrigger: {
                trigger: grid,
                start: 'top 85%',
            },
            y: 50,
            opacity: 0,
            duration: 0.8,
            stagger: 0.15,
            ease: 'power2.out'
        });
    });

    // 5. КОНТАКТНАЯ ФОРМА & ВАЛИДАЦИЯ
    const form = document.getElementById('contactForm');
    const inputs = form.querySelectorAll('input[required]');
    const captchaLabel = document.getElementById('captchaLabel');
    const captchaInput = document.getElementById('captchaInput');
    const statusDiv = document.getElementById('formStatus');

    // Генерация простой мат. капчи
    let num1 = Math.floor(Math.random() * 10);
    let num2 = Math.floor(Math.random() * 10);
    captchaLabel.textContent = `Сколько будет ${num1} + ${num2}?`;

    // Валидация телефона (только цифры)
    const phoneInput = document.getElementById('phone');
    phoneInput.addEventListener('input', function(e) {
        this.value = this.value.replace(/[^0-9+]/g, '');
    });

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        let isValid = true;
        
        // Сброс ошибок
        document.querySelectorAll('.form-group').forEach(g => g.classList.remove('error'));

        // Проверка полей
        inputs.forEach(input => {
            if (!input.value.trim()) {
                input.parentElement.classList.add('error');
                isValid = false;
            }
            // Проверка Email
            if (input.type === 'email') {
                const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!re.test(input.value)) {
                    input.parentElement.classList.add('error');
                    isValid = false;
                }
            }
        });

        // Проверка капчи
        if (parseInt(captchaInput.value) !== (num1 + num2)) {
            captchaInput.parentElement.classList.add('error');
            isValid = false;
        }

        if (isValid) {
            // Имитация AJAX отправки
            const btn = form.querySelector('button');
            const originalText = btn.textContent;
            btn.textContent = 'Отправка...';
            btn.disabled = true;

            setTimeout(() => {
                btn.textContent = originalText;
                btn.disabled = false;
                statusDiv.textContent = 'Спасибо! Мы свяжемся с вами в ближайшее время.';
                statusDiv.style.color = '#ccff00';
                form.reset();
                // Новая капча
                num1 = Math.floor(Math.random() * 10);
                num2 = Math.floor(Math.random() * 10);
                captchaLabel.textContent = `Сколько будет ${num1} + ${num2}?`;
            }, 1500);
        }
    });

    // 6. COOKIE POPUP
    const cookiePopup = document.getElementById('cookiePopup');
    const acceptCookie = document.getElementById('acceptCookie');

    if (!localStorage.getItem('cookiesAccepted')) {
        setTimeout(() => {
            cookiePopup.classList.add('show');
        }, 2000);
    }

    acceptCookie.addEventListener('click', () => {
        localStorage.setItem('cookiesAccepted', 'true');
        cookiePopup.classList.remove('show');
    });
});