"use strict";

function uprostiPolinom() {
  var vnes = document.getElementById("vnes");

  vnes.selectionStart = vnes.selectionEnd;

  vnes.classList.add("zlatenSjaj");
  setTimeout(function () {
    vnes.classList.remove("zlatenSjaj");
  }, 700);

  // var pText = "(x+1) ^3";
  pText = vnes.value;

  try {
    errSymbol = "";
    aktivenPolinom = { validen: false };
    aktivenPolinom = Polinom.generiraj(pText);
  } catch (err) {
    var greshkaPole = document.getElementById("greshka_ili_izlez");
    greshkaPole.style.color = "#D91002"; // темно црвена, боја за грешка

    greshkaPole.innerHTML =
      "<b>" + (jazik[izbranJazik].err || jazik.err) + " <b>";
    greshkaPole.innerHTML += jazik[izbranJazik][err] || jazik[err] || err; // "";
    greshkaPole.innerHTML += errSymbol;
  } finally {
    var PxPole = document.getElementById("Px");
    var matematichkiIzlezPole = document.getElementById("matematichki_izlez");

    var reshenieRavenka = document.getElementById("reshenie_ravenka");
    reshenieRavenka.innerHTML = "";

    if (aktivenPolinom.validen) {
      var greshkaPole = document.getElementById("greshka_ili_izlez");
      greshkaPole.style.color = "#000000"; // црна
      greshkaPole.innerHTML =
        jazik[izbranJazik].izlez_upatstvo || jazik.izlez_upatstvo;

      PxPole.style.opacity = "1"; // целосно видливо

      matematichkiIzlezPole.innerHTML = aktivenPolinom.matematichkiHTML;

      var reshenieObjasnenie, pkoefA, pkoefB, pkoefC, diskriminanta, xx1, xx2;

      if (aktivenPolinom.n == 0) {
        pkoefA = aktivenPolinom.a[0] + "";
        pkoefA = popravi(pkoefA, ".", ",");
        pkoefA = popravi(pkoefA, "-", "–&#8288;");

        reshenieObjasnenie = jazik[izbranJazik].reshenie_C || jazik.reshenie_C;
        reshenieObjasnenie = reshenieObjasnenie.replace("xx1", pkoefA);

        reshenieRavenka.innerHTML += reshenieObjasnenie;
      }

      if (aktivenPolinom.n == 1) {
        pkoefA = aktivenPolinom.a[1];
        pkoefB = aktivenPolinom.a[0];

        xx1 = -pkoefB / pkoefA;
        xx1 = xx1 + "";
        xx1 = popravi(xx1, ".", ",");
        xx1 = popravi(xx1, "-", "–&#8288;");

        reshenieObjasnenie =
          jazik[izbranJazik].reshenie_lin || jazik.reshenie_lin;
        reshenieObjasnenie = reshenieObjasnenie.replace("xx1", xx1);

        reshenieRavenka.innerHTML += reshenieObjasnenie;
      }

      if (aktivenPolinom.n == 2) {
        pkoefA = aktivenPolinom.a[2];
        pkoefB = aktivenPolinom.a[1];
        pkoefC = aktivenPolinom.a[0];

        diskriminanta = pkoefB * pkoefB - 4 * pkoefA * pkoefC;

        if (diskriminanta > 0) {
          diskriminanta = Math.sqrt(diskriminanta);
          xx1 = (-pkoefB + diskriminanta) / (2 * pkoefA);
          xx1 = xx1 + "";
          xx1 = popravi(xx1, ".", ",");
          xx1 = popravi(xx1, "-", "–&#8288;");
          xx2 = (-pkoefB - diskriminanta) / (2 * pkoefA);
          xx2 = xx2 + "";
          xx2 = popravi(xx2, ".", ",");
          xx2 = popravi(xx2, "-", "–&#8288;");

          reshenieObjasnenie =
            jazik[izbranJazik].reshenie_kv_razlichni ||
            jazik.reshenie_kv_razlichni;

          reshenieObjasnenie = reshenieObjasnenie.replace("xx1", xx1);
          reshenieObjasnenie = reshenieObjasnenie.replace("xx2", xx2);
        } else if (diskriminanta == 0) {
          xx1 = -pkoefB / (2 * pkoefA);
          xx1 = xx1 + "";
          xx1 = popravi(xx1, ".", ",");
          xx1 = popravi(xx1, "-", "–&#8288;");

          reshenieObjasnenie =
            jazik[izbranJazik].reshenie_kv_dvoen || jazik.reshenie_kv_dvoen;

          reshenieObjasnenie = reshenieObjasnenie.replace("xx1", xx1);
        } // diskriminanta < 0
        else {
          reshenieObjasnenie =
            jazik[izbranJazik].reshenie_kv_nemaR || jazik.reshenie_kv_nemaR;
        }

        reshenieRavenka.innerHTML += reshenieObjasnenie;
      }

      grafik.nacrtajKS();
      grafik.nacrtajGrafik();

      setCookie("Ax", pText);
      setCookie("KS", aktivenKS);

      setTimeout(function () {
        dodajPrimer(pText, "vashi");
      }, 700);
    } else {
      PxPole.style.opacity = "0.3";

      matematichkiIzlezPole.innerHTML = "";

      grafik.nacrtajKS();
    }
  }
}
class Polinom {
  constructor(dadenP) {
    this.validen = true;

    if (Array.isArray(dadenP)) {
      this.a = dadenP.slice();

      this.srediNuli();

      if (deBUG) console.log(this.a);
    } else if (dadenP == "x") this.a = [0, 1];
    else if (!isNaN(dadenP)) this.a = [parseFloat(dadenP)];
    else {
      this.validen = false;
      if (deBUG)
        console.log(
          "Greshka: od vlezniot podatok " +
            dadenP +
            " ne mozhe da se napravi polinom."
        );
      if (throwErr) {
        errSymbol = dadenP + "";
        throw "err_processing";
      }
    }
  }
  get n() {
    return this.a.length - 1;
  }

