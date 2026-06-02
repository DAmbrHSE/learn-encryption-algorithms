const pageContent = [
    {
        title: "RSA",
        stageValues: {},
        content: `
            <p>Разберем алгоритм, который используется в современном шифровании - RSA, разработанный в 1978 г. учёными криптографами Р. Ривестом, А. Шамиром и Л. Адлеманом.</p>
            <p>RSA называют асимметричным шифрованием, т.к. в нем для зашифровывания и для расшифровывания используются разные ключи,
            в отличие от предыдущих алгоритмов.
            Открытый ключ передается тому, кто должен будет зашифровать сообщение, закрытым же можно будет расшифровывать их -
            зная только открытый ключ сообщение можно будет только зашифровать, и наоборот.</p>
            <p>Это один из самых распостранённых алгоритмов шифрования с открытым ключом, и он лежит в основе современных систем цифровых сертификатов и для безопасного обмена ключами для других шифрований.</p>
        `
    },
    {
        title: "Алгоритм вычисления ключей RSA",
        stageValues: {
            RSA_in_p: { hasField: true, isNeeded: true, startValue: NaN },
            RSA_in_q: { hasField: true, isNeeded: true, startValue: NaN }
        },
        content: `
            <p>Оба ключа RSA - пара чисел. Рассмотрим алгоритм их генерации:</p>

            <p>В основе алгоритма два <b>различных</b> простых числа: назовем их p <input type="number" min="2" step="1" id="RSA_in_p"> и
            q <input type="number" min="2" step="1" id="RSA_in_q">.</p>
            <p>Обычно это 2 больших числа, например, 1024 бита каждое - в корне безопасности алгоритма лежит то, что имея два больших простых числа посчитать их произведение - легко, а имея произведение разложить его на множители - гораздо более сложная задача.</p>
            <p id="RSA_stage_result"></p>
        `,
        onUpdate() {
            var p = this.localState["RSA_in_p"], q = this.localState["RSA_in_q"];
            var output = document.getElementById("RSA_stage_result");

            if (p == null || q == null) {
                output.innerHTML = "Введите два различных простых числа.";
            } else if (p == q) {
                output.innerHTML = "Числа должны быть различными.";
            } else if (!isPrime(p) || !isPrime(q)) {
                output.innerHTML = "Числа должны быть простыми.";
            } else {
                output.innerHTML = "";
            }
        },
        fieldChecks: {
            RSA_in_p() { return isPValid(this.localState["RSA_in_p"], this.localState["RSA_in_q"]); },
            RSA_in_q() { return isQValid(this.localState["RSA_in_p"], this.localState["RSA_in_q"]); }
        },
        onComplete() {
            this.localState["RSA_in_p_1"] = this.localState["RSA_in_p"];
            this.localState["RSA_in_q_1"] = this.localState["RSA_in_q"];
        }
    },
    {
        title: "Алгоритм вычисления ключей RSA",
        stageValues: {
            RSA_in_p: { hasField: true, isNeeded: false }, RSA_in_q: { hasField: true, isNeeded: false },
            RSA_phi: {hasField: true, isNeeded: true, startValue: NaN }},
        content: `
            <p>p <input type="number" min="2" step="1" id="RSA_in_p" readonly>, q <input type="number" min="2" step="1" id="RSA_in_q" readonly></p>
             
            <p>Зашифровывающий выбирает p и q, и вычисляет их произведение n = <span id="RSA_text_n"></span> и функцию Эйлера для n.</p>
            <p>Функция Эйлера φ(n) = количество взаимно простых к n чисел меньше n, для произведения простых чисел это всегда равно:
            φ = (p - 1) (q - 1) = <input type="number" step="1" id="RSA_phi">.</p>
            <p>Результат функции Эйлера, а также числа p и q будут секретны и известны только загадавшему числа.</p>
        `,
        onLoad() {
            var p = this.localState["RSA_in_p"];
            var q = this.localState["RSA_in_q"];
            document.getElementById("RSA_text_n").textContent = p * q;
        },
        onComplete() {
            this.localState["RSA_phi_1"] = this.localState["RSA_phi"];
        },
        fieldChecks: {
            RSA_phi() { return this.localState["RSA_phi"] === (this.localState["RSA_in_p"] - 1) * (this.localState["RSA_in_q"] - 1); }
        }
    },
    {
        title: "Алгоритм вычисления ключей RSA",
        stageValues: {
            RSA_in_p_1: { hasField: true, isNeeded: true },
            RSA_in_q_1: { hasField: true, isNeeded: true },
            RSA_in_e: { hasField: true, isNeeded: true, startValue: NaN },
            RSA_in_d: { hasField: true, isNeeded: true, startValue: NaN }
        },
        content: `
            <p>Выбираются два числа e и d: e взаимнопростое с φ, а d - обратное по модулю φ к e, то есть такое что d * e = 1 по модулю φ.</p>
            <p>e можно выбирать свободно: <input type="number" min="2" step="1" id="RSA_in_e">.</p>
            <p>Число d тогда может быть равно, например, <input type="number" step="1" id="RSA_in_d"></p>

            <p>p = <input type="number" min="2" step="1" id="RSA_in_p_1">, q = <input type="number" min="2" step="1" id="RSA_in_q_1"></p>
            <p>n = <span id="RSA_text_n"></span>, φ = (p - 1) (q - 1) = <span id="RSA_text_phi"></span></p>

            <p>Открытый ключ - пара чисел (e; n), закрытый ключ - (d; n).</p>
            <p id="RSA_stage_result"></p>
        `,
        onUpdate() {
            var p = this.localState["RSA_in_p_1"], q = this.localState["RSA_in_q_1"];
            var isValidPQ = isPQValid(p, q);
            var n = p * q;
            var phi = !isValidPQ ? NaN : (p - 1) * (q - 1);
            this.localState["RSA_phi_1"] = phi;

            document.getElementById("RSA_text_n").textContent = formatValueForField(n, "");
            document.getElementById("RSA_text_phi").textContent = formatValueForField(phi, "?");

            var e = this.localState["RSA_in_e"], d = this.localState["RSA_in_d"];

            var output = document.getElementById("RSA_stage_result");
            output.innerHTML = "";
            if (!isValidPQ) {
                output.innerHTML = "p и q не являются простыми различными числами (в пределе вычислимых значений)!";
            } else if (!isValidExp(e, phi)) {
                output.innerHTML = "Выберите e больше 1 и взаимно простое с φ.";
            } else if (!isValidD(e, d, phi)) {
                output.innerHTML = "Выберите d, подходящее под φ и e.";
            }
        },
        onComplete() {
            this.localState["RSA_sandbox_p"] = this.localState["RSA_in_p_1"];
            this.localState["RSA_sandbox_q"] = this.localState["RSA_in_q_1"];
            this.localState["RSA_sandbox_e"] = this.localState["RSA_in_e"];
            this.localState["RSA_sandbox_d"] = this.localState["RSA_in_d"];
        },
        fieldChecks: {
            RSA_in_p_1() { return isPValid(this.localState["RSA_in_p_1"], this.localState["RSA_in_q_1"]); },
            RSA_in_q_1() { return isQValid(this.localState["RSA_in_p_1"], this.localState["RSA_in_q_1"]); },
            RSA_in_e() { return !isNaN(this.localState["RSA_phi_1"]) && isValidExp(this.localState["RSA_in_e"], this.localState["RSA_phi_1"]); },
            RSA_in_d() { return !isNaN(this.localState["RSA_phi_1"]) && isValidD(this.localState["RSA_in_e"], this.localState["RSA_in_d"], this.localState["RSA_phi_1"]); }
        }
    },
    {
        title: "Алгоритм шифрования RSA",
        stageValues: {
            RSA_in_m: { hasField: true, isNeeded: false, startValue: 3 }
        },
        content: `
            <p>Сообщение в RSA - число. Допустим, мы хотим зашифровать число m = <input type="number" min="0" step="1" id="RSA_in_m">. m должно быть от 0 до n-1, если сообщения больше - их обычно делят на несколько значений, которые передают отдельно.</p>
            <p>Что бы получить зашифрованное сообщение c, мы вычисляем m<span class="pow">e</span> по модулю n: c = <span id="RSA_text_c_calc"></span>.</p>
            <p>Расшифрование c: c<span class="pow">d</span> = m по модулю n, для любых m от 0 до n-1.</p>

            <p>Как это работает?</p>
            <p>Посчитаем, чему должно равняться число после расшифрования:</p>
            <p>(m<span class="pow">e</span>)<span class="pow">d</span> mod n = m<span class="pow">ed</span> mod n</p>
            <p>Докажем, что m<span class="pow">ed</span> ≡ m (mod p) (и mod q, по аналогии).</p>
            <p>Рассмотрим m mod p != 0:
            Так как e и d взаимообратны по модулю φ, то можно представить e * d как 1 + k * (p - 1)(q - 1), где k - целое число не меньшее 0.</p>
            <p>Тогда: 
            m<span class="pow">(1 + k * (p - 1)(q - 1))</span> mod p = 
            m * (m<span class="pow">k(p - 1)(q - 1)</span>) mod p = 
            m * ((m<span class="pow">(p - 1)</span>)<span class="pow">k(q - 1)</span>) mod p.
            m<span class="pow">(p - 1)</span> mod p всегда будет равно 1, по малой теореме Ферма: 
            Если m не делится на p, и p простое число, то m<span class="pow">(p - 1)</span> - 1 делится на p, то есть m<span class="pow">(p - 1)</span> mod p = 1. 
            Итог: m * (1<span class="pow">k(q - 1)</span>) mod p = m * 1 = m </p>
            <p>Если m mod p = 0, то m<span class="pow">ed</span> mod p = 0, то есть m по модулю p.</p>

            <p>Китайская теорема об остатках: если числа p и q взаимнопростые, то для системы уравнений:<br/>
            (x ≡ a) по модулю p и (x ≡ b) по модулю q для некоторых a и b<br/>
            для x существует единственное решение по модулю p * q. </p>
            <p>Если m<span class="pow">ed</span> ≡ m (mod p), и m<span class="pow">ed</span> ≡ m (mod q), то по Китайской теореме об остатках m<span class="pow">ed</span> ≡ m (mod n).</p>
            <p>Так как 0 <= m < n: m<span class="pow">ed</span> mod n = m.</p>
        `,
        onUpdate() {
            var n = this.localState["RSA_in_p_1"] * this.localState["RSA_in_q_1"];
            document.getElementById("RSA_in_m").min = 0, document.getElementById("RSA_in_m").max = n - 1;

            var m = Math.min(Math.max(this.localState["RSA_in_m"], 0), n - 1), e = this.localState["RSA_in_e"];
            document.getElementById("RSA_in_m").value = m;
            var c = intPowMod(m, e, n);
            document.getElementById("RSA_text_c_calc").textContent = `${formatValueForField(m, "?")}^${e} mod ${n} = ${formatValueForField(c, "?")}`;
        }
    },
    {
        title: "Алгоритм шифрования RSA",
        stageValues: {
            RSA_test_p: { hasField: true, isNeeded: false, startValue: 11 },
            RSA_test_q: { hasField: true, isNeeded: false, startValue: 7 },
            RSA_test_n: { hasField: true, isNeeded: true, startValue: NaN },
            RSA_test_phi: { hasField: true, isNeeded: true, startValue: NaN },
            RSA_test_e: { hasField: false, isNeeded: false, startValue: NaN },
            RSA_test_d: { hasField: false, isNeeded: false, startValue: NaN },
            RSA_test_c: { hasField: true, isNeeded: false, startValue: 3 },
            RSA_test_c_pow: { hasField: true, isNeeded: true, startValue: NaN },
            RSA_test_c_mod: { hasField: true, isNeeded: true, startValue: NaN },
            RSA_test_m: { hasField: true, isNeeded: false, startValue: NaN  },
        },
        content: `
            <p>Попробуйте расшифровать сообщение:</p>

            <p>p = <input type="number" min="2" step="1" id="RSA_test_p" readonly>, q = <input type="number" min="2" step="1" id="RSA_test_q" readonly></p>
            <p>n = <input type="number" step="1" id="RSA_test_n">, φ = (p - 1) (q - 1) = <input type="number" step="1" id="RSA_test_phi"></p>
            <p>e = <input type="number" min="2" step="1" id="RSA_test_e" readonly>, d = <input type="number" min="1" step="1" id="RSA_test_d" readonly></p>

            <p>Расшифруем: c = <input type="number" min="0" step="1" id="RSA_test_c" readonly>, тогда c в степени <input type="number" min="1" step="1" id="RSA_test_c_pow"> mod <input type="number" min="1" step="1" id="RSA_test_c_mod">: <input type="number" step="1" id="RSA_test_m" readonly></p>
        `,
        onUpdate() {
            this.localState["RSA_test_m"] = NaN;
            if (this.localState["RSA_test_phi"] == (this.localState["RSA_test_p"] - 1) * (this.localState["RSA_test_q"] - 1)) {
                this.localState["RSA_test_e"] = getDefaultExponent(this.localState["RSA_test_phi"]);
                this.localState["RSA_test_d"] = getDefaultD(this.localState["RSA_test_e"], this.localState["RSA_test_phi"]);
                if (this.localState["RSA_test_c_pow"] !== null && this.localState["RSA_test_c_mod"] == (this.localState["RSA_test_p"]) * (this.localState["RSA_test_q"])) {
                    this.localState["RSA_test_m"] = intPowMod(this.localState["RSA_test_c"], this.localState["RSA_test_c_pow"], this.localState["RSA_test_c_mod"]);
                }
            } else {
                this.localState["RSA_test_d"] = NaN;
                this.localState["RSA_test_e"] = NaN;
            }
            document.getElementById("RSA_test_e").value = this.localState["RSA_test_e"];
            document.getElementById("RSA_test_d").value = this.localState["RSA_test_d"];
            document.getElementById("RSA_test_m").value = this.localState["RSA_test_m"];
        },
        fieldChecks: {
            RSA_test_n() { return this.localState["RSA_test_n"] === this.localState["RSA_test_p"] * this.localState["RSA_test_q"]; },
            RSA_test_phi() { return this.localState["RSA_test_phi"] === (this.localState["RSA_test_p"] - 1) * (this.localState["RSA_test_q"] - 1); },
            RSA_test_c_pow() { return this.localState["RSA_test_c_pow"] === this.localState["RSA_test_d"] && !isNaN(this.localState["RSA_test_d"]); },
            RSA_test_c_mod() { return this.localState["RSA_test_c_mod"] === (this.localState["RSA_test_p"]) * (this.localState["RSA_test_q"]); },
        }
    },
    {
        title: "RSA: Свободная практика",
        freePracticeName: "RSA: практика",
        stageValues: {
            RSA_sandbox_p: { hasField: true, isNeeded: false },
            RSA_sandbox_q: { hasField: true, isNeeded: false },
            RSA_sandbox_e: { hasField: true, isNeeded: false },
            RSA_sandbox_c: { hasField: true, isNeeded: false },
            RSA_sandbox_m: { hasField: true, isNeeded: false, startValue: 1 }
        },
        content: `
            <p>Здесь можно зашифровать и расшифровать свои сообщения:</p>

            <p>p = <input type="number" min="2" step="1" id="RSA_sandbox_p">, q = <input type="number" min="2" step="1" id="RSA_sandbox_q"></p>
            <p>n = <input type="number" step="1" id="RSA_sandbox_n" readonly>, φ = (p - 1) (q - 1) = <input type="number" step="1" id="RSA_sandbox_phi" readonly></p>
            <p>e = <input type="number" min="2" step="1" id="RSA_sandbox_e">, d = <input type="number" step="1" id="RSA_sandbox_d" readonly>
            <button class="action" id="RSA_sandbox_getE">Подобрать e</button></p>
            <p id="RSA_stage_result"></p>

            <p>Зашифруем: m = <input type="number" min="0" step="1" id="RSA_sandbox_m">, тогда c = <input type="number" id="RSA_out_c" readonly></p>
            <p>Расшифруем: c = <input type="number" min="0" step="1" id="RSA_sandbox_c">, тогда m = <input type="number" id="RSA_out_m" readonly></p>
        `,
        onLoad() {
            document.getElementById("RSA_sandbox_getE").addEventListener('click', this.getStageData().onClick.bind(this), {signal: this.unneededFieldsController.signal});
        },
        onUpdate() {
            var p = this.localState["RSA_sandbox_p"], q = this.localState["RSA_sandbox_q"], e = this.localState["RSA_sandbox_e"];
            var n = p * q, phi = (p - 1) * (q - 1);

            document.getElementById("RSA_sandbox_n").value = "" + n;
            document.getElementById("RSA_sandbox_d").value = "";
            document.getElementById("RSA_out_c").value = "";
            document.getElementById("RSA_out_m").value = "";

            this.localState["RSA_sandbox_phi"] = phi;
            document.getElementById("RSA_stage_result").innerHTML = "";
            if (!isPQValid(p, q)) {
                if (p > maxValue || q > maxValue || (p * q) > maxValue) {
                    document.getElementById("RSA_stage_result").innerHTML = `Максимальное поддерживаемое значение для p, q, и их произведения: ${maxValue}`;
                } else {
                    document.getElementById("RSA_stage_result").innerHTML = "p и q должны быть различными простыми числами!";
                }
                this.localState["RSA_sandbox_phi"] = NaN;
            } else if (!isValidExp(e, phi)) {
                document.getElementById("RSA_stage_result").innerHTML = "e не подходит под p и q!";
            } else {
                document.getElementById("RSA_sandbox_m").max = document.getElementById("RSA_sandbox_c").max = n - 1;
                var m = Math.min(Math.max(this.localState["RSA_sandbox_m"], 0), n - 1);
                var c = Math.min(Math.max(this.localState["RSA_sandbox_c"], 0), n - 1);
                document.getElementById("RSA_sandbox_m").value = ""+m;
                document.getElementById("RSA_sandbox_c").value = ""+c;

                var d = getDefaultD(e, phi);
                document.getElementById("RSA_sandbox_d").value = "" + d;

                document.getElementById("RSA_out_m").value = intPowMod(c, d, n);
                document.getElementById("RSA_out_c").value = intPowMod(m, e, n);
            }
            document.getElementById("RSA_sandbox_phi").value = "" +this.localState["RSA_sandbox_phi"];
        },
        onClick() {
            var e = getDefaultExponent(this.localState["RSA_sandbox_phi"]);
            this.localState["RSA_sandbox_e"] = e;
            document.getElementById("RSA_sandbox_e").value = e;
            this.localState.save();
            this.getStageData().onUpdate.call(this);
        }
    }
];

