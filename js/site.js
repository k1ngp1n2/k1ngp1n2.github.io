// Адрес сервера
const SERVER_URL = 'http://89.108.65.123:8080';
// id пользователя
let userID = '';
// Авторизуем пользователя
userAuthorization();
// Устанавливаем флаг необходимости загрузки списка населенных пунктов при первом открытии страницы с формой обратной связи
let citiesLoaded = false;
/** Абстрактный элемент страницы (суперкласс) */
function Container() {
    this.id = "";
    this.className = "";
    this.htmlCode = "";
}
/** Визуализирует элемент на странице
 * @return {String} html-код для встраивания в страницу */
Container.prototype.render = function() {
    return this.htmlCode;
};
/** Удаляет контейнер по id */
Container.prototype.remove = function() {
    try {
        // бросаем исключение, если объект не имеет id
        if (this.id === "") throw new Error(`Удаление элемента класса ${this.className} невозможно, т.к. элементу не присвоен id`);
        // удаляем объект
        $('#' + this.id).remove();
    }
    catch (e) {
        // выводим сообщение об ошибке
        console.error(e.message);
    }
};
/** Класс Меню (подкласс класса Container)
 * @param my_id {String} id меню
 * @param my_class {String} класс меню
 * @param my_items {Array} разделы меню */
function Menu(my_id, my_class, my_items) {
    // Вызываем конструктор класса Container
    Container.call(this);
    // Сохраняем аргументы
    this.id = my_id;
    this.className = my_class;
    this.items = my_items;
}
// Задаем в качестве прототипа класса Меню новый объект с прототипом объекта Container (расширяем класс Container)
Menu.prototype = Object.create(Container.prototype);
Menu.prototype.constructor = Menu;
/** Визуализирует меню на странице
 * @return {String} html-код для встраивания в страницу
 * @override */
Menu.prototype.render = function() {
    let menuItems = document.createElement("ul");
    menuItems.className = this.className;
    menuItems.id = this.id;
    // Обходим все свойства объекта класса Меню
    for (let item in this.items) {
        // Обрабатываем все вложенные меню и пункты меню
        if (this.items[item] instanceof NestedMenu || this.items[item] instanceof MenuItem) {
            // Визуализируем вложенное меню или и пункт меню
            menuItems.innerHTML += this.items[item].render();
        }
    }
    return menuItems.outerHTML;
};

/** Класс Вложенное меню (подкласс класса Menu)
 * @param my_id {String} id вложенного меню
 * @param my_class {String} класс вложенного меню
 * @param my_items {Array} массив с разделами для вложенного подменю, первым элементом является заголовок меню */
function NestedMenu(my_id, my_class, my_items) {
    // Вызываем конструктор класса Menu
    Menu.call(this, my_id, my_class, my_items);
}
// Задаем в качестве прототипа класса Вложенное меню новый объект с прототипом объекта Menu (расширяем класс Menu)
NestedMenu.prototype = Object.create(Menu.prototype);
NestedMenu.prototype.constructor = NestedMenu;
/** Визуализирует вложенное меню на странице
 * @return {String} html-код для встраивания в страницу
 * @override */
NestedMenu.prototype.render = function() {
    let nestedMenuItems = document.createElement("li");
    nestedMenuItems.className = this.className;
    nestedMenuItems.id = this.id;
    nestedMenuItems.innerHTML = `<span onclick="${this.items[0].href}">${this.items[0].itemName}</span><ul></ul>`;
    // Обходим все свойства объекта класса Вложенное меню
    for (let item in this.items) {
        // Обрабатываем все вложенные меню и пункты вложенного меню
        if (item > 0 && (this.items[item] instanceof MenuItem || this.items[item] instanceof NestedMenu)) {
            nestedMenuItems.querySelector("ul").innerHTML += this.items[item].render();
        }
    }
    return nestedMenuItems.outerHTML;
};
/** Класс Пункт меню
 * @param my_href {String} ссылка на страницу сайта для перехода по клику на пункте меню
 * @param my_name {String} название пункта меню */
function MenuItem(my_href, my_name) {
    // Вызываем конструктор класса Container
    Container.call(this);
    this.className = "menu-item";
    // Сохраняем аргументы
    this.href = my_href;
    this.itemName = my_name;
}
// Задаем в качестве прототипа класса Пункт меню новый объект с прототипом объекта Container (расширяем класс Container)
MenuItem.prototype = Object.create(Container.prototype);
MenuItem.prototype.constructor = MenuItem;
/** Визуализирует пункт меню на странице
 * @return {String} html-код для встраивания в страницу
 * @override */
MenuItem.prototype.render = function() {
    let menuItem = document.createElement("li");
    menuItem.className = this.className;
    menuItem.innerHTML = `<span onclick="${this.href}">${this.itemName}</span>`;
    return menuItem.outerHTML;
};

/** Класс Карточка (подкласс класса Container)
 * @param dataKey {String} ключ карточки
 * @param src {String} путь к изображению
 * @param dataTarget {String} id модального окна, появляющегося при нажатии на карточку */
function Card(dataKey, src, dataTarget) {
    // Вызываем конструктор класса Container
    Container.call(this);
    // Сохраняем аргументы
    this.dataKey = dataKey;
    this.src = src;
    this.dataTarget = dataTarget;
}
// Задаем в качестве прототипа класса Меню новый объект с прототипом объекта Container (расширяем класс Container)
Card.prototype = Object.create(Container.prototype);
Card.prototype.constructor = Card;
/** Визуализирует карточку на странице
 * @return {String} html-код для встраивания в страницу
 * @override */
