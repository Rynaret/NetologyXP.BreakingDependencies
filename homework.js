"use strict";
// Домашнее задание:
// Бизнес поставил вам задачу добавить новую возможность в код (какую - написано ниже)
// Сначала разорвите зависимость так, чтобы можно было запустить тесты на старый код
// Затем подготовьте код к изменениям, рефакторя маленькими шагами
// В конце добавьте новую функциональность

// Введение в бизнес:
// Вы разрабатываете ПО для сети магазинов в США
// Налоговое законодательство здесь строгое и индивидуально для каждого штата
// Налог на товар складывается из базовой ставки и дополнительной ставки по категориям товаров
// Для некоторых категорий товаров налог отменяется полностью
// Для некоторых категорий товаров дополнительной ставки нет
// ----
// Сеть расширяется и вас просят добавить новые штаты каждую неделю
// Сегодня вам надо будет добавить два штата:
// Tennessee и Texas
// В Tennessee (Базовая ставка: 7%, Groceries: +5%, Prepared food: базовая, Prescription drug: базовая )
// В Texas (Базовая ставка: 6.25%, Groceries: налога нет, Prepared food: базовая, Prescription drug: налога нет )

// Вопросы и Ответы:
// Как запустить тесты?
// Закомментируейте вызов production(), раскомментируйте runTest(), запустите файл

// Какие зависимости разрывать?
// Посмотрите на тесты. Они уже ожидают функцию, которая считает сумму с налогом.
// Двигайтесь в этом направлении

// На что будет обращаться внимание при проверке?
// Главный критерий - удобство добавления новых штатов
// Следующие по важности:
// Читаемость кода
// Наличие очевидных smell'ов
// Частые коммиты, тесты проходят после кадого коммита

//############################
// Этот код можно менять как угодно

var items = {
    "milk": {price: 5.5, type: "Groceries"},
    "eggs": {price: 3.0, type: "Groceries"},
    "coca-cola": {price: 0.4, type: "Groceries"},
    "amoxicillin": {price: 6.7, type: "Groceries"},
    "aspirin": {price: 0.2, type: "PrescriptionDrug"},
    "marijuana": {price: 1.4, type: "PrescriptionDrug"},
    "hamburger": {price: 2, type: "PreparedFood"},
    "ceasar salad": {price: 4.2, type: "PreparedFood"},
};

var states = {
    "Alabama" : {
        baseTax: 0.04,
        categoriesTaxes:{
            "Groceries": 0,
            "PrescriptionDrug": "",
        }
    },
    "Alaska" : {
        baseTax: 0,
        categoriesTaxes:{
            "Groceries": 0,
            "PrescriptionDrug": 0
        }
    },
    "Arizona" : {
        baseTax: 0.056,
        categoriesTaxes:{
            "Groceries": "",
            "PrescriptionDrug": ""
        }
    },
    "Arkansas" : {
        baseTax: 0.065,
        categoriesTaxes:{
            "Groceries": 0.015,
            "PrescriptionDrug": ""
        }
    },
    "California" : {
        baseTax: 0.075,
        categoriesTaxes:{
            "Groceries": "",
            "PrescriptionDrug": ""
        }
    },
    "Colorado" : {
        baseTax: 0.029,
        categoriesTaxes:{
            "Groceries": "",
            "PrescriptionDrug": ""
        }
    },
    "Connecticut" : {
        baseTax: 0.0635,
        categoriesTaxes:{
            "Groceries": "",
            "PrescriptionDrug": ""
        }
    },
    "Tennessee" : {
        baseTax: 0.07,
        categoriesTaxes:{
            "Groceries": 0.05,
            "PrescriptionDrug": 0,
            "PreparedFood": 0
        }
    },
    "Texas" : {
        baseTax: 0.0625,
        categoriesTaxes:{
            "Groceries": "",
            "PrescriptionDrug": "",
            "PreparedFood": 0
        }
    }
};

function getState(state) {
    return states[state];
}
class State{
    constructor(state){
        this._state = state;
    }

    get baseTax() {return this._state.baseTax;}
    get categoriesTaxes(){return this._state.categoriesTaxes;}
}
class Product{
    constructor(item) {
        this._item = item;
    }

    get productType(){return this._item.type;}
    get productPrice(){return this._item.price;}
}

function calc(state, itemType) {
    var categoryTax = state.categoriesTaxes[itemType];

    if (categoryTax === "") {
        return 0;
    }
    return state.baseTax + categoryTax;
}

function calculatePriceFor(stateArg, itemArg){
    var item = new Product(items[itemArg]);
    var state = new State(getState(stateArg));

    var result = null;
    if (item.productType === "PreparedFood") {
        result = ( 1 + state.baseTax ) * item.productPrice;
    }
    else {
        result = calc(state, item.productType) * item.productPrice + item.productPrice;
    }

    return result;
}

class TaxCalculator {
    // У этой функции нелья менять интерфейс
    // Но можно менять содержимое
    calculateTax() {
        var ordersCount = getOrdersCount();
        var state = getSelectedState();
        console.log(`----------${state}-----------`);
        for (var i = 0; i < ordersCount; i++) {
            var item = getSelectedItem();

            var result = calculatePriceFor(state, item);

            console.log(`${item}: $${result.toFixed(2)}`);
        }
        console.log(`----Have a nice day!-----`);
    }
}

//############################
//Production - код:
// production();

//############################
//Тесты:
var tests = [
    () => assertEquals(3.0 * (1 + 0.04), calculatePriceFor("Alabama", "eggs")),
    () => assertEquals(0.4 * (1 + 0.015 + 0.065), calculatePriceFor("Arkansas", "coca-cola")),
    () => assertEquals(6.7 * (1 + 0.0), calculatePriceFor("Alaska", "amoxicillin")),
    () => assertEquals(6.7 * (1 + 0.0), calculatePriceFor("California", "amoxicillin")),
    () => assertEquals(2 * (1 + 0.0635), calculatePriceFor("Connecticut", "hamburger")),
];
//Раскомментируйте следующую строчку для запуска тестов:
runTests (tests);

//############################
//Код ниже этой строчки не надо менять для выполнения домашней работы

function production(){
    var calculator = new TaxCalculator();
    calculator.calculateTax();
}

function getSelectedItem(){
    var items = ["milk", "eggs", "coca-cola", "amoxicillin", "aspirin", "marijuana", "hamburger", "ceasar salad"];
    return items[Math.floor(Math.random() * items.length)];
}

function getSelectedState(){
    var state = ["Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut"];
    return state[Math.floor(Math.random() * state.length)];
}

function getOrdersCount(){
    return Math.floor(Math.random() * 3) + 1;
}

//############################
// Кустарный способ писать тесты

function assertEquals (expected, actual) {
    var epsilon = 0.000001;
    var difference = Math.abs(expected - actual);
    if ( difference > epsilon || difference === undefined || isNaN(difference)) {
        console.log(`Fail! Expected: ${expected}, Actual: ${actual}` );
        return -1;
    }
    return 0;
}

function runTests (tests) {
    var failedTests = tests
        .map((f) => f())
        .map((code) => {if (code === -1) {return 1} else {return 0}})
        .reduce((a, b) => a + b, 0);

    if (failedTests === 0) {
        console.log(`Success: ${tests.length} tests pass`);
    }
    else {
        console.log(`Fail: ${failedTests} tests failed`);
    }
}

