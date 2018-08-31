mocha.setup("bdd");
const assert = chai.assert;
describe("Глобальные тесты", () => {
    it("Адрес удаленного сервера http://89.108.65.123:8080", () => {
        assert(SERVER_URL === "http://89.108.65.123:8080");
    });
    it("У данной страницы допустимый заголовок", () => {
        assert(document.title && document.title.match(/\S/) && document.title !== "Document");
    });
});
// Запускаем тесты
mocha.run();