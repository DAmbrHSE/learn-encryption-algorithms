function getRussianAlphabet() {
    return 'абвгдеёжзийклмнопрстуфхцчшщъыьэюя';
}

function getEnglishAlphabet() {
    return 'abcdefghijklmnopqrstuvwxyz';
}

function getAlphabet(char) {
    if (char >= 'a' && char <= 'z')
        return getEnglishAlphabet();
    else if (char >= 'а' && char <= 'я' || char == "ё")
        return getRussianAlphabet();
    return "";
}

function correctMod(value, mod) {
    return (value < 0 ? ((value % mod) + mod) : value)  % mod;
}

function shiftChar(char, n) {
    var lowerChar = char.toLowerCase();
    var alphabet = getAlphabet(lowerChar);

    if (alphabet.length == 0) return char;

    var index = alphabet.indexOf(lowerChar);
    var newIndex = correctMod(index + n, alphabet.length);
    var shiftedChar = alphabet[newIndex];

    return char === lowerChar ? shiftedChar : shiftedChar.toUpperCase();
}

function shiftAlphabet(alphabet, n) {
    return isNaN(n) ? '?' : alphabet[correctMod(n, alphabet.length)];
}

function shiftEncrypt(string, n) {
    if (!Number.isInteger(n)) {
        return string;
    }

    var outString = "";
    for (var i = 0; i < string.length; i++) {
        outString += shiftChar(string[i], n);
    }
    return outString;
}

function shiftDecrypt(string, n) {
    return shiftEncrypt(string, -n);
}

function getCharShift(char) {
    var lowerChar = char.toLowerCase();
    var alphabet = getAlphabet(lowerChar);

    if (alphabet.length == 0) return 0;
    return alphabet.indexOf(lowerChar);
}

function vizhKeyToShift(key) {
    var keyN = [];
    for (var i = 0; i < key.length; i++) {
        keyN.push(getCharShift(key[i]));
    }
    return keyN;
}

function dropNonAlphabetSymbols(str) {
    var str1 = "";
    if (typeof str == "string") {
        for (var i = 0; i < str.length; i++) {
            var alphabet = getAlphabet(str[i].toLowerCase());
            if (alphabet.length != 0) { str1 += str[i]; }
        }
    }
    return str1;
}

function vizhKeyValidator(key) {
    return dropNonAlphabetSymbols(key);
}

function vizhEncrypt(string, inKey) {
    var key = vizhKeyValidator(inKey);
    if (key.length == 0) {
        return string;
    }

    var outString = "", keyN = vizhKeyToShift(key);
    for (var i = 0; i < string.length; i++) {
        outString += shiftChar(string[i], keyN[i % keyN.length]);
    }
    return outString;
}

function vizhDecrypt(string, inKey) {
    var key = vizhKeyValidator(inKey);
    if (key.length == 0) {
        return string;
    }

    var outString = "", keyN = vizhKeyToShift(key);
    for (var i = 0; i < string.length; i++) {
        outString += shiftChar(string[i], -keyN[i % keyN.length]);
    }
    return outString;
}

function renderAlphabet(string) {
    var maxPerRow = 10;
    var table = document.createElement('table');
    var tbody = document.createElement('tbody');
    
    for (var i = 0; i < string.length; i += maxPerRow) {
        var rowI = document.createElement('tr');
        var rowCh = document.createElement('tr');

        for (var j = 0; j < maxPerRow; j++) {
            var index = i + j;

            var indexCell = document.createElement('td');
            var valueCell = document.createElement('td');
            
            if (index < string.length) {
                indexCell.textContent = index + 1;
                valueCell.textContent = string[index];
            }

            rowI.appendChild(indexCell);
            rowCh.appendChild(valueCell);
        }

        tbody.appendChild(rowI);
        tbody.appendChild(rowCh);
    }

    table.appendChild(tbody);
    var tableDiv = document.createElement('div');
    tableDiv.className = "tableDiv";
    tableDiv.appendChild(table);
    return tableDiv;
}

function getSampleTextListRU()
{
    return [
        {id: "RU_ОтцыИДети", name:"Отцы и дети - Иван Тургенев, отрывок"},
        {id: "RU_ХозяйкаМеднойГоры", name:"Хозяйка медной горы - Павел Бажов"},
        {id: "RU_МастерИМаргарита_1", name:"Мастер и Маргарита - Михаил булгаков, отрывок"},
        {id: "RU_ДваКапитана", name:"Два капитана - Вениамин Каверин, отрывок"}
    ];
}

