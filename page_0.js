const pageContent = [
    {
        title: "Шифр сдвига",
        stageValues: {},
        content: `
            <p>Добро пожаловать в введение в шифрование! Первый шифр, который мы рассмотрим - шифр сдвига.</p>
            <p>История шифрования насчитывает несколько тысяч лет. Один из известных древних шифров — атбаш, шифр алфавитной подстановки с использованием символа под тем же номером с конца алфавита. Он использовался в древнееврейских текстах, в том числе в Библии - люди шифровали священные тексты с целью сохранения их внутри закрытого сообщества.</p>
            <p>Самый известный древний шифр был назван в честь Юлия Цезаря — алфавитная подстановка с помощью сдвига каждого символа на N позиций алфавита. Известно что Цезарь использовал сдвиг на 3 символа в переписке с генералами, для секретной передачи военных планов. Именно этот шифр мы и рассмотрим, и на его примере познакомимся с основами криптографии.</p>
        `
    },
    {
        title: "Шифр сдвига",
        stageValues: { SHIFT_in_n: { hasField: true, isNeeded: false, startValue: 3 } },
        content: `
            <p>Шифр сдвига - шифр для текстов. Алгоритм: каждый символ заменяется на N символов по алфавиту направо. </p>

            <p>Цель любого шифрования - преобразовать информацию(сообщение) в зашифрованный, с возможностью однозначно восстановить изначальное сообщение без потери данных, но только зная ключ - знание, однозначно определяющее алгоритм расшифрования(и/или шифрования).</p>
            <p>Алгоритмом шифрования называют набор правил, с помощью которых можно получить зашифрованный и расшифрованный текст, и их делят на 2 вида: симметричные и асимметричные, в зависимости от того, используется ли для шифрования и расшифрования один и тот же ключ, или нет.
            Шифр сдвига симметричен, а его ключ - N. Важно, что ключ должен быть необходим и достаточен, что бы совершить шифрование/расшифрование - т.е. если известен N и есть зашифрованное сообщение, то мы однозначно можем расшифровать текст, и наоборот.</p>

            <p>Если N, например, 3, как в шифре Цезаря, то А заменится на Г. Посмотрим на что заменятся разные символы при разных N:</p>
            <table id="SHIFT_alphabet_t_sample"></table>
            <p>N = <input type="number" id="SHIFT_in_n"></p>

            <p>Так выглядит шифрование простого сообщения, и, на первый взгляд, результат неузнаваем:</p>
            <p>"<span id="SHIFT_sample_src">простое сообщение</span>" -- "<span id="SHIFT_sample_dst">простое сообщение</span>".</p>
        `,
        onLoad() {
        },
        onUpdate() {
            var parseN = this.localState["SHIFT_in_n"];

            var sampleSrc = document.getElementById('SHIFT_sample_src');
            var sampleDst = document.getElementById('SHIFT_sample_dst');
            sampleDst.textContent = shiftEncrypt(sampleSrc.textContent, parseN);
        
            var sampleAlphabet = getRussianAlphabet().slice(0, 10);
            var alphSize = getRussianAlphabet().length;
            var table = document.getElementById('SHIFT_alphabet_t_sample');
        
            table.innerHTML = '';
            var tbody = document.createElement('tbody');
            var rows = [];
            for (var j = 0; j < 4; j++) {
                rows.push(document.createElement('tr'));
            }
            var nScaled = (parseN % alphSize) + alphSize;
            for (var i = 0; i < sampleAlphabet.length; i++) {
                rows[0].innerHTML += `<td>${i}</td>`;
                rows[1].innerHTML += `<td>${sampleAlphabet[i]}</td>`;
                rows[2].innerHTML += `<td>${(i + nScaled) % alphSize}</td>`;
                rows[3].innerHTML += `<td>${shiftChar(sampleAlphabet[i], parseN)}</td>`;
            }
            for (var j = 0; j < 4; j++) {
                tbody.appendChild(rows[j]);
            }
            table.appendChild(tbody);
        }
    },
    {
        title: "Шифр сдвига",
        stageValues: { SHIFT_test_src : { hasField: true, isNeeded: true, startValue: "" } },
        content: `
            <p>Для расшифровки такого шифра нужно сделать обратную операцию. Попробуйте расшифровать сообщение для N = 3:</p>
            <p>"<span id="SHIFT_test_dst"></span>"</p>
            <p><input id="SHIFT_test_src"></p>
             
            <div id="SHIFT_alphabet"></div>
        `,
        onLoad() {
            var alphabetTable = document.getElementById('SHIFT_alphabet');
            alphabetTable.innerHTML = "";
            alphabetTable.appendChild(renderAlphabet(getRussianAlphabet()));

            var resultTest = document.getElementById('SHIFT_test_dst');
            resultTest.innerText = shiftEncrypt("ВШЭ", 3);
        },
        fieldChecks: {
            SHIFT_test_src() {
                var resultTest = document.getElementById('SHIFT_test_dst');
                var srcValue = this.localState["SHIFT_test_src"];
                return srcValue.length == resultTest.innerText.length && shiftEncrypt(srcValue, 3).toUpperCase() === resultTest.innerText;
            }
        }
    },
    {
        title: "Шифр сдвига: Свободная практика",
        freePracticeName: "Шифр сдвига: практика",
        stageValues: {
            SHIFT_n : { hasField: true, isNeeded: false, startValue: 3 },
            SHIFT_src : { hasField: true, isNeeded: false, startValue: "Тестовый текст для проверки сообщения на русском языке" }
        },
        content: `
            <p>Здесь можно зашифровать любое сообщение шифром сдвига:</p>
            <p>N = <input type="number" id="SHIFT_n"></p>
            <textarea id="SHIFT_src"></textarea>
            <textarea id="SHIFT_dst" readonly></textarea>
            <p>Регистр сохраняется, поддерживаются только латиница и кириллица, все спец. символы сохряняются.</p>
        `,
        onLoad() {
        },
        onUpdate() {
            var src = document.getElementById('SHIFT_src');
            var dst = document.getElementById('SHIFT_dst');
            dst.value = shiftEncrypt(src.value, this.localState["SHIFT_n"]);
        }
    },
    {
        title: "Частотный анализ",
        stageValues: { FREQ_sample_n: { hasField: true, isNeeded: true, startValue: 0 } },
        content: `
            <p>Даже если зашифрованное сообщение кажется непонятным, если это осмысленный текст и известно, что это шифр сдвига, то его ключ можно легко раскрыть перебором:</p>
            <p id="FREQ_sample_dst"></p><p>N = <input type="number" id="FREQ_sample_n"></p>
        `,
        onLoad() {
        },
        onUpdate() {
            var dst = document.getElementById('FREQ_sample_dst');
            dst.textContent = shiftEncrypt("Сообщение расшифровывается, о нет", 13 - this.localState["FREQ_sample_n"]);
        },
        fieldChecks: {
            FREQ_sample_n() {
                var value = this.localState["FREQ_sample_n"];
                var alphLen = getRussianAlphabet().length;
                return correctMod(13 - value, alphLen) == 0;
            }
        }
    },
    {
        title: "Частотный анализ",
        stageValues: {
            FREQ_sample_called_args: {hasField: false, isNeeded: true, startValue: [] },
            FREQ_sample_text_ru_0: {hasField: true, isNeeded: false, startValue: "" }
        },
        content: `
            <p>Частотный анализ - анализ частоты символов в зашифрованном тексте. В большинстве языков буквы в разных текстах, если взять достаточно большой объем, будут встречаться похожее количество раз.
            Если большой осмысленный текст был зашифрован с помощью шифра сдвига, то, с помощью частотного анализа, легко будет заметить как картина частот похожа на сдвинутую на N символов и расшифровать текст.
            Такой тест не идеален, но чем больше был текст и чем ближе к среднестатистическому тексту на этом языке, тем точнее результат.</p>

            <p><span id="FREQ_stat_task"></span>Выберите текст для примера: <select id="FREQ_sample_text_ru_0"></select></p>
            <div>
                <div class="textPreviewHeader" onClick="this.parentElement.classList.toggle('opened')"><span class="textPreviewArrow">▶</span></div>
                <div class="textPreviewContent" id="FREQ_text_preview"></div>
            </div>
            <div id="FREQ_stat_result"></div>
        `,
        onLoad() {
            if (!this.isCurrentStageCompleted()) {
                document.getElementById('FREQ_stat_task').innerHTML = "Попробуйте 3 текста, что бы продолжить.<br/>";
            }

            var select = document.getElementById('FREQ_sample_text_ru_0');
            select.innerHTML = "";
            getSampleTextListRU().forEach(textId => {
                select.innerHTML += `<option value="${textId.id}">${textId.name}</option>`
            });

            select.value = this.localState["FREQ_sample_text_ru_0"];
        },
        onUpdate() {
            var select = document.getElementById('FREQ_sample_text_ru_0');
            var outputDiv = document.getElementById('FREQ_stat_result');

            if (this.localState["FREQ_sample_text_ru_0"] == "") {
                return;
            }

            var text = getSampleText(select.value);
            document.getElementById("FREQ_text_preview").innerHTML = "<p>"+ text +"</p>";

            var freqResult = freqAnalysis(text, getRussianAlphabet());
            outputDiv.innerHTML =" <p>Результат анализа:</p> ";
            outputDiv.appendChild(renderFreqAnalysis(freqResult));

            if (!this.localState["FREQ_sample_called_args"].some(name => { return name == select.value;})) {
                this.localState["FREQ_sample_called_args"].push(select.value);
            }
        },
        onComplete() {
            document.getElementById('FREQ_stat_task').innerHTML = "";
        },
        fieldChecks: {
            FREQ_sample_called_args() {
                return this.localState["FREQ_sample_called_args"].length >= 3;
            }
        }
    },
    {
        title: "Частотный анализ",
        stageValues: {
            FREQ_n_test: { hasField: true, isNeeded: true, startValue: 0 },
            FREQ_sample_text_ru: { hasField: true, isNeeded: false, startValue: "" }
        },
        content: `
            <p>Используйте частотный анализ для расшифровки!</p>
            <p>Зашифрованный текст:</p>
            <div>
                <div class="textPreviewHeader" onClick="this.parentElement.classList.toggle('opened')"><span class="textPreviewArrow">▶</span></div>
                <div class="textPreviewContent" id="FREQ_dst_text"></div>
            </div>
            <p>Его частотный анализ:</p>
            <div id="FREQ_stat_result"></div>
            <p>Незашифрованные тексты для сравнения:<select id="FREQ_sample_text_ru"></select></p>
            <div>
                <div class="textPreviewHeader" onClick="this.parentElement.classList.toggle('opened')"><span class="textPreviewArrow">▶</span></div>
                <div class="textPreviewContent" id="FREQ_text_preview"></div>
            </div>
            <div id="FREQ_stat_result_sample"></div>
            <br/>
            <p>Текст был зашифрован со смещением: N = <input type="number" id="FREQ_n_test"></p>
        `,
        onLoad() {
            var select = document.getElementById('FREQ_sample_text_ru');
            var selectRes = "";
            getSampleTextListRU().forEach(textId => {
                selectRes += `<option value="${textId.id}">${textId.name}</option>`
            });
            select.innerHTML = selectRes;
            select.value = this.localState["FREQ_sample_text_ru"];

            var text = getSampleText("Загадка");
            document.getElementById('FREQ_dst_text').innerHTML="<p>" + text + "</p>";
            var freqResult = freqAnalysis(text, getRussianAlphabet());
            this.localState["FREQ_stat_result_cahced"] = freqResult;

            var outputDiv = document.getElementById('FREQ_stat_result');
            outputDiv.appendChild(renderFreqAnalysis(freqResult));

            this.localState["FREQ_sample_text_ru_cached"] = "";
        },
        fieldChecks: {
            FREQ_n_test() {
                var alphLen = getRussianAlphabet().length;
                return correctMod(5 - this.localState["FREQ_n_test"], alphLen) == 0;
            }
        },
        onUpdate() {
            var outputDiv = document.getElementById('FREQ_stat_result_sample');
            var select = document.getElementById('FREQ_sample_text_ru');

            if (this.localState["FREQ_sample_text_ru_cached"] != select.value) {
                var text = getSampleText(select.value);

                document.getElementById("FREQ_text_preview").innerHTML = "<p>"+ text +"</p>";

                var freqResult = freqAnalysis(text, getRussianAlphabet());
                outputDiv.innerHTML =" <p>Результат анализа:</p>   ";
                outputDiv.appendChild(renderFreqAnalysisDiff(this.localState["FREQ_stat_result_cahced"], freqResult));
                this.localState["FREQ_sample_text_ru_cached"] = select.value;
            }
        }
    },
    {
        title: "Частотный анализ: Теоретическая частотность",
        stageValues: {
            FREQ_sample_called_args_1: {hasField: false, isNeeded: true, startValue: [] },
            FREQ_sample_text_ru_0: {hasField: true, isNeeded: false, startValue: "" },
            FREQ_sample_text_ru_1: {hasField: true, isNeeded: false, startValue: "RU_Theory" }
        },
        content: `
            <p>Можно заметить, что у разных текстов всё же отличаются графики частот. Здесь вы можете сравнить несколько разных текстов, и "теоретическую частотность" - 
            усредненную частотность, собранную по текстам из <a href="http://dict.ruslang.ru/freq.php?act=show&dic=freq_letters">Национального корпуса русского языка.</a></p>

            <p><span id="FREQ_stat_task"></span>Выберите тексты для примера: <select id="FREQ_sample_text_ru_0"></select> | <select id="FREQ_sample_text_ru_1"></select></p>

            <div id="FREQ_stat_result"></div>

            <div>
                <div class="textPreviewHeader" onClick="this.parentElement.classList.toggle('opened')"><span class="textPreviewArrow">▶</span></div>
                <div class="textPreviewContent" id="FREQ_text_preview_0"></div>
            </div>
            <div>
                <div class="textPreviewHeader" onClick="this.parentElement.classList.toggle('opened')"><span class="textPreviewArrow">▶</span></div>
                <div class="textPreviewContent" id="FREQ_text_preview_1"></div>
            </div>
        `,
        onLoad() {
            if (!this.isCurrentStageCompleted()) {
                document.getElementById('FREQ_stat_task').innerHTML = "Сравните 3 текста, что бы продолжить.<br/>";
            }

            var selectA = document.getElementById('FREQ_sample_text_ru_0');
            var selectB = document.getElementById('FREQ_sample_text_ru_1');
            var selectRes = "";
            getSampleTextListRUWithTheory().forEach(textId => {
                selectRes += `<option value="${textId.id}">${textId.name}</option>`
            });
            selectB.innerHTML = selectA.innerHTML = selectRes;

            selectA.value = this.localState["FREQ_sample_text_ru_0"];
            selectB.value = this.localState["FREQ_sample_text_ru_1"];
        },
        onUpdate() {
            var selectA = document.getElementById('FREQ_sample_text_ru_0');
            var selectB = document.getElementById('FREQ_sample_text_ru_1');
            var outputDiv = document.getElementById('FREQ_stat_result');

            if (this.localState["FREQ_sample_text_ru_0"] == "" || this.localState["FREQ_sample_text_ru_1"] == "") {
                return;
            }

            var freqResultA, freqResultB, aHidden = false, bHidden = false;
            if (selectA.value != "RU_Theory") {
                var textA = getSampleText(selectA.value);
                freqResultA = freqAnalysis(textA, getRussianAlphabet());
                document.getElementById("FREQ_text_preview_0").innerHTML = "<p>"+ textA +"</p>";
            } else {
                aHidden = true;
                freqResultA = getTheoryFreqAnalysisRU();
            }
            if (selectB.value != "RU_Theory") {
                var textB = getSampleText(selectB.value);
                freqResultB = freqAnalysis(textB, getRussianAlphabet());
                document.getElementById("FREQ_text_preview_1").innerHTML = "<p>"+ textB +"</p>";
            } else {
                bHidden = true;
                freqResultB = getTheoryFreqAnalysisRU();
            }

            if (aHidden != document.getElementById("FREQ_text_preview_0").parentElement.classList.contains("hidden")) {
                document.getElementById("FREQ_text_preview_0").parentElement.classList.toggle("hidden");
            }
            if (bHidden != document.getElementById("FREQ_text_preview_1").parentElement.classList.contains("hidden")) {
                document.getElementById("FREQ_text_preview_1").parentElement.classList.toggle("hidden");
            }

            outputDiv.innerHTML =" <p>Результат анализа:</p> ";
            outputDiv.appendChild(renderFreqAnalysisDiff(freqResultA, freqResultB));

            if (!this.localState["FREQ_sample_called_args_1"].some(name => { return name == selectA.value; })) {
                this.localState["FREQ_sample_called_args_1"].push(selectA.value);
            }
            if (!this.localState["FREQ_sample_called_args_1"].some(name => { return name == selectB.value; })) {
                this.localState["FREQ_sample_called_args_1"].push(selectB.value);
            }
        },
        onComplete() {
            document.getElementById('FREQ_stat_task').innerHTML = "";
        },
        fieldChecks: {
            FREQ_sample_called_args_1() {
                return this.localState["FREQ_sample_called_args_1"].length >= 4;
            }
        }
    },
    {
        title: "Частотный анализ: Свободная практика",
        freePracticeName: "Частотный анализ: практика",
        stageValues: {
            FREQ_language: { hasField: true, isNeeded: false, startValue: "RU" },
            FREQ_text_select:{ hasField: true, isNeeded: false, startValue: "Input" },
            FREQ_sandbox_input:{ hasField: true, isNeeded: false, startValue: "" },
            FREQ_compare:{ hasField: true, isNeeded: false, startValue: false },
            FREQ_compare_EN:{ hasField: true, isNeeded: false, startValue: "false" }
        },
        content: `
            <p>Здесь вы можете сделать частотный анализ любого текста на русском или английском языках.</p>
            <p>Выберите язык: <select id="FREQ_language"><option value="RU">Русский</option><option value="EN">Английский</option></select></p>
            <p id="FREQ_compare_p_ru">Сравнить с теоретической? <input type="checkbox" id="FREQ_compare"></p>
            <p id="FREQ_compare_p_en" class="hidden">Сравнить с другим текстом? <select id="FREQ_compare_EN"></select></p>
            <p>Загрузите текст, или введите свой: <select id="FREQ_text_select"></select></p>
            <div>
                <div class="textPreviewHeader" onClick="this.parentElement.classList.toggle('opened')"><span class="textPreviewArrow">▶</span></div>
                <div class="textPreviewContent" id="FREQ_text_preview"></div><textarea class="textPreviewContent" id="FREQ_sandbox_input" style="display:none"></textarea>
            </div>
            <div id="FREQ_result"></div>
        `,
        fillSelect() {
            var select = document.getElementById('FREQ_text_select');
            var isSelectValid = false;
            var selectStr = '<option value="Input">Ввод текста</option>';
            (this.localState["FREQ_language"] == "RU" ? getSampleTextListRU() : getSampleTextListEN()).forEach(textId => {
                selectStr += `<option value="${textId.id}">${textId.name}</option>`
                isSelectValid |= textId.id == this.localState["FREQ_text_select"];
            });
            select.innerHTML = selectStr;
            select.value = isSelectValid ? this.localState["FREQ_text_select"] : "Input";
        },
        onLoad() {
            this.getStageData().fillSelect.call(this);

            var select = document.getElementById('FREQ_compare_EN');
            var selectStr = '<option value="false">нет</option>';
            getSampleTextListEN().forEach(textId => {
                selectStr += `<option value="${textId.id}">Да: ${textId.name}</option>`
            });
            select.innerHTML = selectStr;
            select.value = this.localState["FREQ_compare_EN"];
            this.localState["FREQ_compare_EN_cachedTextName"] = null;
            this.localState["FREQ_compare_EN_cachedText"] = null;
        },
        onUpdate() {
            this.getStageData().fillSelect.call(this);

            var select = document.getElementById('FREQ_text_select');
            if (document.getElementById("FREQ_compare_p_ru").classList.contains("hidden") != (this.localState["FREQ_language"] != "RU")) {
                document.getElementById("FREQ_compare_p_ru").classList.toggle("hidden");
                document.getElementById("FREQ_compare_p_en").classList.toggle("hidden");
            }
            this.localState["FREQ_text_select"] = select.value;

            if (this.localState["FREQ_language"] == "RU") {
                this.localState["FREQ_compare_EN_cachedTextName"] = this.localState["FREQ_compare_EN_cachedText"] = null;
            } else if (this.localState["FREQ_compare_EN_cachedTextName"] != this.localState["FREQ_compare_EN"]) {
                this.localState["FREQ_compare_EN_cachedTextName"] = this.localState["FREQ_compare_EN"];

                if (this.localState["FREQ_compare_EN"] == "false") {
                    this.localState["FREQ_compare_EN_cachedText"] = null;
                } else {
                    this.localState["FREQ_compare_EN_cachedText"] = freqAnalysis(getSampleText(this.localState["FREQ_compare_EN"]), getEnglishAlphabet());
                }
            }

            var text;
            if (select.value == "Input") {
                text = this.localState["FREQ_sandbox_input"];
                document.getElementById("FREQ_text_preview").innerHTML = "";
                document.getElementById("FREQ_text_preview").style = "display:none";
                document.getElementById("FREQ_sandbox_input").style = "";
            } else {
                text = getSampleText(select.value);
                document.getElementById("FREQ_text_preview").innerHTML = "<p>"+ text +"</p>";
                document.getElementById("FREQ_sandbox_input").style = "display:none";
                document.getElementById("FREQ_text_preview").style = "";
            }

            var outputDiv = document.getElementById('FREQ_result');
            var freqResult = freqAnalysis(text, this.localState["FREQ_language"] == "RU" ? getRussianAlphabet() : getEnglishAlphabet());
            outputDiv.innerHTML =" <p>Результат анализа:</p> ";
            if (this.localState["FREQ_compare"] && this.localState["FREQ_language"] == "RU") {
                outputDiv.appendChild(renderFreqAnalysisDiff(freqResult, getTheoryFreqAnalysisRU()));
            } else if (this.localState["FREQ_compare_EN"] != "false" && this.localState["FREQ_language"] != "RU") {
                outputDiv.appendChild(renderFreqAnalysisDiff(freqResult, this.localState["FREQ_compare_EN_cachedText"]));
            } else {
                outputDiv.appendChild(renderFreqAnalysis(freqResult));
            }
        }
    }
];

document.addEventListener('DOMContentLoaded', () => {
    document.styleSheets[0].insertRule(`input[type="number"] { width: 5em; }`, document.styleSheets[0].length);
    new PageApp(pageContent, 0);
});
