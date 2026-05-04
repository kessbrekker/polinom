
'use strict';



function aktiviranPrimer(primerAx, spodelenKS) {

  var vnes = document.getElementById("vnes");


  dodajPrimer(vnes.value, "vashi");

  vnes.value = primerAx;
  korigirajDolzhina();
  aktivenPolinom.validen = false; 


  if (spodelenKS)
    grafik.izberiKS(spodelenKS);

  uprostiPolinom();

}; 
function razniPrimeri() {

  var s, s1, s2, s3, s4, s5;
  var p1, p2, p3;


  do {

  s = "x";

  if (procentualenTF(25)) {

    s1 = izberiCelBroj (-1000, 1000);
    if (s1 == 0)
      s1 = 100;
    s1 = s1/100;

    if (procentualenTF(25))
      s1 = s1 + "*";

    s2 = izberiCelBroj (-400, 400);
    s2 = s2/100;
    if (s2<0)
      s2 = " - " + (-s2);
    else
      s2 = " + " + s2;

    s = s1 + s + s2;

  }
  else if (procentualenTF(70)) {

    s1 = izberiOdNiza(["", "", "", "-", "-", "2", "2*", "-2", "3", "10", "10*", "4", "5*", "-5", "0,2", "0,5", "0,7", "-0,5*", "1,5", "-2,5", "3,2", "20", "-6,4"]);

    if (procentualenTF(30)) {

      s4 = izberiOdNiza(["x", "-x", "2x", "-2x", "1", "-1", "4x", "0,5x", "2", "7", "-3", "5"]);
      if (s1[0] == "-")
        s1 = s4 + " - " + s1.slice(1)
      else
        s1 = s4 + " + " + s1;
    };

    s2 = izberiOdNiza(["1", "1", "0", "-1", "-1", "2", "2", "-2", "3", "10", "-3", "4", "-4", "-5", "0,3", "0,5", "0,83", "-0,5", "1,5", "-1,5", "2,7", "2,08", "-2,4"]);

    if (procentualenTF(30)) {

      s2 = izberiCelBroj (-10000, 10000);
      s2 = s2/1000;
      s2 = s2 + "";
      s2 = popravi(s2, ".", ",");

    };

    if (s2[0] == "-")
      s2 = " - " + s2.slice(1)
    else
      s2 = " + " + s2;

    s = s1 + s + s2;

  }
  else {

    // најнеобични линеарни примери за крај

    s1 = izberiOdNiza(["x^2 / x", "x + x", "(10:5)x", "-(-x)", "-(1/2)x", "(1/4)x", "0,666x", "x^3 / x^2", "x - x", "0*x", "(2x)/3", "x/5", "x / (1 + 1)", "x/10", "-x/2", "x / (-4)", "2^2x", "x / 10^2", "3x / 5^2"]);

    s2 = izberiOdNiza(["", "", " + 0", " + 1", " + x/x", "+ (1 + 1)", " + 0,5", " - 1", " - 0,5", " + 2", " - 0,5", " + 0,3", "- 0,7", " - (-1)", " - (-2)", " - (10/5)", " + 2^2", " - 2^3", " - (1/2)^2", " + (1/5)^2", " + 4x / (2x)", " + 0,5×7", " + 1 + 2 + 3", " + 2 - 3", " + 0*100", " - x/x", " + (x + x)/x", " - (3:2)", " - 0,5^3", " - 4*4/10"]);

    s = s1 + s2;

  };

  if (procentualenTF(15)) {

    s3 = izberiOdNiza(["/ 2", "/ 3", "/ 5", "/ 10", "/ (2 + 3)", "/ (5 * 2)", "/ 100", "/ (-2)", "/ (-10)", "/ (3 - 1)"]);
    s = "(" + s + ") " + s3;

  };

  } while (najdolgiDecimali (s)>8); // да се повтори постапката ако се добил незгоден децимален број со многу децимали (и до 15)

  dodajPrimer(s, "razni");


  do {

  // Со вториот пример се генерира квадратна функција
  s = "x";

  if (procentualenTF(40)) {

    s1 = izberiOdNiza(["", "", "", "-", "-", "2", "-2", "0,5", "0,3", "-0,5", "-0,2", "1,2", "10", "0,25", "0,6", "2,5", "0,1", "-0,1", "-1,1"]);

    s2 = izberiCelBroj (-45, 45);
    s2 = s2/10;

    if (s2<0)
      s2 = " - " + (-s2);
    else
      s2 = " + " + s2;

    s3 = izberiCelBroj (-50, 50);
    if (s3 == 0)
      s3 = 20;
    s3 = s3/10;

    if (s3<0)
      s3 = " - " + (-s3);
    else
      s3 = " + " + s3;

    s = s1 + "(x" + s2 + ")" + "(x" + s3 + ")";

    if (procentualenTF(70)) {
      // наместо разложен полином, генерираме производ како текст
      p1 = Polinom.generiraj(s);
      s = p1.obichenString;
    };

  }
  else if (procentualenTF(80)) {

    s2 = izberiOdNiza(["x", "x", "-x", "2*x", "2(x - 1)", "(x + 1)", "(x + 2)", "(2x + 1)", "(x^2/x - 1)", "(1/2)*x", "-0,5x", "0,3x", "(2x + 3)", "(2x - 3)", "(2x - 2)", "(5x - 1)", "(4x + 3)", "(x + x - 4)", "(4x - 3x - 2)"]);

    s3 = izberiOdNiza(["(x - 1)", "(x + 1)", "(x - 2)", "(-x + 1)", "(-x - 2)", "(x + 2)", "(x - 3)", "(x + 3)", "(2x + 1)", "(2x + 3)", "(2*x - 3)", "(3x - 6)", "(5x - 1)", "(x - 0,2)", "(4x - 1)", "(x + 3,3)", "(0,5x - 1)"]);
    //s3 = izberiOdNiza(["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""]);

    s = s2 + s3;

    if (procentualenTF(40)) {
      // наместо разложен полином, генерираме производ како текст
      p1 = Polinom.generiraj(s);
      s = p1.obichenString;
    };

  }

  else {

    // најнеобични квадратни примери за крај

    s = izberiOdNiza(["(x - 1)(x + 1)", "(x + 2)(x - 2)", "(x + 1)^2", "(x - 1)^2", "2x^2 - 2", "(x - 2)^2", "-(x - 2)^2", "-x^2", "x^2", "0,1*x^2", "0,2*(x - 2)*(x - 2 - 3)", "(1/6)(x + 2)(x - 3)", "(x - 0,7)(x + 0,7)", "(x - 0,7)(x + 0,7)", "-x^3/x", "(x^3 - 1)/(x - 1)", "x^5 / x^3 - 2,5", "-(2x + 7)*(2x - 7)"]);

    if (procentualenTF(38)) {
      // наместо разложен полином, генерираме производ како текст
      p1 = Polinom.generiraj(s);
      s = p1.obichenString;
    };

  };

  if (procentualenTF(10)) {

    s3 = izberiOdNiza(["/ 2", "/ 5", "/ 10", "/ 20", "/ 100", "/ (-2)", "/ (-10)", "/ (1 - 6)", "/ 2^2", " * 2", " * (-1,5)"]);
    s = "(" + s + ") " + s3;

  };
  } while (najdolgiDecimali (s)>10); // да се повтори постапката ако се добил незгоден децимален број со многу децимали (и до 15)

  // s3 = izberiOdNiza(["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""]);
  dodajPrimer(s, "razni");


  do {

  // Со третиот пример се генерира полином од трет, четврт или петти степен
  s = "x";

  if (procentualenTF(75)) {

    s1 = izberiOdNiza(["x", "x", "x^2", "-x", "-x^2", "-2*x", "2x", "2(x - 1)", "(x + 1)", "(x + 2)", "(2x + 1)", "(x^2 - 1)", "-0,5x", "0,4x", "(2x - 3)", "(2x^2 - 2)", "(5x - 4)", "(5x + 3)"]);

    s2 = izberiOdNiza(["(x - 1)", "(x + 1)", "(x - 2)", "(1 - x)", "(-x - 2)", "(x + 2)", "(x - 3)", "(x + 3)", "(2x + 1)", "(2x + 3)", "(2*x - 3)", "(3x - 6)", "(5x - 1)", "(x - 0,7)", "(x + 4,1)", "(0,5x - 2)"]);
    s3 = izberiOdNiza(["(x - 1)", "(x + 1)", "(x - 2)", "(-x + 1)", "(x + 2)", "(x - 3)", "(x + 3)", "(2x + 5)", "(3 - 2x)", "(2x - 3)", "(3x - 6)", "(5x - 1)", "(x - 1,4)", "(2,4 - x)", "(0,5x + 2)"]);
    //s3 = izberiOdNiza(["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""]);

    s = s1 + s2 + s3;

    if (procentualenTF(32)) {
      // наместо разложен полином, генерираме производ како текст
      p1 = Polinom.generiraj(s);
      s = p1.obichenString;
    };

  }
  else {
    // пократки примери од трет, четврт или петти степен

    s = izberiOdNiza(["x^3", "-x^3", "x^4", "-x^4", "x^3 + x", "x^3 + x^2 + x" + "x^4 - 1", "3 - x^4", "x^5 - x^3", "-x^3", "x^3", "-x^3/3", "x^4/40", "x^3 - 9x", "x^4 - 4x^2 + 4", "0,05*x^5", "x^3 - 6x^2 + 11x - 6", "x^3 -3x^2 -x + 3", "x^4 - 10x^3 + 35x^2 - 50x + 24"]);

  }
  } while (najdolgiDecimali (s)>10); // да се повтори постапката ако се добил незгоден децимален број со многу децимали (и до 15)

  dodajPrimer(s, "razni"); //najdolgiDecimali (primerS)


  // Четвртиот пример е наменет да демонстрира степенување
  s = "x";

  s2 = izberiOdNiza(["x", "x", "(x^2)", "(-x)", "(-x^2)", "(-2x)", "(2x)", "(x + x)", "(x + 1)", "(x + 2)", "(1 - x)", "(5 - 2x)", "(2x + 1)",
                      "(x^2 - 1)", "(-0,5x)", "(0,2x)", "(10x - 5)", "(2x^2 - 1)", "(5x - 2)", "(5x + 3)", "(x^3 - 1)", "(x^2 + x + 1)", "(x^2 - x + 1)", "(x^2 + 2x + 3)", "(x^2 + 10)", "(1 + x - x^2)", "(x + x + 5)"]);

  s3 = izberiOdNiza(["^2", "^2", "^3", "^3", "^3", "^(2+2)", "^4", "^5", "^(10:2)", "^6", "^7", "^(3 + 4)", "^8", "^(2^3)", "^9", "^(3^2)", "^10", "^(2*5)", "^11", "^10", "^12", "^(3*4)", "^12", "^15"]);

  s1 = "";
  s4 = "";

  if (procentualenTF(22)) {
    s1 = izberiOdNiza(["-", "1 - ", "2", "2*", "-2", "3", "0,5", "5", "(1/3)", "10", "(1/10)", "-1,4*", "(-1/10)", "-2 + ", "7 - 2"]);
  }
  else if (procentualenTF(18)) {
    s4 = izberiOdNiza([" - 1", " - 4", " + 1", " + 2", " / 2", " / (-2)", " * (5/2)", " / 3", " * 2", " / 5", " / 10", " / 100", "/ 10^2", " / 2^3", " / (-10)"]);
  };

  s = s1 + s2 + s3 + s4;

  dodajPrimer(s, "razni");


  do {

  // Петтиот пример е наменет да демонстрира делење на полиноми
  s = "x";

  s1 = izberiOdNiza(["", "", "", "", "", "", "", "", "-", "-", "-", "-", "2", "-2", "3", "10", "-5", "4", "x", "-x", "x^2", "-x^2", "2x", "(1 - x)", "x^3", "-x^2", "(2x + 3)", "(4 - x^2)", "(x + 3)", "(x - 3)", "(x - 2)", "(2x + 7)", "(2x - 1)", "(2x - 5)", "(x^3 + 1)"]);

  s2 = izberiOdNiza(["x", "x", "(x^2)", "(-x)", "(-x^2)", "(-2x)", "(2x)", "(x + 1)", "(x + 2)", "(1 - x)", "(5 - 2x)", "(2x + 1)",
                      "(x^2 - 1)", "(2 - 5x)", "(x - 3)", "(10x - 5)", "(2x^2 - 1)", "(5x - 2)", "(5x + 3)", "(x^3 - 1)", "(x^2 + x + 1)", "(x^2 - x + 1)", "(x^2 + 2x + 3)", "(x^2 + 10)", "(1 + x - x^2)", "(x^2 + 3x + 5)"]);

  s3 = izberiOdNiza(["x", "x", "(x^2)", "(x^3)", "(1 - x^2)", "(-2x)", "(2x)", "(2x^2)", "(x + 1)", "(x + 2)", "(1 - x)", "(5 - 2x)", "(2x + 1)",
                     "(-x)", "(-x^2)", "(x^2 - 1)", "(2 - 5x)", "(x - 3)", "(10x - 5)", "(2x^3 - 1)", "(5x - 2)", "(5x + 6)", "(x^3 - 1)", "(x^2 + x + 1)", "(x^2 - x + 1)", "(x^2 + 2x + 3)", "(10 - x^2)",
                     "(1 + x - x^2)", "(x^2 + x - 6)", "(x^3 - x)", "(x^3 - x^2 + x - 1)", "(x^5 + 5)", "(16 - x^4)", "(x^3 + x^2 - 14x - 24)", "(x^4 - 4x^2 + 4)", "(x^3 + 2x^2 - 5x - 6)", "(-x^4 + 6x^3 - 11x^2 + 6x)"]);

  if (procentualenTF(55)) {

    p1 = Polinom.generiraj(s1 + s2 + s3);
    s = "(" + p1.obichenString + ") / " + s3;

  } else if (procentualenTF(60)) {

    p1 = Polinom.generiraj(s1 + s2 + s3);
    p3 = Polinom.generiraj(s1 + s3);
    s = "(" + p1.obichenString + ") / (" + p3.obichenString + ")";

  } else {

    p1 = Polinom.generiraj(s1 + s2 + s3);
    p3 = Polinom.generiraj(s2);
    s = "(" + p1.obichenString + ") / " + s2;

  };
  } while (s.length>57); // не дозволуваме ептен големи стрингови кои би ја надминале ширината на левата половина

  dodajPrimer(s, "razni");

}

