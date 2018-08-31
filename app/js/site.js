"use strict";

// Адрес сервера
var SERVER_URL = "http://89.108.65.123:8080"; // id пользователя

var userID = ""; // Авторизуем пользователя

userAuthorization(); // Устанавливаем флаг необходимости загрузки списка населенных пунктов при первом открытии страницы с формой обратной связи

var citiesLoaded = false; // Номер последнего отображенного отзыва

var lastCommentNumber = 0;
/** Абстрактный элемент страницы (суперкласс) */

function Container() {
  this.id = "";
  this.className = "";
  this.htmlCode = "";
}
/** Визуализирует элемент на странице
 * @return {String} html-код для встраивания в страницу */


Container.prototype.render = function () {
  return this.htmlCode;
};
/** Удаляет контейнер по id */


Container.prototype.remove = function () {
  try {
    // бросаем исключение, если объект не имеет id
    if (this.id === "") {
      throw new Error("\u0423\u0434\u0430\u043B\u0435\u043D\u0438\u0435 \u044D\u043B\u0435\u043C\u0435\u043D\u0442\u0430 \u043A\u043B\u0430\u0441\u0441\u0430 ".concat(this.className, " \u043D\u0435\u0432\u043E\u0437\u043C\u043E\u0436\u043D\u043E, \u0442.\u043A. \u044D\u043B\u0435\u043C\u0435\u043D\u0442\u0443 \u043D\u0435 \u043F\u0440\u0438\u0441\u0432\u043E\u0435\u043D id"));
    } // удаляем объект


    $("#" + this.id).remove();
  } catch (e) {
    // выводим сообщение об ошибке
    console.error(e.message);
    $("<div>").text(e.message).dialog({
      title: "Ошибка удаления контейнера"
    });
  }
};
/** Класс Меню (подкласс класса Container)
 * @param my_id {String} id меню
 * @param my_class {String} класс меню
 * @param my_items {Array} разделы меню */


function Menu(my_id, my_class, my_items) {
  // Вызываем конструктор класса Container
  Container.call(this); // Сохраняем аргументы

  this.id = my_id;
  this.className = my_class;
  this.items = my_items;
} // Задаем в качестве прототипа класса Меню новый объект с прототипом объекта Container (расширяем класс Container)


Menu.prototype = Object.create(Container.prototype);
Menu.prototype.constructor = Menu;
/** Визуализирует меню на странице
 * @return {String} html-код для встраивания в страницу
 * @override */

