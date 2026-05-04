export class Grafik {
  constructor(canvas, aktivenKS, aktivenPolinom) {
    this.grafik = canvas;
    this.G = this.grafik.getContext("2d");
    this.aktivenPolinom = aktivenPolinom;
    this.izberiKS(aktivenKS || "10 × 10");
  }

  izberiKS(textKS) {
    this.aktivenKS = textKS;
    this.oskaStrchi = 20;
    this.brojkaStrchi = 4;

    switch (textKS) {
      case "4 × 4":
        this.x1 = -2; this.y1 = -2; this.x2 = 2; this.y2 = 2;
        this.xReckaChekor = 0.2; this.yReckaChekor = 0.2;
        this.xBrojka = [-2, -1, 1, 2]; this.yBrojka = [-2, -1, 1, 2];
        break;
      case "20 × 20":
        this.x1 = -10; this.y1 = -10; this.x2 = 10; this.y2 = 10;
        this.xReckaChekor = 1; this.yReckaChekor = 1;
        this.xBrojka = [-10, -5, 5, 10]; this.yBrojka = [-10, -5, 5, 10];
        break;
      case "60 × 60":
        this.x1 = -30; this.y1 = -30; this.x2 = 30; this.y2 = 30;
        this.xReckaChekor = 5; this.yReckaChekor = 5;
        this.xBrojka = [-30, -20, -10, 10, 20, 30]; this.yBrojka = [-30, -20, -10, 10, 20, 30];
        break;
      case "200 × 200":
        this.x1 = -100; this.y1 = -100; this.x2 = 100; this.y2 = 100;
        this.xReckaChekor = 10; this.yReckaChekor = 10;
        this.xBrojka = [-100, -50, 50, 100]; this.yBrojka = [-100, -50, 50, 100];
        break;
      default:
        this.x1 = -5; this.y1 = -5; this.x2 = 5; this.y2 = 5;
        this.xReckaChekor = 1; this.yReckaChekor = 1;
        this.xBrojka = [-5, -4, -3, -2, -1, 1, 2, 3, 4, 5]; this.yBrojka = [-5, -4, -3, -2, -1, 1, 2, 3, 4, 5];
        break;
    }

    this.nacrtajKS();
    if (this.aktivenPolinom && this.aktivenPolinom.validen) {
      if (this.aktivenPolinom.isMultivariate) {
        this.nacrtajImplicitno();
      } else {
        this.nacrtajGrafik();
      }
    }
  }

  x(logichkaX) { return 25.5 + ((logichkaX - this.x1) * 600) / (this.x2 - this.x1); }
  y(logichkaY) { return 25.5 + ((logichkaY - this.y2) * 600) / (this.y1 - this.y2); }
  logichkaX(fizichkaX) { return this.x1 + ((fizichkaX - 25 - 1) * (this.x2 - this.x1)) / 600; }
  logichkaY(fizichkaY) { return this.y2 + ((fizichkaY - 25.5) * (this.y1 - this.y2)) / 600; }

  nacrtajKS() {
    let i9, x9, xStrelka, yStrelka;
    let textKoordinata, fontKoordinata = "bold 20px 'Inter', 'Book Antiqua', 'Times New Roman', serif";
    let tochnost = 0.0000001;

    let gradient = this.G.createRadialGradient(
      this.grafik.width / 2, this.grafik.height / 2, 400,
      this.grafik.width / 2, this.grafik.height / 2, 0
    );
    gradient.addColorStop(0, "#1e293b"); // tailwind slate-800
    gradient.addColorStop(1, "#0f172a"); // tailwind slate-900
    this.G.fillStyle = gradient;
    this.G.fillRect(0, 0, this.grafik.width, this.grafik.height);

    this.G.beginPath();
    this.G.strokeStyle = "#334155"; // slate-700
    this.G.lineWidth = "1";
    for (x9 = this.x1; x9 <= this.x2 + tochnost; x9 += this.xReckaChekor) {
      this.G.moveTo(this.x(x9), this.y(this.y2));
      this.G.lineTo(this.x(x9), this.y(this.y1));
    }
    this.G.stroke();

    this.G.beginPath();
    for (x9 = this.y1; x9 <= this.y2 + tochnost; x9 += this.xReckaChekor) {
      this.G.moveTo(this.x(this.x2), this.y(x9));
      this.G.lineTo(this.x(this.x1), this.y(x9));
    }
    this.G.stroke();

    this.G.fillStyle = "#e2e8f0"; // slate-200
    this.G.beginPath();
    this.G.lineWidth = "2";
    this.G.strokeStyle = "#e2e8f0";
    this.G.moveTo(this.x(this.x1) - this.oskaStrchi, this.y(0) - 0.5);
    xStrelka = this.x(this.x2) + this.oskaStrchi;
    yStrelka = this.y(0) - 0.5;
    this.G.lineTo(xStrelka, yStrelka);
    this.G.stroke();

    this.G.beginPath();
    this.G.lineWidth = "2";
    this.G.lineJoin = "miter";
    this.G.moveTo(xStrelka - 7, yStrelka - 4);
    this.G.lineTo(xStrelka, yStrelka - 0.5);
    this.G.lineTo(xStrelka - 7, yStrelka + 4);
    this.G.stroke();

    this.G.font = "italic " + fontKoordinata;
    this.G.textAlign = "right";
    this.G.textBaseline = "bottom";
    this.G.fillText("x", xStrelka - 6, yStrelka - 3);

    this.G.beginPath();
    this.G.lineWidth = "2";
    this.G.strokeStyle = "#e2e8f0";
    this.G.moveTo(this.x(0) - 0.5, this.y(this.y1) + this.oskaStrchi);
    xStrelka = this.x(0) - 0.5;
    yStrelka = this.y(this.y2) - this.oskaStrchi;
    this.G.lineTo(xStrelka, yStrelka);
    this.G.stroke();

    this.G.font = "italic " + fontKoordinata;
    this.G.textAlign = "left";
    this.G.textBaseline = "top";
    this.G.fillText("y", xStrelka + 8, yStrelka - 4);

    this.G.beginPath();
    this.G.lineWidth = "2";
    this.G.lineJoin = "miter";
    this.G.moveTo(xStrelka - 4, yStrelka + 7);
    this.G.lineTo(xStrelka + 0.5, yStrelka);
    this.G.lineTo(xStrelka + 4, yStrelka + 7);
    this.G.stroke();

    this.G.textAlign = "center";
    this.G.textBaseline = "top";
    this.G.font = fontKoordinata;

    this.G.beginPath();
    for (i9 = 0; i9 < this.xBrojka.length; i9++) {
      this.G.moveTo(this.x(this.xBrojka[i9]), this.y(0) - this.brojkaStrchi - 1);
      this.G.lineTo(this.x(this.xBrojka[i9]), this.y(0) + this.brojkaStrchi);
      textKoordinata = this.xBrojka[i9] + "";
      textKoordinata = textKoordinata.replace(/\./g, ",");
      textKoordinata = textKoordinata.replace(/\-/g, "–");
      this.G.fillText(textKoordinata, this.x(this.xBrojka[i9]), this.y(0) + this.brojkaStrchi + 1);
    }
    this.G.stroke();

    this.G.textAlign = "right";
    this.G.textBaseline = "middle";
    this.G.font = fontKoordinata;

    this.G.beginPath();
    for (i9 = 0; i9 < this.yBrojka.length; i9++) {
      this.G.moveTo(this.x(0) - this.brojkaStrchi - 1, this.y(this.xBrojka[i9]));
      this.G.lineTo(this.x(0) + this.brojkaStrchi, this.y(this.xBrojka[i9]));
      textKoordinata = this.yBrojka[i9] + "";
      textKoordinata = textKoordinata.replace(/\./g, ",");
      textKoordinata = textKoordinata.replace(/\-/g, "–");
      this.G.fillText(textKoordinata, this.x(0) - this.brojkaStrchi - 4, this.y(this.xBrojka[i9]) - 1);
    }
    this.G.stroke();

    this.G.textBaseline = "top";
    this.G.fillText("0", this.x(0) - this.brojkaStrchi - 4, this.y(0) + this.brojkaStrchi + 1);
    this.G.beginPath();
    this.G.arc(this.x(0) - 0.5, this.y(0) - 0.5, 4, 0, 2 * Math.PI);
    this.G.arc(this.x(0) - 0.5, this.y(0) - 0.5, 3, 0, 2 * Math.PI);
    this.G.stroke();

    this.G.beginPath();
    this.G.strokeStyle = "#e2e8f0";
    this.G.arc(this.x(0) - 0.5, this.y(0) - 0.5, 1.4, 0, 2 * Math.PI);
    this.G.stroke();
  }

  nacrtajGrafik() {
    let i8, x8;
    this.grafikY = [];
    for (i8 = 0; i8 <= this.grafik.width + 1; i8++) {
      x8 = this.logichkaX(i8);
      this.grafikY[i8] = this.aktivenPolinom.f(x8);
      if (this.grafikY[i8] > 10000) this.grafikY[i8] = 10000;
      if (this.grafikY[i8] < -10000) this.grafikY[i8] = -10000;
    }

    this.G.beginPath();
    this.G.strokeStyle = "#38bdf8"; // tailwind sky-400
    this.G.lineWidth = "4";
    this.G.globalAlpha = 1;

    this.G.moveTo(-0.5, this.y(this.grafikY[0]));
    for (i8 = 1; i8 <= this.grafik.width + 1; i8++) {
      this.G.lineTo(i8 - 0.5, this.y(this.grafikY[i8]));
    }
    this.G.stroke();
  }

  nacrtajImplicitno() {
    let fn = this.aktivenPolinom.compile();
    let width = this.grafik.width;
    let height = this.grafik.height;

    let step = 2; 
    let cols = Math.ceil(width / step);
    let rows = Math.ceil(height / step);

    let values = new Float32Array((cols + 1) * (rows + 1));
    
    for (let r = 0; r <= rows; r++) {
      let fizY = r * step;
      let logY = this.logichkaY(fizY);
      for (let c = 0; c <= cols; c++) {
        let fizX = c * step;
        let logX = this.logichkaX(fizX);
        values[r * (cols + 1) + c] = fn(logX, logY);
      }
    }

    this.G.beginPath();
    this.G.strokeStyle = "#38bdf8";
    this.G.lineWidth = "4";
    this.G.globalAlpha = 1;

    let getPoint = (v1, v2, p1, p2) => {
      if (v1 === v2) return p1;
      let t = v1 / (v1 - v2);
      return { x: p1.x + t * (p2.x - p1.x), y: p1.y + t * (p2.y - p1.y) };
    };

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        let idx = r * (cols + 1) + c;
        let vTL = values[idx];
        let vTR = values[idx + 1];
        let vBL = values[idx + cols + 1];
        let vBR = values[idx + cols + 2];

        let pTL = { x: c * step, y: r * step };
        let pTR = { x: (c + 1) * step, y: r * step };
        let pBL = { x: c * step, y: (r + 1) * step };
        let pBR = { x: (c + 1) * step, y: (r + 1) * step };

        let state = 0;
        if (vTL > 0) state |= 1;
        if (vTR > 0) state |= 2;
        if (vBR > 0) state |= 4;
        if (vBL > 0) state |= 8;

        let points = [];
        if (state === 1 || state === 14) {
          points.push(getPoint(vTL, vTR, pTL, pTR), getPoint(vTL, vBL, pTL, pBL));
        } else if (state === 2 || state === 13) {
          points.push(getPoint(vTL, vTR, pTL, pTR), getPoint(vTR, vBR, pTR, pBR));
        } else if (state === 4 || state === 11) {
          points.push(getPoint(vTR, vBR, pTR, pBR), getPoint(vBL, vBR, pBL, pBR));
        } else if (state === 8 || state === 7) {
          points.push(getPoint(vTL, vBL, pTL, pBL), getPoint(vBL, vBR, pBL, pBR));
        } else if (state === 3 || state === 12) {
          points.push(getPoint(vTL, vBL, pTL, pBL), getPoint(vTR, vBR, pTR, pBR));
        } else if (state === 6 || state === 9) {
          points.push(getPoint(vTL, vTR, pTL, pTR), getPoint(vBL, vBR, pBL, pBR));
        } else if (state === 5 || state === 10) {
          points.push(getPoint(vTL, vTR, pTL, pTR), getPoint(vTL, vBL, pTL, pBL));
          points.push(getPoint(vBL, vBR, pBL, pBR), getPoint(vTR, vBR, pTR, pBR));
        }

        if (points.length >= 2) {
          this.G.moveTo(points[0].x, points[0].y);
          this.G.lineTo(points[1].x, points[1].y);
        }
        if (points.length === 4) {
          this.G.moveTo(points[2].x, points[2].y);
          this.G.lineTo(points[3].x, points[3].y);
        }
      }
    }
    this.G.stroke();
  }
}
