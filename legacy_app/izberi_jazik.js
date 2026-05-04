// Избор на јазик на корисничкиот интерфејс, при што главни јазици се македонски и англиски,
// а има превод и на албански, турски и српски кои се користат во образованието во Република Македонија

//
"use strict";

// Проверка на поддржаните јазици кај прелистувачот (browser)
// console.log("Jazici kaj prelistuvachot:");
// console.log(navigator.languages);

var dozvoleniSimboli = "  0123456789Xx𝓍џЏ()[]{},.+-––×*^:/"; // вториот симбол е &nbsp
var zalepenoEdnakvo = "&#8288;&nbsp;&#8288;=&#8288;&nbsp;&#8288;"; // за да нема прекршување кај знакот =
var izbranJazik,
  listaJazici = ["tr"];
var meni_IzborKS,
  listaIzborKS = ["4 × 4", "10 × 10", "20 × 20", "60 × 60", "200 × 200"];
var grafik,
  aktivenKS,
  pText,
  aktivenPolinom = { validen: false };
var ispratiKopche, dozvoliPriem_checkBox, dozvoliPriemText;
var vashiPrimeriNiza = [],
  razniPrimeriNiza = [];

// Дали да се печатат меѓурезултатите во конзолата, за дебагирање?
var deBUG = false;

// Дали да се фрлаат исклучоци? Може не за дебагирање, треба да за продукциски код
var throwErr = true,
  errSymbol = "";

// Уште на почетокот гледаме дали во URL адресата има некои параметри
var url = new URL(location.href);
// var url = new URL('http://www.test.com/t.html?a=1&b=3&c=m2%20-m3-m4-m5');
var searchParams = new URLSearchParams(url.search);
// console.log(searchParams.get('c'));
// alert(searchParams.get('c'));

// izbranJazik = "";
// првин го вчитуваме избраниот јазик од колачето, од претходната сесија
izbranJazik = getCookie("izbranJazik");

/*
console.log(izbranJazik);
console.log("aa" || "bb");
console.log("aa" || undefined);
console.log(undefined || "bb");
*/

var i3, j3, mozhenJazik;

// ако нема постоечки јазик во колачето, се зема параметарот lang од URL линкот
if (!izbranJazik && searchParams.has("lang")) {
  mozhenJazik = searchParams.get("lang").slice(0, 2);
  // console.log("Mozhen jazik: ", mozhenJazik);
  j3 = listaJazici.indexOf(mozhenJazik);
  if (j3 > 0) {
    // избран е јазикот!
    izbranJazik = mozhenJazik;
  }
}

// ако и натаму е избран јазик, се зема најповолниот од прелистувачот
if (!izbranJazik) {
  for (i3 = 0; i3 < navigator.languages.length; i3++) {
    mozhenJazik = navigator.languages[i3].slice(0, 2);
    // console.log("Mozhen jazik: ", mozhenJazik);
    j3 = listaJazici.indexOf(mozhenJazik);
    if (j3 > 0) {
      // избран е јазикот!
      izbranJazik = mozhenJazik;
      break; // за излез од циклусот for i3
    }
  } // for i3

  // ако и покрај сè не е избран јазик, се подразбира англиски
  if (!izbranJazik) izbranJazik = "tr";
}

// избраниот јазик го запишуваме во колаче, кое трае 400 дена = година и кусур
setCookie("izbranJazik", izbranJazik, 400);
if (deBUG) console.log("Izbran jazik e: " + izbranJazik);

/*
var jazik=[];
jazik["en"]=[];
jazik.en[2]="Two";
console.log(jazik);
console.log(jazik["en"]["2"]);
*/
//
var jazik = [];
jazik["en"] = [];
jazik["mk"] = [];
jazik["sr"] = [];
jazik["sq"] = [];
jazik["tr"] = [];