function getSampleTextListRUWithTheory()
{
    var array = getSampleTextListRU();
    array.push({id:"RU_Theory", name:"Теоритические данные"});
    return array;
}

function getSampleTextListEN()
{
    return [
        {id: "EN_PortraitOfDorianGray", name:"Портрет Дориана Грея - Оскар Уайлд, отрывок"},
        {id: "EN_Frankenstine", name:"Франкенштейн - Мерри Шелли, отрывок"},
    ];
}

function getSampleText(textID)
{
    var request = new XMLHttpRequest();
    request.open("GET", `texts/${textID}.txt`, false);
    request.send(null);

    if (request.status === 200 || request.status === 0) {
        return request.responseText;
    }

    return `Ошибка/Error ${request.status}!`;
}

function freqAnalysis(text, alphabet)
{
    var freq = [];
    for (var i = 0; i < alphabet.length; i++) {
        freq.push(0);
    }

    var lowerText = text.toLowerCase();
    var maxFreq = 0, freqSum = 0;
    for (var i = 0; i < text.length; i++) {
        var index = alphabet.indexOf(lowerText[i]);
        if (index !== -1) {
            freq[index]++;
            maxFreq = Math.max(freq[index], maxFreq);
            freqSum++;
        }
    }
    
    return { result: freq, maxFreq: maxFreq, alphabet: alphabet, freqSum : freqSum };
}

function getTheoryFreqAnalysisRU()
{
    var result = [
        40487008,
        8051767,
        22930719,
        8564640,
        15052118,
        42691213,
        184928,
        4746916,
        8329904,
        37153142,
        6106262,
        17653469,
        22230174,
        16203060,
        33838881,
        55414481,
        14201572,
        23916825,
        27627040,
        31620970,
        13245712,
        1335747,
        4904176,
        2438807,
        7300193,
        3678738,
        1822476,
        185452,
        9595941,
        8784613,
        1610107,
        3220715,
        10139085];

    var freqSum = 0;
    result.forEach((freq) => {freqSum += freq;});

    return { result: result, maxFreq: 55414481, alphabet: getRussianAlphabet(), freqSum: freqSum };
}

function renderFreqAnalysisBase(maxFreq, alphabet, height, getCurrentFreq, printCurrentFreq, getCell, getBottomCell, chCount) {
    var table = document.createElement('table');
    var tbody = document.createElement('tbody');

    var step = Math.pow(10, Math.max(0, Math.floor(Math.log10(maxFreq / 20))));
    var scaledMaxFreq = Math.max(1, Math.ceil(maxFreq / step) * step);

    var fontSize = 14, contentSize = 750;
    chCount = (chCount == null ? Math.max(1, Math.ceil(Math.log10(scaledMaxFreq + 1))) : chCount);
    var cellWidth = contentSize / (alphabet.length + 1), cellHeight = 20;
    fontSize = Math.min(cellWidth / chCount * 1.7, 14);
    table.style = `width: ${cellWidth * (alphabet.length + 1)}px; font-size: ${fontSize}px`;

    for (var h = height; h > 0; h--) {
        var row = document.createElement('tr');
        var currentFreq = (getCurrentFreq == null ? (maxFreq <= 1 ? maxFreq : Math.round( (scaledMaxFreq - 1) * ((h - 1.0) / (height - 1)) ) + 1) : getCurrentFreq(h, height));

        var infoCell = document.createElement('td');
        infoCell.innerHTML = printCurrentFreq == null ? currentFreq : printCurrentFreq(currentFreq);
        infoCell.title = infoCell.innerHTML;
        infoCell.style = `height: ${cellHeight}px`;
        row.appendChild(infoCell);

        for (var i = 0; i < alphabet.length; i++) {
            row.appendChild(getCell(i, currentFreq, cellWidth, cellHeight));
        }
        tbody.appendChild(row);
    }

    for (var h = 0; h < 2; h++) {
        var row = document.createElement('tr');
        var infoCell = document.createElement('td');
        infoCell.style = `width:${cellWidth}px;`;
        row.appendChild(infoCell);

        for (var i = 0; i < alphabet.length; i++) {
            if (h == 0) {
                var cell = document.createElement('td');
                cell.innerHTML = alphabet[i];
                cell.style = `width:${cellWidth}px; height: ${cellHeight}px; font-size: 14px;`;
                row.appendChild(cell);
            } else {
                row.appendChild(getBottomCell(i, cellWidth, cellHeight), cellWidth, cellHeight);
            }
        }
        tbody.appendChild(row);
    }

    table.appendChild(tbody);

    var tableDiv = document.createElement('div');
    tableDiv.className = "tableDiv";
    tableDiv.appendChild(table);
    return tableDiv;
}