Card.prototype.render = function() {
    let cardItem = document.createElement("div");
    cardItem.className = "card";
    cardItem.setAttribute("data-key", this.dataKey);
    let smallImg = document.createElement("img");
    smallImg.className = "card-img-top";
    smallImg.setAttribute("src", this.src);
    smallImg.setAttribute("alt", this.dataKey);
    smallImg.setAttribute("data-toggle", "modal");
    smallImg.setAttribute("data-target", "#"+this.dataTarget);
    cardItem.innerHTML += smallImg.outerHTML;
    return cardItem.outerHTML;
};
/** Класс Модальное окно (подкласс класса Container)
 * @param id {String} id модального окна
 * @param src {String} путь к изображению
 * @param alt {String} название изображения, отображаемое, если оно не загружено */
function Modal(id, src, alt) {
    // Вызываем конструктор класса Container
    Container.call(this);
    // Сохраняем аргументы
    this.id = id;
    this.src = src;
    this.alt = alt;
}
// Задаем в качестве прототипа класса Меню новый объект с прототипом объекта Container (расширяем класс Container)
Modal.prototype = Object.create(Container.prototype);
Modal.prototype.constructor = Modal;
/** Визуализирует модальное окно на странице
 * @return {String} html-код для встраивания в страницу
 * @override */
Modal.prototype.render = function() {
    let modalWindow = document.createElement("div");
    modalWindow.className = "modal";
    modalWindow.id = this.id;
    modalWindow.setAttribute("tabindex-key", "-1");
    modalWindow.setAttribute("role", "dialog");
    modalWindow.setAttribute("aria-hidden", "true");
    modalWindow.innerHTML = `<div class="modal-dialog modal-dialog-centered" role="img"><div class="modal-content"><div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button></div><div class="modal-body"><img class="img-fluid" src=${this.src} alt=${this.alt}></div></div></div>`;
    return modalWindow.outerHTML;
};
/** Класс Кнопка (подкласс класса Container)
 * @param buttonType {String} тип кнопки
 * @param buttonName {String} название кнопки */
function Button (buttonType, buttonName) {
    // Вызываем конструктор класса Container
    Container.call(this);
    // Сохраняем аргументы
    this.className = `btn ${buttonType}`;
    this.buttonName = buttonName;
    if (buttonName == "Все")
        this.className += " active";
}
// Задаем в качестве прототипа класса Кнопка новый объект с прототипом объекта Container (расширяем класс Container)
Button.prototype = Object.create(Container.prototype);
Button.prototype.constructor = Button;
/** Визуализирует кнопку на странице
 * @return {String} html-код для встраивания в страницу
 * @override */
Button.prototype.render = function() {
    let createButton = document.createElement("button");
    createButton.className = this.className;
    createButton.setAttribute("type", "button");
    createButton.innerHTML = this.buttonName;
    return createButton.outerHTML;
};
/** Класс Текстовое поле формы
 * @param element {String} вид поля
 * @param id {String} id поля
 * @param name {String} имя поля
 * @param text {String} текст в поле */
function FormField(element, id, name, text) {
    // Вызываем конструктор класса Container
    Container.call(this);
    // Сохраняем аргументы
    this.element = element;
    this.id = id;
    this.fieldName = name;
    this.labelText = text;
}
// Задаем в качестве прототипа Поле новый объект с прототипом объекта Container (расширяем класс Container)
FormField.prototype = Object.create(Container.prototype);
FormField.prototype.constructor = FormField;
/** Визуализирует Текстовое поле формы на странице
 * @return {String} html-код для встраивания в страницу
 * @override */
FormField.prototype.render = function() {
    let createField = document.createElement(this.element);
    createField.id = this.id;
    createField.setAttribute("type", "text");
    createField.setAttribute("name", this.fieldName);
    let createLabel = document.createElement('label');
    createLabel.setAttribute("for", this.id);
    createLabel.innerHTML = this.labelText;
    let createP = document.createElement('p');
    createP.innerHTML = createField.outerHTML + createLabel.outerHTML;
    return createP.outerHTML;
};
/** Класс Кнопка формы
 * @param id {String} id кнопки
 * @param name {String} текст на кнопке
 * @param script {String} скрипт, исполняемый при нажатии на кнопку */
function FormButton(id, name, script) {
    // Вызываем конструктор класса Container
    Container.call(this);
    // Сохраняем аргументы
    this.id = id;
    this.name = name;
    this.scriptOnClick = script;
}
// Задаем в качестве прототипа Кнопка формы новый объект с прототипом объекта Container (расширяем класс Container)
FormButton.prototype = Object.create(Container.prototype);
FormButton.prototype.constructor = FormButton;
/** Визуализирует Кнопку формы на странице
 * @return {String} html-код для встраивания в страницу
 * @override */
FormButton.prototype.render = function() {
    let createFormButton = document.createElement("input");
    createFormButton.id = this.id;
    createFormButton.setAttribute("type", "button");
    createFormButton.setAttribute("value", this.name);
    createFormButton.setAttribute("onclick", this.scriptOnClick);
    return createFormButton.outerHTML;
};
 /** Класс Селектор формы
 * @param id {String} id селекта */