  srediNuli() {
    while (
      this.a.length > 0 &&
      (!this.a[this.a.length - 1] || this.a[this.a.length - 1] == 0)
    )
      this.a.pop();

    if (this.a.length == 0) this.a.push(0);

    var i5;
    for (i5 = 0; i5 < this.a.length; i5++) if (!this.a[i5]) this.a[i5] = 0;
  }
  f(x) {
    var vrednost = 0,
      i7;

    for (i7 = this.n; i7 >= 0; i7--) vrednost = vrednost * x + this.a[i7];

    return vrednost;
  }
  soberi(p2) {
    var nMax = this.n;
    if (p2.n > nMax) nMax = p2.n;

    var zbirA = [],
      i5;

    for (i5 = 0; i5 <= nMax; i5++) {
      zbirA[i5] = this.a[i5];
      if (!zbirA[i5]) zbirA[i5] = 0;
      if (p2.a[i5]) zbirA[i5] += p2.a[i5];
    }

    return new Polinom(zbirA);
  }

  odzemi(p2) {
    var sprotivenP2 = new Polinom(p2.a);

    var i5;
    for (i5 = 0; i5 <= sprotivenP2.n; i5++)
      sprotivenP2.a[i5] = -sprotivenP2.a[i5];

    return this.soberi(sprotivenP2);
  }

  pomnozhi(p2) {
    var nProizvod = this.n + p2.n;

    var proizvodA = [],
      i5,
      j5;

    // на почетокот ги поставуваме сите коефициенти на
    // производот да се нули, за да можеме после да додаваме
    for (i5 = 0; i5 <= nProizvod; i5++) proizvodA[i5] = 0;

    for (i5 = 0; i5 <= this.n; i5++)
      for (j5 = 0; j5 <= p2.n; j5++)
        proizvodA[i5 + j5] += this.a[i5] * p2.a[j5];
    // го додаваме производот на двата коефициенти на претходниот збир
    // така во коефициентот 3 на производот ќе учествуваат
    // p_0*q_3 + p_1*q_2 + p_2*q_1 + p_3*q_0

    // производот е полином кој го враќаме како новосоздаден објект
    return new Polinom(proizvodA);
  }

