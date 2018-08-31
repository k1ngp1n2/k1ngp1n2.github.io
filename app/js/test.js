"use strict";

mocha.setup("bdd");
var assert = chai.assert;
describe("Глобальные тесты", function () {
  it("Адрес удаленного сервера http://89.108.65.123:8080", function () {
    assert(SERVER_URL === "http://89.108.65.123:8080");
  });
  it("У данной страницы допустимый заголовок", function () {
    assert(document.title && document.title.match(/\S/) && document.title !== "Document");
  });
}); // Запускаем тесты

mocha.run();
//# sourceMappingURL=test.js.map