var maxValue = Math.floor(Math.sqrt(Number.MAX_SAFE_INTEGER));

var allPrimeNumbers = [ 2 ];
function isPrimeFast(value) {
    var startListId = 0, endListId = allPrimeNumbers.length;
    if (allPrimeNumbers[endListId - 1] < value) {
        var primeAdded = false;

        for (var newI = allPrimeNumbers[endListId - 1] + 1; newI <= value || !primeAdded; newI++) {
            for (var kId = 0; kId < allPrimeNumbers.length; kId++) {
                var k = allPrimeNumbers[kId];
                if (newI % k == 0) {
                    break;
                }
                if (k * k > newI || kId == (allPrimeNumbers.length - 1)) {
                    primeAdded = true;
                    allPrimeNumbers.push(newI);
                    break;
                }
            }

        }
        return (allPrimeNumbers[allPrimeNumbers.length - 1] == value);
    }
    
    while (startListId < endListId) {
        var medId = Math.floor((startListId + endListId) / 2);
        if (allPrimeNumbers[medId] < value) {
            startListId = medId + 1;
        } else if (allPrimeNumbers[medId] > value) {
            endListId = medId - 1;
        } else {
            return true;
        }
    }

    return (startListId == endListId) && allPrimeNumbers[startListId] == value;
}