  // степенување на природен број m
  stepenuvaj(m) {
    // резултатот на почетокот е 1, за да го опфатиме и случајот
    // со степенување со 0, кога било што на нулти степен е 1
    var rezultat = new Polinom([1]);

    var i5;
    // степенувањето се сведува на повторено множење m-пати
    for (i5 = 1; i5 <= m; i5++) rezultat = this.pomnozhi(rezultat);

    // степенот е полином кој го враќаме како веќе создаден објект
    return rezultat;
  }

  // делење со втор полином p2, со степен ≤ од дадениот
  podeli(p2) {
    // степенот на количникот е разлика од степените делителот и деленикот
    var nKolichnik = this.n - p2.n;

    var delenikA = [],
      kolichnikA = [],
      ostatokA = [];
    var k, i5, j5;
    var tochnost = 0.000001;
    var p2n = p2.n;

    if (nKolichnik >= 0) {
      // најпрвин кај деленикот го копираме дадениот полином што сакаме да го делиме
      delenikA = this.a.slice();

      // делиме од највисок степен кон 0
      for (i5 = nKolichnik; i5 >= 0; i5--) {
        // одредување на коефициентот на количникот
        k = delenikA[i5 + p2n] / p2.a[p2n];
        kolichnikA[i5] = k;

        // почнуваме со ресетиран остаток
        ostatokA = [];
        for (j5 = p2n; j5 >= 0; j5--) {
          ostatokA[i5 + j5] = delenikA[i5 + j5] - k * p2.a[j5];
          // заокружување на малите децимални броеви на 0,
          // загради непрецзното делење
          if (Math.abs(ostatokA[i5 + j5]) < tochnost) ostatokA[i5 + j5] = 0;
        }

        // копирање на неупотребените делови од деленикот кај остатокот
        for (j5 = i5 - 1; j5 >= 0; j5--) ostatokA[j5] = delenikA[j5];

        // за следниот индекс i5, остатокот станува нов деленик!
        delenikA = ostatokA;
      } // for i5

      if (deBUG) {
        console.log("Ostatok od delenjeto polinomi:");
        console.log(ostatokA);
      }

      var nenultOstatok = false;
      for (j5 = p2n; j5 >= 0; j5--) if (ostatokA[j5] != 0) nenultOstatok = true;

      if (nenultOstatok) {
        if (deBUG)
          console.log(
            "Greshka, pri delenjeto na polinomite ne se dobi polinom!"
          );
        if (throwErr) throw "err_noPolyom";
      }

      // количникот е полином кој го враќаме како новосоздаден објект
      return new Polinom(kolichnikA);
    } else {
      if (deBUG)
        console.log("Greshka, pri delenjeto na polinomite ne se dobi polinom!");
      if (throwErr) throw "err_noPolyom";
    }
  }