function FormSelect(id) {
    // Вызываем конструктор класса Container
    Container.call(this);
     // Сохраняем аргументы
     this.id = id;
}
// Задаем в качестве прототипа Селектор новый объект с прототипом объекта Container (расширяем класс Container)
FormSelect.prototype = Object.create(Container.prototype);
FormSelect.prototype.constructor = FormSelect;
/** Визуализирует Селектор формы на странице
 * @return {String} html-код для встраивания в страницу
 * @override */
FormSelect.prototype.render = function() {
    let createSelect = document.createElement('select');
    createSelect.id = this.id;
    let option = $("<option></option>");
    option.attr('value', '');
    option.attr('disabled', 'disabled');
    option.attr('selected', 'selected');
    option.text('--------- Укажите Ваш населенный пункт ---------');
    createSelect.append(option[0]);
    return createSelect.outerHTML;
};
/** Подгружает наименования населенных пунктов в поле селект формы обратной связи
 * @param select селект, в который надо добавить наименования населенных пунктов */
function loadCities(select) {
    let option;
    // Загружаем список городов
    $.ajax({
        url: 'help/cities.json',
        dataType: 'json',
        success: (data, testStatus) => {
            try {
                // Бросаем исключение, если загрузка не удалась
                if (testStatus != 'success') throw new Error('Список городов с сервера не получен из-за ошибки связи');
                // Добавляем названия населенных пунктов в поле селект формы
                $.each(data, (i, val) => {
                    option = $("<option></option>");
                    option.attr('value', `${val.name} ${val.subject}`);
                    option.text(`${val.name} ${val.subject}`);
                    select.append(option[0]);
                });
            }
            catch (e) {
                // выводим сообщение об ошибке
                console.error(e.message);
            }
        },
        error: error => {
            console.error(error);
        }
    });
}
/** Отображает на странице изображения автомобилей с сайта Flickr */
function showFlickrImages() {
    // Фото
    const url = "https://api.flickr.com/services/feeds/photos_public.gne?" +
        "tags=cars&format=json&jsoncallback=?";
    // создаем новый элемент jQuery для помещения в него изображения
    let img;
    // номер индекса первого отображаемого изображения в массиве
    let number = 0;
    // массив для хранения адресов изображений
    let flickrImages = [];
    /** С помощью функции .getJSON загружаем JSON-данные, находящиеся по указанному url-адресу (с сервера Flickr).
     * Функция .getJSON сразу интерпретирует JSON, поэтому нет необходимости вызывать JSON.parse.
     * В случае успешной загрузки данных выполняется заданная функция */
    $.getJSON(url, function (flickrResponse) {
        // Поочередно перебираем циклом все элементы JSON-массива items, получаемого с сервера Flickr
        flickrResponse.items.forEach(function (photo) {
            flickrImages.push(photo.media.m);
        });
    });
    let displayImages = function(imageIndex) {
        // Очищаем содержимое переменной для хранения изображения, сохраняем в ней элемент img и скрываем его с помощью функции .hide
        img = $("<img>").hide();
        // С помощью функции .attr устанавливаем значение атрибута src элемента img, равным URL-адресу, хранящемуся в media.m JSON-ответа, полученного от Flickr (остальные полученные JSON-данные нам не нужны)
        img.attr("src", flickrImages[imageIndex]);
        // прикрепляем элемент img к элементу класса .flickr
        $(".flickr").empty().append(img);
        // а затем отображаем его
        img.fadeIn();
        setTimeout(function () {
            imageIndex++;
            if (imageIndex === flickrImages.length)
                imageIndex = 0;
            displayImages(imageIndex);
        }, 3000);
    };
    displayImages(number);
}
/** Возвращает Promise для ресурса, загружаемого по протоколу GET
 * @param url {String} адрес загружаемого ресурса
 * @return {Object} Promise */