jazik.ID = jazik["tr"] = {
  ID: "TÜRKÇE",
  znamence: "https://cdn.glitch.com/429fec58-e1bb-4ee7-9767-9a46102751a0%2Ftr.png?1520095692265",
  naslov: "CEBRİSEL İFADELERİ POLİNOM BİÇİMİNE İNDİRGEME (Ancak uygun olduğunda çalışır.)    Said Başara - Eren Kaylı - Rayan Küçük*",
  vnes_upatstvo: "Cebirsel ifadeyi, *bilgi veren gösterim biçimini kullanarak girin*: ",
  izlez_upatstvo: "Elde edilen polinom, *matematiksel gösterimi* kullanarak: ",
  reshenie_C: "Herhangi bir <i>x</i> değeri için aynı değere P(<i>x</i>) sahip, sabit bir polinom (sıfırıncı dereceden) elde edilir." + zalepenoEdnakvo + "xx1.",
  reshenie_lin: "Birinci dereceden bir lineer polinom elde edilir. Lineer denklem P(<i>x</i>)" + zalepenoEdnakvo + "0'ın bir kökü vardır ve bu kökün değeri <i>x</i>" + zalepenoEdnakvo + "xx1.'dir.",
  reshenie_kv_razlichni: "İkinci dereceden bir kare polinom elde edilir. Kare denklem P(<i>x</i>)" + zalepenoEdnakvo + "0'ın iki farklı gerçek kökü vardır ve bu köklerin değerleri <i>x</i><sub style=\"font-size:70%;\">1</sub>" + zalepenoEdnakvo + "xx1 ve <i>x</i><sub style=\"font-size:70%;\">2</sub>" + zalepenoEdnakvo + "xx2.'dir.",
  reshenie_kv_dvoen: "İkinci dereceden bir kare polinom elde edilir. Kare denklem P(<i>x</i>)" + zalepenoEdnakvo + "0'ın bir çift gerçek kökü vardır ve bu kökün değeri <i>x</i><sub style=\"font-size:70%;\">1</sub>" + zalepenoEdnakvo + "<i>x</i><sub style=\"font-size:70%;\">2</sub>" + zalepenoEdnakvo + "xx1.'dir.",
  reshenie_kv_nemaR: "İkinci dereceden bir kare polinom elde edilir. Kare denklem P(<i>x</i>)" + zalepenoEdnakvo + "0'ın gerçek kökü yoktur.",
  vashi_primeri: "Sizin örnekleriniz:",
  razni_primeri: "Çeşitli örnekler:",
  isprati: "Herkese gönderin!",
  dozvoli_priem: "Diğer bilgisayarlardan alıma izin ver",
  err: "Hata!",
  err_processing: "Girdiğiniz verilerden polinom oluşturmak mümkün değil",
  err_noPolyom: "Polinom bölme işleminin sonucu polinom değildir.",
  err_opBeginEnd: "Girdiğiniz ifadenin başında ve/veya sonunda ikili bir operatör kullanılamaz, burada ise var: ",
  err_2op: "İki tane ikili operatör yan yana kullanılamaz.",
  err_parentheses: "Parantezlerin sıralaması hatalı.",
  err_parenthesesEmpty: "Boş parantezler var.",
  err_unknownSymbol: "Girdiğiniz verilerde bilinmeyen bir sembol var: ",
  err_exp_x: "Üste, <i>x</i> değişkenini içeremez, burada ise değeri: ",
  err_expNoNatural: "Üste, doğal bir sayı olmalıdır, burada ise değeri: ",
  err_div0: "Sıfıra bölme var"
};
// функцијата за додавање на динамички елементи се извршува ПОСЛЕ целосното
// вчитување на body и извршувањето на претходните обични скрипти што
// не се дел од функција. Со оваа функција динамички го креираме менито
// за избор на јазик, при што најгоре е постоечкиот јазик
function dodajDinamichkiElementi() {
  // return;

  document.getElementById("naslov").innerHTML =
    jazik[izbranJazik].naslov || jazik.naslov;
  document.getElementById("vnes_upatstvo").innerHTML =
    jazik[izbranJazik].vnes_upatstvo || jazik.vnes_upatstvo;

  // динамичко креирање на менито за избор на јазик
  dodajMeniJazik();

  // динамичко креирање на 5 „Разни примери“ на полиноми: линеарен, квадратен,
  // од 3-4 степен, пример со повисок степен и посложен пример со делење
  razniPrimeri();

  // динамичко креирање на менито за избор на координатен систем
  dodajMeniIzborKS();

  // динамичко додавање на копчето за испраќање на полиномот кај сите
  // и на чек-боксот за дозвола на прием од други компјутери
  dodajIspratiKopche();

  aktivenPolinom = { validen: false };
  aktivenKS = getCookie("KS");
  // alert("Претходен координатен систем: " + aktivenKS);
  grafik = new Grafik("grafik_canvas");

  // го активираме последниот успешно обработен полином, запамтен во колаче за сесијата
  pText = getCookie("Ax");
  // pText="(x+1) ^3";
  aktivenPolinom = { validen: false };
  if (pText != undefined) {
    aktivenPolinom = Polinom.generiraj(pText);
    // alert("Zapamten polinom: " + pText);
    aktiviranPrimer(pText, aktivenKS);
  }
}