function isPrime(value) {
    if (!Number.isInteger(value) || value <= 1 || isNaN(value)) {
        return false;
    }
    return isPrimeFast(value);
}

function isPValid(p, q) {
    return (p != q) && p <= maxValue && (isNaN(q) || (q <= maxValue && (p * q) <= maxValue)) && isPrime(p);
}

function isQValid(p, q) {
    return (p != q) && q <= maxValue && (isNaN(p) || (p <= maxValue && (p * q) <= maxValue)) && isPrime(q);
}

function isPQValid(p, q) {
    return (p != q) && (!isNaN(p) && !isNaN(q) && (p <= maxValue && q <= maxValue && (p * q) <= maxValue))&& isPrime(p) && isPrime(q);
}

function intPowMod(value, exp, mod) {
    if ((value === null || mod === null || exp === null) || isNaN(exp) || isNaN(value) || isNaN(mod)) {
        return NaN;
    }

    var base = value % mod;
    var result = 1;
    var expBase = base;
    var tmpExp = exp;

    while (tmpExp > 0) {
        if (tmpExp % 2 == 1) {
            result = (result * expBase) % mod;
        }
        tmpExp = Math.floor(tmpExp / 2);
        expBase = (expBase * expBase) % mod;
    }
    
    return result;
}

function getGCD(a, b) {
    var r_0 = a, r_1 = b;
    while (r_1 != 0) {
        var tmp = r_1;
        r_1 = r_0 % r_1;
        r_0 = tmp;
    }

    return r_0;
}

