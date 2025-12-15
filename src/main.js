document.addEventListener('DOMContentLoaded', () => {
  console.log("Скрипт v3.0 (Final) запущен!");

  // --- 1. ИНИЦИАЛИЗАЦИЯ ИКОНОК ---
  if (typeof lucide !== 'undefined') {
      lucide.createIcons();
  }

  // --- 2. ПЛАВНЫЙ СКРОЛЛ (LENIS) ---
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

  // --- 3. МОБИЛЬНОЕ МЕНЮ ---
  const burger = document.querySelector('.burger');
  const mobileMenu = document.querySelector('.mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-menu__link');

  if (burger && mobileMenu) {
      burger.addEventListener('click', () => {
          burger.classList.toggle('active');
          mobileMenu.classList.toggle('active');
          // Блокируем скролл страницы, когда меню открыто
          document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
      });

      // Закрываем меню при клике на любую ссылку
      mobileLinks.forEach(link => {
          link.addEventListener('click', () => {
              burger.classList.remove('active');
              mobileMenu.classList.remove('active');
              document.body.style.overflow = '';
          });
      });
  }

  // --- 4. АНИМАЦИИ (GSAP) ---
  gsap.registerPlugin(ScrollTrigger);

  // A. Заголовок Hero (SplitType)
  const splitText = document.querySelector('.split-text');
  if (splitText) {
      splitText.style.opacity = 1; // Показываем текст перед анимацией
      const typeSplit = new SplitType('.split-text', { types: 'lines, words, chars' });
      gsap.from(typeSplit.chars, {
          opacity: 0,
          y: 50,
          rotation: 5,
          duration: 1,
          stagger: 0.05,
          delay: 0.2,
          ease: 'back.out(1.7)'
      });

      // Остальные элементы Hero
      gsap.from('.hero__desc, .hero__btns, .hero__badge', {
          opacity: 0,
          y: 30,
          duration: 1,
          stagger: 0.2,
          delay: 0.8,
          ease: 'power3.out'
      });
  }

  // B. Заголовки всех секций
  gsap.utils.toArray('.section').forEach(section => {
      const elements = section.querySelectorAll('.section__title, .section__subtitle');
      if (elements.length > 0) {
          gsap.from(elements, {
              scrollTrigger: { trigger: section, start: 'top 85%' },
              y: 50,
              opacity: 0,
              duration: 0.8,
              stagger: 0.2
          });
      }
  });

  // C. СЕТКИ И КАРТОЧКИ (ИСПРАВЛЕНО: ГРУЗЯТСЯ ВСЕ ЭЛЕМЕНТЫ)
  // Находим все контейнеры сеток: Преимущества, Блог, Инновации (если есть список)
  const grids = document.querySelectorAll('.about__grid, .blog__grid, .benefits__list');

  grids.forEach(grid => {
      // Анимируем ДЕТЕЙ (children), то есть сами карточки
      const cards = grid.children;

      if (cards.length > 0) {
          gsap.from(cards, {
              scrollTrigger: {
                  trigger: grid,
                  start: 'top 85%', // Начинаем, когда верх сетки чуть выше низа экрана
              },
              y: 50,
              opacity: 0,
              duration: 0.8,
              stagger: 0.2, // Задержка между появлением карточек (0.2 сек)
              ease: 'power2.out',
              clearProps: "all" // Очищаем стили после анимации, чтобы не ломать верстку
          });
      }
  });

  // --- 5. КОНТАКТНАЯ ФОРМА (ВАЛИДАЦИЯ) ---
  const form = document.getElementById('contactForm');

  if (form) {
      const phoneInput = document.getElementById('phone');
      const policyCheckbox = document.getElementById('policy');
      const captchaInput = document.getElementById('captchaInput');
      const captchaLabel = document.getElementById('captchaLabel');
      const statusDiv = document.getElementById('formStatus');

      // 5.1 Блокировка ввода букв в телефон (Мгновенно)
      phoneInput.addEventListener('input', function(e) {
          this.value = this.value.replace(/\D/g, '');
      });

      // 5.2 Математическая капча
      let n1 = Math.floor(Math.random() * 10);
      let n2 = Math.floor(Math.random() * 10);
      if(captchaLabel) captchaLabel.textContent = `Сколько будет ${n1} + ${n2}?`;

      // 5.3 Обработка отправки
      form.addEventListener('submit', function(e) {
          e.preventDefault(); // ОТМЕНА ПЕРЕЗАГРУЗКИ

          let hasError = false;
          const inputs = form.querySelectorAll('input[required]');

          // Сброс старых ошибок (убираем красную обводку и текст)
          document.querySelectorAll('.error-msg').forEach(el => el.style.opacity = '0');
          document.querySelectorAll('.form-group, .form-checkbox').forEach(el => el.classList.remove('error'));

          // Проверка текстовых полей
          inputs.forEach(input => {
              // Чекбокс проверяем отдельно
              if (input.type === 'checkbox') return;

              if (!input.value.trim()) {
                  setError(input);
                  hasError = true;
              }
              // Валидация Email
              if (input.type === 'email' && input.value.trim()) {
                  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                  if (!re.test(input.value)) {
                      setError(input);
                      hasError = true;
                  }
              }
          });

          // Проверка Чекбокса
          if (!policyCheckbox.checked) {
              policyCheckbox.parentElement.classList.add('error');
              hasError = true;
          }

          // Проверка Капчи
          if (parseInt(captchaInput.value) !== (n1 + n2)) {
              setError(captchaInput);
              hasError = true;
          }

          if (hasError) {
              statusDiv.textContent = 'Пожалуйста, проверьте правильность заполнения полей.';
              statusDiv.style.color = '#ff4d4d';
              return;
          }

          // Успешная отправка (Имитация)
          const btn = form.querySelector('button[type="submit"]');
          const oldText = btn.textContent;
          btn.textContent = 'Отправка...';
          btn.disabled = true;

          setTimeout(() => {
              btn.textContent = oldText;
              btn.disabled = false;
              statusDiv.textContent = 'Спасибо! Данные успешно отправлены.';
              statusDiv.style.color = '#ccff00';
              form.reset();

              // Обновляем капчу
              n1 = Math.floor(Math.random() * 10);
              n2 = Math.floor(Math.random() * 10);
              captchaLabel.textContent = `Сколько будет ${n1} + ${n2}?`;

              // Убираем сообщение через 5 сек
              setTimeout(() => { statusDiv.textContent = ''; }, 5000);
          }, 1500);
      });

      // Вспомогательная функция для установки ошибки
      function setError(inputElement) {
          inputElement.parentElement.classList.add('error');
          const msg = inputElement.parentElement.querySelector('.error-msg');
          if(msg) msg.style.opacity = '1';
      }
  }

  // --- 6. COOKIE POPUP ---
  const cookiePopup = document.getElementById('cookiePopup');
  const acceptCookie = document.getElementById('acceptCookie');

  if (cookiePopup && !localStorage.getItem('cookiesAccepted')) {
      setTimeout(() => {
          cookiePopup.classList.add('show');
      }, 2000);
  }

  if (acceptCookie) {
      acceptCookie.addEventListener('click', () => {
          localStorage.setItem('cookiesAccepted', 'true');
          cookiePopup.classList.remove('show');
      });
  }
});