// Со оваа функција динамички го креираме менито
// за избор на јазик, при што најгоре е постоечкиот јазик
function dodajMeniJazik() {
  var meni_Jazik = document.getElementById("meni_jazik");
  var i3,
    j3,
    meniHTML = "";

  var meni_listaJazici = [izbranJazik]; // прв елемент на листата на јазици во менито е избраниот
  // а понатаму јазиците си се по стандардниот редослед
  for (i3 = 0; i3 < listaJazici.length; i3++)
    if (listaJazici[i3] != izbranJazik) meni_listaJazici.push(listaJazici[i3]);

  for (i3 = 0; i3 < meni_listaJazici.length; i3++)
    meniHTML +=
      '<li onclick="smeniJazik(&quot;' +
      meni_listaJazici[i3] +
      '&quot;)"><img src=' +
      jazik[meni_listaJazici[i3]].znamence +
      "/>" +
      jazik[meni_listaJazici[i3]].ID +
      "</li>";
  // <li onclick="smeniJazik(&quot;mk&quot;)"><img src="ikoni/mk.png"/>МАКЕДОНСКИ</li>

  // meniHTML += "<li><img src=\"ikoni/" + listaJazici[i3] + ".png\"/>" + jazik[listaJazici[i3]].ID + "</li>";
  // <li><img src="ikoni/mk.png"/>МАКЕДОНСКИ</li>

  // откако е составен големиот стринг за праѓачкото мени за избор на јазик,
  // одеднаш го ставаме како внатрешен HTML
  meni_Jazik.innerHTML = meniHTML;
}

function smeniJazik(novJazik) {
  if (deBUG) console.log("Treba da se smeni jazikot vo " + novJazik);

  if (novJazik == izbranJazik) {
    // нема потреба да се менува јазикот, но ќе му се укаже на корисникот за кликот
    var j3 = document.getElementsByTagName("li")[0];
    // j3.innerHTML="***";
    // j3.style.transitionProperty = "none";
    //j3.style.backgroundColor = "#FEC"; // не може да се смени додека е hover

    //j3.transition: all .5s ease;
    //j3.style.transition = "all 1s";
    //j3.style.backgroundColor = "#FFF";
    // j3.style.color = "#0EC"; // не може да се смени додека е hover
    //j3.style.color = "#000"; // не може да се смени додека е hover

    j3.classList.add("zlatenSjaj");
    setTimeout(function () {
      j3.classList.remove("zlatenSjaj");
    }, 700);
  } else {
    // состојбата на чекбоксот за примање ја запишуваме во колаче
    var dozvoliPriem10 = dozvoliPriem_checkBox.checked ? "1" : "0";
    setCookie("dozvoliPriem", dozvoliPriem10);

    // новиот јазик го запишуваме во колаче
    setCookie("izbranJazik", novJazik, 400);
    // за да фатат промените на јазикот, го превчитуваме одново целиот HTML документ
    location.reload();
  }
}

// Со оваа функција динамички го креираме менито за избор
// на координатен систем, кое се наоѓа горе-десно над графикот
function dodajMeniIzborKS() {
  // нема var бидејќи meni_IzborKS е глобална променлива
  meni_IzborKS = document.getElementById("izberiKS_flex");
  var i3,
    kopcheKS,
    meniHTML = "";

  for (i3 = 0; i3 < listaIzborKS.length; i3++) {
    kopcheKS = document.createElement("button");
    kopcheKS.setAttribute("class", "izberiKS_kopche");
    kopcheKS.setAttribute("onclick", "grafik.izberiKS(this.innerText)");
    kopcheKS.innerHTML = "<div>" + listaIzborKS[i3] + "</div>";
    // <button class="izberiKS_kopche" onclick="grafik.izberiKS(this.innerText)"><div>4 × 4</div></button>

    // динамички создаденото копче го ставаме како дел од менито,
    // при што автоматски си добива следен индекс
    meni_IzborKS.appendChild(kopcheKS);
  }
} // dodajMeniIzborKS