  // расчленување (парсирање) на полиномот според влезен стринг s
  static raschleni(s) {
    var iznos = [],
      tipIznos = [],
      vrednostIznos = [],
      iZ = 0;
    var operator = [];

    var b, z, brZagradi;

    z = s[0];
    if (vidZnak(z) == "operator")
      if (throwErr) {
        errSymbol = z;
        throw "err_opBeginEnd";
      }

    z = s[s.length - 1];
    if (vidZnak(z) == "operator")
      if (throwErr) {
        errSymbol = z;
        throw "err_opBeginEnd";
      }

    for (b = 0; b < s.length - 1; b++)
      if (vidZnak(s[b]) == "operator" && vidZnak(s[b] + 1) == "operator")
        if (throwErr) throw "err_2op";

    var brZagradi = 0;
    for (b = 0; b < s.length; b++) {
      // го зголемуваме или намалуваме бројот на загради во длабочина,
      // во зависност дали се отвораат или затвораат
      if (s[b] == "(") brZagradi++;
      if (s[b] == ")") brZagradi--;

      if (brZagradi < 0) if (throwErr) throw "err_parentheses";
    }

    if (brZagradi != 0) if (throwErr) throw "err_parentheses";

    if (s.indexOf("()") >= 0) if (throwErr) throw "err_parenthesesEmpty";

    for (b = 0; b < s.length; b++) {
      iznos[iZ] = "";
      z = s[b];

      if (z == "(") {
        // имаме израз во загради, кој треба да го
        // одделиме од остатокот од стрингот
        tipIznos[iZ] = "zagrada";

        // броиме колку загради има
        brZagradi = 1;

        while (brZagradi > 0) {
          b++;
          iznos[iZ] += s[b];

          // го зголемуваме или намалуваме бројот на загради во длабочина,
          // во зависност дали се отвораат или затвораат
          if (s[b] == "(") brZagradi++;
          if (s[b] == ")") brZagradi--;
        } // одделување на израз во загради

        // го отстрануваме последниот карактер, кој мора да е затворена заграда )
        iznos[iZ] = iznos[iZ].slice(0, -1);
        if (iznos[iZ] == "") iznos[iZ] = "0";
        if (deBUG) console.log("IzraZZ: ", iznos[iZ]);
      } else if (vidZnak(z) == "promenliva") {
        tipIznos[iZ] = "promenliva";
        iznos[iZ] += z;
      } else if (vidZnak(z) == "broj") {
        tipIznos[iZ] = "broj";
        iznos[iZ] += z;
        // го земаме бројот со сите негови знаци
        while (vidZnak((z = s[b + 1])) == "broj") {
          iznos[iZ] += z;
          b++;
        }
      } else {
        if (deBUG) console.log("Greshka: vo izrazot ima nedozvolen znak " + z);
        if (throwErr) {
          errSymbol = z;
          throw "err_unknownSymbol";
        }
      }

      // ако е исцрпен стрингот до крај, да излеземе од for b циклусот
      if (b + 1 == s.length) break;
      else {
        // ако не е исцрпен стрингот до крај, земаме нов карактер
        // и очекуваме тој да е оператор
        b++;
        z = s[b];

        if (vidZnak(z) == "operator") {
          operator[iZ] = z;
        }
      }

      // стрингот не е исцрпен до крај, очекуваме нов износ
      iZ++;
    } // for b

    if (deBUG) {
      console.log("\nBroj na iznosi: ", iZ);
      console.log(iznos);
      console.log(tipIznos);
      console.log(operator);
    }

    // овде завршува расчленувањето на изразот, па одиме на пресметување
    // на изразот, при што броевите и променливата ги заменуваме
    // со полиноми, а изразите во заграда ги пресметуваме рекурзивно

    var i5;
    for (i5 = 0; i5 <= iZ; i5++) {
      if (tipIznos[i5] == "broj")
        vrednostIznos[i5] = new Polinom(parseFloat(iznos[i5]));
      else if (tipIznos[i5] == "promenliva")
        // тогаш знаеме дека променливата е всушност x
        vrednostIznos[i5] = new Polinom(iznos[i5]);
      else if (tipIznos[i5] == "zagrada")
        // ако е израз во загради, РЕКУРЕНТНО го повикуваме
        // методот Polinom.raschleni за да добиеме вредност
        vrednostIznos[i5] = this.raschleni(iznos[i5]);
      else {
        if (deBUG)
          console.log("Greshka: neprepoznaen tip na izrazot " + iznos[i5]);
        if (throwErr) {
          errSymbol = iznos[i5];
          throw "err_processing";
        }
      }
    } // for i5
    // после овој циклус, сите вредности на износите
    // веќе ни се претворени во облик на објект Polinom
    // console.log(vrednostIznos);

    // Ако има само еден износ, нема потреба за операции,
    // тој е всушност резултатот на методот raschleni
    if (iZ == 0) return vrednostIznos[0];

    // Ако се повеќе вредности, останува уште да ги извршиме
    // операциите меѓу вредностите, кои се полиноми, но по приоритет
    while (operator.length > 0) {
      for (i5 = 0; i5 < operator.length; i5++)
        // најприоритетна е операцијата на степенување
        if (operator[i5] == "^") {
          if (vrednostIznos[i5 + 1].n > 0) {
            if (deBUG)
              console.log(
                "Greshka: stepenoviot pokazatel ja sodrzhi promenlivata x, toj e " +
                  vrednostIznos[i5 + 1].obichenString
              );
            if (throwErr) {
              errSymbol = vrednostIznos[i5 + 1].obichenString;
              throw "err_exp_x";
            }
          }

          var stPokazatel = vrednostIznos[i5 + 1].a[0];

          if (Math.abs(stPokazatel) != parseInt(stPokazatel + "", 10)) {
            if (deBUG)
              console.log(
                "Greshka: stepenoviot pokazatel ne e priroden broj, toj e " +
                  stPokazatel
              );
            if (throwErr) {
              errSymbol = stPokazatel + "";
              throw "err_expNoNatural";
            }
          }

          //console.log("Pred operacija ^ ", vrednostIznos);
          vrednostIznos[i5] = vrednostIznos[i5].stepenuvaj(stPokazatel);
          //console.log("Stepenuvanje: ", vrednostIznos[i5].a);
          otstraniIndex(i5);
          //console.log("Posle operacija ^ ", vrednostIznos);

          // за спедната проверка на операција да започне на истото место
          i5--;
        }

      for (i5 = 0; i5 < operator.length; i5++) {
        // втори по приоритет се множењети и делењето
        if (operator[i5] == "*") {
          vrednostIznos[i5] = vrednostIznos[i5].pomnozhi(vrednostIznos[i5 + 1]);
          otstraniIndex(i5);
          i5--;
        }

        if (operator[i5] == "/") {
          if (vrednostIznos[i5 + 1].obichenString == "0") {
            if (deBUG) console.log("Greshka: delenje so nula.");
            if (throwErr) throw "err_div0";
          }

          vrednostIznos[i5] = vrednostIznos[i5].podeli(vrednostIznos[i5 + 1]);
          otstraniIndex(i5);
          i5--;
        }
      }

      for (i5 = 0; i5 < operator.length; i5++) {
        // на крајот со најмал приоритет се собирањето и одземањето
        if (operator[i5] == "+") {
          vrednostIznos[i5] = vrednostIznos[i5].soberi(vrednostIznos[i5 + 1]);
          otstraniIndex(i5);
          i5--;
        }

        if (operator[i5] == "-") {
          vrednostIznos[i5] = vrednostIznos[i5].odzemi(vrednostIznos[i5 + 1]);
          otstraniIndex(i5);
          i5--;
        }
      }

      //break;
    }

    // помошна функција за скратување на низата операции
    // и пресметани износи
    function otstraniIndex(i6) {
      operator.splice(i6, 1);
      vrednostIznos.splice(i6 + 1, 1);
      // кај вредностите, резултатот е на местото на левиот
      // оператор, додека десниот го бришеме
    }

    // после извршените операции по правилниот редослед на
    // приоритети, заклучуваме дека се работи за валиден полином,
    // а конечниот резултат од изразот s се наоѓа
    // како полином во vrednostIznos[0]
    vrednostIznos[0].validen = true;
    return vrednostIznos[0];

    //      rezultat = this.pomnozhi(rezultat);
  } // raschleni, статичка + рекурзивен метод

