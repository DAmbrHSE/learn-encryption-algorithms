const currentPageId = -1;

class MainPageApp {
    constructor() {
        this.globalState = new GlobalState();
        this.sidemenu = new Sidemenu(currentPageId, this.globalState);

        var buttonsList = "";
        var sandboxes = this.globalState.unlockedPractices;

        for (var i = 0; i < pagesList.length; i++) {
            var isUnlocked = this.globalState.isPageUnlocked(i);
            var displayString = isUnlocked ? `` :  `disabled=true`;

            buttonsList += `<button id="${pagesList[i].key}_Btn" class="mainMenuNav" ${displayString}>${pagesList[i].title}</button>`;

            var pageSandboxes = sandboxes.hasOwnProperty(i) ? sandboxes[i] : {};
            Object.keys(pageSandboxes).forEach(key => {
                buttonsList += `<button id="${pagesList[i].key+key}_Btn" class="mainMenuNav">${pageSandboxes[key]}</button>`;
            });

            if (i != pagesList.length - 1) {
                buttonsList += `<br/>`;
            }
        }

        const mainStructure = `
            <main>
                <div class="stageHeader">
                    <h1 id="stageTitle">${document.title}</h1>
                </div>
                <div class="stageContent" id="stageContent">
                    <p>Добро пожаловать! Здесь вы познакомитесь с основами криптографии, научитесь пользоваться и расшифровывать просте виды шифрования и узнаете про алгоритмы, которые лежат в основе вашей безопасности в интернете!</p>
                    <div>${buttonsList}</div>
                </div>
            </main>`;

        document.getElementsByTagName('body')[0].innerHTML += mainStructure;

        for (var i = 0; i < pagesList.length; i++) {
            var id = `${pagesList[i].key}_Btn`;
            var onClick = function(i){ window.location.href = pagesList[i].url; }.bind(this, i);
            document.getElementById(id).addEventListener('click', onClick);

            var pageSandboxes = sandboxes.hasOwnProperty(i) ? sandboxes[i] : {};
            Object.keys(pageSandboxes).forEach(key => {
                var onClickSandbox = function(i, key){ window.location.href = pagesList[i].url + "#" + key; }.bind(this, i, key);
                var id = `${pagesList[i].key+key}_Btn`;
                document.getElementById(id).addEventListener('click', onClickSandbox);
            });

            if (i != pagesList.length - 1) {
                buttonsList += `<br/>`;
            }
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new MainPageApp();
});