"use strict";

mocha.ui("tdd");
var assert = chai.assert;
suite("Глобальные тесты", function () {
  test("У данной страницы допустимый заголовок", function () {
    assert(document.title && document.title.match(/\S/) && document.title !== "Document");
  });
});
mocha.run();
//# sourceMappingURL=test.js.map
