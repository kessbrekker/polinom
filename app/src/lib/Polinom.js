
function vidZnak(z) {
  if (z == "x") return "promenliva";
  if ((z >= "0" && z <= "9") || z == "," || z == ".") return "broj";
  if (z == "+" || z == "-" || z == "*" || z == "/" || z == "^") return "operator";
  if (z == "(" || z == ")") return "zagrada";
  if (z == " " || z == " ") return "prazno";
  if (!z) return "nishto";
  return "nedozvoleno";
}

function stringBezSpace(s) {
  let b, rezultat = "";
  for (b = 0; b < s.length; b++)
    if (vidZnak(s[b]) != "prazno") rezultat += s[b];
  return rezultat;
}

function popravi(dadeno, fraza1, fraza2) {
  let rezultat = dadeno;
  while (rezultat.indexOf(fraza1) >= 0)
    rezultat = rezultat.replace(fraza1, fraza2);
  return rezultat;
}

function superscript(celBroj) {
  return '<sup style="font-size:70%;">' + celBroj + "</sup>";
}

function subscript(celBroj) {
  return '<sub style="font-size:70%;">' + celBroj + "</sub>";
}

export class Polinom {
  constructor(dadenP) {
    this.validen = true;

    if (Array.isArray(dadenP)) {
      this.a = dadenP.slice();

      this.srediNuli();

      if (false) console.log(this.a);
    } else if (dadenP == "x") this.a = [0, 1];
    else if (!isNaN(dadenP)) this.a = [parseFloat(dadenP)];
    else {
      this.validen = false;
      if (false)
        console.log(
          "Greshka: od vlezniot podatok " +
            dadenP +
            " ne mozhe da se napravi polinom."
        );
      throw new Error(`err_processing: ${dadenP + ""}`);
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

    let i5;
    for (i5 = 0; i5 < this.a.length; i5++) if (!this.a[i5]) this.a[i5] = 0;
  }
  f(x) {
    let vrednost = 0,
      i7;

    for (i7 = this.n; i7 >= 0; i7--) vrednost = vrednost * x + this.a[i7];

    return vrednost;
  }
  soberi(p2) {
    let nMax = this.n;
    if (p2.n > nMax) nMax = p2.n;

    let zbirA = [],
      i5;

    for (i5 = 0; i5 <= nMax; i5++) {
      zbirA[i5] = this.a[i5];
      if (!zbirA[i5]) zbirA[i5] = 0;
      if (p2.a[i5]) zbirA[i5] += p2.a[i5];
    }

    return new Polinom(zbirA);
  }

  odzemi(p2) {
    let sprotivenP2 = new Polinom(p2.a);

    let i5;
    for (i5 = 0; i5 <= sprotivenP2.n; i5++)
      sprotivenP2.a[i5] = -sprotivenP2.a[i5];

    return this.soberi(sprotivenP2);
  }

  pomnozhi(p2) {
    let nProizvod = this.n + p2.n;

    let proizvodA = [],
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
    let rezultat = new Polinom([1]);

    let i5;
    // степенувањето се сведува на повторено множење m-пати
    for (i5 = 1; i5 <= m; i5++) rezultat = this.pomnozhi(rezultat);

    // степенот е полином кој го враќаме како веќе создаден објект
    return rezultat;
  }

  // делење со втор полином p2, со степен ≤ од дадениот
  podeli(p2) {
    // степенот на количникот е разлика од степените делителот и деленикот
    let nKolichnik = this.n - p2.n;

    let delenikA = [],
      kolichnikA = [],
      ostatokA = [];
    let k, i5, j5;
    let tochnost = 0.000001;
    let p2n = p2.n;

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

      if (false) {
        console.log("Ostatok od delenjeto polinomi:");
        console.log(ostatokA);
      }

      let nenultOstatok = false;
      for (j5 = p2n; j5 >= 0; j5--) if (ostatokA[j5] != 0) nenultOstatok = true;

      if (nenultOstatok) {
        if (false)
          console.log(
            "Greshka, pri delenjeto na polinomite ne se dobi polinom!"
          );
        throw new Error("err_noPolyom");
      }

      // количникот е полином кој го враќаме како новосоздаден објект
      return new Polinom(kolichnikA);
    } else {
      if (false)
        console.log("Greshka, pri delenjeto na polinomite ne se dobi polinom!");
      throw new Error("err_noPolyom");
    }
  }

