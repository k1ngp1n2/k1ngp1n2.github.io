document.addEventListener("DOMContentLoaded", function(){
    /* Используем скрипт Bootstrap Auto Hide Navbar, чтобы прятать и показывать навбар при прокрутке */
    $('.navbar').bootstrapAutoHideNavbar({
        disableAutoHide: false,
        delta: 5,
        duration: 250,
        shadow: true
    });
    
    /* Используем скрипт ScrollMagic для изменения фона навбара при прокрутке */
    // Инициализируем контроллер
    var controller = new ScrollMagic.Controller();
    
    // Определяем изменения, которые необходимо выполнить
    var menuTween = new TweenMax.to('#menu', 0.5, {
        backgroundColor: 'black'
    });
    // Создаем сцену
    new ScrollMagic.Scene({
            offset: 100     // применяем изменения после скрола на 100 пикселей
        })
        .setTween(menuTween)
        .addTo(controller);
    
    /* Обработчик нажатий клавиш фильтрации статей по тегу */
    $('.tag_filter').click(function(){
        if ($(this).hasClass('active')){
            return;
        }
        $('.tag_filter.active').button('toggle');
        $(this).button('toggle');
        if ($(this).text() === 'All'){
            $('.card').show(300);
        } else {
            $('.card').hide().filter('[data-key="'+$(this).text()+'"]').show(300);
        }
    });
    
    // install flowplayer into all elements with CSS class="player"
    $('.player').flowplayer({       
        ratio: 705/1920,
        volume: 0.1
    });
    
    // убираем большую кнопку play/pause
    $(".fp-ui>.fp-play, .fp-ui>.fp-pause", ".player").remove();
    
    // вывод текущего времени видео в середине окна во время паузы
    /*
    TODO успел сделать только до 59 секунд, т.к. ролик маленький
    */
    var api;
    var currentPos;
    // Отслеживаем щелчки по окну видео
    var checkEl = document.getElementById('checkTime');
    checkEl.addEventListener("click", function(){
        // получаем текущее время
        api = flowplayer('.player');
        // добавляем задержку времени из-за анимации
        currentPos = api.ready ? parseInt(api.video.time + 0.1) : 0;        
        if (currentPos < 10) {
            document.getElementById('curPos').innerText = "00:0"+currentPos;
        } else
            document.getElementById('curPos').innerText = "00:"+currentPos;
    });
    
    $('.owl-carousel').owlCarousel({
        loop:true,
        responsiveClass:true,
        autoplay: true,
        autoplayTimeout: 4000,
        autoplayHoverPause: true,
        responsive:{
            0:{
                items:1,               
                margin:10
            },
            576:{
                items:2,
                margin:20
            },
            768:{
                items:3,
                margin:30
            }
        }
    });
    
    /* Добавляем обработчики щелчков по кнопкам прокрутки слайдера */
    $('.owl-next').click(function() {
        $('.owl-carousel').trigger('next.owl.carousel');
    });
    $('.owl-prev').click(function() {
        $('.owl-carousel').trigger('prev.owl.carousel');
    });
});