function httpGet(url) {
    return new Promise(function(resolve, reject) {
        // Создаём новый объект XMLHttpRequest
        let xhr = new XMLHttpRequest();
        // Создаем обработчик события успешного завершения запроса
        xhr.onload = function() {
            // Если код ответа сервера не 200, то это ошибка
            if (this.status == 200) {
                // Возвращаем ответ сервера
                resolve(this.response);
            } else {
                // Выводим описание ошибки
                let error = new Error(this.statusText);
                // Сохраняем код ошибки
                error.code = this.status;
                reject(error);
            }
        };
        // Создаем обработчик события неудачного завершения запроса
        xhr.onerror = function() {
            reject(new Error("Сетевая ошибка"));
        };
        // Инициализируем объект XMLHttpRequest и сохраняем аргументы для последующего использования методом send(): асинхронный GET-запрос на url
        xhr.open('GET', url);
        // Открываем соединение и отсылаем запрос на сервер
        xhr.send();
    });
}
/** Загружает меню сайта */
function loadMenu() {
    /* JSON содержит информацию в следующем виде:
    * первый элемент {Number} - максимальная глубина (уровень) вложенности меню
    * элементы меню задаются двумя значениями - адрес для перехода и название пункта
    * change_to_lvlN - команда перехода на другой уровень вложенности меню, где N - уровень, на который переходим
    * create_lvlN - команда создания пункта меню уровня N, содержащего вложенное меню */
    httpGet('menu.json').then( result => {
            // Преобразуем тело ответа в объект
            const allItems = JSON.parse(result);
            // Используем полученные данные для создания меню
            let temp;
            // Текущий уровень элементов меню (0 - главное меню)
            let lvl = 0;
            // Массивы для хранения пунктов меню для соответствующих уровней глубины вложенности меню
            lvls = [];
            for (let i = 0; i < allItems[0]; i++) {
                lvls[i] = [];
            }
            // Индекс первого элемента меню, хранящегося в полученном с сервера массива
            let i = 1;
            // Обрабатываем массив
            while (i < allItems.length) {
                temp = allItems[i];
                // Проверяем является ли текущий элемент массива сведениями о пункте меню или командой переключения глубины вложенности либо создания пункта с вложенным меню
                if (temp.indexOf("change_to_lvl") == -1 && temp.indexOf("create_lvl") == -1) {
                    // Добавляем пункты меню на текущем уровне глубины вложенности меню
                    lvls[lvl].push(new MenuItem(temp, allItems[i + 1]));
                    // Переходим на следующий необработанный элемент массива
                    i += 2;
                } else {
                    // Переключаемся на нужный уровень вложенности меню
                    if (temp.indexOf("change_to_lvl") != -1) {
                        lvl = temp.replace("change_to_lvl", "");
                    } else {
                        // Создаем пункт с вложенным меню заданного уровня вложенности меню
                        if (temp.indexOf("create_lvl") != -1) {
                            temp = temp.replace("create_lvl", "");
                            lvls[temp - 1].push(new NestedMenu("nested-menu-id" + i, "nested-menu-class", lvls[temp]));
                            lvls[temp] = [];
                        }
                    }
                    // Переходим на следующий необработанный элемент массива
                    i++;
                }
            }
            // Создаем главное меню
            let menu = new Menu("menu-id", "menu-class", lvls[0]);
            // Визуализируем меню на странице сайта
            document.getElementById('menu').innerHTML = menu.render();
        },
        error => {
            console.error(error);
        });
}
/** Создает элементы управления галереей */
function createGalleryControls() {
    // Названия кнопок
    const buttonNames = ["Все", "Aston Martin", "Audi quattro", "Audi R-8", "Ferrari", "Lamborghini"];
    for (let i = 0; i < buttonNames.length; i++) {
        $(".gallery_controls").append(new Button("tag_filter", buttonNames[i]).render());
    }
}
/** Загружает галерею */
function loadGallery() {
    const quantity = 24;
    for (let i = 0; i < quantity; i++) {
        httpGet(`gallery/${i}.json`).then( result => {
                let imgData = JSON.parse(result);
                $(".card-columns").append(new Card(imgData.dataKey, imgData.image, imgData.id).render());
                $(".card-columns").append(new Modal(imgData.id, imgData.src, imgData.dataKey).render());
            },
            error => {
                console.error(error);
            });
    }
}
/** Обработчик нажатий клавиш фильтрации фотографий по тегу */
function tagFilter(){
    /** Обработчик нажатий клавиш фильтрации фотографий по тегу */
    $('.tag_filter').click(function(){
        if ($(this).hasClass('active')){
            return;
        }
        $('.tag_filter.active').button('toggle');
        $(this).button('toggle');
        if ($(this).text() === 'Все'){
            $('.card').show(300);
        } else {
            $('.card').hide().filter('[data-key="'+$(this).text()+'"]').show(300);
        }
    });
}
/** Обрабатывает по правилам русского языка кавычки в тексте с диалогами, заключенными в апострофы, со словами на русском и английском языках */
function regExpOutput() {
    let edittingText = `Анна сказала: 'Этим летом я буду отдыхать в Кот-д'Ивуар!'\n
        Учитель неожиданно заметил: 'Время истекло'.\n
        'Прямая речь'\n
        'Поезд ушёл, — с грустью подумала девушка, — теперь уж точно опоздаю!'\n
        'Что ж, поезд успел уйти, — с грустью подумал студент. – Теперь я точно не успею в институт!'.\n
        Мужчина с грустью подумал: 'Электричка ушла, теперь я точно опоздаю', — и быстро побежал на автобусную остановку.\n
        'Hello, friend!'\n
        'test'\n
        Test parents' aren't 'test test`;
    let newEl = document.createElement("p");
    newEl.innerHTML = edittingText;
    document.getElementsByClassName("reg_exp")[0].append(newEl);
    // Шаблон поддерживает текст на английском и русском языках
    let template = new RegExp("('\\s')|^('[A-ZА-ЯЁ])|([^a-zA-ZА-яЁё]'[A-ZА-ЯЁ])|([^a-zA-ZА-яЁё]'[a-zA-ZА-яЁё]+'[^a-zA-ZА-яЁё])|('$)|('\\n)|(', —)|(' —)|('\\.)", "g");
    edittingText = edittingText.replace(template, (str) => {
        // заменяем апострофы на кавычки
        return str.replace(/'/g, "\"");
    });
    template = new RegExp("(\"[\\wа-яёА-ЯЁ])", "g");
    edittingText = edittingText.replace(template, (str) => {
        // заменяем апострофы на кавычки
        return str.replace(/"/, "«");
    });
    template = new RegExp("\"", "g");
    edittingText = edittingText.replace(template, "»");
    newEl = document.createElement("p");
    newEl.innerHTML = edittingText;
    document.getElementsByClassName("reg_exp")[0].append(newEl);
}
/** Создает форму обратной связи */
function createForm() {
    $("#call_back").append(new FormField('input', 'form_name', 'name', 'Имя').render());
    $("#call_back").append(new FormField('input', 'form_phone', 'phone', 'Телефон').render());
    $("#call_back").append(new FormField('input', 'form_email', 'email', 'e-mail').render());
    $("#call_back").append(new FormField('textarea', 'form_text', 'message', 'Сообщение').render());
    $("#call_back").append(new FormSelect('cities').render());
    $("#call_back").append(new FormButton('form_submit', 'Отправить', 'checkForm(this.form)').render());
    // Убираем labels, если в поле ввода формы введен какой-то текст
    hideLabelsOnBlur();
}
/** Проверяет строку на соответствие шаблону
 * @param str {String} проверяемая строка
 * @param regexp {String} регулярное выражение, используемое для проверки
 * @return {Boolean} true, если соответствует, иначе false */
function validForTemplate(str, regexp) {
    return regexp.test(str);
}
/** Визуализирует сообщение об ошибке
 * @param container {Object}, в который будет выведено сообщение об ошибке
 * @param errorMessage {String} сообщение об ошибке */
function showError(container, errorMessage) {
    // Меняем стиль отображения контейнера, отображающего ошибку
    container.classList.add('error');
    // Создаем элемент для отображения сообщения об ошибке
    let msgElem = document.createElement('span');
    msgElem.classList.add('error-message');
    msgElem.innerHTML = errorMessage;
    // Визуализируем текст сообщения об ошибке
    container.appendChild(msgElem);
}
/** Удаляет сообщение об ошибке
 * @param container {Object}, в котором надо удалить сообщение об ошибке */
function resetError(container) {
    // Меняем стиль отображения контейнера, отображавшего ошибку
    container.classList.remove('error');
    if (container.lastChild.className == "error-message") {
        // Удаляем сообщение об ошибке
        container.removeChild(container.lastChild);
    }
}
/** Обрабатывает отправку данных из формы */
function checkForm(form) {
    // Получаем элементы формы
    let elems = form.elements;
    // Удаляем сообщение об ошибке заполнения поля с именем пользователя
    resetError(elems.name.parentNode);
    // Если поле с именем пользователя заполнено неверно
    if (!validForTemplate(elems.name.value, /^[а-яёА-ЯЁ]+$/)) {
        // то выводим сообщение об ошибке
        showError(elems.name.parentNode, 'Имя может состоять только из русских букв');
    }
    // Обработка поля с телефоном пользователя
    resetError(elems.phone.parentNode);
    if (!validForTemplate(elems.phone.value, /^\+\d\(\d{3}\)\d{3}-\d{4}$/)) {
        showError(elems.phone.parentNode, 'Введите номер телефона в формате +7(000)000-0000');
    }
    // Обработка поля с почтовым адресом пользователя
    resetError(elems.email.parentNode);
    if (!validForTemplate(elems.email.value, /^(\w+)((\.\w+)|(-\w+))?(@[a-z_]+\.[a-z]{2,6})$/)) {
        showError(elems.email.parentNode, 'Недопустимый адрес электронной почты');
    }
    // Обработка поля с сообщением пользователя
    resetError(elems.message.parentNode);
    if (validForTemplate(elems.message.value, /^$/)) {
        showError(elems.message.parentNode, 'Оставьте ваше сообщение');
    }
}
/** Убирает labels, если в поле ввода формы введены символы */
function hideLabelsOnBlur() {
    // Обработчик события потери фокуса на поле form_name
    form_name.onblur = () => {
        // если в поле имеются символы
        if (form_name.value !== '')
            // то скрываем label
            document.forms.callback.name.parentNode.getElementsByTagName('label')[0].style.display = 'none';
        else
            // иначе отображаем label
            document.forms.callback.name.parentNode.getElementsByTagName('label')[0].style.display = '';
    };
    // Обработчик события потери фокуса на поле form_phone
    form_phone.onblur = () => {
        if (form_phone.value !== '')
            document.forms.callback.phone.parentNode.getElementsByTagName('label')[0].style.display = 'none';
        else
            document.forms.callback.phone.parentNode.getElementsByTagName('label')[0].style.display = '';
    };
    // Обработчик события потери фокуса на поле form_email
    form_email.onblur = () => {
        if (form_email.value !== '')
            document.forms.callback.email.parentNode.getElementsByTagName('label')[0].style.display = 'none';
        else
            document.forms.callback.email.parentNode.getElementsByTagName('label')[0].style.display = '';
    };
    // Обработчик события потери фокуса на поле form_text
    form_text.onblur = () => {
        if (form_text.value !== '')
            document.forms.callback.message.parentNode.getElementsByTagName('label')[0].style.display = 'none';
        else
            document.forms.callback.message.parentNode.getElementsByTagName('label')[0].style.display = '';
    };
}
/** Включает отображение раздела о компании */
function showCompanyInfo() {
    if (document.querySelector('#company').style.display === '') {
        // Создаем страницу с отзывами
        createCommentPage();
        document.querySelector('#cart').style.display = '';
        document.querySelector('#catalog').style.display = '';
        document.querySelector('#photo_gallery').style.display = '';
        document.querySelector('#tabs').style.display = '';
        document.querySelector('#reg_exp').style.display = '';
        document.querySelector('#company').style.display = 'block';
        document.querySelector('#call_back').style.display = '';
    }
}
/** Включает отображение корзины */
function showCart() {
    if (document.querySelector('#cart').style.display === '') {
        // Получаем содержимое корзины с сервера
        getBasket(userID);
        document.querySelector('#cart').style.display = 'block';
        document.querySelector('#catalog').style.display = '';
        document.querySelector('#photo_gallery').style.display = '';
        document.querySelector('#tabs').style.display = '';
        document.querySelector('#reg_exp').style.display = '';
        document.querySelector('#company').style.display = '';
        document.querySelector('#call_back').style.display = '';
    }
}
/** Включает отображение раздела каталог */
function showCatalog() {
    if (document.querySelector('#catalog').style.display === '') {
        document.querySelector('#cart').style.display = '';
        document.querySelector('#catalog').style.display = 'block';
        document.querySelector('#photo_gallery').style.display = '';
        document.querySelector('#tabs').style.display = '';
        document.querySelector('#reg_exp').style.display = '';
        document.querySelector('#company').style.display = '';
        document.querySelector('#call_back').style.display = '';
    }
}
/** Включает отображение раздела фотогалереи */
function showGallery() {
    if (document.querySelector('#photo_gallery').style.display === '') {
        document.querySelector('#cart').style.display = '';
        document.querySelector('#catalog').style.display = '';
        document.querySelector('#photo_gallery').style.display = 'block';
        document.querySelector('#tabs').style.display = '';
        document.querySelector('#reg_exp').style.display = '';
        document.querySelector('#company').style.display = '';
        document.querySelector('#call_back').style.display = '';
    }
}
/** Включает отображение раздела промоакций */
function showPromo() {
    if (document.querySelector('#tabs').style.display === '') {
        document.querySelector('#cart').style.display = '';
        document.querySelector('#catalog').style.display = '';
        document.querySelector('#photo_gallery').style.display = '';
        document.querySelector('#tabs').style.display = 'block';
        document.querySelector('#reg_exp').style.display = '';
        document.querySelector('#company').style.display = '';
        document.querySelector('#call_back').style.display = '';
    }
}
/** Включает отображение раздела новостей */
function showNews() {
    if (document.querySelector('#reg_exp').style.display === '') {
        document.querySelector('#cart').style.display = '';
        document.querySelector('#catalog').style.display = '';
        document.querySelector('#tabs').style.display = '';
        document.querySelector('#photo_gallery').style.display = '';
        document.querySelector('#reg_exp').style.display = 'block';
        document.querySelector('#company').style.display = '';
        document.querySelector('#call_back').style.display = '';
    }
}
/** Включает отображение раздела помощи */
function showHelp() {
    if (document.querySelector('#call_back').style.display === '') {
        document.querySelector('#cart').style.display = '';
        document.querySelector('#catalog').style.display = '';
        document.querySelector('#tabs').style.display = '';
        document.querySelector('#photo_gallery').style.display = '';
        document.querySelector('#reg_exp').style.display = '';
        document.querySelector('#company').style.display = '';
        document.querySelector('#call_back').style.display = 'block';
        if (!citiesLoaded) {
            // Подгружаем наименования населенных пунктов в поле селект формы обратной связи
            loadCities($('#cities')[0]);
            // Список населенных пунктов загружен
            citiesLoaded = true;
        }
    }
}
/** Предоставляет управление вкладками */
function tabControls() {
    // По умолчанию открываем первую вкладку
    $('.tab_controls li:first').addClass('opened_tab');
    // Отображаем первый div
    $('.tabs div:first').addClass('opened');
    // Остальные div соответствуют другим вкладкам - скрываем их
    $('.tabs div:not(:first)').hide();
    // Добавляем обработчик щелчков по вкладкам
    // Если щелчок по закрытой вкладке
    $('ul.tab_controls').on('click', 'li:not(.opened_tab)', function() {
        // то применяем к ней класс opened_tab
        $(this).addClass('opened_tab')
            // у остальных вкладок удаляем этот класс
            .siblings().removeClass('opened_tab')
            // удаляем класс opened у всех div вкладок
            .closest('div.tabs').find('div.tab_info').removeClass('opened').hide()
            // применяем класс opened к div, имеющим тот же порядковый номер, что и вкладка
            .eq($(this).index()).addClass('opened').show();
    });
}
/** Управляет визуализацией подсказки */
function btn_slide() {
    $('#helper').slideToggle('slow');
    $('p .slide').toggleClass('active');
}
/** Создает фотогалерею */
function createGallery() {
    // Создаем элементы управления галереей
    createGalleryControls();
    // Загружаем изображения для галереи
    loadGallery();
    // Подключаем обработчик щелчков по кнопкам галереи
    tagFilter();
}
/** Создает элементы, отображаемые на каждой странице */
function pageTemplate() {
    // Загружаем меню
    loadMenu();
    // Загружаем изображения с Flickr
    showFlickrImages();
    // Скрываем подсказку вверху страницы
    $('#helper').hide();
}
/** Загружает названия и цены автомобилей */
function loadCatalog() {
    // Загружаем описания автомобилей
    $.ajax({
        url: 'catalogue/autoDetails.json',
        dataType: 'json',
        success: (data, testStatus) => {
            try {
                // Бросаем исключение, если загрузка не удалась
                if (testStatus != 'success') throw new Error('Сведения об автомобилях с сервера не получены из-за ошибки связи');
                // Добавляем названия автомобилей в поле селект формы
                addAutomobiles(data);
                // Добавляем обработчик щелчков по товарам в списке каталога
                shooseItem(data);
            }
            catch (e) {
                // выводим сообщение об ошибке
                console.error(e.message);
            }
        },
        error: error => {
            console.error(error);
        }
    });
}
/** Создает форму с каталогом автомобилей */
function createCatalog() {
    // Загружаем наименования автомобилей в селект формы каталога
    $('#autoShooserControl').load('catalogue/autoOptions.json');
    // Загружаем названия и цены автомобилей
    loadCatalog();
}
/** Добавляет обработчик щелчков по названиям автомобилей в поле селект формы
 * @param automobilesData {Object} json-данные об автомобилях */
function addAutomobiles(automobilesData) {
    $('#autoShooserControl').change( event => {
        // Убираем опцию с подсказкой
        $('[value=""]', event.target).remove();
        // Сохраняем номер выбранной опции
        let val = $(event.target).val();
        // Отображаем описание автомобиля
        $('#autoDetailPane').html(`<p>Название автомобиля ${automobilesData[val].name}</p><p>Цена автомобиля ${automobilesData[val].price} рублей</p>`);
    });
}
/** Добавляет обработчик для добавления товара в корзину */
function shooseItem(automobilesData) {
    let autoCatalog = document.querySelector('#autoCatalog');
    let autoShooserControl = document.querySelector('#autoShooserControl');
    // Добавляем обработчик событий отправки при нажатии на товар в списке каталога
    autoCatalog.addEventListener('submit', (event) => {
        event.preventDefault();
        addItemToBasket(automobilesData[autoShooserControl.value].name, automobilesData[autoShooserControl.value].price);
    });
}
/** Авторизирует пользователя */
function userAuthorization() {
    $.ajax({
        url: `${SERVER_URL}/shop`,
        data: {'user_id': userID},
        dataType: 'json',
        success: (data, testStatus) => {
            try {
                // Бросаем исключение, если загрузка не удалась
                if (testStatus != 'success') throw new Error('id пользователя с сервера не получено из-за ошибки связи');
                // Сохраняем id пользователя
                userID = data.user_id;
            }
            catch (e) {
                // выводим сообщение об ошибке
                console.error(e.message);
            }
        },
        error: error => {
            console.error(`${error.status} ${error.responseJSON.message}`);
        }
    });
}
/** Создает страницу с отзывами о магазине */
function createCommentPage() {
    // Номер последнего отображенного отзыва
    let lastCommentNumber;
    // Добавляем форму для отправки отзывов
    createCommentForm();
    // Добавлем обработчик отправки отзывов на сервер
    onClickSubmitNewComment();
    // Получаем все отзывы с сервера
    getComments();
}
/** Добавляет форму для отправки отзыва */
function createCommentForm() {
    // Добавляет форму для отправки отзывов
    $('#company').html(`<form id="add_new_comment"><label for="new_comment">Что Вы думаете о нашем магазине?</label><input id="new_comment"><input class="btn" id="send_comment" type="submit" value="Отправить отзыв"></form>`);
}
/** Добавлет обработчик отправки отзывов на сервер */
function onClickSubmitNewComment() {
    let addNewComment = document.querySelector('#add_new_comment');
    let newComment = document.querySelector('#new_comment');
    addNewComment.addEventListener('submit', (event) => {
        event.preventDefault();
        // Увеличиваем номер последнего визуализируемого отзыва
        lastCommentNumber++;
        // Отправляем новый отзыв на сервер
        sendNewComment(newComment.value, lastCommentNumber);
        newComment.value = '';
    });
}
/** Получает с сервера все отзывы и отображает их */
function getComments() {
    // Загружаем отзывы
    $.ajax({
        url: `${SERVER_URL}/comments`,
        dataType: 'json',
        success: (data, testStatus) => {
            try {
                // Бросаем исключение, если загрузка не удалась
                if (testStatus != 'success') throw new Error('Отзывы с сервера не получены из-за ошибки связи');
                // Отображаем отзывы
                showComments(data);
            }
            catch (e) {
                // выводим сообщение об ошибке
                console.error(e.message);
            }
        },
        error: error => {
            console.error(`${error.status} ${error.responseJSON.message}`);
        }
    });
}
/** Отображает отзывы
 * @param commentsData {Object} json-данные отзывов */
function showComments(commentsData) {
    if (commentsData.length == 0) {
        $('#cart').text('Отзывы о магазине отсутствуют. Пожалуйста, оставьте Ваш отзыв.');
    } else {
        let comments = `<h4>Отзывы покупателей о нас:</h4>`;
        for (let i = 0; i < commentsData.length; i++) {
            comments += `<div class="card comments"><div class="card-body"><p class="card-text user">${i+1}) Номер отзыва: ${commentsData[i].comment_id}</p><p class="card-text title">Содержание отзыва:</p><p class="card-text message">${commentsData[i].text}</p><p class="card-text like">Оценка отзыва: ${commentsData[i].likes}</p><a href="#" class="btn" id="comment${i}">Удалить отзыв</a></div></div>`;
        }
        $('#company').append(comments);
        // Сохраняем номер последнего оображенного отзыва
        lastCommentNumber = commentsData.length;
    }
}
/** Добавляет новый отзыв в базу отзывов на сервере
 * @param comment {String} текст отзыва */
function sendNewComment(comment) {
    $.ajax({
        url: `${SERVER_URL}/comments?text=${comment}`,
        type: 'post',
        dataType: 'json',
        success: (data, testStatus) => {
            try {
                // Бросаем исключение, если загрузка не удалась
                if (testStatus != 'success') throw new Error('Отзыв не добавлен из-за ошибки связи');
                // Визуализирует новый отзыв на странице отзывов
                showNewComment(data);
            }
            catch (e) {
                // выводим сообщение об ошибке
                console.error(e.message);
            }
        },
        error: error => {
            console.error(`${error.status} ${error.responseJSON.message}`);
        }
    });
}
/** Визуализирует новый отзыв на странице
 * @param {Object} полученные с сервера json-данные нового отзыва */
function showNewComment(commentData) {
    $('#company').append(`<div class="card comments"><div class="card-body"><p class="card-text user">${lastCommentNumber}) Номер отзыва: ${commentData.comment_id}</p><p class="card-text title">Содержание отзыва:</p><p class="card-text message">${commentData.text}</p><p class="card-text like">Оценка отзыва: ${commentData.likes}</p><a href="#" class="btn" id="comment${lastCommentNumber}">Удалить отзыв</a></div></div>`);
}
/** Загружает с сервера данные корзины, затем отображает корзину или создает новую корзину
 * @param consumerID {String} id покупателя */
function getBasket(consumerID) {
    // Загружаем корзину
    $.ajax({
        url: `${SERVER_URL}/shop`,
        data: {'user_id': consumerID},
        dataType: 'json',
        success: (data, testStatus) => {
            try {
                // Бросаем исключение, если загрузка не удалась
                if (testStatus != 'success') throw new Error('Содержимое корзины с сервера не получено из-за ошибки связи');
                // Отображаем содержимое корзины
                showBasket(data);
            }
            catch (e) {
                // выводим сообщение об ошибке
                console.error(e.message);
            }
        },
        error: error => {
            console.error(`${error.status} ${error.responseJSON.message}`);
        }
    });
}
/** Отображает содержимое корзины
 * @param basketData {Object} json-данные содержимого корзины */
function showBasket(basketData) {
    if (basketData.cart.length == 0) {
        $('#cart').text('Товары в корзине отсутствуют. Перейдите в каталог сайта, чтобы выбрать нужные Вам товары');
    } else {
        let basket = `<p>Имя покупателя: ${basketData.user_id}</p><p>Состав корзины:</p>`;
        // Общая стоимость товаров в корзине
        let value = 0;
        for (let i = 0; i < basketData.cart.length; i++) {
            // Визуализируем каждый товар в корзине
            basket += `<div class="card automobile"><div class="card-body"><p class="card-text">${i+1}) Наименование: ${basketData.cart[i].product}</p><p class="card-text">Цена: ${basketData.cart[i].price}</p><a href="#" class="btn" id="item${i}">Удалить товар из корзины</a></div></div>`;
            // Определяем общую стоимость товаров в корзине
            value += Number(basketData.cart[i].price);
        }
        // Визуализируем общую стоимость товаров в корзине
        basket += `<p>Общая стоимость товаров в корзине: ${value} рублей.</p>`;
        // Визуализируем содержимое корзины на странице
        $('#cart').html(basket);
        // Добавляем кнопки удаления товара из корзины для каждого товара в корзине
        for (let i = 0; i < basketData.cart.length; i++) {
            $(`#item${i}`).click(basketData.cart[i], (eventObject) => {
                deleteItemFromBasket(eventObject.data.product_id);
            });
        }
    }
}
/** Добавляет товар в корзину
 * @param item {String} товар, добавляемый в корзину
 * @param price {Price} цена товара, добавляемого в корзину */
function addItemToBasket(item, price) {
    $.ajax({
        url: `${SERVER_URL}/shop?user_id=${userID}&product=${item}&price=${price}`,
        type: 'post',
        dataType: 'json',
        success: (data, testStatus) => {
            try {
                // Бросаем исключение, если загрузка не удалась
                if (testStatus != 'success') throw new Error('Товар в корзину не добавлен из-за ошибки связи');
            }
            catch (e) {
                // выводим сообщение об ошибке
                console.error(e.message);
            }
        },
        error: error => {
            console.error(`${error.status} ${error.responseJSON.message}`);
        }
    });
}
/** Удаляет товар из корзины
 * @param productID id удаляемого товара */
function deleteItemFromBasket(productID) {
    $.ajax({
        url: `${SERVER_URL}/shop?user_id=${userID}&product_id=${productID}`,
        type: 'delete',
        dataType: 'json',
        success: (data, testStatus) => {
            try {
                // Бросаем исключение, если загрузка не удалась
                if (testStatus != 'success') throw new Error('Товар из корзины не удален из-за ошибки связи');
                // Обтображаем содержимое корзины после удаления товара
                showBasket(data);
            }
            catch (e) {
                // выводим сообщение об ошибке
                console.error(e.message);
            }
        },
        error: error => {
            console.error(`${error.status} ${error.responseJSON.message}`);
        }
    });
}
// Дожидаемся загрузки страницы
document.addEventListener("DOMContentLoaded", function() {
    // Создаем элементы, отображаемые на каждой странице
    pageTemplate();
    // Создаем форму с каталогом автомобилей
    createCatalog();
    // Добавляем управление для вкладок раздела Промоакции
    tabControls();
    // Работаем с регулярными выражениями
    regExpOutput();
    // Создаем фотогалерею
    createGallery();
    // Создаем форму обратной связи
    createForm();
});