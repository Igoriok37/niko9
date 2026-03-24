const slider = document.getElementById('mainSlider');
const slides = document.querySelectorAll('.slide');
let currentIdx = 0;
let isMoving = false;


function goToSection(index) {
  if (index < 0 || index >= slides.length || isMoving) return;
  isMoving = true;

  // Убираем активный класс у всех и ставим спец. класс для уходящего слайда
  slides.forEach((s, i) => {
    s.classList.remove('active', 'exit-up');
    if (i < index) s.classList.add('exit-up');
  });

  // Двигаем весь контейнер
  slider.style.transform = `translateY(-${index * 100}vh)`;

  // Активируем новый слайд
  slides[index].classList.add('active');

  // Блокировка на время анимации
  setTimeout(() => {
    currentIdx = index;
    isMoving = false;
  }, 1200); // Совпадает с CSS transition
}



let rotationTimer;
let heroCube = document.getElementById('hero-cube');
let sides = heroCube.querySelectorAll('.side');
let step = 0;
let isCubeAllowedToRotate = false; // Перенесли вверх для надежности

window.addEventListener('DOMContentLoaded', () => {
  const box = document.querySelector('.logo-box');
  const parts = document.querySelectorAll('.logo-parti');

  if (!box || parts.length === 0) return;

  // ШАГ 1: Разбрасываем детали мгновенно
  parts.forEach((part, index) => {
    const spreadX = (Math.random() - 0.5) * window.innerWidth * 2;
    const spreadY = (Math.random() - 0.5) * window.innerHeight * 2;
    const spreadZ = (Math.random() - 0.5) * 1000;
    const randomRotate = (Math.random() - 0.5) * 720;

    part.style.transition = 'none';
    part.style.transform = `translate3d(${spreadX}px, ${spreadY}px, ${spreadZ}px) rotate(${randomRotate}deg) scale(0.2)`;
    part.style.opacity = "0";
    part.dataset.delay = (index * 0.05).toFixed(2);
  });

  // ШАГ 2: Запускаем сборку
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      parts.forEach(part => {
        part.style.transition = '';
        part.style.transitionDelay = `${part.dataset.delay}s`;
        part.style.opacity = "1";
      });
      box.classList.add('is-assembled');
    });
  });

  // ... (Твой ШАГ 2 остается без изменений) ...

// ШАГ 3: Активация куба (ТОЛЬКО ДЛЯ ДЕСКТОПА)
const isMobile = window.innerWidth <= 768; // Проверка устройства

if (!isMobile) {
    // Этот блок сработает только на компьютерах
    setTimeout(() => {
      document.body.classList.add('show-cube');

      // Разрешаем вращение и запускаем цикл
      setTimeout(() => {
        isCubeAllowedToRotate = true;
        if (typeof startInfiniteLoop === 'function') startInfiniteLoop();
        console.log("Вращение запущено (Desktop)");
      }, 500);

    }, 1500);
} else {
    // НА МОБИЛКЕ: Брусок не включаем, логотип просто остается собранным
    console.log("Мобильная версия: оставляем собранный логотип в центре");
    
    // Обязательно убедись, что .static-logo в углу виден сразу
    const staticLogo = document.querySelector('.static-logo');
    if (staticLogo) staticLogo.classList.add('visible');
}

});

function startInfiniteLoop() {
  if (!isCubeAllowedToRotate) return;

  clearTimeout(rotationTimer);

  rotationTimer = setTimeout(() => {
    performRotation(); // Шаг 1

    rotationTimer = setTimeout(() => {
      performRotation(); // Шаг 2
      console.log("Замерли на ПЛОТНОМ слове");

      rotationTimer = setTimeout(() => {
        performRotation(); // Шаг 3

        rotationTimer = setTimeout(() => {
          performRotation(); // Шаг 4 (Architecture)

          rotationTimer = setTimeout(() => {
            heroCube.style.transition = 'none';
            step = 0;
            heroCube.style.transform = `rotateX(0deg)`;

            rotationTimer = setTimeout(() => {
              heroCube.style.transition = 'transform 2s cubic-bezier(0.19, 1, 0.22, 1)';
              startInfiniteLoop();
            }, 100);
          }, 5000);
        }, 1200);
      }, 1500);

    }, 1200);
  }, 3000);
}

