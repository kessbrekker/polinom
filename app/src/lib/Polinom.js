function vidZnak(z) {
  if (z >= "a" && z <= "z" || z >= "A" && z <= "Z") return "promenliva";
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

export class Polinom {
  constructor(dadenP) {
    this.validen = true;
    this.terms = {};

    if (dadenP instanceof Polinom) {
      this.terms = { ...dadenP.terms };
    } else if (Array.isArray(dadenP)) {
      for (let i = 0; i < dadenP.length; i++) {
        if (dadenP[i] !== 0) {
          let k = i === 0 ? "" : `x:${i}`;
          this.terms[k] = dadenP[i];
        }
      }
      if (Object.keys(this.terms).length === 0) this.terms[""] = 0;
    } else if (typeof dadenP === "string" && dadenP.length === 1 && vidZnak(dadenP) === "promenliva") {
      this.terms[`${dadenP.toLowerCase()}:1`] = 1;
    } else if (!isNaN(dadenP)) {
      let val = parseFloat(dadenP);
      if (val !== 0) this.terms[""] = val;
      if (Object.keys(this.terms).length === 0) this.terms[""] = 0;
    } else if (dadenP && typeof dadenP === 'object' && dadenP.terms) {
      this.terms = { ...dadenP.terms };
    } else {
      this.validen = false;
      throw new Error(`err_processing: ${dadenP + ""}`);
    }
  }

  static parseKey(key) {
    if (!key) return {};
    let parts = key.split(",");
    let varsObj = {};
    for (let p of parts) {
      let [k, v] = p.split(":");
      varsObj[k] = parseInt(v, 10);
    }
    return varsObj;
  }

  static getKey(varsObj) {
    let keys = Object.keys(varsObj).filter(k => varsObj[k] > 0).sort();
    return keys.map(k => `${k}:${varsObj[k]}`).join(",");
  }

  get variables() {
    let vars = new Set();
    for (let k in this.terms) {
      if (k) {
        k.split(",").forEach(p => vars.add(p.split(":")[0]));
      }
    }
    return Array.from(vars).sort();
  }

  get isMultivariate() {
    let vars = this.variables;
    return vars.length > 1 || (vars.length === 1 && vars[0] !== "x");
  }

  getUnivariateCoeffs(varName = "x") {
    let max = -1;
    let coeffs = [];
    for (let k in this.terms) {
      let vars = Polinom.parseKey(k);
      let keys = Object.keys(vars);
      if (keys.length === 0) {
        max = Math.max(max, 0);
        coeffs[0] = this.terms[k];
      } else if (keys.length === 1 && keys[0] === varName) {
        max = Math.max(max, vars[varName]);
        coeffs[vars[varName]] = this.terms[k];
      } else {
        return null;
      }
    }
    if (max === -1) return [0];
    for (let i = 0; i <= max; i++) {
      if (coeffs[i] === undefined) coeffs[i] = 0;
    }
    return coeffs;
  }

  get a() {
    let arr = this.getUnivariateCoeffs("x");
    return arr || [];
  }

  get n() {
    let arr = this.getUnivariateCoeffs("x");
    return arr ? arr.length - 1 : -1;
  }

  f(varsOrX) {
    let fn = this.compile();
    if (typeof varsOrX === 'number') {
      return fn(varsOrX, 0);
    } else {
      return fn(varsOrX.x || 0, varsOrX.y || 0);
    }
  }

  compile() {
    if (this._compiledFn) return this._compiledFn;
    let termsArr = this.getSortedTerms();
    let body = "return ";
    let parts = [];
    for (let t of termsArr) {
      if (t.coef === 0) continue;
      let p = t.coef.toString();
      for (let v in t.vars) {
        // Fast paths for small exponents, fallback to Math.pow
        if (t.vars[v] === 1) p += ` * ${v}`;
        else if (t.vars[v] === 2) p += ` * (${v}*${v})`;
        else if (t.vars[v] === 3) p += ` * (${v}*${v}*${v})`;
        else p += ` * Math.pow(${v}, ${t.vars[v]})`;
      }
      parts.push(p);
    }
    if (parts.length === 0) body += "0;";
    else body += parts.join(" + ") + ";";
    
    try {
        this._compiledFn = new Function("x", "y", body);
    } catch(e) {
        this._compiledFn = () => 0;
    }
    return this._compiledFn;
  }

  soberi(p2) {
    let res = new Polinom(0);
    res.terms = { ...this.terms };
    for (let k in p2.terms) {
      res.terms[k] = (res.terms[k] || 0) + p2.terms[k];
      if (Math.abs(res.terms[k]) < 1e-10) delete res.terms[k];
    }
    if (Object.keys(res.terms).length === 0) res.terms[""] = 0;
    return res;
  }

  odzemi(p2) {
    let res = new Polinom(0);
    res.terms = { ...this.terms };
    for (let k in p2.terms) {
      res.terms[k] = (res.terms[k] || 0) - p2.terms[k];
      if (Math.abs(res.terms[k]) < 1e-10) delete res.terms[k];
    }
    if (Object.keys(res.terms).length === 0) res.terms[""] = 0;
    return res;
  }

  pomnozhi(p2) {
    let res = new Polinom(0);
    res.terms = {};
    for (let k1 in this.terms) {
      for (let k2 in p2.terms) {
        let c = this.terms[k1] * p2.terms[k2];
        let v1 = Polinom.parseKey(k1);
        let v2 = Polinom.parseKey(k2);
        let nv = { ...v1 };
        for (let v in v2) {
          nv[v] = (nv[v] || 0) + v2[v];
        }
        let nk = Polinom.getKey(nv);
        res.terms[nk] = (res.terms[nk] || 0) + c;
        if (Math.abs(res.terms[nk]) < 1e-10) delete res.terms[nk];
      }
    }
    if (Object.keys(res.terms).length === 0) res.terms[""] = 0;
    return res;
  }

  stepenuvaj(m) {
    let res = new Polinom(1);
    for (let i = 1; i <= m; i++) res = res.pomnozhi(this);
    return res;
  }

  podeli(p2) {
    let varName = "x";
    if (this.variables.length > 0) varName = this.variables[0];
    else if (p2.variables.length > 0) varName = p2.variables[0];

    let delenikA = this.getUnivariateCoeffs(varName);
    let delitelA = p2.getUnivariateCoeffs(varName);

    if (!delenikA || !delitelA) {
      throw new Error("err_noPolyom: Bölme işlemi sadece tek değişkenli polinomlar için desteklenmektedir.");
    }

    let nKolichnik = delenikA.length - 1 - (delitelA.length - 1);
    let p2n = delitelA.length - 1;
    let kolichnikA = [];
    let ostatokA = [];
    let tochnost = 0.000001;

    if (nKolichnik >= 0) {
      for (let i5 = nKolichnik; i5 >= 0; i5--) {
        let k = delenikA[i5 + p2n] / delitelA[p2n];
        kolichnikA[i5] = k;

        ostatokA = [];
        for (let j5 = p2n; j5 >= 0; j5--) {
          ostatokA[i5 + j5] = delenikA[i5 + j5] - k * delitelA[j5];
          if (Math.abs(ostatokA[i5 + j5]) < tochnost) ostatokA[i5 + j5] = 0;
        }
        for (let j5 = i5 - 1; j5 >= 0; j5--) ostatokA[j5] = delenikA[j5];
        delenikA = ostatokA;
      }

      let nenultOstatok = false;
      for (let j5 = p2n; j5 >= 0; j5--) if (ostatokA[j5] != 0) nenultOstatok = true;

      if (nenultOstatok) {
        throw new Error("err_noPolyom");
      }

      let res = new Polinom(0);
      res.terms = {};
      for(let i=0; i<kolichnikA.length; i++) {
        if (kolichnikA[i] !== 0) {
            let k = i === 0 ? "" : `${varName}:${i}`;
            res.terms[k] = kolichnikA[i];
        }
      }
      if (Object.keys(res.terms).length === 0) res.terms[""] = 0;
      return res;
    } else {
      throw new Error("err_noPolyom");
    }
  }

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
        tipIznos[iZ] = "zagrada";
        brZagradi = 1;
        while (brZagradi > 0) {
          b++;
          iznos[iZ] += s[b];
          if (s[b] == "(") brZagradi++;
          if (s[b] == ")") brZagradi--;
        }
        iznos[iZ] = iznos[iZ].slice(0, -1);
        if (iznos[iZ] == "") iznos[iZ] = "0";
      } else if (vidZnak(z) == "promenliva") {
        tipIznos[iZ] = "promenliva";
        iznos[iZ] += z.toLowerCase();
      } else if (vidZnak(z) == "broj") {
        tipIznos[iZ] = "broj";
        iznos[iZ] += z;
        while (b + 1 < s.length && vidZnak(s[b + 1]) == "broj") {
          iznos[iZ] += s[b + 1];
          b++;
        }
      } else {
        throw new Error(`err_unknownSymbol: ${z}`);
      }

      if (b + 1 == s.length) break;
      else {
        b++;
        z = s[b];
        if (vidZnak(z) == "operator") {
          operator[iZ] = z;
        }
      }
      iZ++;
    }

    let i5;
    for (i5 = 0; i5 <= iZ; i5++) {
      if (tipIznos[i5] == "broj")
        vrednostIznos[i5] = new Polinom(parseFloat(iznos[i5]));
      else if (tipIznos[i5] == "promenliva")
        vrednostIznos[i5] = new Polinom(iznos[i5]);
      else if (tipIznos[i5] == "zagrada")
        vrednostIznos[i5] = this.raschleni(iznos[i5]);
      else {
        throw new Error(`err_processing: ${iznos[i5]}`);
      }
    }

    if (iZ == 0) return vrednostIznos[0];

    while (operator.length > 0) {
      for (i5 = 0; i5 < operator.length; i5++)
        if (operator[i5] == "^") {
          let isMulti = vrednostIznos[i5 + 1].isMultivariate;
          let n2 = vrednostIznos[i5 + 1].n;
          if (n2 > 0 || isMulti) {
            throw new Error(`err_exp_x: ${vrednostIznos[i5 + 1].obichenString}`);
          }

          let stPokazatel = vrednostIznos[i5 + 1].terms[""] || 0;

          if (Math.abs(stPokazatel) != parseInt(stPokazatel + "", 10)) {
            throw new Error(`err_expNoNatural: ${stPokazatel + ""}`);
          }

          vrednostIznos[i5] = vrednostIznos[i5].stepenuvaj(stPokazatel);
          otstraniIndex(i5);
          i5--;
        }

      for (i5 = 0; i5 < operator.length; i5++) {
        if (operator[i5] == "*") {
          vrednostIznos[i5] = vrednostIznos[i5].pomnozhi(vrednostIznos[i5 + 1]);
          otstraniIndex(i5);
          i5--;
        }

        if (operator[i5] == "/") {
          if (vrednostIznos[i5 + 1].obichenString == "0") {
            throw new Error("err_div0");
          }
          vrednostIznos[i5] = vrednostIznos[i5].podeli(vrednostIznos[i5 + 1]);
          otstraniIndex(i5);
          i5--;
        }
      }

      for (i5 = 0; i5 < operator.length; i5++) {
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
    }

    function otstraniIndex(i6) {
      operator.splice(i6, 1);
      vrednostIznos.splice(i6 + 1, 1);
    }

    vrednostIznos[0].validen = true;
    return vrednostIznos[0];
  }

  static generiraj(s) {
    if (s.includes('=')) {
      let parts = s.split('=');
      if (parts.length > 2) throw new Error("Sadece bir adet eşittir işareti kullanılabilir.");
      let left = parts[0].trim();
      let right = parts[1].trim();
      if (right === "0") {
         s = left;
      } else {
         s = `(${left})-(${right})`;
      }
    }

    s = popravi(s, " ", "");
    s = popravi(s, ",", ".");
    s = popravi(s, "–", "-");
    s = popravi(s, "—", "-");

    if (s.substr(0, 1) == "-") s = "0" + s;
    s = popravi(s, "(-", "(0-");

    s = popravi(s, "×", "*");
    s = popravi(s, ":", "/");

    s = popravi(s, ")(", ")*(");

    for (let i = 0; i < 3; i++) {
        s = s.replace(/([0-9])([a-zA-Z\(])/g, "$1*$2");
        s = s.replace(/([a-zA-Z\)])([0-9])/g, "$1*$2");
        s = s.replace(/([a-zA-Z])([a-zA-Z\(])/g, "$1*$2");
        s = s.replace(/\)([a-zA-Z])/g, ")*$1");
    }

    return this.raschleni(s);
  }

  getSortedTerms() {
    let termsArr = [];
    for (let k in this.terms) {
      let vars = Polinom.parseKey(k);
      let totalDeg = Object.values(vars).reduce((a, b) => a + b, 0);
      termsArr.push({
        key: k,
        vars: vars,
        totalDeg: totalDeg,
        coef: this.terms[k]
      });
    }
    termsArr.sort((a, b) => {
      if (a.totalDeg !== b.totalDeg) return b.totalDeg - a.totalDeg;
      if (a.key < b.key) return -1;
      if (a.key > b.key) return 1;
      return 0;
    });
    return termsArr;
  }

  get matematichkiHTML() {
    let termsArr = this.getSortedTerms();
    let result = "";

    for (let i = 0; i < termsArr.length; i++) {
      let t = termsArr[i];
      if (t.coef === 0 && termsArr.length > 1) continue;
      if (t.coef === 0 && termsArr.length === 1) return "0";

      let termStr = "";
      
      if (result === "") {
        if (t.coef < 0) result = "–";
      } else {
        if (t.coef < 0) result += " –&#8288;&nbsp;";
        else result += " +&#8288;&nbsp;";
      }

      let absCoef = Math.abs(t.coef);
      let isConstant = Object.keys(t.vars).length === 0;
      if (absCoef !== 1 || isConstant) {
        termStr += absCoef;
      }

      for (let v in t.vars) {
        termStr += `<i>${v}</i>`;
        let p = t.vars[v];
        if (p > 1) {
          termStr += superscript(p);
        }
      }

      result += termStr;
    }
    
    if (result === "") result = "0";
    result = popravi(result, ".", ",");
    return result;
  }

  get obichenString() {
    let termsArr = this.getSortedTerms();
    let result = "";

    for (let i = 0; i < termsArr.length; i++) {
      let t = termsArr[i];
      if (t.coef === 0 && termsArr.length > 1) continue;
      if (t.coef === 0 && termsArr.length === 1) return "0";

      let termStr = "";
      
      if (result === "") {
        if (t.coef < 0) result = "–";
      } else {
        if (t.coef < 0) result += " – ";
        else result += " + ";
      }

      let absCoef = Math.abs(t.coef);
      let isConstant = Object.keys(t.vars).length === 0;
      if (absCoef !== 1 || isConstant) {
        termStr += absCoef;
      }

      for (let v in t.vars) {
        termStr += v;
        let p = t.vars[v];
        if (p > 1) {
          termStr += "^" + p;
        }
      }

      result += termStr;
    }
    
    if (result === "") result = "0";
    result = popravi(result, ".", ",");
    return result;
  }
}
