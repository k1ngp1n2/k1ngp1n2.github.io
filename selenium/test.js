// Licensed to the Software Freedom Conservancy (SFC) under one
// or more contributor license agreements.  See the NOTICE file
// distributed with this work for additional information
// regarding copyright ownership.  The SFC licenses this file
// to you under the Apache License, Version 2.0 (the
// "License"); you may not use this file except in compliance
// with the License.  You may obtain a copy of the License at
//
//   http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing,
// software distributed under the License is distributed on an
// "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
// KIND, either express or implied.  See the License for the
// specific language governing permissions and limitations
// under the License.

/**
 * @fileoverview An example test that may be run using Mocha.
 *
 * Usage:
 *
 *     mocha -t 10000 selenium-webdriver/example/test.js
 *
 * You can change which browser is started with the SELENIUM_BROWSER environment
 * variable:
 *
 *     SELENIUM_BROWSER=chrome \
 *         mocha -t 10000 selenium-webdriver/example/test.js
 */

// Подключаем selenium
const {Builder, By, Key, until} = require('selenium-webdriver');
// Интеграция selenium и mocha
const test = require('selenium-webdriver/testing');

test.describe('Открытие страницы сайта', function() {
  let driver;

  // инициализируем драйвер
  test.before(function *() {
    // запускам chrome для тестирования
    driver = yield new Builder().forBrowser('chrome').build();
  });

  // You can write tests either using traditional promises.
  it('Проверяем заголовок страницы', function() {
    // Сценарий действий в браузере
    return driver.get('http://localhost:3000/')
        .then(_ => driver.wait(until.titleIs('Автосалон'), 1000));
  });

  // Or you can define the test as a generator function. The test will wait for
  // any yielded promises to resolve before invoking the next step in the
  // generator.
  test.it('works with generators', function*() {
    // Сценарий действий в браузере
    yield driver.get('http://localhost:3000/');
    yield driver.wait(until.titleIs('Автосалон'), 1000);
  });

  // останавливаем драйвер
  test.after(() => driver.quit());
});
