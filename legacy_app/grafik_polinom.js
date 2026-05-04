"use strict";

class Grafik {
  constructor(elementGrafikId) {
    this.grafik = document.getElementById(elementGrafikId);
    this.G = this.grafik.getContext("2d");

    if (deBUG) {
      this.G.lineWidth = 0.5;

      this.G.moveTo(-10, 0);
      this.G.lineTo(200, 100);
      this.G.lineTo(250, 100);
      this.G.stroke();

      //var ctx = c.getContext("2d");
      this.G.beginPath();
      this.G.arc(95, 50, 70, 0, 2 * Math.PI);
      this.G.stroke();
    }

    // this.izberiKS("10 × 10");
    this.izberiKS(aktivenKS || "10 × 10");
    // this.nacrtajKS();
    // this.nacrtajGrafik();
  } // constructor

  // избирање на координатен систем под графикот, преку
  // копчињата што се над платното на графикот
  izberiKS(textKS) {
    aktivenKS = textKS;
    if (deBUG) console.log("Izbran e koordinaten sistem " + aktivenKS);
    // console.log(meni_IzborKS.children);

    // запамтување на активниот координатен систем во колаче
    setCookie("KS", aktivenKS);

    var i4, m4;

    for (i4 = 0; i4 < meni_IzborKS.children.length; i4++) {
      m4 = meni_IzborKS.children[i4];
      if (m4.innerText == textKS) m4.disabled = true;
      else m4.disabled = false;
    }

    this.oskaStrchi = 20;
    this.brojkaStrchi = 4;

    switch (textKS) {
      case "4 × 4": //case "4 × 4":
        this.x1 = -2;
        this.y1 = -2;
        this.x2 = 2;
        this.y2 = 2;
        this.xReckaChekor = 0.2;
        this.yReckaChekor = 0.2;
        this.xBrojka = [-2, -1, 1, 2];
        this.yBrojka = [-2, -1, 1, 2];
        break;

      case "20 × 20":
        this.x1 = -10;
        this.y1 = -10;
        this.x2 = 10;
        this.y2 = 10;
        this.xReckaChekor = 1;
        this.yReckaChekor = 1;
        this.xBrojka = [-10, -5, 5, 10];
        this.yBrojka = [-10, -5, 5, 10];
        break;

      case "60 × 60":
        this.x1 = -30;
        this.y1 = -30;
        this.x2 = 30;
        this.y2 = 30;
        this.xReckaChekor = 5;
        this.yReckaChekor = 5;
        this.xBrojka = [-30, -20, -10, 10, 20, 30];
        this.yBrojka = [-30, -20, -10, 10, 20, 30];
        break;

      case "200 × 200":
        this.x1 = -100;
        this.y1 = -100;
        this.x2 = 100;
        this.y2 = 100;
        this.xReckaChekor = 10;
        this.yReckaChekor = 10;
        this.xBrojka = [-100, -50, 50, 100];
        this.yBrojka = [-100, -50, 50, 100];
        break;

      default:
        //case "10 × 10":
        this.x1 = -5;
        this.y1 = -5;
        this.x2 = 5;
        this.y2 = 5;
        this.xReckaChekor = 1;
        this.yReckaChekor = 1;
        this.xBrojka = [-5, -4, -3, -2, -1, 1, 2, 3, 4, 5];
        this.yBrojka = [-5, -4, -3, -2, -1, 1, 2, 3, 4, 5];
        break;
    }

    this.nacrtajKS();
    if (aktivenPolinom.validen) this.nacrtajGrafik();
  } // izberiKS

  // добивање на физичка x-координата од логичката (релативната) x-координата
  x(logichkaX) {
    return 25.5 + ((logichkaX - this.x1) * 600) / (this.x2 - this.x1);
  }

  // добивање на физичка y-координата од логичката (релативната) y-координата
  // оваа функција е различна од функцијата за x, за да овозможи надградба
  // на web-страницата со правоаголен график
  y(logichkaY) {
    return 25.5 + ((logichkaY - this.y2) * 600) / (this.y1 - this.y2);
  }