function performRotation() {
  step++;
  heroCube.style.transform = `rotateX(${step * -90}deg)`;
  const currentIndex = step % 4;
  sides.forEach((side, index) => {
    side.classList.toggle('active-side', index === currentIndex);
  });
}

// ВНИМАНИЕ: вызов startInfiniteLoop() отсюда УДАЛЕН. 
// Он теперь вызывается только внутри логики сборки выше.

let isScrolling = false;
const viewport = document.querySelector('.cube-viewport');
// ... остальной твой код скролла ...


// --- 1. ПЕРЕМЕННЫЕ ДЛЯ ПЛАВНОСТИ ---
let currentScroll = window.scrollY;
let targetScroll = window.scrollY;
const ease = 0.04;
let isHeroActive = true;
let lastScrollY = 0; // Добавь эту переменную в начало файла


function updateLogoAnimation() {
  currentScroll += (targetScroll - currentScroll) * ease;
  const vh = window.innerHeight;
  const progressBar = document.getElementById('progressBar');
  const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
  const totalProgress = currentScroll / totalHeight;
  // --- УПРАВЛЕНИЕ ХЕДЕРОМ ---
const header = document.querySelector('.main-header');
const actualScroll = window.scrollY; // Берем реальный скролл для точности направления

if (header) {
    // ЭТАП 1: Перекрашиваем в белый (на 4-й шторке)
    if (currentScroll > vh * 5.45) {
        header.classList.add('header-light');
    } else {
        header.classList.remove('header-light');
    }

    // ЭТАП 2: Прятки (после 5-го экрана)
    if (actualScroll > vh * 5.35) {
        // Если крутим ВНИЗ — прячем. Если ВВЕРХ — показываем.
        // Добавим порог в 10px, чтобы хедер не дрожал от микро-движений
        if (actualScroll > lastScrollY + 10) {
            header.classList.add('header-hidden');
        } else if (actualScroll < lastScrollY - 10) {
            header.classList.remove('header-hidden');
        }
    } else {
        // Если мы вернулись выше 5-го экрана — всегда показываем хедер
        header.classList.remove('header-hidden');
    }

    lastScrollY = actualScroll; // Запоминаем текущий скролл для следующего кадра
}

 if (window.innerWidth <= 768) {
  if (header) {
    // ЭТАП 1: Перекрашиваем в белый (на 4-й шторке)
    if (currentScroll > vh * 5.3) {
        header.classList.add('header-light');
    } else {
        header.classList.remove('header-light');
    }

    // ЭТАП 2: Прятки (после 5-го экрана)
    if (actualScroll > vh * 5) {
        // Если крутим ВНИЗ — прячем. Если ВВЕРХ — показываем.
        // Добавим порог в 10px, чтобы хедер не дрожал от микро-движений
        if (actualScroll > lastScrollY + 10) {
            header.classList.add('header-hidden');
        } else if (actualScroll < lastScrollY - 10) {
            header.classList.remove('header-hidden');
        }
    } else {
        // Если мы вернулись выше 5-го экрана — всегда показываем хедер
        header.classList.remove('header-hidden');
    }

    lastScrollY = actualScroll; // Запоминаем текущий скролл для следующего кадра
}
}
 
    if (progressBar) {
      progressBar.style.transform = `scaleX(${totalProgress})`;
    }
        const s1 = document.getElementById('slide-1');
        const s2 = document.getElementById('slide-2');
        const s3 = document.getElementById('slide-3');
        const s4 = document.getElementById('slide-4');
        const s5 = document.getElementById('slide-5');
        
        // --- ЛОГИКА РАСКРЫТИЯ (REVEAL) ---
        if (s1) {
          // Он улетает вверх ровно на столько, на сколько прокрутили
          // Скорость 1:1 с бруском, так как используется тот же currentScroll
          s1.style.transform = `translate3d(0, ${-currentScroll}px, 0)`;
          
          // Опционально: гасим его, когда он полностью ушел за экран
          s1.style.opacity = currentScroll > vh ? 0 : 1;
      }
    
        // 1. Двигаем ВТОРОЙ слайд (после 100vh), чтобы открыть ТРЕТИЙ
        if (currentScroll > vh) {
          const s2Offset = currentScroll - vh; 
          if (s2) s2.style.transform = `translate3d(0, ${-s2Offset}px, 0)`;
      } else {
          if (s2) s2.style.transform = `translate3d(0, 0, 0)`;
      }
    
        // 2. Двигаем ТРЕТИЙ слайд (после 200vh), чтобы открыть ЧЕТВЕРТЫЙ
        if (currentScroll > vh * 2) {
          let s3Offset = currentScroll - vh * 2;
          if (s3) s3.style.transform = `translate3d(0, ${-s3Offset}px, 0)`;
      } else {
          if (s3) s3.style.transform = `translate3d(0, 0, 0)`;
      }
    
    if (currentScroll > vh * 3) {
          let s4Offset = currentScroll - vh * 3;
          if (s4) s4.style.transform = `translate3d(0, ${-s4Offset}px, 0)`;
      } else {
          if (s4) s4.style.transform = `translate3d(0, 0, 0)`;
      } 
     
         // 4. Активация и Параллакс текстов
      const t2 = s2?.querySelector('.reveal-text');
      const t3 = s3?.querySelector('.reveal-text');
      const t4 = s4?.querySelector('.reveal-text');
    
      if (currentScroll > vh * 0.4) {
          s2?.classList.add('active');
          // ПАРАЛЛАКС для 2 слайда: текст чуть отстает от шторки
          if (t2 && currentScroll > vh) {
              let p2 = 90 - (currentScroll - vh) * 0.05;
              t2.style.transform = `translate3d(0%, ${p2}%, 0)`;
          }
      } else {
          s2?.classList.remove('active');
          if (t2) t2.style.transform = `translate3d(0%, 90%, 0)`;
      }
    
      if (currentScroll > vh * 1.2) {
          s3?.classList.add('active');
          // ПАРАЛЛАКС для 3 слайда
          if (t3 && currentScroll > vh * 2) {
              let p3 = 90 - (currentScroll - vh * 2) * 0.05;
              t3.style.transform = `translate3d(0%, ${p3}%, 0)`;
          }
      } else {
          s3?.classList.remove('active');
          if (t3) t3.style.transform = `translate3d(0%, 90%, 0)`;
      }
    
      if (currentScroll > vh * 2.4) {
          s4?.classList.add('active');
          // ПАРАЛЛАКС для 3 слайда
          if (t4 && currentScroll > vh * 3) {
              let p4 = 90 - (currentScroll - vh * 3) * 0.05;
              t4.style.transform = `translate3d(0%, ${p4}%, 0)`;
          }
      } else {
          s4?.classList.remove('active');
          if (t4) t4.style.transform = `translate3d(0%, 90%, 0)`;
      }

      const isMobile = window.innerWidth <= 768; // Проверка устройства

      const viewport = document.querySelector('.cube-viewport');
      if (!viewport) return; 
      
      if (viewport && !isMobile) {
      const vw = document.documentElement.clientWidth;
      const finishDistance = vh - 100;
      
      let progress = currentScroll / finishDistance;
      if (progress > 1) progress = 1;
      if (progress < 0) progress = 0;
      
      // Твои настройки ОТСТУПА ОТ КРАЯ (теперь это чистый зазор)
      let targetX = 50;
      let targetY = 15;
      
      if (window.innerWidth <= 1280) {
          targetX = 40;
          targetY = 15; 
      }
      if (window.innerWidth <= 768) {
          targetX = 15;
          targetY = 15; 
      }

      const baseVmin = 30; 
      const vminPx = Math.min(vw, vh) / 100;
      const currentBaseSize = baseVmin * vminPx;

      
      // 1. Считаем текущий масштаб
      const currentScale = 1 + (0.25 - 1) * progress;
      
      // 2. ПОПРАВКА НА РАЗМЕР: 
      // Получаем реальные размеры вьюпорта в пикселях и умножаем на масштаб
      const halfSize = (currentBaseSize * currentScale) / 2;
      const halfH = (currentBaseSize * currentScale) / 2;
      
      // По X: Отступ + половина (привязка к КРАЮ)
const finalTargetX = targetX + halfSize; 
// По Y: Просто твой отступ (привязка к ЦЕНТРУ)
const finalTargetY = targetY + halfH;

const moveX = (finalTargetX - vw / 2) * progress;
const moveY = (finalTargetY - vh / 2) * progress;

      
      // ПРИМЕНЯЕМ ТРАНСФОРМАЦИЮ
      viewport.style.transform = `translate3d(calc(-50% + ${moveX}px), calc(-50% + ${moveY}px), 0) scale(${currentScale})`;
      


  // Переменная-флаг (проверь, чтобы она была объявлена вверху скрипта)
  let isHeroActive = true;


  // 1. ЛОГИКА ОСТАНОВКИ (когда улетаем в угол)
  if (progress > 0.05 && isHeroActive) {
    isHeroActive = false; // "Закрываем замок"
    clearTimeout(rotationTimer); // Останавливаем вращение

    // Докручиваем до плотной грани, если нужно
    if (step % 2 !== 0) {
      performRotation();
    }
    console.log("Улетели: Вращение остановлено");
  }

  // 2. ЛОГИКА ЗАПУСКА (когда вернулись в самый верх)
  else if (progress <= 0.05 && !isHeroActive) {
    isHeroActive = true; // "Открываем замок"

    // ОЧЕНЬ ВАЖНО: сначала очищаем все старые таймеры, чтобы не было накладок
    clearTimeout(rotationTimer);

    // Запускаем цикл заново только ОДИН раз
    startInfiniteLoop();
    console.log("Вернулись: Вращение запущено");
  }

  const allSides = viewport.querySelectorAll('.side');

  // 1. Уходим в угол (Скрываем лишнее)
  if (progress > 0.05) { // Начинаем чуть раньше, чтобы скрыть "полоски"
    allSides.forEach((side) => {
      if (!side.classList.contains('active-side')) {
        side.style.display = "none";
        side.style.opacity = "0";
      }
    });
  }

  // 2. Возвращаемся в центр (Проявляем грани)
  else if (progress <= 0.05) {
    allSides.forEach((side) => {
      // Возвращаем физическое присутствие граней
      side.style.display = "flex";

      // Но прозрачность оставляем только той, что была активна
      // Остальные проявятся сами, когда запустится startInfiniteLoop()
      if (side.classList.contains('active-side')) {
        side.style.opacity = "1";
      } else {
        side.style.opacity = "0"; // Или 0.05 для легкого объема
      }
    });
  }

  // Находим точку, где брусок уже "встал" в логотип (например, 0.98)
const isLogoDocked = progress > 0.999;

if (isLogoDocked) {
    // Мгновенно скрываем, когда долетел
    viewport.style.opacity = "0";
    viewport.style.visibility = "hidden"; // Добавим для надежности
    viewport.style.pointerEvents = "none";
} else {
    // Держим полностью видимым во время всего полета
    viewport.style.opacity = "1";
    viewport.style.visibility = "visible";
    viewport.style.pointerEvents = "auto";
}
      }
  requestAnimationFrame(updateLogoAnimation);
}

