const pagesList = [
    {title: 'Шифр сдвига', url:"page_0.html", key:"page_SHIFT"},
    {title:'Шифр Виженера', url:"page_1.html", key:"page_VIZHENER"},
    {title:'RSA', url:"page_2.html", key:"page_RSA"}
]

const mainPageUrl = "main.html";
const globalKey = "global";

class GlobalState {
    constructor() {
        this.unlockedPage = 0;
        this.unlockedPractices = {};
        this.isLightTheme = false;
        this.load();
    }

    isPageUnlocked(pageId) {
        return this.unlockedPage >= pageId;
    }

    isPageCompleted(pageId) {
        return this.unlockedPage >= pageId + 1;
    }

    save() {
        var state = {
            unlockedPage: this.unlockedPage,
            unlockedPractices: this.unlockedPractices,
            isLightTheme: this.isLightTheme
        };
        localStorage.setItem(globalKey, JSON.stringify(state));
    }

    load() {
        var storageData = localStorage.getItem(globalKey);
        if (storageData) {
            this.unlockedPage = JSON.parse(storageData).unlockedPage || 0;
            this.unlockedPractices = JSON.parse(storageData).unlockedPractices || {};
            this.isLightTheme = JSON.parse(storageData).isLightTheme;
        }
    }

    unlockPage(pageId) {
        this.unlockedPage = Math.max(pageId, this.unlockedPage);
        this.save();
    }

    unlockPractice(pageId, stageId, name) {
        if (!this.unlockedPractices.hasOwnProperty(pageId)) {
            this.unlockedPractices[pageId] = {};
        }
        this.unlockedPractices[pageId][stageId] = name;
        this.save();
    }

    toggleLightTheme() {
        this.isLightTheme = !this.isLightTheme;
        this.save();
    }
}

class LocalState {
    constructor(storageKey) {
        this.storageKey = storageKey;
        this.load();
    }

    load() {
        var data = localStorage.getItem(this.storageKey);
        if (data) {
            Object.assign(this, JSON.parse(data));
        }
    }

    save() {
        var state = { ...this };
        delete state.storageKey;

        localStorage.setItem(this.storageKey, JSON.stringify(state));
    }
}

function resetGlobalProgress(event) {
    event.preventDefault(); // отменяет переход по ссылке, предполагаемый данной кнопкой
    if (confirm('Сбросить весь прогресс?')) {
        for (var i = 0; i < pagesList.length; i++) {
            localStorage.removeItem(pagesList[i].key);
        }
        localStorage.removeItem(globalKey);
        window.location.href = mainPageUrl;
    }
}

function resetPageProgress() {
    if (confirm('Сбросить прогресс по этому виду шифрования?')) {
        localStorage.removeItem(pagesList[this.pageId].key);
        window.location.reload();
    }
}

function toggleTheme(event) {
    event.preventDefault();
    this.globalState.toggleLightTheme();
    this.onSetTheme();
}

class Sidemenu {
    constructor(pageId, globalState) {
        this.pageId = pageId;
        this.globalState = globalState;

        this.onSetTheme();

        var body = document.getElementsByTagName('body')[0];
        body.innerHTML = (`<div id="sidemenu" class="sidemenu"></div>`) + body.innerHTML;
        
        this.render();

        resetGlobalProgress = resetGlobalProgress.bind(this);
        resetPageProgress = resetPageProgress.bind(this);
        toggleTheme = toggleTheme.bind(this);
    }

    render() {
        var pagesLinkList = "";
        var isMainMenu = this.pageId == -1;

        {
            var classString = (isMainMenu ? " active" : "");
            pagesLinkList += `<li><a href="${mainPageUrl}" class="${classString}">Главное меню</a></li>`
            pagesLinkList += `<h2></h2>`
        }

        for (var i = 0; i < pagesList.length; i++) {
            var isActive = this.pageId == i;
            var isUnlocked = this.globalState.isPageUnlocked(i);

            var classString = (isActive ? " active" : (isUnlocked ? "" : " disabled"));
            var displayString = isUnlocked ? `` :  `display="disabled"`;
            var completedMark = this.globalState.isPageCompleted(i) ? " ✓" : "";

            pagesLinkList += `<li><a href="${pagesList[i].url}" class="${classString}" ${displayString}>${pagesList[i].title + completedMark}</a></li>`;
        }

        var canResetPage = !isMainMenu && !this.globalState.isPageCompleted(this.pageId);
        var innerHTML = `
            <h2>МЕНЮ</h2>
            <ul>${pagesLinkList}</ul>
            <h2>ПРОГРЕСС</h2>
            <ul>
                <li><a href="" onclick="resetGlobalProgress(event)">Сбросить весь прогресс</a></li>
                ${canResetPage ? `<li><a href="" onclick="resetPageProgress()">Сбросить прогресс страницы</a></li>` : ""}
            </ul>
            <h2>ТЕМА</h2>
            <ul><li><a href="" onclick="toggleTheme(event)">Переключить тему</a></li></ul>
        `;

        document.getElementById('sidemenu').innerHTML = innerHTML;
    }