  // генерирање на полином според влезен стринг s, првин со
  // средување на влезниот стринг за множење без знак * ,
  // а потоа со расчленување (парсирање) на полиномот
  static generiraj(s) {
    // најпрвин само средуваме!!
    // бришење на празните места
    s = popravi(s, " ", "");

    // ги поправаме големите букви X во мали букви x,
    // а исто така и евентуалните кирилични букви Х и х
    s = popravi(s, "X", "x");
    s = popravi(s, "Х", "x");
    s = popravi(s, "х", "x");

    // ги поправаме децималните запирки , во децимални точки .
    // заради подоцнежно парсирање во американски стил
    s = popravi(s, ",", ".");

    // сите цртички ги сметаме за минуси
    s = popravi(s, "–", "-");
    s = popravi(s, "–", "-");

    // унарните минуси -израз се сведуваат на одземање 0-израз
    if (s.substr(0, 1) == "-") s = "0" + s;
    s = popravi(s, "(-", "(0-");

    // ги сметаме операторите × за множење и : за делење
    s = popravi(s, "×", "*");
    s = popravi(s, ":", "/");

    // поправка на множењето со додавање на * кога имаме загради
    s = popravi(s, ")(", ")*(");
    s = popravi(s, "x(", "x*(");
    s = popravi(s, ")x", ")*x");
    s = popravi(s, "xx", "x*x");

    var i9;
    // поправка на сите цифри допрени со x или заграда со множење *
    for (i9 = 0; i9 <= 9; i9++) {
      s = popravi(s, i9 + "x", i9 + "*x");
      s = popravi(s, "x" + i9, "x*" + i9);
      s = popravi(s, i9 + "(", i9 + "*(");
    }

    if (deBUG) console.log("Sreden polinom: \n", s, "\n");

    // откако сме готови со средувањето, се оди на расчленувањето
    // и на враќање на резултатот од него!
    return this.raschleni(s);
  }