function renderFreqAnalysis(freqResult) {
    var getCell = (i, currentFreq, cellWidth, cellHeight) => {
        var cell = document.createElement('td');
        var isColored = (freqResult.maxFreq == 0 ? false : freqResult.result[i] >= currentFreq);
        cell.style = `${isColored ? 'background-color: var(--accent);' : ''} `;
        cell.title = freqResult.alphabet[i] + ": " + freqResult.result[i];
        return cell;
    };
    var getBottomCell = (i, cellWidth, cellHeight) => {
        var cell = document.createElement('td');
        cell.innerHTML = freqResult.result[i];
        cell.title = cell.innerHTML;
        cell.style = `width:${cellWidth}px; height: ${cellHeight}px;`;
        return cell;
    };

    var height = Math.max(1, Math.min(20, freqResult.maxFreq));
    return renderFreqAnalysisBase(freqResult.maxFreq, freqResult.alphabet, height, null, null, getCell, getBottomCell, null);
}

function renderFreqAnalysisDiff(freqResultA, freqResultB) {
    if (freqResultA.alphabet != freqResultB.alphabet) {
        return null;
    }

    var maxFreqA = Math.max(1, freqResultA.maxFreq), maxFreqB = Math.max(1, freqResultB.maxFreq);

    var getCell = (i, currentFreq, cellWidth, cellHeight) => {
        var cellA = document.createElement('td'), cellB = document.createElement('td');
        var aFreq = freqResultA.result[i] / maxFreqA;
        var bFreq = freqResultB.result[i] / maxFreqB;
        var isColoredA = (freqResultA.maxFreq == 0 ? false : aFreq >= currentFreq);
        var isColoredB = (freqResultB.maxFreq == 0 ? false : bFreq >= currentFreq);

        cellA.style = `${isColoredA ? 'background-color: var(--accent);' : ''} width: ${cellWidth / 2}px; height: ${cellHeight}px; `;
        cellB.style = `${isColoredB ? 'background-color: var(--accent-2);' : ''} width: ${cellWidth / 2}px; height: ${cellHeight}px; `;
        cellA.className = cellB.className = "borderless";

        var row = document.createElement('tr');
        row.appendChild(cellA); row.appendChild(cellB);
        var pseudoCell = document.createElement('td'); pseudoCell.appendChild(row);
        pseudoCell.title = freqResultA.alphabet[i] + ": " + (aFreq * 100).toFixed(1) + "%" + " / " + (bFreq * 100).toFixed(1) + "%";
        return pseudoCell;
    };
    var getBottomCell = (i, cellWidth, cellHeight) => {
        var cellA = document.createElement('td'), cellB = document.createElement('td');
        var aFreq = freqResultA.result[i] / maxFreqA;
        var bFreq = freqResultB.result[i] / maxFreqB;
        cellA.innerHTML = (aFreq * 100).toFixed(0) + "%"; cellA.title = (aFreq * 100).toFixed(1) + "%";
        cellB.innerHTML = (bFreq * 100).toFixed(0) + "%"; cellB.title = (bFreq * 100).toFixed(1) + "%";
        cellA.style = `width: ${cellWidth}px; height: ${cellHeight}px; color: var(--accent); border-top: 0px; border-left: 0px; border-right: 0px;`;
        cellB.style = `width: ${cellWidth}px; height: ${cellHeight}px; color: var(--accent-2); border: 0px;`;

        var pseudoCell = document.createElement('td'), rowA = document.createElement('tr'), rowB = document.createElement('tr');
        rowA.appendChild(cellA); rowB.appendChild(cellB);
        pseudoCell.appendChild(rowA); pseudoCell.appendChild(rowB);
        return pseudoCell;
    };

    var getFreq = (h, height) => { return h / height; }
    var printFreq = (freq) => { return (freq * 100).toFixed(0) + "%"; };

    return renderFreqAnalysisBase(maxFreqA, freqResultA.alphabet, 20, getFreq, printFreq, getCell, getBottomCell, 4.2);
}