// додавање на копче со пример за алгебарски израз, дали кај „Ваши примери“
// со кои експериментирал корисникот, или кај „Разни примери“ што се
// автоматски генерирани со погорната функција
function dodajPrimer(primerAx, kade) {

  var primerKopche, primerKontejner, primerPrefix, i5;

  // kopcheKS = document.createElement("button");
  // kopcheKS.setAttribute("class", "izberiKS_kopche");
  // kopcheKS.setAttribute("onclick", "grafik.izberiKS(this.innerText)");
  // kopcheKS.innerHTML = "<div>" + listaIzborKS[i3] + "</div>";

  primerAx = popravi(primerAx, ".", ",");
  primerAx = popravi(primerAx, "-", "–");


  var primerVekjeIma = false;
  var primerAxBezSpace = stringBezSpace(primerAx);

  if (primerAxBezSpace == "")
    primerVekjeIma = true;

  // Проверка дали примерот веќе постои кај постоечките копчиња
  for (i5=0; i5<razniPrimeriNiza.length; i5++)
    if (stringBezSpace(razniPrimeriNiza[i5].Ax) == primerAxBezSpace)
      primerVekjeIma = true;

  for (i5=0; i5<vashiPrimeriNiza.length; i5++)
    if (stringBezSpace(vashiPrimeriNiza[i5].Ax) == primerAxBezSpace)
      primerVekjeIma = true;

  // ако примерот веќе си постои, нема потреба да додаваме копче и функцијата
  // се враќа назад
  if (primerVekjeIma)
    return;


  //document.getElementById("razni_primeri").innerHTML += primerAx + "<br/>";
  // stringBezSpace(s)

  try {
    var probenPx = {validen: false};
    primerPrefix = "A(x) = ";
    probenPx = Polinom.generiraj(primerAx);
  }
  catch(err) {
    primerPrefix = "<b style=\"color:#D91002;\">#</b> ";
  };

  primerKopche = document.createElement("button");
  primerKopche.setAttribute("class", "primer_rasteglivo");

  // primerKopche.class = "primer_rasteglivo";
  // primerKopche.setAttribute("onclick", "grafik.izberiKS(this.innerText)");
  primerKopche.innerHTML = "<span><em><div>" + primerPrefix + primerAx + "</div></em></span>";
  // <button class="primer_rasteglivo"><span><em><div>A(x) = x</div></em></span></button>

  primerKopche.Ax = primerAx;
  primerKopche.setAttribute("onclick", "aktiviranPrimer(this.Ax)");

  if (kade=="razni") {
    razniPrimeriNiza.push(primerKopche);
    document.getElementById("razni_primeri").append(primerKopche);
    document.getElementById("razni_primeri_text").innerHTML = jazik[izbranJazik].razni_primeri || jazik.razni_primeri;
  }
  else {
    vashiPrimeriNiza.push(primerKopche);
    document.getElementById("vashi_primeri").prepend(primerKopche);
    document.getElementById("vashi_primeri_text").innerHTML = jazik[izbranJazik].vashi_primeri || jazik.vashi_primeri;
  };

}; // function dodajPrimer