function extendedGCD(a, b) {
    var r_0 = a, r_1 = b;
    var s_0 = 1, s_1 = 0;
    var t_0 = 0, t_1 = 1;

    while (r_1 != 0) {
        var quotient = Math.floor(r_0 / r_1);

        var r_next = r_0 - quotient * r_1;
        r_0 = r_1;
        r_1 = r_next;

        var s_next = s_0 - quotient * s_1;
        s_0 = s_1;
        s_1 = s_next;

        var t_next = t_0 - quotient * t_1;
        t_0 = t_1;
        t_1 = t_next;
    }

    return { gcd: r_0, s: s_0, t: t_0 };
}

function getDefaultD(e, phi) {
    if (e === null || phi === null || isNaN(phi) || phi <= 1) {
        return null;
    }

    var result = extendedGCD(e % phi, phi);

    return (Math.abs(result.gcd) !== 1) ? null : correctMod(result.s, phi);
}

function getDefaultExponent(phi) {
    if (!isNaN(phi)) {
        for (var e = 2; e < maxValue; e *= 2) {
            if (isValidExp(e + 1, phi)) {
                return e + 1;
            }
        }
        for (var e = 2; e < maxValue; e++) {
            if (isValidExp(e, phi)) {
                return e;
            }
        }
    }

    return NaN;
}

function isValidExp(e, phi) {
    return typeof e == "number" && !isNaN(phi) && e > 1 && e <= maxValue && getGCD(e, phi) == 1;
}

function isValidD(e, d, phi) {
    return typeof e == "number" && typeof d == "number" && !isNaN(phi) && d >= 1 && d <= maxValue && (e * d) % phi == 1;
}

document.addEventListener('DOMContentLoaded', () => {
    new PageApp(pageContent, 2);
});