function calcVizhM(text) {
    if (text.length <= 2) {
        var validText = dropNonAlphabetSymbols(text);
        return (validText.length > 0 ? validText.length : NaN);
    }

    var minLength = 2;
    var maxLength = Math.min(40, Math.floor(text.length / 2));
    var maxM = Math.max(1, text.length - 1);
    var candidates = [];
    for (var i = 1; i <= maxM; i++) {
        candidates.push({m: i, score: 0});
    }

    for (var length = minLength; length <= maxLength; length++) {
        var positions = new Map();

        for (var i = 0; i <= text.length - length; i++) {
            var part = "", isValid = true;

            for (var j = i; j < i + length; j++) {
                if (getRussianAlphabet().indexOf(text[j]) != -1 || getEnglishAlphabet().indexOf(text[j]) != -1) {
                    part += text[j];
                } else {
                    isValid = false;
                };
            }

            if (!isValid) { continue; }

            if (!positions.has(part)) {
                positions.set(part, []);
            }
            positions.get(part).push(i);
        }

        positions.forEach(indexes => {
            for (var i = 0; i < indexes.length - 1; i++) {
                for (var j = i + 1; j < indexes.length; j++) {
                    var distance = indexes[j] - indexes[i];

                    for (var m = 1; m <= maxM; m++) {
                        if ((m == 1 && distance == 1) || (m != 1 && distance % m == 0)) {
                            candidates[m - 1].score += length - 1;
                        }
                    }
                }
            }
        });
    }

    candidates.sort((a, b) => { return a.score != b.score ? b.score - a.score : a.m - b.m; });
    if (candidates[0].score == 0) {
        return NaN;
    }

    return candidates[0].m;
}


function autoFreqTestPart(freqResult, theoryFreq) {
    if (freqResult.maxFreq == 0) { return [ {shift: NaN, score: NaN }]; }

    var candidates = [];
    for (var shift = 0; shift < theoryFreq.alphabet.length; shift++) {
        var score = 0;
        for (var i = 0; i < theoryFreq.alphabet.length; i++) {
            var encryptedChar = theoryFreq.alphabet[(i + shift) % theoryFreq.alphabet.length];
            var encryptedIndex = freqResult.alphabet.indexOf(encryptedChar);
            var observed = encryptedIndex == -1 ? 0 : freqResult.result[encryptedIndex] / freqResult.freqSum;

            var freq = theoryFreq.result[i] / theoryFreq.freqSum;
            score += Math.pow(observed - freq, 2) / Math.max(freq, 0.0001) * freqResult.freqSum;
        }
        score /= theoryFreq.alphabet.length;
        candidates.push({ shift: shift, score: score });
    }

    candidates.sort((a, b) => a.score - b.score);
    return candidates;
}

function renderAutoFreqResult(result, m, maxN, alphabet) {
    var table = document.createElement('table');
    var tbody = document.createElement('tbody');

    for (var i = 0; i < m; i++) {
        var rowCh = document.createElement('tr');
        var row = document.createElement('tr');

        var curLen = (maxN != null ? Math.min(maxN, result[i].candidates.length) : result[i].candidates.length);
        for (var j = 0; j < curLen; j++) {
            var cellCh = document.createElement('td');
            var cell = document.createElement('td');
            if (maxN != null && result[i].candidates.length != maxN && (j == maxN - 1)) {
                cell.innerHTML = "...";
            } else {
                cellCh.innerHTML = shiftAlphabet(alphabet, result[i].candidates[j].shift);
                cell.innerHTML = isNaN(result[i].candidates[j].score) ? ' ' : result[i].candidates[j].score.toFixed(2);
            }
            rowCh.appendChild(cellCh);
            row.appendChild(cell);
        }
        tbody.appendChild(rowCh);
        tbody.appendChild(row);
    }

    table.appendChild(tbody);

    var tableDiv = document.createElement('div');
    tableDiv.className = "tableDiv";
    tableDiv.appendChild(table);
    return tableDiv;
}

function renderAutoFreqResultPart(result, alphabet) {
    return renderAutoFreqResult([{candidates: result}], 1, null, alphabet);
}