    onSetTheme() {
        document.getElementsByTagName('html')[0].setAttribute("theme", this.globalState.isLightTheme ? "light" : "dark");
    }
}

function saveValueToFieldString(field, value) {
    field.value = formatValueForField(value, "");
    if (field.type == "checkbox") {field.checked = value;}
}

function formatValueForField(value, nullStr) {
    if (value == null) {
        return nullStr;
    }

    if (typeof value == "number") {
        return isNaN(value) ? nullStr : "" + value;
    }
    return value;
}

function readValueFromFieldString(field, curValue) {
    if (field.type == "number") {
        var value = field.valueAsNumber;
        if (!field.validity.valid) {
            return curValue;
        }
        return value;
    }
    if (field.type == "checkbox") {
        return field.checked;
    }

    return field.value;
}

class PageApp {
    constructor(stagesArray, pageId) {
        this.pageId = pageId;

        this.globalState = new GlobalState(this.pageId);
        this.sidemenu = new Sidemenu(this.pageId, this.globalState);
        this.localState = new LocalState(pagesList[pageId].key);

        var initLocalState = () => {
            this.localState.currentStage = this.localState.currentStage || 0;
            this.localState.unlockedStage = this.localState.unlockedStage || 0;

            if (window.location.hash) {
                var currentStageTarget = Number(window.location.hash.slice(1));
                if (Number.isInteger(currentStageTarget) && currentStageTarget >= 0 && currentStageTarget <= this.localState.unlockedStage) {
                    this.localState.currentStage = currentStageTarget;
                }
            }
        };
        initLocalState();

        var initCommonHTML = () => {
            var mainHTML = `
                <main>
                    <div class="stageHeader">
                        <h1 id="stageTitle"></h1>
                        <div id="stageNumber" class="stageNumber"></div>
                    </div>
                    <div class="stageContent" id="stageContent"></div>
                    <div class="buttonsArea">
                        <button id="prevButton" style="display: none;">Назад</button>
                        <button id="nextButton" style="display: none;">Вперед</button>
                        <button id="nextPageButton" style="display: none;">К следующему алгоритму</button>
                    </div>
                </main>`;

            document.title = pagesList[this.pageId].title;
            document.getElementsByTagName('body')[0].innerHTML += mainHTML;

            document.getElementById('prevButton').addEventListener('click', () => { this.previousStage() });
            document.getElementById('nextButton').addEventListener('click', () => { this.nextStage() });
            document.getElementById('nextPageButton').addEventListener('click', () => { this.nextPage() });
        };
        initCommonHTML();

        this.stagesArray = stagesArray;

        this.initStage();
    }

    currentStage() {
        return this.localState.currentStage;
    }

    unlockedStage() {
        return this.localState.unlockedStage;
    }

    isCurrentStageCompleted() {
        return this.unlockedStage() >= (this.currentStage() + 1);
    }

    getStageData() {
        return this.stagesArray[this.currentStage()];
    }

    isStageSkippable(stageId) {
        return Object.keys(this.stagesArray[stageId].stageValues).every(fieldId => {
            return !(this.stagesArray[stageId].stageValues[fieldId].isNeeded);
        });
    }

    updateUnlockedPage() {
        if (this.unlockedStage() == this.stagesArray.length) {
            this.globalState.unlockPage(this.pageId + 1);
        }
    }