// динамичко додавање на копчето за испраќање на полиномот кај сите, заедно
// со преактивираниот чек-боксот за дозвола на прием од други компјутери
function dodajIspratiKopche() {
  var ispratiFlex = document.getElementById("isprati_flex");

  ispratiKopche = document.createElement("button");
  ispratiKopche.setAttribute("class", "izberiKS_kopche");
  ispratiKopche.setAttribute("id", "isprati_kopche");
  ispratiKopche.setAttribute("onclick", "ispratiPolinom()");
  ispratiKopche.innerHTML =
    "<div>" + (jazik[izbranJazik].isprati || jazik.isprati) + "</div>";
  // ispratiKopche.innerHTML = "<div>" + "4x4" + "</div>";

  // динамички создаденото копче го ставаме одлево во флекс контејнерот под графикот
  ispratiFlex.appendChild(ispratiKopche);
  // meni_IzborKS.appendChild(ispratiKopche);

  //, dozvoliPriem_checkBox;

  var dozvoliPriemDiv = document.createElement("div");
  dozvoliPriemDiv.setAttribute("id", "dozvoliPriem_div");
  dozvoliPriemDiv.setAttribute("class", "squaredTwo");

  dozvoliPriem_checkBox = document.createElement("input");
  dozvoliPriem_checkBox.type = "checkbox";
  dozvoliPriem_checkBox.name = "name";
  dozvoliPriem_checkBox.value = "value";
  dozvoliPriem_checkBox.id = "squaredTwo";
  dozvoliPriem_checkBox.onchange = "dozvoliPriem_smeneto(this)";
  dozvoliPriem_checkBox.setAttribute("onchange", "dozvoliPriem_smeneto(this)");

  var dozvoliPriem_label1 = document.createElement("label");
  dozvoliPriem_label1.htmlFor = "squaredTwo";
  dozvoliPriem_label1.className = "squaredTwo_label";

  // dozvoliPriem_label2
  dozvoliPriemText = document.createElement("label");
  dozvoliPriemText.htmlFor = "squaredTwo";
  dozvoliPriemText.id = "dozvoliPriem_text";
  dozvoliPriemText.appendChild(
    document.createTextNode(
      jazik[izbranJazik].dozvoli_priem || jazik.dozvoli_priem
    )
  );

  var dozvoliPriem10 = getCookie("dozvoliPriem");
  if (dozvoliPriem10 == undefined) dozvoliPriem10 = "1";
  dozvoliPriem_checkBox.checked = dozvoliPriem10 == "1";

  dozvoliPriemDiv.appendChild(dozvoliPriem_checkBox);
  dozvoliPriemDiv.appendChild(dozvoliPriem_label1);
  // dozvoliPriemDiv.appendChild(dozvoliPriem_label2);

  ispratiFlex.appendChild(dozvoliPriemDiv);
  ispratiFlex.appendChild(dozvoliPriemText);
} // function dodajIspratiKopche

function dozvoliPriem_smeneto(dP_checkBox) {
  var dozvoliPriem10 = dP_checkBox.checked ? "1" : "0";
  setCookie("dozvoliPriem", dozvoliPriem10);
  // alert ("Дозволи прием е кликнато!");
} // function dozvoliPriem_smeneto

// готова функција за запишување на колаче
function setCookie(c_name, value, exdays) {
  var exdate = new Date();
  exdate.setDate(exdate.getDate() + exdays);
  var c_value =
    escape(value) +
    (exdays == undefined ? "" : "; expires=" + exdate.toUTCString());
  document.cookie = c_name + "=" + c_value;
}

// готова функција за читање на колаче
function getCookie(c_name) {
  var i,
    x,
    y,
    ARRcookies = document.cookie.split(";");
  for (i = 0; i < ARRcookies.length; i++) {
    x = ARRcookies[i].substr(0, ARRcookies[i].indexOf("="));
    y = ARRcookies[i].substr(ARRcookies[i].indexOf("=") + 1);
    x = x.replace(/^\s+|\s+$/g, "");
    if (x == c_name) {
      return unescape(y);
    }
  }

  // ако нема колече, да врати резултат дека не е дефинирано
  return undefined;
}

