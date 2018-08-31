mocha.ui("tdd");
var assert = chai.assert;
suite("Глобальные тесты", () => {
    test("У данной страницы допустимый заголовок", () => {
        assert(document.title && document.title.match(/\S/) && document.title !== "Document");
    });
});
mocha.run();