    initStage() {
        var data = this.getStageData();
        var neededControllerSignal = null, unneededControllerSignal = null;

        this.unneededFieldsController = new AbortController();
        // (в onload можно прикрепляться по этому контроллеру)
        unneededControllerSignal = this.unneededFieldsController.signal;

        document.getElementById('stageContent').innerHTML = data.content;
        if (typeof data.onLoad === "function") {
            data.onLoad.call(this);
        }

        if (this.isStageSkippable(this.currentStage())) {
            this.localState.unlockedStage = Math.min(Math.max(this.unlockedStage(), this.currentStage() + 1), this.stagesArray.length);
            this.updateUnlockedPage();
            this.localState.save();
        }
        this.renderProgress();

        var isCompleted = this.isCurrentStageCompleted();

        if (!isCompleted) {
            this.neededFieldsController = new AbortController();
            neededControllerSignal = this.neededFieldsController.signal;
        }

        // инициализация стартового значения
        Object.keys(data.stageValues).forEach(fieldId => {
            if (!this.localState.hasOwnProperty(fieldId)) {
                this.localState[fieldId] = data.stageValues[fieldId].startValue;
            }
        });

        Object.keys(data.stageValues).forEach(fieldId => {
            if (data.stageValues[fieldId].hasField) {
                saveValueToFieldString(document.getElementById(fieldId), this.localState[fieldId]);
                if (data.stageValues[fieldId].isNeeded) {
                    this.updateAnswerDisplay(fieldId, data.fieldChecks[fieldId].call(this), isCompleted);
                }
            }
        });

        this.onInputForNeededFields = () => {
            // используется переменная data, она всегда будет от текущего этапа

            if (this.isCurrentStageCompleted() || this.neededFieldsController === null || this.neededFieldsController.signal.aborted) {
                // если кнопки у ввода чисел зажать, то сообщение может вызываться множество раз, игнорируя "readonly" параметр
                // но контроллер сообщений должен такое предотвращать? и такие вызовы в теории симптом того что onChange вызван дважды..
                // в Firefox баг воспроизводится, в Chrome и VSCode Debug (вроде на chrome) - нет
                Object.keys(data.stageValues).forEach(fieldId => {
                    if (data.stageValues[fieldId].hasField && data.stageValues[fieldId].isNeeded) {
                        saveValueToFieldString(document.getElementById(fieldId), this.localState[fieldId]);
                    }
                });

                console.log(`Ошибка: кто-то вызвал onChange после того, как этап был пройден!`);
                return;
            }

            // загружаем значения из полей
            Object.keys(data.stageValues).forEach(fieldId => {
                if (data.stageValues[fieldId].hasField && data.stageValues[fieldId].isNeeded) {
                    this.localState[fieldId] = readValueFromFieldString(document.getElementById(fieldId), this.localState[fieldId]);
                }
            });

            // все значения без полей будут заполнены здесь?
            if (typeof data.onUpdate === "function") {
                data.onUpdate.call(this);
            }

            // сохраняем обновленные значения
            this.localState.save();

            var isAllCorrect = true;

            Object.keys(data.stageValues).forEach(fieldId => {
                if (data.stageValues[fieldId].isNeeded) {
                    var isCorrect = data.fieldChecks[fieldId].call(this);
                    isAllCorrect &= isCorrect;
                    if (data.stageValues[fieldId].hasField) {
                        this.updateAnswerDisplay(fieldId, isCorrect, this.isCurrentStageCompleted());
                    }
                }
            });

            if (isAllCorrect) {
                this.completeStage();
            }
        };

        // в теории такие поля не должны влиять на логику обязательных, кроме "счётчиков" выполнения действий,
        // поэтому только для обязательных без полей включена логика
        this.onInputForUnneededFields = () => {
            // загружаем значения из полей
            Object.keys(data.stageValues).forEach(fieldId => {
                if (data.stageValues[fieldId].hasField && !data.stageValues[fieldId].isNeeded) {
                    this.localState[fieldId] = readValueFromFieldString(document.getElementById(fieldId), this.localState[fieldId]);
                }
            });

            if (typeof data.onUpdate === "function") {
                data.onUpdate.call(this);
            }

            this.localState.save();

            if (!this.isCurrentStageCompleted()) {
                var isAllCorrect = Object.keys(data.stageValues).every(fieldId => {
                    return !data.stageValues[fieldId].isNeeded || data.fieldChecks[fieldId].call(this);
                        // не обновляется внешность для полей с hasField!! что бы быстрее было
                });

                if (isAllCorrect) {
                    this.completeStage();
                }
            }
        };

        // прикрепление onInput
        Object.keys(data.stageValues).forEach(fieldId => {
            var currentField = data.stageValues[fieldId];
            if (currentField.hasField) {
                var field = document.getElementById(fieldId);
                if (!isCompleted && currentField.isNeeded) {
                    // см. проверку в начале onInputForNeededFields
                    const isFirefox = navigator.userAgent.includes("Firefox/");
                    field.addEventListener('input', this.onInputForNeededFields, { signal: (isFirefox ? unneededControllerSignal : neededControllerSignal) });
                } else if (!currentField.isNeeded) {
                    field.addEventListener('input', this.onInputForUnneededFields, { signal: unneededControllerSignal });
                }
            }
        });

        // вызвать 1 раз: для некоторых этапов проще писать код когда 1 раз апдейт вызывается обязательно на загузке,
        // а вызвать его самостоятельно до полной инициализации запрещено
        this.onInputForUnneededFields();
        if (!isCompleted) {
            this.onInputForNeededFields();
        } else {
            this.onInputForNeededFields = this.onInputForUnneededFields;
        }
    }

