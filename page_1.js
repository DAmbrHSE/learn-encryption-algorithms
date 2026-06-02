const pageContent = [
    {
        title: "Шифр Виженера",
        stageValues: {},
        content: `
            <p>Рассмотрим менее примитивный алгоритм для текстов: шифр Виженера, который уже перебором не раскрыть.</p>
            <p>Шифр назван в честь Блеза де Виженера - криптогрофа, который разрабатывал и описывал в своих трудах более сложные шифры, но с его именем стал тесно связан именно этот простой для понимания шифр.
            Взломать такой шифр гораздо сложнее, чем шифр сдвига - рассмотрим как он устроен, и узнаем почему современная криптография требует более сложных решений.</p>
        `
    },
    {
        title: "Шифр Виженера",
        stageValues: {
            VIZH_test_0_shift : { hasField: true, isNeeded: true, startValue: NaN },
            VIZH_test_0_shift_id : { hasField: true, isNeeded: true, startValue: NaN },
            VIZH_test_0_dst : { hasField: true, isNeeded: true, startValue: "" }
        },
        content: `
            <p>Алгоритм: каждому символу сообщения сопоставляется один из символов ключа, [номер символа ключа в алфавите - 1]
            это сдвиг по алфавиту данного символа. Алгоритм симметричен, ключ - строка.</p>
            <p>Например: если буква ключа <span id="VIZH_test_0_key">Б</span>, т.к. её номер в алфавите - <input type="number" id="VIZH_test_0_shift">,
            то символ <span id="VIZH_test_0_src">Г</span> сдвигается на <input type="number" id="VIZH_test_0_shift_id"> вперед, и
            шифруется в <input style="width: 5em" id="VIZH_test_0_dst"></p>
            <div id="VIZH_alphabet"></div>
        `,
        onLoad() {
            var alphabetTable = document.getElementById('VIZH_alphabet');
            alphabetTable.innerHTML = "";
            alphabetTable.appendChild(renderAlphabet(getRussianAlphabet()));
        },
        fieldChecks: {
            VIZH_test_0_shift() {
                return (getRussianAlphabet().indexOf("б") == this.localState["VIZH_test_0_shift"] - 1);
            },
            VIZH_test_0_shift_id() {
                return (getRussianAlphabet().indexOf("б") == this.localState["VIZH_test_0_shift_id"]);
            },
            VIZH_test_0_dst() {
                var value = this.localState["VIZH_test_0_dst"];
                return value.length == 1 && (shiftChar(value.toLowerCase(), -getRussianAlphabet().indexOf("б")) == 'г');
            }
        }
    },
    {
        title: "Шифр Виженера",
        stageValues: { VIZH_test_1_key : { hasField: true, isNeeded: true, startValue: "" } },
        content: `
            <p>Ключ, в отличие от шифра сдвига, состоит из нескольких символов. Например, ключ может
            быть <input id="VIZH_test_1_key">, тогда шифрование фразы
            "<span id="VIZH_sample_1_src">ШИФРОВАНИЕ</span>" выглядит так:</p>
            <table><tbody>
                <tr id="VIZH_sample_1_table_key"></tr>
                <tr id="VIZH_sample_1_table_src"></tr>
                <tr id="VIZH_sample_1_table_dst"></tr>
            </tbody></table>
            <p>Подберите ключ так, чтобы получилось: "<span id="VIZH_test_1_dst_goal">АВАШАЦЕЛЬА</span>"</p>
            <div id="VIZH_alphabet"></div>
        `,
        onLoad() {
            document.getElementById("VIZH_test_1_key").size = document.getElementById("VIZH_sample_1_src").innerHTML.length;

            var alphabetTable = document.getElementById('VIZH_alphabet');
            alphabetTable.innerHTML = "";
            alphabetTable.appendChild(renderAlphabet(getRussianAlphabet()));
        },
        onUpdate() {
            var tableKey = document.getElementById("VIZH_sample_1_table_key");
            var tableSrc = document.getElementById("VIZH_sample_1_table_src");
            var tableDst = document.getElementById("VIZH_sample_1_table_dst");
            var key = vizhKeyValidator(this.localState["VIZH_test_1_key"]);
            var src = document.getElementById("VIZH_sample_1_src").innerHTML;
            var dst = vizhEncrypt(src, key);
            this.localState["VIZH_test_1_dst"] = dst;

            tableKey.innerHTML = '';
            tableSrc.innerHTML = '';
            tableDst.innerHTML = '';
            for (var i = 0; i < src.length; i++) {
                var shift = (key.length == 0 ? " ": key[i % key.length].toUpperCase());
                tableKey.innerHTML += `<td style="height:20px; width:20px">${shift}</td>`;
                tableSrc.innerHTML += `<td style="height:20px; width:20px">${src[i]}</td>`;
                tableDst.innerHTML += `<td style="height:20px; width:20px">${dst[i]}</td>`;
            }
        },
        fieldChecks: {
            VIZH_test_1_key() {
                return this.localState["VIZH_test_1_dst"] === document.getElementById("VIZH_test_1_dst_goal").innerHTML;
            }
        }
    },
    {
        title: "Шифр Виженера: Свободная практика",
        freePracticeName: "Шифр Виженера: практика",
        stageValues: {
            VIZH_in_key : { hasField: true, isNeeded: false, startValue: "КЛЮЧ" },
            VIZH_in_src : { hasField: true, isNeeded: false, startValue: "Тестовый текст для проверки сообщения на русском языке" },
        },
        content: `
            <p>Здесь можно зашифровать любое сообщение шифром Виженера:</p>
            <p>Ключ = <input id="VIZH_in_key">. Регистр не имеет значения, символами могут быть только буквы.</p>
            <textarea id="VIZH_in_src"></textarea>
            <textarea id="VIZH_dst" readonly></textarea>
        `,
        onUpdate() {
            document.getElementById("VIZH_dst").value = vizhEncrypt(this.localState["VIZH_in_src"], this.localState["VIZH_in_key"]);
        }
    },
    {
        title: "Частотный анализ: шифр Виженера",
        stageValues: {
            VIZH_FREQ_in_m: { hasField: true, isNeeded: true, startValue: null },
            VIZH_FREQ_sample_shift: { hasField: true, isNeeded: false, startValue: 0 }
        },
        content: `
            <p>Допустим, есть сообщение:</p>
            <div>
                <div class="textPreviewHeader" onClick="this.parentElement.classList.toggle('opened')"><span class="textPreviewArrow">▶</span></div>
                <div class="textPreviewContent"><p id="VIZH_FREQ_sample_src"></p></div>
            </div>

            <p>Если попробовать сделать частотный анализ на сообщении, зашифрованном шифром Виженера, мы не увидим ту же картину, что и в шифре сдвига, т.к. одна и та же буква незашифрованного текста окажется в нескольких разных буквах в зашифрованном тексте.
            Но если длина ключа M была небольшой, по сравнению с текстом, то раз в M символов сдвиг будет одинаковый - а значит если в изначальном тексте есть повторяющиеся последовательности символов (свойство осмысленных текстов на большинстве языках), то если мы и в
            зашифрованном сообщении видим одинаковые последовательности раз в N символов, то скорее всего N кратно M, а случайно такие последовательности (т.е. не в результате зашифрования одной и той же частью ключа) - маловероятны.</p>
            <p>В нашем тексте есть несколько последовательностей:</p>

            <div class="tableDiv"><table><tbody><tr id="VIZH_FREQ_sample_id"></tr><tr id="VIZH_FREQ_sample_src_tr"></tr><tr id="VIZH_FREQ_sample_dst"></tr><tr id="VIZH_FREQ_sample_shift_dst"></tr></tbody></table></div>
            <p>Значит длине ключа кратно число: <input type="number" id="VIZH_FREQ_in_m"></p>
            <p>Используйте шифр сдвига, что бы понять длину ключа: <input type="number" id="VIZH_FREQ_sample_shift"></p>
        `,
        onLoad() {
            var src = getSampleText("Загадка1");
            document.getElementById("VIZH_FREQ_sample_src").innerHTML = src;

            var tableId = document.getElementById("VIZH_FREQ_sample_id");
            var tableSrc = document.getElementById("VIZH_FREQ_sample_src_tr");
            var tableDst = document.getElementById("VIZH_FREQ_sample_dst");
            src = src.toUpperCase();
            var dst = vizhEncrypt(src, "КЛЮЧБ");

            this.localState["VIZH_FREQ_sample_src_upper_cache"] = src;
            this.localState["VIZH_FREQ_sample_dst_upper_cache"] = dst;

            var resId = '<td></td>';
            var resSrc = '<td>До шифрования</td>';
            var resDst = '<td>После шифрования</td>';
            for (var i = 0; i < src.length; i++) {
                resId += `<td style="height:20px; width:20px">${i}</td>`;
                resSrc += `<td style="height:20px; width:20px;">${src[i]}</td>`;
                resDst += `<td style="height:20px; width:20px;">${dst[i]}</td>`;
            }
            tableSrc.innerHTML= resSrc; tableDst.innerHTML = resDst;
            tableId.innerHTML= resId;
        },
        onUpdate() {
            var tableDst = document.getElementById("VIZH_FREQ_sample_shift_dst");
            var dst = shiftEncrypt(this.localState["VIZH_FREQ_sample_src_upper_cache"], this.localState["VIZH_FREQ_sample_shift"]);

            var tableResult = '<td>Шифрование сдвига</td>';
            for (var i = 0; i < dst.length; i++) {
                var curDst = this.localState["VIZH_FREQ_sample_dst_upper_cache"][i];
                var tdColor = (dst[i] == curDst && getAlphabet(curDst.toLowerCase()).length != 0) ? "background-color: var(--bg-success);" : "";
                tableResult += `<td style="height:20px; width:20px; ${tdColor}">${dst[i]}</td>`;
            }
            tableDst.innerHTML = tableResult;
        },
        fieldChecks: {
            VIZH_FREQ_in_m() {
                return Number.isInteger(this.localState["VIZH_FREQ_in_m"]) && this.localState["VIZH_FREQ_in_m"] > 0 && this.localState["VIZH_FREQ_in_m"] % 5 == 0 &&
                this.localState["VIZH_FREQ_in_m"] < document.getElementById("VIZH_FREQ_sample_src").innerHTML.length;
            }
        }
    },
    {
        title: "Частотный анализ: шифр Виженера",
        stageValues: {
            VIZH_FREQ_in_m: { hasField: true, isNeeded: false },
            VIZH_FREQ_in_key: { hasField: true, isNeeded: true, startValue: "" },
            VIZH_FREQ_test_k: { hasField: true, isNeeded: false, startValue: NaN }
        },
        content: `
            <p>Зная размер ключа (или число кратное размеру), сообщение можно разбить на N подстрок, где каждая зашифрована шифром сдвига. Если мы ошиблись и N больше M в k раз, то мы лишь усложним время вычисления, получив в k раза больше строк, но ответ должны получить верный.</p>
            <p>Ваше M: <input type="number" id="VIZH_FREQ_in_m" readonly="readonly"></p><p>Сообщение:</p>
            <div>
                <div class="textPreviewHeader" onClick="this.parentElement.classList.toggle('opened')"><span class="textPreviewArrow">▶</span></div>
                <div class="textPreviewContent"><p id="VIZH_FREQ_sample_src"></p></div>
            </div>
            
            <p>Итоговый ключ: <input id="VIZH_FREQ_in_key"></p>
             
            <p>Используйте частотный анализ, что бы понять, какой сдвиг у каждой подстроки.</p>
            <p>Выберите подпоследовательность: <input type="number" step=1 min=0 id="VIZH_FREQ_test_k"></p>
            <div class="tableDiv"><table><tbody><tr id="VIZH_FREQ_FREQ_test_1_id"></tr><tr id="VIZH_FREQ_FREQ_test_1_src"></tr></tbody></table></div>
            <div id="VIZH_FREQ_FREQ_res"></div>

            <div id="VIZH_alphabet"></div>
        `,
        onLoad() {
            var src = getSampleText("Загадка2");
            document.getElementById("VIZH_FREQ_sample_src").innerHTML = src;
            document.getElementById("VIZH_FREQ_test_k").max = this.localState["VIZH_FREQ_in_m"] - 1;
            this.localState["VIZH_FREQ_test_k_cache"] = NaN;

            var alphabetTable = document.getElementById('VIZH_alphabet');
            alphabetTable.appendChild(renderAlphabet(getRussianAlphabet()));
        },
        onUpdate() {
            var k = this.localState["VIZH_FREQ_test_k"];
            var text = document.getElementById("VIZH_FREQ_sample_src");

            var resId = "", resSrc = "";
            var outputDiv = document.getElementById("VIZH_FREQ_FREQ_res");

            if (this.localState["VIZH_FREQ_test_k_cache"] != this.localState["VIZH_FREQ_test_k"]) {
                this.localState["VIZH_FREQ_test_k_cache"] = this.localState["VIZH_FREQ_test_k"];
                outputDiv.innerHTML = "";
                document.getElementById("VIZH_FREQ_FREQ_test_1_id").innerHTML = "";
                document.getElementById("VIZH_FREQ_FREQ_test_1_src").innerHTML = "";
            } else {
                k = NaN;
            }

            if (!isNaN(k)) {
                var subLine = "";
                for (var i = k; i < text.innerHTML.length; i += this.localState["VIZH_FREQ_in_m"]) {
                    resId +=`<td style="height:20px; width:20px">${i}</td>`;
                    resSrc += `<td style="height:20px; width:20px">${text.innerHTML[i].toUpperCase()}</td>`;
                    subLine += text.innerHTML[i];
                }

                var freqResult = freqAnalysis(subLine, getRussianAlphabet());
                outputDiv.appendChild(renderFreqAnalysisDiff(freqResult, getTheoryFreqAnalysisRU()));

                document.getElementById("VIZH_FREQ_FREQ_test_1_id").innerHTML = resId;
                document.getElementById("VIZH_FREQ_FREQ_test_1_src").innerHTML = resSrc;
            }
        },
        fieldChecks: {
            VIZH_FREQ_in_key() {
                return this.localState["VIZH_FREQ_in_key"].toUpperCase() == "КЛЮЧБ";
            }
        }
    },
    {
        title: "Частотный анализ, шифр Виженера: Свободная практика",
        freePracticeName: "Частотный анализ, шифр Виженера: практика",
        stageValues: {
            VIZH_FREQ_sandbox_key: { hasField: true, isNeeded: false, startValue: "" },
            VIZH_FREQ_sandbox_text: { hasField: true, isNeeded: false, startValue: "Theory" },
            VIZH_FREQ_sandbox_M: { hasField: true, isNeeded: false, startValue: 0 },
            VIZH_FREQ_sandbox_src: { hasField: true, isNeeded: false, startValue: "" },
            VIZH_FREQ_sandbox_K: { hasField: true, isNeeded: false, startValue: 0 }
        },
        content: `
            <p>Здесь можно расшифровать любое сообщение, зашифрованное шифром Виженера:</p>
            <p>Эталон частот: <select id="VIZH_FREQ_sandbox_text"></select>,<br/>
            M = <input type="number" id="VIZH_FREQ_sandbox_M" min=0 step=1>, Ключ = <input id="VIZH_FREQ_sandbox_key"></p>
            <p><button id="VIZH_FREQ_calc_M">Подобрать M</button> <button id="VIZH_FREQ_calc_Key">Подобрать ключ</button></p>
            
            <div>
                <div class="textPreviewHeader" onClick="this.parentElement.classList.toggle('opened')"><span class="textPreviewArrow">▶</span> Зашифрованный текст</div>
                <textarea id="VIZH_FREQ_sandbox_src"  class="textPreviewContent"></textarea>
            </div>

            <div>
                <div class="textPreviewHeader" onClick="this.parentElement.classList.toggle('opened')"><span class="textPreviewArrow">▶</span> Расшифрованный текст</div>
                <textarea id="VIZH_FREQ_sandbox_dst" class="textPreviewContent" readonly></textarea>
            </div>
            
            <p>Результат последнего подбора ключа:</p><div id="VIZH_FREQ_calc_Key_result"></div>
            <p>Выберите подпоследовательность: <input type="number" step=1 min=0 id="VIZH_FREQ_sandbox_K"></p>
            <div id="VIZH_FREQ_FREQ_res"></div>
            <div id="VIZH_alphabet"></div>
        `,
        onLoad() {
            var alphabetTable = document.getElementById('VIZH_alphabet');
            alphabetTable.appendChild(renderAlphabet(getRussianAlphabet()));

            var select = document.getElementById('VIZH_FREQ_sandbox_text');
            var selectStr = "";
            getSampleTextListRUWithTheory().forEach(textId => {
                selectStr += `<option value="${textId.id}">РУС: ${textId.name}</option>`
            });
            getSampleTextListEN().forEach(textId => {
                selectStr += `<option value="${textId.id}">EN: ${textId.name}</option>`
            });
            select.innerHTML = selectStr;

            select.value = this.localState["VIZH_FREQ_sandbox_text"];
            this.localState["VIZH_FREQ_sandbox_text_cached_Name"] = null;
            this.localState["VIZH_FREQ_sandbox_text_cached_Freq"] = null;

            document.getElementById("VIZH_FREQ_calc_M").addEventListener('click', this.getStageData().calcM.bind(this), {signal: this.unneededFieldsController.signal});
            document.getElementById("VIZH_FREQ_calc_Key").addEventListener('click', this.getStageData().calcKey.bind(this), {signal: this.unneededFieldsController.signal});
        },
        calcM() {
            var text = this.localState["VIZH_FREQ_sandbox_src"].toLowerCase();
            var M = calcVizhM(text);
            document.getElementById("VIZH_FREQ_sandbox_M").value = M;
            this.onInputForUnneededFields();
        },
        calcKey() {
            var Key = "";
            var KeyResult = [];
            var sampleTextFreq = this.localState["VIZH_FREQ_sandbox_text_cached_Freq"];
            var alphabet = this.localState["VIZH_FREQ_sandbox_text_cached_Freq"].alphabet;
            var m = this.localState["VIZH_FREQ_sandbox_M"];

            for (var i = 0; i < m; i++) {
                var subLine = "";
                for (var j = i; j < this.localState["VIZH_FREQ_sandbox_src"].length; j += m) {
                    subLine += this.localState["VIZH_FREQ_sandbox_src"][j];
                }
                KeyResult.push({ candidates: autoFreqTestPart(freqAnalysis(subLine, alphabet), sampleTextFreq) });
                Key += (isNaN(KeyResult[i].candidates[0].shift) ? ' ' : shiftAlphabet(alphabet, KeyResult[i].candidates[0].shift).toUpperCase());
            }

            document.getElementById("VIZH_FREQ_calc_Key_result").innerHTML = "";
            document.getElementById("VIZH_FREQ_calc_Key_result").appendChild(renderAutoFreqResult(KeyResult, m, 6, alphabet));

            document.getElementById("VIZH_FREQ_sandbox_key").value = Key;
            this.onInputForUnneededFields();
        },
        onUpdate() {
            if (this.localState["VIZH_FREQ_sandbox_text_cached_Name"] != this.localState["VIZH_FREQ_sandbox_text"]) {
                this.localState["VIZH_FREQ_sandbox_text_cached_Name"] = this.localState["VIZH_FREQ_sandbox_text"];
                if (this.localState["VIZH_FREQ_sandbox_text"] == "Theory") {
                    this.localState["VIZH_FREQ_sandbox_text_cached_Freq"] = getTheoryFreqAnalysisRU();
                } else {
                    var text = getSampleText(this.localState["VIZH_FREQ_sandbox_text"]);
                    this.localState["VIZH_FREQ_sandbox_text_cached_Freq"] = freqAnalysis(text, getAlphabet(text[0]));
                    text = null;
                }
            }
            
            var sampleTextFreq = this.localState["VIZH_FREQ_sandbox_text_cached_Freq"];
            var m = this.localState["VIZH_FREQ_sandbox_M"];

            document.getElementById("VIZH_FREQ_sandbox_K").max = Math.max(0, m - 1);
            var k = Math.min(document.getElementById("VIZH_FREQ_sandbox_K").max, this.localState["VIZH_FREQ_sandbox_K"]);
            document.getElementById("VIZH_FREQ_sandbox_K").value = k;

            var text = this.localState["VIZH_FREQ_sandbox_src"];
            var outputDiv = document.getElementById("VIZH_FREQ_FREQ_res");
            outputDiv.innerHTML = "";

            if (!isNaN(k) && m != 0) {
                var subLine = "";
                for (var i = k; i < text.length; i += m) {
                    subLine += text[i];
                }

                var freqResult = freqAnalysis(subLine, sampleTextFreq.alphabet);
                outputDiv.appendChild(renderFreqAnalysisDiff(freqResult, sampleTextFreq));

                var autoKey = autoFreqTestPart(freqResult, sampleTextFreq);
                var comment = document.createElement("p");
                comment.innerHTML = "Список возможных ключей (данной подстроки) и их отклонений от эталонного текста:";
                outputDiv.appendChild(comment);
                outputDiv.appendChild(renderAutoFreqResultPart(autoKey, sampleTextFreq.alphabet));
                outputDiv.appendChild(document.createElement("br"));
            }

            document.getElementById("VIZH_FREQ_sandbox_dst").innerText = vizhDecrypt(text, this.localState["VIZH_FREQ_sandbox_key"]);
        }
    }
];


document.addEventListener('DOMContentLoaded', () => {
    document.styleSheets[0].insertRule(`input[type="number"] { width: 5em; }`, document.styleSheets[0].length);
    new PageApp(pageContent, 1);
});