  // расчленување (парсирање) на полиномот според влезен стринг s
  static raschleni(s) {
    let iznos = [],
      tipIznos = [],
      vrednostIznos = [],
      iZ = 0;
    let operator = [];

    let b, z, brZagradi;

    z = s[0];
    if (vidZnak(z) == "operator")
      throw new Error(`err_opBeginEnd: ${z}`);

    z = s[s.length - 1];
    if (vidZnak(z) == "operator")
      throw new Error(`err_opBeginEnd: ${z}`);

    for (b = 0; b < s.length - 1; b++)
      if (vidZnak(s[b]) == "operator" && vidZnak(s[b] + 1) == "operator")
        throw new Error("err_2op");

    brZagradi = 0;
    for (b = 0; b < s.length; b++) {
      // го зголемуваме или намалуваме бројот на загради во длабочина,
      // во зависност дали се отвораат или затвораат
      if (s[b] == "(") brZagradi++;
      if (s[b] == ")") brZagradi--;

      if (brZagradi < 0) throw new Error("err_parentheses");
    }

    if (brZagradi != 0) throw new Error("err_parentheses");

    if (s.indexOf("()") >= 0) throw new Error("err_parenthesesEmpty");

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
        if (false) console.log("IzraZZ: ", iznos[iZ]);
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
        if (false) console.log("Greshka: vo izrazot ima nedozvolen znak " + z);
        throw new Error(`err_unknownSymbol: ${z}`);
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

    if (false) {
      console.log("\nBroj na iznosi: ", iZ);
      console.log(iznos);
      console.log(tipIznos);
      console.log(operator);
    }

    // овде завршува расчленувањето на изразот, па одиме на пресметување
    // на изразот, при што броевите и променливата ги заменуваме
    // со полиноми, а изразите во заграда ги пресметуваме рекурзивно

    let i5;
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
        if (false)
          console.log("Greshka: neprepoznaen tip na izrazot " + iznos[i5]);
        throw new Error(`err_processing: ${iznos[i5]}`);
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
            if (false)
              console.log(
                "Greshka: stepenoviot pokazatel ja sodrzhi promenlivata x, toj e " +
                  vrednostIznos[i5 + 1].obichenString
              );
            throw new Error(`err_exp_x: ${vrednostIznos[i5 + 1].obichenString}`);
          }

          let stPokazatel = vrednostIznos[i5 + 1].a[0];

          if (Math.abs(stPokazatel) != parseInt(stPokazatel + "", 10)) {
            if (false)
              console.log(
                "Greshka: stepenoviot pokazatel ne e priroden broj, toj e " +
                  stPokazatel
              );
            throw new Error(`err_expNoNatural: ${stPokazatel + ""}`);
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
            if (false) console.log("Greshka: delenje so nula.");
            throw new Error("err_div0");
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

    let i9;
    // поправка на сите цифри допрени со x или заграда со множење *
    for (i9 = 0; i9 <= 9; i9++) {
      s = popravi(s, i9 + "x", i9 + "*x");
      s = popravi(s, "x" + i9, "x*" + i9);
      s = popravi(s, i9 + "(", i9 + "*(");
    }

    if (false) console.log("Sreden polinom: \n", s, "\n");

    // откако сме готови со средувањето, се оди на расчленувањето
    // и на враќање на резултатот од него!
    return this.raschleni(s);
  }

  // создавање на елегантен математички запис на полиномот во HTML формат
  get matematichkiHTML() {
    let rezultatHTML = "",
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
    let rezultatString = "",
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