// --- 3. ОБРАБОТЧИК СКРОЛЛА (только фиксирует цель) ---
window.addEventListener('scroll', () => {
  targetScroll = window.scrollY;
}, { passive: true });

// --- 4. ЗАПУСК ВСЕГО ПРОЦЕССА ---
requestAnimationFrame(updateLogoAnimation);

window.addEventListener('DOMContentLoaded', () => {
  const box = document.querySelector('.logo-box');
  const scrollPos = window.scrollY;
  // Проверка: мобильное ли это устройство
  const isMobile = window.innerWidth <= 768;

  // ЕСЛИ МЫ ВВЕРХУ (скролл меньше 100px) — запускаем сборку
  if (scrollPos < 100) {
      // Здесь твоя логика запуска анимации (GSAP или CSS классы)
      // На мобилке она просто отработает и логотип останется в центре
  } 
  // ЕСЛИ МЫ УЖЕ ПРОСКРОЛЛИЛИ
  else {
      if (isMobile) {
          // НА МОБИЛКЕ: не скрываем детали, не показываем брусок
          if (box) box.style.display = 'block'; // Убедимся, что детали видны
          document.body.classList.remove('show-cube'); // Брусок не нужен
      } else {
          // НА ДЕСКТОПЕ: старая логика подмены
          if (box) box.style.display = 'none'; 
          document.body.classList.add('show-cube'); 
          isCubeAllowedToRotate = true; 
          if (typeof startInfiniteLoop === 'function') startInfiniteLoop();
      }
  }
});