  // создавање на елегантен математички запис на полиномот во HTML формат
  get matematichkiHTML() {
    var rezultatHTML = "",
      i5,
      k;

    for (i5 = this.n; i5 >= 0; i5--) {
      // додаваме HTML код само за ненултите индекси
      if (this.a[i5] != 0) {
        // најпрвин го ставаме знакот со обичен фонт
        if (rezultatHTML == "")
          if (this.a[i5] < 0) rezultatHTML = "–";
          else rezultatHTML = "";
        else if (this.a[i5] < 0) rezultatHTML += " –&#8288;&nbsp;";
        // ако има прекршување во следен ред, да е ПРЕД знакот
        else rezultatHTML += " +&#8288;&nbsp;";

        // после знакот следува самиот коефициент, кој го пишуваме пред x само
        // ако не е 1, а кога е слободен член посекако го пишуваме
        k = Math.abs(this.a[i5]);
        if (k != 1 || i5 == 0) rezultatHTML += k;

        // после коефициентот следува променливата x со италик фонт
        if (i5 > 0) rezultatHTML += "<i>x</i>";

        // најпосле, после променливата x го имаме нејзиниот експонент,
        // но само ако се работи за степен поголем од 1
        if (i5 > 1) rezultatHTML += superscript(i5);
        // rezultatHTML += "<sup style=\"font-size:70%;\">" + i5 + "</sup>";
        // во зависност од фонтот, освен со таг, е можно и со вградени експоненти вака:
        // rezultatHTML += superscript2(i5);
      }
    } //for i5

    // специјален случај за нулти полином
    if (rezultatHTML == "") rezultatHTML = "0";

    // на крајот, ги поправаме децималните точки со запирки за европски изглед
    rezultatHTML = popravi(rezultatHTML, ".", ",");

    return rezultatHTML;
  }

  // создавање на обичен математички запис на полиномот како обичен стринг
  get obichenString() {
    var rezultatString = "",
      i5,
      k;

    for (i5 = this.n; i5 >= 0; i5--) {
      // додаваме текст само за ненултите индекси
      if (this.a[i5] != 0) {
        // најпрвин го ставаме знакот со обичен фонт
        if (rezultatString == "")
          if (this.a[i5] < 0) rezultatString = "–";
          else rezultatString = "";
        else if (this.a[i5] < 0) rezultatString += " – ";
        else rezultatString += " + ";

        // после знакот следува самиот коефициент, кој го пишуваме пред x само
        // ако не е 1, а кога е слободен член посекако го пишуваме
        k = Math.abs(this.a[i5]);
        if (k != 1 || i5 == 0) rezultatString += k;

        // после коефициентот следува променливата x
        if (i5 > 0) rezultatString += "x";

        // најпосле, после променливата x го имаме нејзиниот експонент,
        // додаден со операција ^ но само ако се работи за степен поголем од 1
        if (i5 > 1) rezultatString += "^" + i5;
      }
    } //for i5

    // специјален случај за нулти полином
    if (rezultatString == "") rezultatString = "0";

    // на крајот, ги поправаме децималните точки со запирки за европски изглед
    rezultatString = popravi(rezultatString, ".", ",");

    return rezultatString;
  }
} // class Polinom