  // обратно: добивање на логичката x-координата од физичката
  // која има вредности од 0 до this.grafik.width+1 (ја сметаме како поместена за -0.5)
  logichkaX(fizichkaX) {
    return this.x1 + ((fizichkaX - 25 - 1) * (this.x2 - this.x1)) / 600;
  }

  // цртање на координатен систем и координатна мрежа под графикот
  nacrtajKS(textKS) {
    if (deBUG) console.log("Crtam koordinaten sistem so nula na ", this.x(0));

    var i9, x9, xStrelka, yStrelka;
    var textKoordinata,
      fontKoordinata = "bold 20px 'Book Antiqua', 'Times New Roman', serif";
    var tochnost = 0.0000001;

    // пополнување на позадината на графикот со радијален градиент од центална бела боја
    // до небесносина боја покрај рабовите
    var gradient = this.G.createRadialGradient(
      this.grafik.width / 2,
      this.grafik.height / 2,
      400,
      this.grafik.width / 2,
      this.grafik.height / 2,
      0
    );
    //console.log("Gradient:", this.grafik.width);
    gradient.addColorStop(0, "#BBEEFF");
    gradient.addColorStop(0.35, "#FFFFFF");
    gradient.addColorStop(1, "#FFFFFF");
    this.G.fillStyle = gradient;
    this.G.fillRect(0, 0, this.grafik.width, this.grafik.height);

    // цртање на вертикалните линии од координатната мрежа
    this.G.beginPath();
    this.G.strokeStyle = "#55CC77";
    this.G.lineWidth = "1";
    for (x9 = this.x1; x9 <= this.x2 + tochnost; x9 += this.xReckaChekor) {
      this.G.moveTo(this.x(x9), this.y(this.y2));
      this.G.lineTo(this.x(x9), this.y(this.y1));
    }
    this.G.stroke();

    // цртање на хоризонталните линии од координатната мрежа
    this.G.beginPath();
    for (x9 = this.y1; x9 <= this.y2 + tochnost; x9 += this.xReckaChekor) {
      this.G.moveTo(this.x(this.x2), this.y(x9));
      this.G.lineTo(this.x(this.x1), this.y(x9));
    }
    this.G.stroke();

    this.G.fillStyle = "black";
    // this.G.font = fontKoordinata;
    // this.G.fillText("55", 150, 100);

    // цртање на x-оска со стрелка надесно
    this.G.beginPath();
    this.G.lineWidth = "2";
    this.G.strokeStyle = "black";
    this.G.moveTo(this.x(this.x1) - this.oskaStrchi, this.y(0) - 0.5);
    xStrelka = this.x(this.x2) + this.oskaStrchi;
    yStrelka = this.y(0) - 0.5;
    this.G.lineTo(xStrelka, yStrelka);
    this.G.stroke();

    // цртање на стрелка надесно
    this.G.beginPath();
    this.G.lineWidth = "2";
    this.G.lineJoin = "miter"; // заострен врв на пресекот на линиите
    //this.G.moveTo(xStrelka, yStrelka);
    this.G.moveTo(xStrelka - 7, yStrelka - 4);
    this.G.lineTo(xStrelka, yStrelka - 0.5);
    this.G.lineTo(xStrelka - 7, yStrelka + 4);
    this.G.stroke();

    // означување на x-оска
    this.G.font = "italic " + fontKoordinata;
    this.G.textAlign = "right";
    this.G.textBaseline = "bottom";
    this.G.fillText("x", xStrelka - 6, yStrelka - 3);

    // цртање на y-оска со стрелка нагоре
    this.G.beginPath();
    this.G.lineWidth = "2";
    this.G.strokeStyle = "black";
    this.G.moveTo(this.x(0) - 0.5, this.y(this.y1) + this.oskaStrchi);
    xStrelka = this.x(0) - 0.5;
    yStrelka = this.y(this.y2) - this.oskaStrchi;
    this.G.lineTo(xStrelka, yStrelka);
    this.G.stroke();

    // означување на y-оска
    this.G.font = "italic " + fontKoordinata;
    this.G.textAlign = "left";
    this.G.textBaseline = "top";
    this.G.fillText("y", xStrelka + 8, yStrelka - 4);

    // цртање на стрелка нагоре
    this.G.beginPath();
    this.G.lineWidth = "2";
    this.G.lineJoin = "miter";
    //this.G.moveTo(xStrelka, yStrelka);
    this.G.moveTo(xStrelka - 4, yStrelka + 7);
    this.G.lineTo(xStrelka + 0.5, yStrelka);
    this.G.lineTo(xStrelka + 4, yStrelka + 7);
    this.G.stroke();

    this.G.textAlign = "center";
    this.G.textBaseline = "top";
    this.G.font = fontKoordinata;

    // цртање на рецки и координати на x-оската
    this.G.beginPath();
    for (i9 = 0; i9 < this.xBrojka.length; i9++) {
      this.G.moveTo(
        this.x(this.xBrojka[i9]),
        this.y(0) - this.brojkaStrchi - 1
      );
      this.G.lineTo(this.x(this.xBrojka[i9]), this.y(0) + this.brojkaStrchi);
      textKoordinata = this.xBrojka[i9] + "";
      textKoordinata = popravi(textKoordinata, ".", ",");
      textKoordinata = popravi(textKoordinata, "-", "–");
      this.G.fillText(
        textKoordinata,
        this.x(this.xBrojka[i9]),
        this.y(0) + this.brojkaStrchi + 1
      );
    }
    this.G.stroke();

    this.G.textAlign = "right";
    this.G.textBaseline = "middle";
    this.G.font = fontKoordinata;

    // цртање на рецки и координати на y-оската
    this.G.beginPath();
    for (i9 = 0; i9 < this.yBrojka.length; i9++) {
      this.G.moveTo(
        this.x(0) - this.brojkaStrchi - 1,
        this.y(this.xBrojka[i9])
      );
      this.G.lineTo(this.x(0) + this.brojkaStrchi, this.y(this.xBrojka[i9]));
      textKoordinata = this.yBrojka[i9] + "";
      textKoordinata = popravi(textKoordinata, ".", ",");
      textKoordinata = popravi(textKoordinata, "-", "–");
      this.G.fillText(
        textKoordinata,
        this.x(0) - this.brojkaStrchi - 4,
        this.y(this.xBrojka[i9]) - 1
      );
    }
    this.G.stroke();

    // на крајот и координатниот почеток 0, со задебелено кругче и со бројка 0
    this.G.textBaseline = "top";
    this.G.fillText(
      "0",
      this.x(0) - this.brojkaStrchi - 4,
      this.y(0) + this.brojkaStrchi + 1
    );
    this.G.beginPath();
    this.G.arc(this.x(0) - 0.5, this.y(0) - 0.5, 4, 0, 2 * Math.PI);
    this.G.arc(this.x(0) - 0.5, this.y(0) - 0.5, 3, 0, 2 * Math.PI);
    this.G.stroke();

    this.G.beginPath();
    this.G.strokeStyle = "white";
    this.G.arc(this.x(0) - 0.5, this.y(0) - 0.5, 1.4, 0, 2 * Math.PI);
    this.G.stroke();
    this.G.strokeStyle = "black";
  } // nacrtajKS

  // цртање на координатен систем и координатна мрежа под графикот
  nacrtajGrafik() {
    var i8, x8;

    // console.log("Go crtam grafikot na polinomot.");

    this.grafikY = [];
    for (i8 = 0; i8 <= this.grafik.width + 1; i8++) {
      x8 = this.logichkaX(i8);
      this.grafikY[i8] = aktivenPolinom.f(x8);
      // console.log(this.grafikY[i8] = aktivenPolinom.f(x8));
      if (this.grafikY[i8] > 10000) this.grafikY[i8] = 10000; // справување со претекнување на графикот одозгора
      if (this.grafikY[i8] < -10000) this.grafikY[i8] = -10000; // справување со претекнување на графикот одоздола
    }

    this.G.beginPath();
    this.G.strokeStyle = "blue";
    this.G.lineWidth = "3";
    this.G.globalAlpha = 0.7;

    this.G.moveTo(-0.5, this.y(this.grafikY[0]));
    for (i8 = 1; i8 <= this.grafik.width + 1; i8++) {
      this.G.lineTo(i8 - 0.5, this.y(this.grafikY[i8]));
    }
    this.G.stroke();
    this.G.globalAlpha = 1;
  } //nacrtajGrafik
}