    abortNeededFieldsController() {
        if (this.neededFieldsController) {
            console.log(`Этап ${this.currentStage() + 1} завершён, stageValues сообщения остановлены (для ответов)`)
            this.neededFieldsController.abort();
            this.neededFieldsController = null;
        }
    }

    abortAllFieldsControllers() {
        if (this.unneededFieldsController) {
            console.log(`Этап ${this.currentStage() + 1} завершён, stageValues сообщения остановлены (для всех)`)
            this.unneededFieldsController.abort();
            this.unneededFieldsController = null;
        }
        this.abortNeededFieldsController();
    }

    updateAnswerDisplay(fieldId, isCorrect, isCompleted) {
        var field = document.getElementById(fieldId);
        if (!field.classList.contains("answer")) {field.classList.add("answer");};
        if (field.classList.contains("correct") != isCorrect) { field.classList.toggle("correct"); };
        field.readOnly = isCompleted ? true : false;
    }

    areNeededValuesCorrect(data) {
        return Object.keys(data.stageValues).every(fieldId => {
            if (!data.stageValues[fieldId].isNeeded) {
                return true;
            }

            return data.fieldChecks[fieldId].call(this);
        });
    }

    renderProgress() {
        this.sidemenu.render();

        document.getElementById('stageNumber').textContent = `${this.currentStage() + 1}/${this.stagesArray.length}`;

        var data = this.getStageData();
        var completedMark = (this.isCurrentStageCompleted() && !this.isStageSkippable(this.currentStage()) ? " ✓" : "");
        document.getElementById('stageTitle').innerHTML = data.title + completedMark;

        var prevButton = document.getElementById('prevButton');
        if (this.currentStage() > 0) {
            prevButton.style.display = 'inline-block';
            prevButton.disabled = false;
        } else {
            prevButton.style.display = 'none';
        }

        var nextButton = document.getElementById('nextButton');
        if (this.currentStage() < this.stagesArray.length - 1) {
            nextButton.style.display = 'inline-block';
            nextButton.disabled = !this.isCurrentStageCompleted();
        } else {
            nextButton.style.display = 'none';
        }
        
        var nextPageButton = document.getElementById('nextPageButton');
        if (this.currentStage() == this.stagesArray.length - 1 && this.pageId < pagesList.length - 1) {
            nextPageButton.style.display = 'inline-block';
            nextPageButton.disabled = !this.isCurrentStageCompleted();
        } else {
            nextPageButton.style.display = 'none';
        }
    }

    completeStage() {
        if (typeof this.getStageData().onComplete === "function") {
            this.getStageData().onComplete.call(this);
        };

        this.abortNeededFieldsController();
        Object.keys(this.getStageData().stageValues).forEach(fieldId => {
            if (this.getStageData().stageValues[fieldId].isNeeded && this.getStageData().stageValues[fieldId].hasField) {
                this.updateAnswerDisplay(fieldId, true, true);
            }
        });

        this.localState.unlockedStage = Math.min(Math.max(this.unlockedStage(), this.currentStage() + 1), this.stagesArray.length);
        this.updateUnlockedPage();
        this.localState.save();
        this.renderProgress();

        if (this.currentStage() + 1 < this.stagesArray.length) {
            if (this.stagesArray[this.currentStage() + 1].hasOwnProperty("freePracticeName")) {
                this.globalState.unlockPractice(this.pageId, this.currentStage() + 1, this.stagesArray[this.currentStage() + 1].freePracticeName);
            }
        }
    }

    nextStage() {
        if (this.currentStage() < this.stagesArray.length - 1 && this.isCurrentStageCompleted()) {
            this.abortAllFieldsControllers();
            this.localState.currentStage++;
            this.localState.save();
            this.initStage();
        }
    }

    nextPage() {
        if (this.currentStage() == this.stagesArray.length - 1 && this.isCurrentStageCompleted() && this.pageId < pagesList.length - 1) {
            window.location.href = pagesList[this.pageId + 1].url;
        }
    }

    previousStage() {
        if (this.currentStage() > 0) {
            this.abortAllFieldsControllers();
            this.localState.currentStage--;
            this.localState.save();
            this.initStage();
        }
    }
}