let isLogoMode = false; // Флаг состояния

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  const viewport = document.querySelector('.cube-viewport');

  // Уходим вниз (в режим логотипа)
  if (scrollY > 50 && !isLogoMode) {
    isLogoMode = true; // Блокируем повторные вызовы

    stopRotation(); // Твоя функция clearTimeout

    // Докручиваем только ОДИН раз, если замерли на контурном слове
    if (step % 2 !== 0) {
      console.log("Разовая докрутка до плотного слова");
      performRotation();
    }

    viewport.classList.add('as-logo');
  }

  // Возвращаемся наверх
  else if (scrollY <= 50 && isLogoMode) {
    isLogoMode = false;
    viewport.classList.remove('as-logo');

    // Запускаем цикл вращения снова через паузу
    setTimeout(() => {
      if (!isLogoMode) startInfiniteLoop();
    }, 1500);
  }
});



// Функция принудительной остановки
function stopRotation() {
  // Очищаем основной таймер
  clearTimeout(rotationTimer);

  // ХИТРОСТЬ: Очищаем вообще все таймеры в браузере, 
  // чтобы "забытые" вложенные setTimeout не выстрелили позже
  let id = window.setTimeout(function () { }, 0);
  while (id--) {
    window.clearTimeout(id);
  }

  console.log("Полная очистка таймеров выполнена");
}