// Помошна функција за случаен избор на една вредност од
// дадени вредности, во облик на низа
function izberiOdNiza(niza) {

  var i5 = Math.floor(Math.random() * niza.length);
  return niza[i5];

}; // function izberiOdNiza


// Помошна функција за случаен избор на цел број
// од зададен затворен интервал [min, max]
function izberiCelBroj (min, max) {

  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; // Двете вредности за минимум и максимум можат да се вклучат

}; // function izberiCelBroj


// Помошна функција што враќа true со веројатност од procent%
// а во спротивно враќа false со веројатност од (100-procent)%
function procentualenTF (procent) {

  return (Math.random() < (procent/100));

}; // function procentualenTF


// Пронаоѓање на бројот со најдолги децимали, кои можат да се и 16 во JavaScript,
// но тактивте коефициенти со премногу децимали изгледаат ГРДО и со мерењето на
// најдолгите децимали меѓу коефициентите во еден генериран пример, тој пример
// може да се отфрли ако има коефициент со премногу децимали
function najdolgiDecimali (primerS) {

  var najdolgiDec = 0, momentalnoDec = 0, i4;

  for (i4 = 0; i4<primerS.length; i4++) {
    if (vidZnak(primerS[i4])=="broj") {

      momentalnoDec++ ;
      if (momentalnoDec > najdolgiDec)
        najdolgiDec = momentalnoDec;

    }
    else
      momentalnoDec = 0;
  };

  return najdolgiDec;

} // function najdolgiDecimali