// помошна функција за одредување на видот на знакот
// кој е дел од влезниот стринг
function vidZnak(z) {
  if (z == "x") return "promenliva";
  if ((z >= "0" && z <= "9") || z == "," || z == ".") return "broj";
  if (z == "+" || z == "-" || z == "*" || z == "/" || z == "^")
    return "operator";
  if (z == "(" || z == ")") return "zagrada";
  if (z == " " || z == " ") return "prazno";
  if (!z) return "nishto";
  // ако има знак, но поинаков од обработените, тоа не е дозволено
  return "nedozvoleno";
}

// помошна функција за отстранување на празните места од влезниот стринг,
// за полесно да се споредува со другите стрингови
function stringBezSpace(s) {
  var b,
    rezultat = "";

  for (b = 0; b < s.length; b++)
    if (vidZnak(s[b]) != "prazno") rezultat += s[b];

  return rezultat;
}

// помошна функција за поправање на дел од влезниот алгебарски
// израз со операции, најчесто се користи за повторно воведување
// на испуштеното множење со оператор *
function popravi(dadeno, fraza1, fraza2) {
  var rezultat = dadeno;
  while (rezultat.indexOf(fraza1) >= 0)
    rezultat = rezultat.replace(fraza1, fraza2);
  return rezultat;
}

// помошна функција за претворање на целобројниот експонент
// од обичен број во superscript, варијанта во HTML
function superscript(celBroj) {
  return '<sup style="font-size:70%;">' + celBroj + "</sup>";
}

// варијанта за експонент без HTML, со посебни карактери
function superscript2(celBroj) {
  celBroj = "" + celBroj;
  var rezultat = "",
    iSup;
  for (iSup = 0; iSup < celBroj.length; iSup++)
    rezultat += "⁰¹²³⁴⁵⁶⁷⁸⁹"[+celBroj[iSup]];
  return rezultat;
}

// помошна функција за претворање на целобројниот индекс
// од обичен број во subscript, варијанта во HTML
function subscript(celBroj) {
  return '<sub style="font-size:70%;">' + celBroj + "</sub>";
}

/*
var p = new Polinom([1, 2, 0, 2]);
var q = new Polinom([0, , 0, 2, ]);

console.log(p.soberi(q))
console.log(p.odzemi(q))
*/

/*
var p = new Polinom([1, -2]);

console.log(p.pomnozhi(p).pomnozhi(p))
console.log(p.stepenuvaj(5))
*/

/*
console.log(new Polinom("x"));

Polinom.raschleni("123+(2)-3");

console.log(Polinom.raschleni("2^3^2"));
console.log(Polinom.raschleni("(1+2*x)^2"));

console.log(Polinom.raschleni("(1+x)*(1-x)*(x^2+1)"));
console.log(Polinom.generiraj("(1+x)(-x+1)(xx +1)"));
*/

if (deBUG) {
  //console.log(Polinom.generiraj("x^6/x^2").matematichkiHTML);
  //console.log(Polinom.generiraj("(x^6-1)/(x^2-1)"));
  //console.log(Polinom.generiraj("(x^6-1)^2/(2x^2-2)").matematichkiHTML);
  console.log(Polinom.generiraj("2x").matematichkiHTML);
  //console.log("\nPolinomot kako obichen string:");
  //console.log(Polinom.generiraj("(x^6-1)^2/(2x^2-2)").obichenString);

  var PP = Polinom.generiraj("(-2+x+1) ^3");
  console.log(PP.a);
  console.log("Treba da e 5^3=125:", PP.f(6));
  console.log("\nPolinomot kako obichen string:");
  console.log(PP.obichenString);
  console.log("\nPolinomot regeneriran od obichen string:");
  PP = Polinom.generiraj(PP.obichenString);
  console.log(PP.obichenString);

  //console.log(superscript("12309"))
}