document.addEventListener('DOMContentLoaded', () => {
  const burger = document.getElementById('burger');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  burger.addEventListener('click', () => {
    document.body.classList.toggle('menu-open');

    // Чтобы при открытом меню нельзя было скроллить основной сайт
    if (document.body.classList.contains('menu-open')) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  });

  // Закрываем меню при клике на любую ссылку
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      document.body.classList.remove('menu-open');
      document.body.style.overflow = '';
    });
  });
});

/* const filterButtons = document.querySelectorAll('.filter-btn');
const projectItems = document.querySelectorAll('.project-item');

filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filterValue = btn.getAttribute('data-filter');

        projectItems.forEach(item => {
            const itemType = item.getAttribute('data-type');

            if (filterValue === 'all' || itemType === filterValue) {
                item.classList.remove('hide');
            } else {
                item.classList.add('hide');
            }
        });
    });
}); */

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  const vh = window.innerHeight;
  const s5 = document.getElementById('slide-5');
  

  // 1. УПРАВЛЕНИЕ 4-Й ШТОРКОЙ (Стык на 300vh - 400vh)
  if (s5) {
      if (scrollY > vh * 4.3 && scrollY <= vh * 5.3) {
          let offset = scrollY - vh * 4.3;
          s5.style.transform = `translate3d(0, ${-offset}px, 0)`;
      } else if (scrollY <= vh * 4.3) {
          s5.style.transform = `translate3d(0, 0, 0)`;
      } else {
          // Чтобы при быстром скролле шторка точно улетела
          s5.style.transform = `translate3d(0, -100vh, 0)`;
      }
  }

  // 2. УПРАВЛЕНИЕ КОНТЕНТОМ (Стык на 400vh)
  // Если ты хочешь, чтобы контент просто стоял в потоке (без JS-движения):
  // Просто задай в CSS .slider { height: 400vh; } и всё. 
  // Браузер сам подтянет контент к краю 4-й шторки.
});

