let mode = "",
    settings = [];

let AbsentCounter = (function Counter() {
        let data = [];
        let PRACTICE = 7;
        const THEORY = 7;

        function setPractice() {
            const v = document.querySelector(".settings__practice__set").value;
            if (v === "1") {
                PRACTICE = 6;
            }
        }

        function calculateAllAbsences(mass) {
            let tempArray = [];

            function createTempArray() {
                for (let number in mass) {
                    if (mass.hasOwnProperty(number)) {
                        if (Number.isNaN(mass[number])) {
                            tempArray.push(0);
                        } else {
                            tempArray.push(mass[number]);
                        }
                    }
                }
            }

            function totalValue() {
                let total = 0;

                if (mode === "HOURS") {
                    total = tempArray[2] + tempArray[3] + tempArray[4] +
                        tempArray[5] + tempArray[6] + tempArray[7] +
                        tempArray[8] + tempArray[9];
                } else {
                    total = (tempArray[2] + tempArray[3] + tempArray[4] +
                        tempArray[5]) * THEORY + (tempArray[6] + tempArray[7] +
                        tempArray[8] + tempArray[9]) * PRACTICE;
                }

                return total;
            }

            createTempArray();
            AbsentRender.total(totalValue());
            return totalValue();
        }

        function pushData(object) {
            let dataArray = [];

            function createDataArray() {
                for (let value in object) {
                    if (object.hasOwnProperty(value)) {
                        dataArray.push(object[value]);
                    }
                }
            }

            function justPush() {
                for (let value of dataArray) {
                    data.push(value);
                }
            }

            function convertPush() {
                function convertTheory() {
                    for (let i = 2; i <= 5; i++) {
                        data.push(dataArray[i] * THEORY);
                    }
                }

                function convertPractice() {
                    for (let i = 6; i <= 9; i++) {
                        data.push(dataArray[i] * PRACTICE);
                    }
                }

                data.push(dataArray[0]);
                data.push(dataArray[1]);
                convertTheory();
                convertPractice();
            }

            function checkMode() {
                object.allAbsence = calculateAllAbsences(object);
                createDataArray();
                if (mode === "HOURS") {
                    justPush();
                } else {
                    convertPush();
                }
            }

            dataArray = [];
            checkMode();
        }

        function mediator(rawData) {
            for (let [array, object] of rawData) {
                pushData(object);
            }
            AbsentRender.run(data);
        }

        function whiteHole(rawData) {
            setPractice();
            mediator(rawData);
        }

        function clearData() {
            data = [];
        }

        return {
            "run": whiteHole,
            "clear": clearData
        };
    }()),

    AbsentForm = (function Form() {
        let inputNames = [],
            medium = 0,
            nameList = [],
            names = ["t1", "t2", "t3", "t4", "p1", "p2", "p3", "p4"],
            zData = new Map();

        if (inputNames.length === 0) {
            for (let name of names) {
                inputNames.push(`[name="${name}"]`);
            }
        }

        function cleanInputs() {
            for (let inputValue of inputNames) {
                document.querySelector(inputValue).value = "";
            }
        }

        function blackHole(namelist) {
            if (nameList.length === 0) {
                nameList = namelist;
            }
            if (medium < nameList.length) {
                AbsentUI.name(nameList[medium]);
            }
        }

        function getValues() {
            let keyes = [
                    "theorysickness",
                    "theoryabsence",
                    "theoryvacation",
                    "theoryannotation",
                    "practicesickness",
                    "practiceabsence",
                    "practicevacation",
                    "practiceannotation"],
                parsedValues = [];

            function parseValues() {
                for (let inputValue of inputNames) {
                    let x = parseInt(document.querySelector(inputValue)
                        .value, 10);
                    parsedValues.push(x);
                }
            }

            function storeValues() {
                parseValues();

                zData.set([`MAP ${medium}`], {
                    "name": nameList[medium],
                    "allAbsence": null,
                    [keyes[0]]: parsedValues[0],
                    [keyes[1]]: parsedValues[1],
                    [keyes[2]]: parsedValues[2],
                    [keyes[3]]: parsedValues[3],
                    [keyes[4]]: parsedValues[4],
                    [keyes[5]]: parsedValues[5],
                    [keyes[6]]: parsedValues[6],
                    [keyes[7]]: parsedValues[7]
                });

                medium++;
                cleanInputs();
                parsedValues = [];
                blackHole();
            }

            function checkCondition() {
                if (medium < nameList.length) {
                    storeValues();
                }

                if (medium === nameList.length) {
                    AbsentCounter.run(zData);
                    parsedValues = [];
                }
            }

            checkCondition();
        }

        function clearData() {
            zData.clear();
            medium = 0;
            nameList = [];
        }

        document.addEventListener("DOMContentLoaded", () =>
            document.querySelector(".main__button__next")
            .addEventListener("click", getValues));

        return {
            "run": blackHole,
            "clear": clearData
        };
    }()),

    AbsentParser = (function Parser() {
        function parseFile(e) {
            const file = e.target.result;
            let names = [],
                parsedwords = file.split(/{Cyrillic}\W|\n|\,|\s/).filter(Boolean);

            for (let i = 0; i < parsedwords.length; i += 2) {
                names.push(`${parsedwords[i]} ${parsedwords[i + 1]}`);
            }

            AbsentForm.run(names.sort());
            AbsentUI.main();
            names = [];
        }

        function setSettings() {
            const TAG = [".settings__table__group", ".settings__table__name",
                ".settings__table__month"];

            for (let sClass of TAG) {
                settings.push(document.querySelector(sClass).value);
            }

            AbsentUI.settings();
            AbsentUI.unlock();
            AbsentUI.closesettings();
        }
        function logStatus() {
            console.log("READY");
        }

        function whiteHole() {
            const file = document
                .querySelector(".intro__button__loadfile").files[0];

            if (file) {
                const reader = new FileReader();

                reader.readAsText(file);
                reader.onload = parseFile;
            }
        }

        document.addEventListener("DOMContentLoaded", () =>
            document.querySelector(".intro__button__next")
            .addEventListener("click", whiteHole));

        document.addEventListener("DOMContentLoaded", () =>
            document.querySelector(".settings__button__set")
            .addEventListener("click", setSettings));

        return {
            logStatus
        };
    }()),

    AbsentRender = (function Render() {
        let COLUMUN = 11,
            ROW = 30,
            cellnameList = [],
            totalList = [];

        function renderData(stream) {
            let renderList = [];

            function getTotal() {
                let value = 0;

                for (let x of totalList) {
                    value += x;
                }
                document.querySelector(".R31D2").innerHTML = value;
            }

            function createRenderList() {
                for (let item of stream) {
                    if (Number.isNaN(item) || item === 0) {
                        renderList.push("");
                    } else {
                        renderList.push(item);
                    }
                }
            }

            function renderDataToTable() {
                let i = 0;

                for (let cell of cellnameList) {
                    if (i >= renderList.length) {
                        i++;
                    } else {
                        document.querySelector(cell)
                            .innerHTML = renderList[i];
                        i++;
                    }
                }
            }

            createRenderList();
            renderDataToTable();
            getTotal();
            AbsentUI.table();
        }

        function createCellName() {
            for (let i = 3; i <= ROW; i++) {
                for (let j = 2; j <= COLUMUN; j++) {
                    cellnameList.push(`.R${i}D${j}`);
                }
            }
        }

        function createTotalList(totalvalue) {
            totalList.push(totalvalue);
        }

        function clearData() {
            totalList = [];
        }

        function greenHole(stream) {
            if (cellnameList.length === 0) {
                createCellName();
            }
            renderData(stream);
        }

        return {
            "run": greenHole,
            "total": createTotalList,
            "clear": clearData
        };
    }()),

    AbsentUI = (function UI() {
        function setStudentName(value) {
            document.querySelector(".main__fullname__placeholder")
                .innerHTML = value;
        }

        function tableSettings() {
            const GROUP = document.querySelector(".G"),
                MASTERNAME = document.querySelector(".MN"),
                MONTHS = document.querySelector(".M"),
                YEAR = document.querySelector(".Y");

            function setYear() {
                const DATE = new Date();
                return DATE.getFullYear();
            }

            function setMonth(months) {
                const DATE = new Date(),
                    monthNames = ["січень", "лютий", "березень", "квітень",
                    "травень", "червень", "липень", "серпень",
                    "вересень", "жовтень", "листопад", "грудень"];
                let month = "";
                if (months) {
                    month = months;
                } else {
                    month = monthNames[DATE.getMonth()];
                }
                return month;
            }
            GROUP.innerHTML = settings[0];
            MASTERNAME.innerHTML = settings[1];
            MONTHS.innerHTML = setMonth(settings[2]);
            YEAR.innerHTML = setYear();
        }

        function unlockUploader() {
            document.querySelector(".intro__button__loadfile").disabled = false;
        }

        function openPage(page) {
            switch (page) {
            case "intro":
                document.querySelector(".intro").style.display = "flex";
                break;
            case "settings":
                document.querySelector(".settings").style.display = "flex";
                break;
            case "main":
                document.querySelector(".main").style.display = "flex";
                break;
            case "table":
                document.querySelector(".table").style.display = "flex";
                break;
            default:
                console.log("NO PAGE");
            }
        }

        function closePage(page) {
            switch (page) {
            case "intro":
                document.querySelector(".intro").style.display = "none";
                break;
            case "settings":
                document.querySelector(".settings").style.display = "none";
                break;
            case "main":
                document.querySelector(".main").style.display = "none";
                break;
            case "table":
                document.querySelector(".table").style.display = "none";
                break;
            default:
                console.log("NO PAGE");
            }
        }

        function createMain() {
            closePage("intro");
            openPage("main");
        }

        function createTable() {
            closePage("main");
            openPage("table");
        }

        function openSettings() {
            openPage("settings");
        }

        function closeSettings() {
            closePage("settings");
        }

        function reStart() {
            closePage("table");
            AbsentCounter.clear();
            AbsentForm.clear();
            AbsentRender.clear();
            openPage("intro");
        }

        function printTable() {
            window.print();
        }

        document.addEventListener("DOMContentLoaded", () =>
            document.querySelector(".intro__button__settings")
            .addEventListener("click", openSettings));
        document.addEventListener("DOMContentLoaded", () =>
            document.querySelector(".settings__button__cancel")
            .addEventListener("click", closeSettings));
        document.addEventListener("DOMContentLoaded", () =>
            document.querySelector(".table__close")
            .addEventListener("click", reStart));
        document.addEventListener("DOMContentLoaded", () =>
            document.querySelector(".table__print")
            .addEventListener("click", printTable));

        return {
            "name": setStudentName,
            "settings": tableSettings,
            "closesettings": closeSettings,
            "unlock": unlockUploader,
            "main": createMain,
            "table": createTable
        };
    }());

AbsentParser.logStatus();