Menu.prototype.render = function () {
  var menuItems = document.createElement("ul");
  menuItems.className = this.className;
  menuItems.id = this.id; // Обходим все свойства объекта класса Меню

  for (var item in this.items) {
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
} // Задаем в качестве прототипа класса Вложенное меню новый объект с прототипом объекта Menu (расширяем класс Menu)


NestedMenu.prototype = Object.create(Menu.prototype);
NestedMenu.prototype.constructor = NestedMenu;
/** Визуализирует вложенное меню на странице
 * @return {String} html-код для встраивания в страницу
 * @override */

NestedMenu.prototype.render = function () {
  var nestedMenuItems = document.createElement("li");
  nestedMenuItems.className = this.className;
  nestedMenuItems.id = this.id;
  nestedMenuItems.innerHTML = "<span onclick=\"".concat(this.items[0].href, "\">").concat(this.items[0].itemName, "</span><ul></ul>"); // Обходим все свойства объекта класса Вложенное меню

  for (var item in this.items) {
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
  this.className = "menu-item"; // Сохраняем аргументы

  this.href = my_href;
  this.itemName = my_name;
} // Задаем в качестве прототипа класса Пункт меню новый объект с прототипом объекта Container (расширяем класс Container)


MenuItem.prototype = Object.create(Container.prototype);
MenuItem.prototype.constructor = MenuItem;
/** Визуализирует пункт меню на странице
 * @return {String} html-код для встраивания в страницу
 * @override */

MenuItem.prototype.render = function () {
  var menuItem = document.createElement("li");
  menuItem.className = this.className;
  menuItem.innerHTML = "<span onclick=\"".concat(this.href, "\">").concat(this.itemName, "</span>");
  return menuItem.outerHTML;
};
/** Класс Карточка (подкласс класса Container)
 * @param dataKey {String} ключ карточки
 * @param src {String} путь к изображению
 * @param dataTarget {String} id модального окна, появляющегося при нажатии на карточку */


function Card(dataKey, src, dataTarget) {
  // Вызываем конструктор класса Container
  Container.call(this); // Сохраняем аргументы

  this.dataKey = dataKey;
  this.src = src;
  this.dataTarget = dataTarget;
} // Задаем в качестве прототипа класса Меню новый объект с прототипом объекта Container (расширяем класс Container)


Card.prototype = Object.create(Container.prototype);
Card.prototype.constructor = Card;
/** Визуализирует карточку на странице
 * @return {String} html-код для встраивания в страницу
 * @override */

Card.prototype.render = function () {
  var cardItem = document.createElement("div");
  cardItem.className = "card";
  cardItem.setAttribute("data-key", this.dataKey);
  var smallImg = document.createElement("img");
  smallImg.className = "card-img-top";
  smallImg.setAttribute("src", this.src);
  smallImg.setAttribute("alt", this.dataKey);
  smallImg.setAttribute("data-toggle", "modal");
  smallImg.setAttribute("data-target", "#" + this.dataTarget);
  cardItem.innerHTML += smallImg.outerHTML;
  return cardItem.outerHTML;
};
/** Класс Модальное окно (подкласс класса Container)
 * @param id {String} id модального окна
 * @param src {String} путь к изображению
 * @param alt {String} название изображения, отображаемое, если оно не загружено */


function Modal(id, src, alt) {
  // Вызываем конструктор класса Container
  Container.call(this); // Сохраняем аргументы

  this.id = id;
  this.src = src;
  this.alt = alt;
} // Задаем в качестве прототипа класса Меню новый объект с прототипом объекта Container (расширяем класс Container)


Modal.prototype = Object.create(Container.prototype);
Modal.prototype.constructor = Modal;
/** Визуализирует модальное окно на странице
 * @return {String} html-код для встраивания в страницу
 * @override */

Modal.prototype.render = function () {
  var modalWindow = document.createElement("div");
  modalWindow.className = "modal";
  modalWindow.id = this.id;
  modalWindow.setAttribute("tabindex-key", "-1");
  modalWindow.setAttribute("role", "dialog");
  modalWindow.setAttribute("aria-hidden", "true");
  modalWindow.innerHTML = "<div class=\"modal-dialog modal-dialog-centered\" role=\"img\"><div class=\"modal-content\"><div class=\"modal-header\"><button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-label=\"Close\"><span aria-hidden=\"true\">&times;</span></button></div><div class=\"modal-body\"><img class=\"img-fluid\" src=".concat(this.src, " alt=").concat(this.alt, "></div></div></div>");
  return modalWindow.outerHTML;
};
/** Класс Кнопка (подкласс класса Container)
 * @param buttonType {String} тип кнопки
 * @param buttonName {String} название кнопки */


function Button(buttonType, buttonName) {
  // Вызываем конструктор класса Container
  Container.call(this); // Сохраняем аргументы

  this.className = "btn ".concat(buttonType);
  this.buttonName = buttonName;
  if (buttonName == "Все") this.className += " active";
} // Задаем в качестве прототипа класса Кнопка новый объект с прототипом объекта Container (расширяем класс Container)


Button.prototype = Object.create(Container.prototype);
Button.prototype.constructor = Button;
/** Визуализирует кнопку на странице
 * @return {String} html-код для встраивания в страницу
 * @override */

Button.prototype.render = function () {
  var createButton = document.createElement("button");
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
  Container.call(this); // Сохраняем аргументы

  this.element = element;
  this.id = id;
  this.fieldName = name;
  this.labelText = text;
} // Задаем в качестве прототипа Поле новый объект с прототипом объекта Container (расширяем класс Container)


FormField.prototype = Object.create(Container.prototype);
FormField.prototype.constructor = FormField;
/** Визуализирует Текстовое поле формы на странице
 * @return {String} html-код для встраивания в страницу
 * @override */

FormField.prototype.render = function () {
  var createField = document.createElement(this.element);
  createField.id = this.id;
  createField.setAttribute("type", "text");
  createField.setAttribute("name", this.fieldName);
  var createLabel = document.createElement("label");
  createLabel.setAttribute("for", this.id);
  createLabel.innerHTML = this.labelText;
  var createP = document.createElement("p");
  createP.innerHTML = createField.outerHTML + createLabel.outerHTML;
  return createP.outerHTML;
};
/** Класс Кнопка формы
 * @param id {String} id кнопки
 * @param name {String} текст на кнопке
 * @param script {String} скрипт, исполняемый при нажатии на кнопку */


function FormButton(id, name, script) {
  // Вызываем конструктор класса Container
  Container.call(this); // Сохраняем аргументы

  this.id = id;
  this.name = name;
  this.scriptOnClick = script;
} // Задаем в качестве прототипа Кнопка формы новый объект с прототипом объекта Container (расширяем класс Container)


FormButton.prototype = Object.create(Container.prototype);
FormButton.prototype.constructor = FormButton;
/** Визуализирует Кнопку формы на странице
 * @return {String} html-код для встраивания в страницу
 * @override */

FormButton.prototype.render = function () {
  var createFormButton = document.createElement("input");
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
  Container.call(this); // Сохраняем аргументы

  this.id = id;
} // Задаем в качестве прототипа Селектор новый объект с прототипом объекта Container (расширяем класс Container)


FormSelect.prototype = Object.create(Container.prototype);
FormSelect.prototype.constructor = FormSelect;
/** Визуализирует Селектор формы на странице
 * @return {String} html-код для встраивания в страницу
 * @override */

FormSelect.prototype.render = function () {
  var createSelect = document.createElement("select");
  createSelect.id = this.id;
  var option = $("<option></option>");
  option.attr("value", "");
  option.attr("disabled", "disabled");
  option.attr("selected", "selected");
  option.text("--------- Укажите Ваш населенный пункт ---------");
  createSelect.append(option[0]);
  return createSelect.outerHTML;
};
/** Подгружает наименования населенных пунктов в поле селект формы обратной связи
 * @param select селект, в который надо добавить наименования населенных пунктов */


function loadCities(select) {
  var option; // Загружаем список городов

  $.ajax({
    url: "help/cities.json",
    dataType: "json",
    success: function success(data, testStatus) {
      try {
        // Бросаем исключение, если загрузка не удалась
        if (testStatus != "success") throw new Error("Список городов с сервера не получен из-за ошибки связи"); // Добавляем названия населенных пунктов в поле селект формы

        $.each(data, function (i, val) {
          option = $("<option></option>");
          option.attr("value", "".concat(val.name, " ").concat(val.subject));
          option.text("".concat(val.name, " ").concat(val.subject));
          select.append(option[0]);
        });
      } catch (e) {
        // выводим сообщение об ошибке
        console.error(e.message);
        $("<div>").text(e.status + " " + e.statusText).dialog({
          title: "Ошибка связи"
        });
      }
    },
    error: function error(_error) {
      console.error(_error.status + " " + _error.statusText);
      $("<div>").text(_error.status + " " + _error.statusText).dialog({
        title: "Ошибка связи"
      });
    }
  });
}
/** Отображает на странице изображения автомобилей с сайта Flickr */


function showFlickrImages() {
  // Фото
  var url = "https://api.flickr.com/services/feeds/photos_public.gne?" + "tags=cars&format=json&jsoncallback=?"; // создаем новый элемент jQuery для помещения в него изображения

  var img; // номер индекса первого отображаемого изображения в массиве

  var number = 0; // массив для хранения адресов изображений

  var flickrImages = [];
  /** С помощью функции .getJSON загружаем JSON-данные, находящиеся по указанному url-адресу (с сервера Flickr).
   * Функция .getJSON сразу интерпретирует JSON, поэтому нет необходимости вызывать JSON.parse.
   * В случае успешной загрузки данных выполняется заданная функция */

  $.getJSON(url, function (flickrResponse) {
    // Поочередно перебираем циклом все элементы JSON-массива items, получаемого с сервера Flickr
    flickrResponse.items.forEach(function (photo) {
      flickrImages.push(photo.media.m);
    });
  });

  var displayImages = function displayImages(imageIndex) {
    // Очищаем содержимое переменной для хранения изображения, сохраняем в ней элемент img и скрываем его с помощью функции .hide
    img = $("<img>").hide(); // С помощью функции .attr устанавливаем значение атрибута src элемента img, равным URL-адресу, хранящемуся в media.m JSON-ответа, полученного от Flickr (остальные полученные JSON-данные нам не нужны)

    img.attr("src", flickrImages[imageIndex]); // прикрепляем элемент img к элементу класса .flickr

    $(".flickr").empty().append(img); // а затем отображаем его

    img.fadeIn();
    setTimeout(function () {
      imageIndex++;
      if (imageIndex === flickrImages.length) imageIndex = 0;
      displayImages(imageIndex);
    }, 3000);
  };

  displayImages(number);
}
/** Возвращает Promise для ресурса, загружаемого по протоколу GET
 * @param url {String} адрес загружаемого ресурса
 * @return {Object} Promise */


function httpGet(url) {
  return new Promise(function (resolve, reject) {
    // Создаём новый объект XMLHttpRequest
    var xhr = new XMLHttpRequest(); // Создаем обработчик события успешного завершения запроса

    xhr.onload = function () {
      // Если код ответа сервера не 200, то это ошибка
      if (this.status == 200) {
        // Возвращаем ответ сервера
        resolve(this.response);
      } else {
        // Выводим описание ошибки
        var error = new Error(this.statusText); // Сохраняем код ошибки

        error.code = this.status;
        reject(error);
      }
    }; // Создаем обработчик события неудачного завершения запроса


    xhr.onerror = function () {
      $("<div>").text("Сетевая ошибка").dialog({
        title: "Ошибка связи"
      });
      reject(new Error("Сетевая ошибка"));
    }; // Инициализируем объект XMLHttpRequest и сохраняем аргументы для последующего использования методом send(): асинхронный GET-запрос на url


    xhr.open("GET", url); // Открываем соединение и отсылаем запрос на сервер

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
  httpGet("menu.json").then(function (result) {
    // Преобразуем тело ответа в объект
    var allItems = JSON.parse(result); // Используем полученные данные для создания меню

    var temp; // Текущий уровень элементов меню (0 - главное меню)

    var lvl = 0; // Массивы для хранения пунктов меню для соответствующих уровней глубины вложенности меню

    var lvls = [];

    for (var _i = 0; _i < allItems[0]; _i++) {
      lvls[_i] = [];
    } // Индекс первого элемента меню, хранящегося в полученном с сервера массива


    var i = 1; // Обрабатываем массив

    while (i < allItems.length) {
      temp = allItems[i]; // Проверяем является ли текущий элемент массива сведениями о пункте меню или командой переключения глубины вложенности либо создания пункта с вложенным меню

      if (temp.indexOf("change_to_lvl") == -1 && temp.indexOf("create_lvl") == -1) {
        // Добавляем пункты меню на текущем уровне глубины вложенности меню
        lvls[lvl].push(new MenuItem(temp, allItems[i + 1])); // Переходим на следующий необработанный элемент массива

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
        } // Переходим на следующий необработанный элемент массива


        i++;
      }
    } // Создаем главное меню


    var menu = new Menu("menu-id", "menu-class", lvls[0]); // Визуализируем меню на странице сайта

    document.getElementById("menu").innerHTML = menu.render();
  }, function (error) {
    console.error(error);
    $("<div>").text("Ошибка удаления контейнера").dialog({
      title: "Ошибка удаления"
    });
  });
}
/** Создает элементы управления галереей */


function createGalleryControls() {
  // Названия кнопок
  var buttonNames = ["Все", "Aston Martin", "Audi quattro", "Audi R-8", "Ferrari", "Lamborghini"];

  for (var i = 0; i < buttonNames.length; i++) {
    $(".gallery_controls").append(new Button("tag_filter", buttonNames[i]).render());
  }
}
/** Загружает галерею */


function loadGallery() {
  var quantity = 24;

  for (var i = 0; i < quantity; i++) {
    httpGet("gallery/".concat(i, ".json")).then(function (result) {
      var imgData = JSON.parse(result);
      $(".card-columns").append(new Card(imgData.dataKey, imgData.image, imgData.id).render());
      $(".card-columns").append(new Modal(imgData.id, imgData.src, imgData.dataKey).render());
    }, function (error) {
      console.error(error);
      $("<div>").text(error.status + " " + error.statusText).dialog({
        title: "Ошибка связи"
      });
    });
  }
}
/** Обработчик нажатий клавиш фильтрации фотографий по тегу */


function tagFilter() {
  /** Обработчик нажатий клавиш фильтрации фотографий по тегу */
  $(".tag_filter").click(function () {
    if ($(this).hasClass("active")) {
      return;
    }

    $(".tag_filter.active").button("toggle");
    $(this).button("toggle");

    if ($(this).text() === "Все") {
      $(".card").show(300);
    } else {
      $(".card").hide().filter("[data-key=\"".concat($(this).text(), "\"]")).show(300);
    }
  });
}
/** Обрабатывает по правилам русского языка кавычки в тексте с диалогами, заключенными в апострофы, со словами на русском и английском языках */


function regExpOutput() {
  var edittingText = "\u0410\u043D\u043D\u0430 \u0441\u043A\u0430\u0437\u0430\u043B\u0430: '\u042D\u0442\u0438\u043C \u043B\u0435\u0442\u043E\u043C \u044F \u0431\u0443\u0434\u0443 \u043E\u0442\u0434\u044B\u0445\u0430\u0442\u044C \u0432 \u041A\u043E\u0442-\u0434'\u0418\u0432\u0443\u0430\u0440!'\n\n        \u0423\u0447\u0438\u0442\u0435\u043B\u044C \u043D\u0435\u043E\u0436\u0438\u0434\u0430\u043D\u043D\u043E \u0437\u0430\u043C\u0435\u0442\u0438\u043B: '\u0412\u0440\u0435\u043C\u044F \u0438\u0441\u0442\u0435\u043A\u043B\u043E'.\n\n        '\u041F\u0440\u044F\u043C\u0430\u044F \u0440\u0435\u0447\u044C'\n\n        '\u041F\u043E\u0435\u0437\u0434 \u0443\u0448\u0451\u043B, \u2014 \u0441 \u0433\u0440\u0443\u0441\u0442\u044C\u044E \u043F\u043E\u0434\u0443\u043C\u0430\u043B\u0430 \u0434\u0435\u0432\u0443\u0448\u043A\u0430, \u2014 \u0442\u0435\u043F\u0435\u0440\u044C \u0443\u0436 \u0442\u043E\u0447\u043D\u043E \u043E\u043F\u043E\u0437\u0434\u0430\u044E!'\n\n        '\u0427\u0442\u043E \u0436, \u043F\u043E\u0435\u0437\u0434 \u0443\u0441\u043F\u0435\u043B \u0443\u0439\u0442\u0438, \u2014 \u0441 \u0433\u0440\u0443\u0441\u0442\u044C\u044E \u043F\u043E\u0434\u0443\u043C\u0430\u043B \u0441\u0442\u0443\u0434\u0435\u043D\u0442. \u2013 \u0422\u0435\u043F\u0435\u0440\u044C \u044F \u0442\u043E\u0447\u043D\u043E \u043D\u0435 \u0443\u0441\u043F\u0435\u044E \u0432 \u0438\u043D\u0441\u0442\u0438\u0442\u0443\u0442!'.\n\n        \u041C\u0443\u0436\u0447\u0438\u043D\u0430 \u0441 \u0433\u0440\u0443\u0441\u0442\u044C\u044E \u043F\u043E\u0434\u0443\u043C\u0430\u043B: '\u042D\u043B\u0435\u043A\u0442\u0440\u0438\u0447\u043A\u0430 \u0443\u0448\u043B\u0430, \u0442\u0435\u043F\u0435\u0440\u044C \u044F \u0442\u043E\u0447\u043D\u043E \u043E\u043F\u043E\u0437\u0434\u0430\u044E', \u2014 \u0438 \u0431\u044B\u0441\u0442\u0440\u043E \u043F\u043E\u0431\u0435\u0436\u0430\u043B \u043D\u0430 \u0430\u0432\u0442\u043E\u0431\u0443\u0441\u043D\u0443\u044E \u043E\u0441\u0442\u0430\u043D\u043E\u0432\u043A\u0443.\n\n        'Hello, friend!'\n\n        'test'\n\n        Test parents' aren't 'test test";
  var newEl = document.createElement("p");
  newEl.innerHTML = edittingText;
  document.getElementsByClassName("reg_exp")[0].append(newEl); // Шаблон поддерживает текст на английском и русском языках

  var template = new RegExp("('\\s')|^('[A-ZА-ЯЁ])|([^a-zA-ZА-яЁё]'[A-ZА-ЯЁ])|([^a-zA-ZА-яЁё]'[a-zA-ZА-яЁё]+'[^a-zA-ZА-яЁё])|('$)|('\\n)|(', —)|(' —)|('\\.)", "g");
  edittingText = edittingText.replace(template, function (str) {
    // заменяем апострофы на кавычки
    return str.replace(/'/g, "\"");
  });
  template = new RegExp("(\"[\\wа-яёА-ЯЁ])", "g");
  edittingText = edittingText.replace(template, function (str) {
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
  $("#call_back").append(new FormField("input", "form_name", "name", "Имя").render());
  $("#call_back").append(new FormField("input", "form_birthday", "birthday", "Дата рождения").render());
  $("#call_back").append(new FormField("input", "form_phone", "phone", "Телефон").render());
  $("#call_back").append(new FormField("input", "form_email", "email", "e-mail").render());
  $("#call_back").append(new FormField("textarea", "form_text", "message", "Сообщение").render());
  $("#call_back").append(new FormSelect("cities").render());
  $("#call_back").append(new FormButton("form_submit", "Отправить", "checkForm(this.form)").render()); // Убираем labels, если в поле ввода формы введен какой-то текст

  hideLabelsOnBlur();
  $("#form_birthday").datepicker();
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
  container.classList.add("error"); // Создаем элемент для отображения сообщения об ошибке

  var msgElem = document.createElement("span");
  msgElem.classList.add("error-message");
  msgElem.innerHTML = errorMessage; // Визуализируем текст сообщения об ошибке

  container.appendChild(msgElem);
}
/** Удаляет сообщение об ошибке
 * @param container {Object}, в котором надо удалить сообщение об ошибке */


function resetError(container) {
  // Меняем стиль отображения контейнера, отображавшего ошибку
  container.classList.remove("error");

  if (container.lastChild.className == "error-message") {
    // Удаляем сообщение об ошибке
    container.removeChild(container.lastChild);
  }
}
/** Обрабатывает отправку данных из формы */


function checkForm(form) {
  // Получаем элементы формы
  var elems = form.elements; // Удаляем сообщение об ошибке заполнения поля с именем пользователя

  resetError(elems.name.parentNode); // Если поле с именем пользователя заполнено неверно

  if (!validForTemplate(elems.name.value, /^[а-яёА-ЯЁ]+$/)) {
    // то выводим сообщение об ошибке
    showError(elems.name.parentNode, "Имя может состоять только из русских букв");
  } // Обработка поля с телефоном пользователя


  resetError(elems.phone.parentNode);

  if (!validForTemplate(elems.phone.value, /^\+\d\(\d{3}\)\d{3}-\d{4}$/)) {
    showError(elems.phone.parentNode, "Введите номер телефона в формате +7(000)000-0000");
  } // Обработка поля с почтовым адресом пользователя


  resetError(elems.email.parentNode);

  if (!validForTemplate(elems.email.value, /^(\w+)((\.\w+)|(-\w+))?(@[a-z_]+\.[a-z]{2,6})$/)) {
    showError(elems.email.parentNode, "Недопустимый адрес электронной почты");
  } // Обработка поля с сообщением пользователя


  resetError(elems.message.parentNode);

  if (validForTemplate(elems.message.value, /^$/)) {
    showError(elems.message.parentNode, "Оставьте ваше сообщение");
  }

  $(".error-message").effect("slide", 3000);
}
/** Убирает labels, если в поле ввода формы введены символы */


function hideLabelsOnBlur() {
  // Обработчик события потери фокуса на поле form_name
  form_name.onblur = function () {
    // если в поле имеются символы
    if (form_name.value !== "") // то скрываем label
      document.forms.callback.name.parentNode.getElementsByTagName("label")[0].style.display = "none";else // иначе отображаем label
      document.forms.callback.name.parentNode.getElementsByTagName("label")[0].style.display = "";
  }; // Обработчик события потери фокуса на поле form_birthday


  form_birthday.onblur = function () {
    $("#form_birthday + label")[0].style.top = "8.5em";
  }; // Обработчик события потери фокуса на поле form_phone


  form_phone.onblur = function () {
    if (form_phone.value !== "") document.forms.callback.phone.parentNode.getElementsByTagName("label")[0].style.display = "none";else document.forms.callback.phone.parentNode.getElementsByTagName("label")[0].style.display = "";
  }; // Обработчик события потери фокуса на поле form_email


  form_email.onblur = function () {
    if (form_email.value !== "") document.forms.callback.email.parentNode.getElementsByTagName("label")[0].style.display = "none";else document.forms.callback.email.parentNode.getElementsByTagName("label")[0].style.display = "";
  }; // Обработчик события потери фокуса на поле form_text


  form_text.onblur = function () {
    if (form_text.value !== "") document.forms.callback.message.parentNode.getElementsByTagName("label")[0].style.display = "none";else document.forms.callback.message.parentNode.getElementsByTagName("label")[0].style.display = "";
  };
}
/** Включает отображение раздела о компании */


function showCompanyInfo() {
  if (document.querySelector("#company").style.display === "") {
    // Создаем страницу с отзывами
    createCommentPage();
    document.querySelector("#cart").style.display = "";
    document.querySelector("#catalog").style.display = "";
    document.querySelector("#photo_gallery").style.display = "";
    document.querySelector("#tabs").style.display = "";
    document.querySelector("#reg_exp").style.display = "";
    document.querySelector("#company").style.display = "block";
    document.querySelector("#call_back").style.display = "";
  }
}
/** Включает отображение корзины */


function onClickShowBasket() {
  if (document.querySelector("#cart").style.display === "") {
    // Получаем содержимое корзины с сервера
    getBasket(userID);
    document.querySelector("#cart").style.display = "block";
    document.querySelector("#catalog").style.display = "";
    document.querySelector("#photo_gallery").style.display = "";
    document.querySelector("#tabs").style.display = "";
    document.querySelector("#reg_exp").style.display = "";
    document.querySelector("#company").style.display = "";
    document.querySelector("#call_back").style.display = "";
  }
}
/** Включает отображение раздела каталог */


function showCatalog() {
  if (document.querySelector("#catalog").style.display === "") {
    document.querySelector("#cart").style.display = "";
    document.querySelector("#catalog").style.display = "block";
    document.querySelector("#photo_gallery").style.display = "";
    document.querySelector("#tabs").style.display = "";
    document.querySelector("#reg_exp").style.display = "";
    document.querySelector("#company").style.display = "";
    document.querySelector("#call_back").style.display = "";
  }
}
/** Включает отображение раздела фотогалереи */


function showGallery() {
  if (document.querySelector("#photo_gallery").style.display === "") {
    document.querySelector("#cart").style.display = "";
    document.querySelector("#catalog").style.display = "";
    document.querySelector("#photo_gallery").style.display = "block";
    document.querySelector("#tabs").style.display = "";
    document.querySelector("#reg_exp").style.display = "";
    document.querySelector("#company").style.display = "";
    document.querySelector("#call_back").style.display = "";
  }
}
/** Включает отображение раздела промоакций */


function showPromo() {
  if (document.querySelector("#tabs").style.display === "") {
    document.querySelector("#cart").style.display = "";
    document.querySelector("#catalog").style.display = "";
    document.querySelector("#photo_gallery").style.display = "";
    document.querySelector("#tabs").style.display = "block";
    document.querySelector("#reg_exp").style.display = "";
    document.querySelector("#company").style.display = "";
    document.querySelector("#call_back").style.display = "";
  }
}
/** Включает отображение раздела новостей */


function showNews() {
  if (document.querySelector("#reg_exp").style.display === "") {
    document.querySelector("#cart").style.display = "";
    document.querySelector("#catalog").style.display = "";
    document.querySelector("#tabs").style.display = "";
    document.querySelector("#photo_gallery").style.display = "";
    document.querySelector("#reg_exp").style.display = "block";
    document.querySelector("#company").style.display = "";
    document.querySelector("#call_back").style.display = "";
  }
}
/** Включает отображение раздела помощи */


function showHelp() {
  if (document.querySelector("#call_back").style.display === "") {
    document.querySelector("#cart").style.display = "";
    document.querySelector("#catalog").style.display = "";
    document.querySelector("#tabs").style.display = "";
    document.querySelector("#photo_gallery").style.display = "";
    document.querySelector("#reg_exp").style.display = "";
    document.querySelector("#company").style.display = "";
    document.querySelector("#call_back").style.display = "block";

    if (!citiesLoaded) {
      // Подгружаем наименования населенных пунктов в поле селект формы обратной связи
      loadCities($("#cities")[0]); // Список населенных пунктов загружен

      citiesLoaded = true;
    }
  }
}
/** Предоставляет управление вкладками */


function tabControls() {
  // По умолчанию открываем первую вкладку
  $(".tab_controls li:first").addClass("opened_tab"); // Отображаем первый div

  $(".tabs div:first").addClass("opened"); // Остальные div соответствуют другим вкладкам - скрываем их

  $(".tabs div:not(:first)").hide(); // Добавляем обработчик щелчков по вкладкам
  // Если щелчок по закрытой вкладке

  $("ul.tab_controls").on("click", "li:not(.opened_tab)", function () {
    // то применяем к ней класс opened_tab
    $(this).addClass("opened_tab") // у остальных вкладок удаляем этот класс
    .siblings().removeClass("opened_tab") // удаляем класс opened у всех div вкладок
    .closest("div.tabs").find("div.tab_info").removeClass("opened").hide() // применяем класс opened к div, имеющим тот же порядковый номер, что и вкладка
    .eq($(this).index()).addClass("opened").show();
  });
}
/** Управляет визуализацией подсказки */


function btn_slide() {
  $("#helper").slideToggle("slow");
  $("p .slide").toggleClass("active");
}
/** Создает фотогалерею */


function createGallery() {
  // Создаем элементы управления галереей
  createGalleryControls(); // Загружаем изображения для галереи

  loadGallery(); // Подключаем обработчик щелчков по кнопкам галереи

  tagFilter();
}
/** Создает элементы, отображаемые на каждой странице */


function pageTemplate() {
  // Загружаем меню
  loadMenu(); // Загружаем изображения с Flickr

  showFlickrImages(); // Отображаем карусель

  createCarousel(); // Скрываем подсказку вверху страницы

  $("#helper").hide();
}
/** Загружает названия и цены автомобилей */


function loadCatalog() {
  // Загружаем описания автомобилей
  $.ajax({
    url: "catalogue/autoDetails.json",
    dataType: "json",
    success: function success(data, testStatus) {
      try {
        // Бросаем исключение, если загрузка не удалась
        if (testStatus != "success") throw new Error("Сведения об автомобилях с сервера не получены из-за ошибки связи"); // Добавляем названия автомобилей в поле селект формы

        addAutomobiles(data); // Добавляем обработчик щелчков по товарам в списке каталога

        shooseItem(data);
      } catch (e) {
        // выводим сообщение об ошибке
        console.error(e.message);
        $("<div>").text(e.status + " " + e.statusText).dialog({
          title: "Ошибка связи"
        });
      }
    },
    error: function error(_error2) {
      console.error(_error2);
      $('<div>').text(_error2.status + ' ' + _error2.statusText).dialog({
        title: 'Ошибка связи'
      });
    }
  });
}
/** Создает форму с каталогом автомобилей */


function createCatalog() {
  // Загружаем наименования автомобилей в селект формы каталога
  $('#autoShooserControl').load('catalogue/autoOptions.json'); // Загружаем названия и цены автомобилей

  loadCatalog();
}
/** Добавляет обработчик щелчков по названиям автомобилей в поле селект формы
 * @param automobilesData {Object} json-данные об автомобилях */


function addAutomobiles(automobilesData) {
  $('#autoShooserControl').change(function (event) {
    // Убираем опцию с подсказкой
    $('[value=""]', event.target).remove(); // Сохраняем номер выбранной опции

    var val = $(event.target).val(); // Отображаем описание автомобиля

    $('#autoDetailPane').html("<p>\u041D\u0430\u0437\u0432\u0430\u043D\u0438\u0435 \u0430\u0432\u0442\u043E\u043C\u043E\u0431\u0438\u043B\u044F ".concat(automobilesData[val].name, "</p><p>\u0426\u0435\u043D\u0430 \u0430\u0432\u0442\u043E\u043C\u043E\u0431\u0438\u043B\u044F ").concat(automobilesData[val].price, " \u0440\u0443\u0431\u043B\u0435\u0439</p>"));
  });
}
/** Добавляет обработчик для добавления товара в корзину */


function shooseItem(automobilesData) {
  var autoCatalog = document.querySelector('#autoCatalog');
  var autoShooserControl = document.querySelector('#autoShooserControl'); // Добавляем обработчик событий отправки при нажатии на товар в списке каталога

  autoCatalog.addEventListener('submit', function (event) {
    event.preventDefault();
    onClickAddItemToBasket(automobilesData[autoShooserControl.value].name, automobilesData[autoShooserControl.value].price);
  });
}
/** Авторизирует пользователя */


function userAuthorization() {
  $.ajax({
    url: "".concat(SERVER_URL, "/shop"),
    data: {
      'user_id': userID
    },
    dataType: 'json',
    success: function success(data, testStatus) {
      try {
        // Бросаем исключение, если загрузка не удалась
        if (testStatus != 'success') throw new Error('id пользователя с сервера не получено из-за ошибки связи'); // Сохраняем id пользователя

        userID = data.user_id;
      } catch (e) {
        // выводим сообщение об ошибке
        console.error(e.message);
        $('<div>').text(e.status + ' ' + e.responseJSON.message).dialog({
          title: 'Ошибка связи'
        });
      }
    },
    error: function error(_error3) {
      console.error("".concat(_error3.status, " ").concat(_error3.responseJSON.message));
      $('<div>').text(_error3.status + ' ' + _error3.responseJSON.message).dialog({
        title: 'Ошибка связи'
      });
    }
  });
}
/** Создает страницу с отзывами о магазине */


function createCommentPage() {
  // Добавляем форму для отправки отзывов
  createCommentForm(); // Получаем все отзывы с сервера

  getComments(); // Добавлем обработчик отправки отзывов на сервер

  onClickSubmitNewComment();
}
/** Добавляет форму для отправки отзыва */


function createCommentForm() {
  // Добавляет форму для отправки отзывов
  $('#company').html("<form id=\"add_new_comment\"><label for=\"new_comment\">\u0427\u0442\u043E \u0412\u044B \u0434\u0443\u043C\u0430\u0435\u0442\u0435 \u043E \u043D\u0430\u0448\u0435\u043C \u043C\u0430\u0433\u0430\u0437\u0438\u043D\u0435?</label><input id=\"new_comment\"><input class=\"btn\" id=\"send_comment\" type=\"submit\" value=\"\u041E\u0442\u043F\u0440\u0430\u0432\u0438\u0442\u044C \u043E\u0442\u0437\u044B\u0432\"></form>");
}
/** Добавляет обработчик отправки отзывов на сервер */


function onClickSubmitNewComment() {
  var addNewComment = document.querySelector('#add_new_comment');
  var newComment = document.querySelector('#new_comment');
  addNewComment.addEventListener('submit', function (event) {
    event.preventDefault(); // Если отзыв написан

    if (newComment.value !== '') {
      // то отправляем новый отзыв на сервер
      sendNewComment(newComment.value, lastCommentNumber); // Очищаем поле ввода

      newComment.value = '';
    }
  });
}
/** Получает с сервера все отзывы и отображает их */


function getComments() {
  // Загружаем отзывы
  $.ajax({
    url: "".concat(SERVER_URL, "/comments"),
    dataType: 'json',
    success: function success(data, testStatus) {
      try {
        // Бросаем исключение, если загрузка не удалась
        if (testStatus != 'success') throw new Error('Отзывы с сервера не получены из-за ошибки связи'); // Отображаем отзывы

        showComments(data);
      } catch (e) {
        // выводим сообщение об ошибке
        console.error(e.message);
        $('<div>').text(e.status + ' ' + e.statusText).dialog({
          title: 'Ошибка связи'
        });
      }
    },
    error: function error(_error4) {
      console.error("".concat(_error4.status, " ").concat(_error4.responseJSON.message));
      $('<div>').text(_error4.status + ' ' + _error4.responseJSON.message).dialog({
        title: 'Ошибка связи'
      });
    }
  });
}
/** Отображает отзывы
 * @param commentsData {Object} json-данные отзывов */


function showComments(commentsData) {
  if (commentsData.length == 0) {
    $('#cart').text('Отзывы о магазине отсутствуют. Пожалуйста, оставьте Ваш отзыв.');
  } else {
    var comments = "<h4>\u041E\u0442\u0437\u044B\u0432\u044B \u043F\u043E\u043A\u0443\u043F\u0430\u0442\u0435\u043B\u0435\u0439 \u043E \u043D\u0430\u0441:</h4>";

    for (var i = 0; i < commentsData.length; i++) {
      comments += "<div class=\"card comments\" id=\"comment".concat(i, "\"><div class=\"card-body\"><p class=\"card-text user\">\u041D\u043E\u043C\u0435\u0440 \u043E\u0442\u0437\u044B\u0432\u0430: ").concat(commentsData[i].comment_id, "</p><p class=\"card-text title\">\u0421\u043E\u0434\u0435\u0440\u0436\u0430\u043D\u0438\u0435 \u043E\u0442\u0437\u044B\u0432\u0430:</p><p class=\"card-text message\">").concat(commentsData[i].text, "</p><p class=\"card-text like\">\u041E\u0446\u0435\u043D\u043A\u0430 \u043E\u0442\u0437\u044B\u0432\u0430: <span id=\"likes").concat(i, "\">").concat(commentsData[i].likes, "</span></p><a href=\"#\" class=\"btn\" id=\"delete").concat(i, "\">\u0423\u0434\u0430\u043B\u0438\u0442\u044C \u043E\u0442\u0437\u044B\u0432</a><a href=\"#\" class=\"btn\" id=\"like").concat(i, "\">\u041C\u043D\u0435 \u043D\u0440\u0430\u0432\u0438\u0442\u0441\u044F</a></div></div>");
    }

    $('#company').append(comments); // Сохраняем номер последнего оображенного отзыва

    lastCommentNumber = commentsData.length;

    var _loop = function _loop(_i2) {
      $("#delete".concat(_i2)).click(commentsData[_i2], function (eventObject) {
        // отключаем переход по ссылке
        eventObject.preventDefault(); // Удаляем отзыв по щелчку на кнопку "Удалить отзыв"

        onClickDeleteComment(eventObject.data.comment_id, _i2);
      });
      $("#like".concat(_i2)).click(commentsData[_i2], function (eventObject) {
        // отключаем переход по ссылке
        eventObject.preventDefault(); // Повышаем оценку отзыва по щелчку на кнопку "Мне нравится"

        onClickLikeComment(eventObject.data.comment_id, _i2);
      });
    };

    for (var _i2 = 0; _i2 < commentsData.length; _i2++) {
      _loop(_i2);
    }
  }
}
/** Удаляет отзыв по щелчку на кнопку "Удалить отзыв"
 * @param commentID {String} id отзыва */


function onClickDeleteComment(commentID, commentNumber) {
  $.ajax({
    url: "".concat(SERVER_URL, "/comments?comment_id=").concat(commentID),
    type: 'delete',
    dataType: 'json',
    success: function success(data, testStatus) {
      try {
        // Бросаем исключение, если загрузка не удалась
        if (testStatus != 'success') throw new Error('Отзыв не удален из-за ошибки связи'); // Скрываем отзыв со страницы отзывов

        hideComment(commentNumber);
      } catch (e) {
        // выводим сообщение об ошибке
        console.error(e.message);
        $('<div>').text(e.status + ' ' + e.responseJSON.message).dialog({
          title: 'Ошибка связи'
        });
      }
    },
    error: function error(_error5) {
      console.error("".concat(_error5.status, " ").concat(_error5.responseJSON.message));
      $('<div>').text(_error5.status + ' ' + _error5.responseJSON.message).dialog({
        title: 'Ошибка связи'
      });
    }
  });
}
/** Скрывает отзыв на странице отзывов
 * @param commentNumber {Number} номер отзыва на странице */


function hideComment(commentNumber) {
  $("#comment".concat(commentNumber)).hide();
}
/** Повышает оценку отзыва
 * @param commentID {String} id отзыва
 * @param commentNumber {Number} номер отзыва на странице */


function onClickLikeComment(commentID, commentNumber) {
  $.ajax({
    url: "".concat(SERVER_URL, "/comments?comment_id=").concat(commentID),
    type: 'patch',
    dataType: 'json',
    success: function success(data, testStatus) {
      try {
        // Бросаем исключение, если загрузка не удалась
        if (testStatus != 'success') throw new Error('Оценка отзыва не добавлена из-за ошибки связи'); // Визуализируем новую оценку отзыва на странице отзывов

        showNewLikeForComment(data, commentNumber);
      } catch (e) {
        // выводим сообщение об ошибке
        console.error(e.message);
        $('<div>').text(e.status + ' ' + e.responseJSON.message).dialog({
          title: 'Ошибка связи'
        });
      }
    },
    error: function error(_error6) {
      console.error("".concat(_error6.status, " ").concat(_error6.responseJSON.message));
      $('<div>').text(_error6.status + ' ' + _error6.responseJSON.message).dialog({
        title: 'Ошибка связи'
      });
    }
  });
}
/** Визуализирует новую оценку отзыва на странице отзывов
 * @param commentData {Object} json-данные отзыва
 * @param commentNumber {Number} номер отзыва */


function showNewLikeForComment(commentData, commentNumber) {
  $("#likes".concat(commentNumber)).html(commentData.likes);
}
/** Добавляет новый отзыв в базу отзывов на сервере
 * @param comment {String} текст отзыва */


function sendNewComment(comment) {
  $.ajax({
    url: "".concat(SERVER_URL, "/comments?text=").concat(comment),
    type: 'post',
    dataType: 'json',
    success: function success(data, testStatus) {
      try {
        // Бросаем исключение, если загрузка не удалась
        if (testStatus != 'success') throw new Error('Отзыв не добавлен из-за ошибки связи'); // Визуализирует новый отзыв на странице отзывов

        showNewComment(data);
      } catch (e) {
        // выводим сообщение об ошибке
        console.error(e.message);
        $('<div>').text(e.status + ' ' + e.responseJSON.message).dialog({
          title: 'Ошибка связи'
        });
      }
    },
    error: function error(_error7) {
      console.error("".concat(_error7.status, " ").concat(_error7.responseJSON.message));
      $('<div>').text(_error7.status + ' ' + _error7.responseJSON.message).dialog({
        title: 'Ошибка связи'
      });
    }
  });
}
/** Визуализирует новый отзыв на странице
 * @param commentData {Object} полученные с сервера json-данные нового отзыва */


function showNewComment(commentData) {
  // Сохраняем номер отзыва
  var commentNumber = lastCommentNumber;
  $('#company').append("<div class=\"card comments\" id=\"comment".concat(commentNumber, "\"><div class=\"card-body\"><p class=\"card-text user\">\u041D\u043E\u043C\u0435\u0440 \u043E\u0442\u0437\u044B\u0432\u0430: ").concat(commentData.comment_id, "</p><p class=\"card-text title\">\u0421\u043E\u0434\u0435\u0440\u0436\u0430\u043D\u0438\u0435 \u043E\u0442\u0437\u044B\u0432\u0430:</p><p class=\"card-text message\">").concat(commentData.text, "</p><p class=\"card-text like\">\u041E\u0446\u0435\u043D\u043A\u0430 \u043E\u0442\u0437\u044B\u0432\u0430: <span id=\"likes").concat(commentNumber, "\">").concat(commentData.likes, "</span></p><a href=\"#\" class=\"btn\" id=\"delete").concat(commentNumber, "\">\u0423\u0434\u0430\u043B\u0438\u0442\u044C \u043E\u0442\u0437\u044B\u0432</a><a href=\"#\" class=\"btn\" id=\"like").concat(commentNumber, "\">\u041C\u043D\u0435 \u043D\u0440\u0430\u0432\u0438\u0442\u0441\u044F</a></div></div>")); // Добавляем обработчики кнопок удаления и оценки для нового отзыва

  $("#delete".concat(commentNumber)).click(commentData, function (eventObject) {
    // отключаем переход по ссылке
    eventObject.preventDefault(); // Удаляем отзыв по щелчку на кнопку "Удалить отзыв"

    onClickDeleteComment(eventObject.data.comment_id, commentNumber);
  });
  $("#like".concat(commentNumber)).click(commentData, function (eventObject) {
    // отключаем переход по ссылке
    eventObject.preventDefault(); // Повышаем оценку отзыва по щелчку на кнопку "Мне нравится"

    onClickLikeComment(eventObject.data.comment_id, commentNumber);
  }); // Увеличиваем номер последнего визуализируемого отзыва

  lastCommentNumber++;
}
/** Загружает с сервера данные корзины, затем отображает корзину или создает новую корзину
 * @param consumerID {String} id покупателя */


function getBasket(consumerID) {
  // Загружаем корзину
  $.ajax({
    url: "".concat(SERVER_URL, "/shop"),
    data: {
      'user_id': consumerID
    },
    dataType: 'json',
    success: function success(data, testStatus) {
      try {
        // Бросаем исключение, если загрузка не удалась
        if (testStatus != 'success') throw new Error('Содержимое корзины с сервера не получено из-за ошибки связи'); // Отображаем содержимое корзины

        showBasket(data);
      } catch (e) {
        // выводим сообщение об ошибке
        console.error(e.message);
        $('<div>').text(e.status + ' ' + e.responseJSON.message).dialog({
          title: 'Ошибка связи'
        });
      }
    },
    error: function error(_error8) {
      console.error("".concat(_error8.status, " ").concat(_error8.responseJSON.message));
      $("<div>").text(_error8.status + " " + _error8.responseJSON.message).dialog({
        title: "Ошибка связи"
      });
    }
  });
}
/** Отображает содержимое корзины
 * @param basketData {Object} json-данные содержимого корзины */


function showBasket(basketData) {
  if (basketData.cart.length == 0) {
    $("#cart").text("Товары в корзине отсутствуют. Перейдите в каталог сайта, чтобы выбрать нужные Вам товары");
  } else {
    var basket = "<p>\u0418\u043C\u044F \u043F\u043E\u043A\u0443\u043F\u0430\u0442\u0435\u043B\u044F: ".concat(basketData.user_id, "</p><p>\u0421\u043E\u0441\u0442\u0430\u0432 \u043A\u043E\u0440\u0437\u0438\u043D\u044B:</p>"); // Общая стоимость товаров в корзине

    var value = 0;

    for (var i = 0; i < basketData.cart.length; i++) {
      // Визуализируем каждый товар в корзине
      basket += "<div class=\"card automobile\"><div class=\"card-body\"><p class=\"card-text\">".concat(i + 1, ") \u041D\u0430\u0438\u043C\u0435\u043D\u043E\u0432\u0430\u043D\u0438\u0435: ").concat(basketData.cart[i].product, "</p><p class=\"card-text\">\u0426\u0435\u043D\u0430: ").concat(basketData.cart[i].price, "</p><a href=\"#\" class=\"btn\" id=\"item").concat(i, "\">\u0423\u0434\u0430\u043B\u0438\u0442\u044C \u0442\u043E\u0432\u0430\u0440 \u0438\u0437 \u043A\u043E\u0440\u0437\u0438\u043D\u044B</a></div></div>"); // Определяем общую стоимость товаров в корзине

      value += Number(basketData.cart[i].price);
    } // Визуализируем общую стоимость товаров в корзине


    basket += "<p>\u041E\u0431\u0449\u0430\u044F \u0441\u0442\u043E\u0438\u043C\u043E\u0441\u0442\u044C \u0442\u043E\u0432\u0430\u0440\u043E\u0432 \u0432 \u043A\u043E\u0440\u0437\u0438\u043D\u0435: ".concat(value, " \u0440\u0443\u0431\u043B\u0435\u0439.</p>"); // Визуализируем содержимое корзины на странице

    $("#cart").html(basket); // Добавляем кнопки удаления товара из корзины для каждого товара в корзине

    for (var _i3 = 0; _i3 < basketData.cart.length; _i3++) {
      $("#item".concat(_i3)).click(basketData.cart[_i3], function (eventObject) {
        // отключаем переход по ссылке
        eventObject.preventDefault();
        onClickDeleteItemFromBasket(eventObject.data.product_id);
      });
    }
  }
}
/** Добавляет товар в корзину
 * @param item {String} товар, добавляемый в корзину
 * @param price {Price} цена товара, добавляемого в корзину */


function onClickAddItemToBasket(item, price) {
  $.ajax({
    url: "".concat(SERVER_URL, "/shop?user_id=").concat(userID, "&product=").concat(item, "&price=").concat(price),
    type: "post",
    dataType: "json",
    success: function success(data, testStatus) {
      try {
        // Бросаем исключение, если загрузка не удалась
        if (testStatus != "success") throw new Error("Товар в корзину не добавлен из-за ошибки связи");
      } catch (e) {
        // выводим сообщение об ошибке
        console.error(e.message);
        $("<div>").text(e.status + " " + e.responseJSON.messag).dialog({
          title: "Ошибка связи"
        });
      }
    },
    error: function error(_error9) {
      console.error("".concat(_error9.status, " ").concat(_error9.responseJSON.message));
      $("<div>").text(_error9.status + " " + _error9.responseJSON.messag).dialog({
        title: "Ошибка связи"
      });
    }
  });
}
/** Удаляет товар из корзины
 * @param productID id удаляемого товара */


function onClickDeleteItemFromBasket(productID) {
  $.ajax({
    url: "".concat(SERVER_URL, "/shop?user_id=").concat(userID, "&product_id=").concat(productID),
    type: "delete",
    dataType: "json",
    success: function success(data, testStatus) {
      try {
        // Бросаем исключение, если загрузка не удалась
        if (testStatus != "success") throw new Error("Товар из корзины не удален из-за ошибки связи"); // Обтображаем содержимое корзины после удаления товара

        showBasket(data);
      } catch (e) {
        // выводим сообщение об ошибке
        console.error(e.message);
        $("<div>").text(e.status + " " + e.responseJSON.message).dialog({
          title: "Ошибка связи"
        });
      }
    },
    error: function error(_error10) {
      console.error("".concat(_error10.status, " ").concat(_error10.responseJSON.message));
      $("<div>").text(_error10.status + " " + _error10.responseJSON.message).dialog({
        title: "Ошибка связи"
      });
    }
  });
}

(function ($) {
  /** Добавляет метод Carousel (карусель) классу jQuery
   * @param options {Object} содержит пользовательские настройки
   * @return {Object} для цепочек методов */
  $.fn.Carousel = function (options) {
    // задаем параметры карусели по-умолчанию
    var settings = {
      visible: 3,
      //количество отображаемых позиций 3
      rotateBy: 1,
      //прокручивать по 1
      speed: 1000,
      //скорость 1 секунда
      btnNext: null,
      // кнопка вперед не назначена
      btnPrev: null,
      // кнопка назад не назначена
      auto: true,
      // авто прокрутка включена
      margin: 10,
      // отступ между позициями
      position: "h",
      // расположение по горизонтали
      dirAutoSlide: false //направление движения вперед для автопрокрутки

    }; // возвращаем объект для использования в цепочках методов

    return this.each(function () {
      if (options) {
        // устанавливаем пользовательские настройки
        $.extend(settings, options);
      }

      var $this = $(this); //родительский элемент (Блок в котором находится карусель)

      var $carousel = $this.children(":first"); // получаем дочерний элемент (UL) т.е. саму карусель

      var itemWidth = $carousel.children().outerWidth() + settings.margin; // вычисляем ширину элемента

      var itemHeight = $carousel.children().outerHeight() + settings.margin; // вычисляем высоту элемента

      var itemsTotal = $carousel.children().length; // получаем общее количество элементов в каруселе

      var running = false; //останавливаем процесс

      var intID = null; //очищаем интервал
      //size - размер для вычисления длины, зависит от ориентации карусели

      var size = itemWidth;
      if (settings.position == "v") size = itemHeight; //Если карусель вертикальная то

      if (settings.position == "v") $this.css({
        "position": "relative",
        // необходимо для нормального отображения в IE6-7
        "overflow": "hidden",
        // прячем все, что не влезает в контейнер
        "height": settings.visible * size + "px",
        // ставим длину контейнера равной ширине всех видимых элементов
        "width": itemWidth - settings.margin // ширина контейнера равна ширине элемента

      });else $this.css({
        "position": "relative",
        // необходимо для нормального отображения в IE6-7
        "overflow": "hidden",
        // прячем все, что не влезает в контейнер
        "width": settings.visible * size + "px",
        // ширину контейнера ставим равной ширине всех видимых элементов
        "height": itemHeight - settings.margin
      }); //вычисляем расстояние отступа от каждого элемента

      if (settings.position == "v") $carousel.children("li").css({
        "margin-top": settings.margin / 2 + "px",
        "margin-bottom": settings.margin / 2 + "px",
        "float": "left",
        "width": "60px",
        "height": "40px"
      });else $carousel.children("li").css({
        "margin-left": settings.margin / 2 + "px",
        "margin-right": settings.margin / 2 + "px"
      }); // в зависимости от ориентации, увеличиваем длину или ширину карусели

      if (settings.position == "v") $carousel.css({
        "position": "relative",
        // разрешаем сдвиг по оси
        "height": 9999 + "px",
        // увеличиваем длину карусели
        "left": 0,
        "top": 0
      });else $carousel.css({
        "position": "relative",
        // разрешаем сдвиг по оси
        "width": 9999 + "px",
        // увеличиваем лену карусели
        "top": 0,
        "left": 0
      }); // прокрутка карусели в наравлении dir [true-вперед; false-назад]

      function slide(dir) {
        var direction = !dir ? -1 : 1; // устанавливаем заданное направление

        var Indent = 0; // смещение (для ul)

        if (!running) {
          // если анимация завершена (или еще не запущена)
          running = true; // ставим флаг, что анимация в процессе

          if (intID) {
            // если запущен интервал
            window.clearInterval(intID); // очищаем интервал
          }

          if (!dir) {
            // если мы мотаем к следующему элементу (так по умолчанию)

            /*
              * вставляем после последнего элемента карусели
              * клоны стольких элементов, сколько задано
              * в параметре rotateBy (по умолчанию задан один элемент)
            */
            $carousel.children(":last").after($carousel.children().slice(0, settings.rotateBy).clone(true));
          } else {
            // если мотаем к предыдущему элементу

            /*
               * вставляем перед первым элементом карусели
               * клоны стольких элементов, сколько задано
               * в параметре rotateBy (по умолчанию задан один элемент)
            */
            $carousel.children(":first").before($carousel.children().slice(itemsTotal - settings.rotateBy, itemsTotal).clone(true));
            /*
             * сдвигаем карусель (<ul>)  на ширину/высоту  элемента,
             * умноженную на количество элементов, заданных
             * в параметре rotateBy (по умолчанию задан один элемент)
            */

            if (settings.position == "v") $carousel.css("top", -size * settings.rotateBy + "px");else $carousel.css("left", -size * settings.rotateBy + "px");
          }
          /*
           * расчитываем  смещение
           * текущее значение  + ширина/высота  одного элемента * количество проматываемых элементов * на направление перемещения (1 или -1)
            */


          if (settings.position == "v") Indent = parseInt($carousel.css("top")) + size * settings.rotateBy * direction;else Indent = parseInt($carousel.css("left")) + size * settings.rotateBy * direction;
          if (settings.position == "v") var animate_data = {
            "top": Indent
          };else var animate_data = {
            "left": Indent
          }; // запускаем анимацию

          $carousel.animate(animate_data, {
            queue: false,
            duration: settings.speed,
            complete: function complete() {
              // когда анимация закончена
              if (!dir) {
                // если мы мотаем к следующему элементу (так по умолчанию)
                // удаляем столько первых элементов, сколько задано в rotateBy
                $carousel.children().slice(0, settings.rotateBy).remove(); // устанавливаем сдвиг в ноль

                if (settings.position == "v") $carousel.css("top", 0);else $carousel.css("left", 0);
              } else {
                // если мотаем к предыдущему элементу
                // удаляем столько последних элементов, сколько задано в rotateBy
                $carousel.children().slice(itemsTotal, itemsTotal + settings.rotateBy).remove();
              }

              if (settings.auto) {
                // если карусель должна проматываться автоматически
                // запускаем вызов функции через интервал времени (auto)
                intID = window.setInterval(function () {
                  slide(settings.dirAutoSlide);
                }, settings.auto);
              }

              running = false; // отмечаем, что анимация завершена
            }
          });
        }

        return false; // возвращаем false для того, чтобы не было перехода по ссылке
      } // назначаем обработчик на событие click для кнопки "вперед"


      $(settings.btnNext).click(function () {
        return slide(false);
      }); // назначаем обработчик на событие click для кнопки "Назад"

      $(settings.btnPrev).click(function () {
        return slide(true);
      });

      if (settings.auto) {
        // если карусель должна проматываться автоматически
        // запускаем вызов функции через временной интервал
        intID = window.setInterval(function () {
          slide(settings.dirAutoSlide);
        }, settings.auto);
      }
    });
  };
})(jQuery);
/** Создает карусель на странице */


function createCarousel() {
  $(".popular_goods").Carousel({
    visible: 2,
    rotateBy: 1,
    speed: 5000,
    btnNext: "#next",
    btnPrev: "#prev",
    auto: true,
    backslide: true,
    margin: 5
  });
} // Дожидаемся загрузки страницы


document.addEventListener("DOMContentLoaded", function () {
  // Создаем элементы, отображаемые на каждой странице
  pageTemplate(); // Создаем форму с каталогом автомобилей

  createCatalog(); // Добавляем управление для вкладок раздела Промоакции

  tabControls(); // Работаем с регулярными выражениями

  regExpOutput(); // Создаем фотогалерею

  createGallery(); // Создаем форму обратной связи

  createForm();
});
//# sourceMappingURL=site.js.map
