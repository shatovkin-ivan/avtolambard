window.addEventListener('DOMContentLoaded', () => {

    // Инициализация и настройка yandex карт

    ymaps.ready(init);

    function init() {
        const myMap = new ymaps.Map("map", {
        center: [52.72503154031792,41.441141447256086],
        zoom: 17,
        controls: [],
        });

        const myPlacemark1 = new ymaps.Placemark([52.72503154031792,41.441141447256086], {}, {
        iconLayout: 'default#image',
        iconImageHref: 'img/placeholder.svg',
        iconImageSize: [50, 68],
        iconImageOffset: [-25, -47]
        });

        myMap.geoObjects.add(myPlacemark1);
    }

    // Инициализация и настройам

    const sumSlider = document.querySelector('#sum-slider');
    
    if (sumSlider) {
        noUiSlider.create(sumSlider, {
            start: [300000],
            connect: 'lower',
            range: {
                'min': 20000,
                'max': 3000000
            },
            step: 1000,
        });
    }
    
    const timeSlider = document.querySelector('#time-slider');

    if (timeSlider) {
        noUiSlider.create(timeSlider, {
            start: [3],
            connect: 'lower',
            range: {
                'min': 1,
                'max': 36
            },
            step: 1,
        });
    }

    // Маска для инпутов
    
    const selectors = document.querySelectorAll("input[type='tel']");

    for (selector of selectors) {
        const im = new Inputmask("+7 (999) 999-99-99");
        im.mask(selector);
    }

    // Прокрутка к верху страницы

    const scrollTopBtn = document.querySelector('.scroll-top');

    scrollTopBtn.addEventListener('click', (e) => {
        e.preventDefault();
        $('html').animate ({ 
            scrollTop: $('html').offset().top
            }, 500
        );
    })

    window.addEventListener('scroll', () => {

        // Фиксированное меню

        const main = document.querySelector('#main'),
        header = document.querySelector('.header'),
        headerHeigth = header.offsetHeight;

        if (window.pageYOffset > 300) {
            header.classList.add('fixed');
            main.style.paddingTop = headerHeigth + 'px';
            scrollTopBtn.classList.add('active');
        }
        else {
            header.classList.remove('fixed');
            main.style.paddingTop = 0 + 'px';
            scrollTopBtn.classList.remove('active');
        }
    })

    // Модальные окна

    const opentModal = document.querySelectorAll('.open-modal'),
    overlay = document.querySelector('.overlay'),
    close = document.querySelector('.close'),
    body = document.querySelector('body'),
    successClose = document.querySelector('.modal__success-close');
    if (opentModal) {
        opentModal.forEach(currentModal => {
            currentModal.addEventListener('click', () => {
                overlay.classList.add('active');
                body.style.overflow = 'hidden';
                body.style.paddingRight = getScrollbarWidth() + 'px';
            })
            close.addEventListener('click', () => {
                closeModal();
            })
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) {
                    closeModal();
                }
            })
            successClose.addEventListener('click', () => {
                closeModal();
            })
        })
    }

    // Аккордеон

    const tabLink = document.querySelectorAll('.questions__item-title');
    tabLink.forEach(currentTabLink => {
        currentTabLink.addEventListener('click', () => {
            let itemHeight = currentTabLink.nextElementSibling.querySelector('.questions__dropdown-content').offsetHeight;
            if (currentTabLink.classList.contains('active')) {
                currentTabLink.classList.remove('active');
                currentTabLink.nextElementSibling.style.maxHeight = 0 + 'px';
            }
            else {
                currentTabLink.classList.add('active');
                currentTabLink.nextElementSibling.style.maxHeight = itemHeight + 'px';
            }
        })
    })

    // Выпадающее меню

    const burger = document.querySelector('.burger'),
    menu = document.querySelector('.menu');

    burger.addEventListener('click', () => {
        if (burger.classList.contains('active')) {
            closeMenu()
        }
        else {
            burger.classList.add('active');
            menu.classList.add('active');
        }
    })

    // Якорные ссылки

    $('.anchor').on( 'click', function(){ 
        var el = $(this);
        var dest = el.attr('href');
        if(dest !== undefined && dest !== '') {
            $('html').animate ({ 
                scrollTop: $(dest).offset().top
                }, 500
            );
        }
        return false;
    });

    // Калькулятор

    getSum();
    getTime();

    if (sumSlider && timeSlider) {
        sumSlider.noUiSlider.on('update', function (values, handle) {
            document.querySelector('#sum').textContent = Math.round(values[handle]);
            document.querySelector('#per-mounth').textContent = calcMounthPay();
            document.querySelector('#total-sum').textContent = calcTotalSum();
            
        });
        timeSlider.noUiSlider.on('update', function (values, handle) {
            
            document.querySelector('#time').textContent = Math.round(values[handle]);
            document.querySelector('#per-mounth').textContent = calcMounthPay();
            document.querySelector('#total-sum').textContent = calcTotalSum();
        });
    }

    // Функции калькулятора

    function getSum () {
        if (sumSlider) {
            sumSlider.noUiSlider.on('update', function (values, handle) {
                return sumSliderValue = +sumSlider.noUiSlider.get();
            });
        }
    }
    function getTime () {
        if (timeSlider) {
            timeSlider.noUiSlider.on('update', function (values, handle) {
                return timeSliderValue = +timeSlider.noUiSlider.get();
            });
        }
    }
    
    function calcTotalSum() {
        let percent = timeSliderValue * 2 / 100, 
        totalSum = sumSliderValue + sumSliderValue * percent;
        return totalSum;
    }   

    function calcMounthPay() {
        let mounthPay = Math.round(calcTotalSum() / timeSliderValue);
        return mounthPay;
    }

    // Функция скрытия модального окна

    function closeModal() {
        overlay.classList.remove('active');
        body.style.overflow = 'visible';
        body.style.paddingRight = 0 + 'px';
    }

    // Функция скрытия меню

    function closeMenu() {
        burger.classList.remove('active');
        menu.classList.remove('active');
    }
    
    // Функция расчета ширины скроллбара

    function getScrollbarWidth() {
        const outer = document.createElement('div');
        outer.style.visibility = 'hidden';
        outer.style.overflow = 'scroll'; 
        outer.style.msOverflowStyle = 'scrollbar';
        document.body.appendChild(outer);
      
        const inner = document.createElement('div');
        outer.appendChild(inner);
      
        const scrollbarWidth = (outer.offsetWidth - inner.offsetWidth);
      
        outer.parentNode.removeChild(outer);

        return scrollbarWidth;
    }
})