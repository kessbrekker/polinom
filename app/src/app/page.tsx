"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calculator, XCircle, CheckCircle2, TrendingUp, Settings2 } from "lucide-react";
import { Polinom } from "@/lib/Polinom";
import { Grafik } from "@/lib/Grafik";

const EXAMPLES = [
  "(x+1)^3",
  "2x + 5",
  "x^2 - 4x + 4",
  "(x^6-1)/(x^2-1)",
  "x^3 - x",
];

const GRID_SIZES = ["4 × 4", "10 × 10", "20 × 20", "60 × 60", "200 × 200"];

export default function PolinomApp() {
  const [input, setInput] = useState("");
  const [polinom, setPolinom] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [gridSize, setGridSize] = useState("10 × 10");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    try {
      if (!input.trim()) {
        setPolinom(null);
        setError(null);
        drawGraph(null);
        return;
      }
      const p = Polinom.generiraj(input);
      setPolinom(p);
      setError(null);
      drawGraph(p);
    } catch (e: any) {
      setPolinom(null);
      setError(e.message || "Geçersiz ifade");
      drawGraph(null);
    }
  }, [input, gridSize]);

  const drawGraph = (p: any) => {
    if (canvasRef.current) {
      new Grafik(canvasRef.current, gridSize, p);
    }
  };

  const renderSolutionText = () => {
    if (!polinom || !polinom.validen) return null;

    let text = "";
    if (polinom.n === 0) {
      let a = polinom.a[0] + "";
      a = a.replace(".", ",");
      text = `Herhangi bir x değeri için aynı değere P(x) sahip, sabit bir polinom (sıfırıncı dereceden) elde edilir. P(x) = ${a}`;
    } else if (polinom.n === 1) {
      let a = polinom.a[1];
      let b = polinom.a[0];
      let root = -b / a;
      let rootStr = root.toString().replace(".", ",");
      text = `Birinci dereceden bir lineer polinom elde edilir. Lineer denklem P(x) = 0'ın bir kökü vardır: x = ${rootStr}`;
    } else if (polinom.n === 2) {
      let a = polinom.a[2];
      let b = polinom.a[1];
      let c = polinom.a[0];
      let delta = b * b - 4 * a * c;
      if (delta > 0) {
        let x1 = (-b + Math.sqrt(delta)) / (2 * a);
        let x2 = (-b - Math.sqrt(delta)) / (2 * a);
        text = `İkinci dereceden bir polinom elde edilir. P(x) = 0 denkleminin iki farklı gerçek kökü vardır: x₁ = ${x1.toFixed(2).replace(".", ",")} ve x₂ = ${x2.toFixed(2).replace(".", ",")}`;
      } else if (delta === 0) {
        let x1 = -b / (2 * a);
        text = `İkinci dereceden bir polinom elde edilir. P(x) = 0 denkleminin çift katlı gerçek kökü vardır: x₁ = x₂ = ${x1.toFixed(2).replace(".", ",")}`;
      } else {
        text = `İkinci dereceden bir polinom elde edilir. P(x) = 0 denkleminin gerçek kökü yoktur.`;
      }
    } else {
      text = `${polinom.n}. dereceden bir polinom elde edildi.`;
    }

    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-6 p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 text-slate-300"
      >
        <p className="text-sm leading-relaxed">{text}</p>
      </motion.div>
    );
  };

  return (
    <div className="h-[calc(100vh-4rem)] bg-[#020617] text-slate-200 selection:bg-sky-500/30">
      <div className="max-w-7xl mx-auto px-4 py-12 flex flex-col lg:flex-row gap-8">

        {/* Sol Panel - Girdi ve Sonuçlar */}
        <div className="flex-1 flex flex-col gap-6">
          <header className="mb-4">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
              <h1 className="text-4xl font-extrabold bg-gradient-to-r from-sky-400 to-indigo-400 bg-clip-text text-transparent mb-2">
                Polinom Çözümleyici
              </h1>
              <p className="text-slate-400">Cebirsel ifadeleri polinom biçimine indirgeyin ve analiz edin.</p>
            </motion.div>
          </header>

          <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 backdrop-blur-xl shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-32 bg-sky-500/10 blur-[100px] rounded-full pointer-events-none" />

            <div className="relative z-10">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-3">
                <Calculator className="w-4 h-4 text-sky-400" />
                A(x) =
              </label>

              <div className="relative group">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Örn: (x+1)^3"
                  className="w-full bg-slate-950/50 border border-slate-700 focus:border-sky-500 rounded-xl px-5 py-4 text-lg font-mono text-sky-100 placeholder:text-slate-600 outline-none transition-all ring-4 ring-transparent focus:ring-sky-500/10"
                />
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-rose-400"
                    >
                      <XCircle className="w-5 h-5" />
                    </motion.div>
                  )}
                  {polinom && !error && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-400"
                    >
                      <CheckCircle2 className="w-5 h-5" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <AnimatePresence mode="wait">
                {error ? (
                  <motion.div
                    key="error"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-3 text-sm text-rose-400 px-2 flex items-center gap-2"
                  >
                    <XCircle className="w-4 h-4 shrink-0" />
                    {error}
                  </motion.div>
                ) : polinom ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-6"
                  >
                    <div className="px-5 py-4 rounded-xl bg-sky-950/30 border border-sky-900/50">
                      <div className="text-sm font-medium text-sky-400/80 mb-1">P(x) =</div>
                      <div className="text-2xl font-serif tracking-wider text-sky-100" dangerouslySetInnerHTML={{ __html: polinom.matematichkiHTML }}></div>
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>

              {renderSolutionText()}

              <div className="mt-8 pt-6 border-t border-slate-800/50">
                <div className="text-sm font-medium text-slate-400 mb-3">Örnek İfadeler</div>
                <div className="flex flex-wrap gap-2">
                  {EXAMPLES.map(ex => (
                    <button
                      key={ex}
                      onClick={() => setInput(ex)}
                      className="px-3 py-1.5 text-sm rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors border border-slate-700"
                    >
                      {ex}
                    </button>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Sağ Panel - Grafik */}
        <div className="flex-1 lg:max-w-[650px] w-full">
          <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 backdrop-blur-xl shadow-2xl flex flex-col items-center">

            <div className="w-full flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold flex items-center gap-2 text-slate-200">
                <TrendingUp className="w-5 h-5 text-indigo-400" />
                Grafik Görünümü
              </h2>

              <div className="flex items-center gap-2 bg-slate-950/50 rounded-xl p-1 border border-slate-800">
                <Settings2 className="w-4 h-4 text-slate-400 ml-2" />
                <select
                  value={gridSize}
                  onChange={(e) => setGridSize(e.target.value)}
                  className="bg-transparent text-sm text-slate-300 outline-none cursor-pointer pr-2 py-1 [&>option]:bg-slate-900"
                >
                  {GRID_SIZES.map(size => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="relative w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] lg:w-[600px] lg:h-[600px] rounded-xl overflow-hidden border border-slate-700/50 shadow-inner bg-slate-950">
              <canvas
                ref={canvasRef}
                width={651}
                height={651}
                className="w-full h-full object-contain"
              />
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