function korigirajDolzhina(kb_event) {
  var input = document.getElementById("vnes");
  // console.log("Proverka dali e validen karakter.");
  // console.log(input, kb_event);

  //var

  //if (kb_event.code == "KeyX")
  //  kb_event.key = "x";

  // ако навистина функцијата е активирана со внес од тастатура
  if (kb_event) {
    if (kb_event.key == "Enter") {
      // му го одземаме фокусот на копчето за влез
      input.blur();
      uprostiPolinom();

      // набрзо му го враќаме фокусот на копчето за влез
      setTimeout(function () {
        input.focus();
      }, 1600);

      return;
    }

    // Коригирање на внесот, дали содржи само дозволени симболи
    if (!kb_event.ctrlKey && kb_event.key.length == 1)
      if (dozvoleniSimboli.indexOf(kb_event.key) < 0) {
        kb_event.preventDefault();
        if (deBUG) console.log("Vneseniot znak ne e validen.");
        return false;
      }
  }

  // скриптата за коригирање должина е земена од овој линк
  // https://stackoverflow.com/questions/7168727/make-html-text-input-field-grow-as-i-type

  var min = 200,
    max = 594,
    pad_right = -4;

  // console.log("Korigiranje na dolzhinata.");
  // var input = this;
  setTimeout(function () {
    var tmp = document.createElement("div");
    tmp.style.padding = "0";
    if (getComputedStyle)
      tmp.style.cssText = getComputedStyle(input, null).cssText;
    if (input.currentStyle) tmp.style = input.currentStyle;
    tmp.style.width = "";
    tmp.style.position = "absolute";
    tmp.innerHTML = input.value
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;")
      .replace(/ /g, "&nbsp;");
    input.parentNode.appendChild(tmp);
    var width = tmp.clientWidth + pad_right + 1;
    tmp.parentNode.removeChild(tmp);
    if (min <= width && width <= max) input.style.width = width + "px";
    else if (width < min) input.style.width = min + "px";
    else input.style.width = max + "px";

    if (deBUG) console.log("Dolzhina na vnesot: " + input.style.width);
    // alert("Dolzhina na vnesot: " + input.style.width);
  }, 2);

  return true;
}

// Коригирање на внесот, ако евентуално се paste-ира поголем текст одеднаш
function korigirajPoPaste(kb_event) {
  // регуларен израз, само за бројки
  //  !(/^[0-9]*$/i).test(input.value) ? input.value = input.value.replace(/[^0-9]/ig, '') : null;

  //  !(/[0-9][Xx\(\ \)\,\.\+\-\–\–\×\*\:\/]/).test(input.value) ? input.value = input.value.replace(/[^0-9]/ig, '') : null;

  if (deBUG) console.log("Korigiranje na vnesot posle paste-iranje.");
  var input = document.getElementById("vnes");

  var s = input.value;

  // заради можноста од paste-ирање на голем текст со недозволени
  // симболи, тоа го поправаме уште веднаш!
  // ги поправаме големите букви X во мали букви x,
  // а исто така и евентуалните кирилични букви Х, х, џ и Џ
  s = popravi(s, "X", "x");
  s = popravi(s, "Х", "x");
  s = popravi(s, "х", "x");
  s = popravi(s, "𝓍", "x");
  s = popravi(s, "џ", "x");
  s = popravi(s, "Џ", "x");
  // s = popravi(s, "x", "𝓍");

  // ги поправаме заградите
  s = popravi(s, "[", "(");
  s = popravi(s, "{", "(");
  s = popravi(s, "]", ")");
  s = popravi(s, "}", ")");

  // ги поправаме децималните точки . во децимални точки ,
  // за изгледот да е во европски стил
  // s = popravi(s, ".", ",");

  // го поправаме &nbsp во обично space
  s = popravi(s, " ", " ");

  // ги ставаме сите недозволени симболи во низа
  var nedozvoleniSimboli = [],
    i4;
  for (i4 = 0; i4 < s.length; i4++)
    if (dozvoleniSimboli.indexOf(s[i4]) < 0) nedozvoleniSimboli.push(s[i4]);

  // а потоа ги бришеме
  for (i4 = 0; i4 < nedozvoleniSimboli.length; i4++)
    s = popravi(s, nedozvoleniSimboli[i4], "");

  // после направените поправки, ја враќаме средената вредност во копчето за влез
  input.value = s;

  return;

  // Застарен дел од оваа функција, кој е префрлен во функцијата korigirajDolzhina

  if (!kb_event.ctrlKey && kb_event.key.length == 1)
    if (" 12345".indexOf(kb_event.key) < 0) {
      kb_event.preventDefault();
      if (deBUG) console.log("Vneseniot znak ne e validen.");
      return false;
    }

  return true;
}