// Эта функция запустится ТОЛЬКО когда Swiper загрузится
window.initMySite = function() {
  console.log("Swiper успешно загружен. Запускаем слайдер...");

  const sourceCards = Array.from(document.querySelectorAll('#source-projects .project-item'));
  const wrapper = document.getElementById('projects-wrapper');
  let swiperInstance;

  function updateSwiper(filterValue) {
    const container = document.querySelector('.projects-container');
    

    // 1. Сначала скрываем контейнер
    container.classList.remove('swiper-ready');

     // 2. Небольшая задержка (150мс), пока контейнер прозрачный
    setTimeout(() => {
      if (swiperInstance) swiperInstance.destroy(true, true);
      wrapper.innerHTML = '';

      const filtered = filterValue === 'all' 
          ? sourceCards 
          : sourceCards.filter(card => card.dataset.type === filterValue);

      filtered.forEach(card => {
          const slide = document.createElement('div');
          slide.className = 'swiper-slide';
          slide.appendChild(card.cloneNode(true)); 
          wrapper.appendChild(slide);
      });

      // Инициализация (slidesPerView: 'auto' требует ширины в CSS!)
      swiperInstance = new Swiper('.projects-container', {
        slidesPerView: 1.2, 
          spaceBetween: 10,
          grabCursor: true,
          freeMode: true,
          mousewheel: { forceToAxis: true },

             // Адаптив:
    breakpoints: {
        // Когда ширина экрана >= 768px (Планшеты)
        768: {
            slidesPerView: 1.5,
            spaceBetween: 20,
        },
        // Когда ширина экрана >= 1024px (Десктоп)
        1024: {
            slidesPerView: 2.2, // Видно две полных и край третьей
            spaceBetween: 30,
        }
    }
      });
      container.classList.add('swiper-ready');
    }, 150); 
  }

  // Слушатели фильтров
  document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
          const filter = e.currentTarget.getAttribute('data-filter');
          updateSwiper(filter);
          document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
          e.currentTarget.classList.add('active');
      });
  });

  // Первый запуск
  updateSwiper('all');
};

// На случай, если Swiper загрузился ОЧЕНЬ быстро
if (window.isSwiperReady) window.initMySite();


const newsSwiper = new Swiper('.news-container', {
  slidesPerView: 1.2, 
          spaceBetween: 10,
          grabCursor: true,
          freeMode: true,
          mousewheel: { forceToAxis: true },

             // Адаптив:
    breakpoints: {
        // Когда ширина экрана >= 768px (Планшеты)
        768: {
            slidesPerView: 1.5,
            spaceBetween: 20,
        },
        // Когда ширина экрана >= 1024px (Десктоп)
        1024: {
            slidesPerView: 2.5, // Видно две полных и край третьей
            spaceBetween: 30,
        }
    }
      });

