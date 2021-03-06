﻿# Структура проекта
- папка `app` содержит исходники проекта:
    - папка `catalogue` содержит изображения для каталога товаров
    - папка `css` содержит скомпилированные стили для сайта
    - папка `gallery` содержит изображения фотогалереи
    - папка `help` содержит список населенных пунктов
    - папка `js` содержит js-скрипты для браузеров без поддержки ES-2015+
    - папка `scss` содержит стили scss
    - папка `js` содержит исходные js-скрипты
    - файл `index.html` содержит html стартовой страницы
    - Файл `menu.json` содержит информацию о меню сайта в следующем виде:
      - первый элемент - максимальная глубина (уровень) вложенности меню
      - элементы меню задаются двумя значениями - функция для отображения контента и название пункта меню
      - `change_to_lvlN` - команда перехода на другой уровень вложенности меню, где N - уровень, на который переходим
      - `create_lvlN` - команда создания пункта меню уровня N, содержащего вложенное меню 
- папка `dist` содержит проект, подготовленный для публикации на сервере:
    - папка `catalogue` содержит изображения для каталога товаров
    - папка `css` содержит скомпилированные стили для сайта
    - папка `gallery` содержит изображения фотогалереи
    - папка `help` содержит список населенных пунктов
    - папка `js` содержит js-скрипты для браузеров без поддержки ES-2015+
    - файл `index.html` содержит html стартовой страницы
    - Файл `menu.json` содержит меню сайта
- файл `gulpfile.js` содержит задачи для gulp
- файл `npm-shrinkwrap.json` содержит сведения о пакетах, установленных на ПК, использованном для разработки
- файл `package.json` содержит сведения о пакетах, используемых для запуска и разработки проекта

## Sources
1. В папке app/src находятся исходные файлы на js.
2. В папке app/scss находятся исходные файлы на scss.

### Команды для gulp
1. Запуск сервера для разработки (выводится информация о прохождении тестов):  
`gulp dev`.
2. Подготовка файлов для публикации на сервере:  
`gulp dist`.
3. Запуск сервера с конечным продуктом:  
`gulp production`.

# Тестирование работы сайта в браузере
Браузерные тесты используют библиотеку Selenium. Перед запуском тестов необходимо предварительно запустить сервер сайта.  
Для запуска тестов предварительно необходимо настроить конфигурацию следующим образом:
![alt text](https://github.com/k1ngp1n2/k1ngp1n2.github.io/blob/master/selenium/Selenium%20settings.jpg)