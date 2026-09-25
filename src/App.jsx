import { useState, useRef, useEffect } from "react";
import { Mic, Volume2, Eye, EyeOff, Send, Clock,} from "lucide-react";

/**
 * Jarvis-Jial — klickbarer UI-Prototyp (React)
 * -------------------------------------------------
 * Kein echtes Backend: Buttons lösen nur lokale State-Änderungen
 * und Mock-Feedback (Toast, Platzhaltertexte) aus.
 *
 * Abhängigkeiten: lucide-react (Icons). Tailwind-Utility-Klassen.
 */

const GAMES = [
  { id: "minecraft", label: "Minecraft" },
  { id: "cod", label: "Call of Duty"},
  { id: "overwatch", label: "Overwatch"},
];

const INITIAL_HISTORY = [
  { id: 1, title: "Diamanten farmen", meta: "Minecraft · vor 2 Min." },
  { id: 2, title: "Bestes Loadout", meta: "Call of Duty · gestern" },
  { id: 3, title: "Skin-Bild erstellen", meta: "Overwatch · gestern" },
  { id: 4, title: "Nether Portal bauen", meta: "Minecraft · vor 2 Tagen" },
];

function useToast() {
  const [toast, setToast] = useState(null);
  const timerRef = useRef(null);

  const show = (msg) => {
    setToast(msg);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setToast(null), 1800);
  };

  useEffect(() => () => clearTimeout(timerRef.current), []);

  return { toast, show };
}

export default function GameMatePrototype() {
  const { toast, show } = useToast();

  const [listening, setListening] = useState(false);
  const [soundPlaying, setSoundPlaying] = useState(false);
  const [selectedGame, setSelectedGame] = useState("minecraft");
  const [inputValue, setInputValue] = useState("");
  const [inputHidden, setInputHidden] = useState(false);
  const [output, setOutput] = useState(null); // null = skeleton state
  const [history, setHistory] = useState(INITIAL_HISTORY);

  const activeGame = GAMES.find((g) => g.id === selectedGame);

  const handleVoiceStart = () => setListening(true);
  const handleVoiceEnd = () => {
    if (!listening) return;
    setListening(false);
    show("Spracheingabe beendet (Demo)");
    setOutput(
        "„Ich habe dich gehört!“ — Spracherkennung ist in diesem Prototyp nicht aktiv."
    );
  };

  const toggleSound = () => {
    setSoundPlaying((p) => !p);
    show(!soundPlaying ? "Sound gestartet (Demo)" : "Sound gestoppt");
  };

  const sendMessage = () => {
    const val = inputValue.trim();
    if (!val) {
      show("Bitte etwas eingeben");
      return;
    }
    setOutput(`Antwort auf: „${val}“ — (Demo, keine echte KI-Anbindung)`);
    show("Gesendet ✓");
    setInputValue("");
  };

  const loadFromHistory = (item) => {
    setInputValue(item.title);
    setOutput(`Verlauf geladen: „${item.title}“ (${item.meta})`);
    show("↺ Anfrage aus History geladen");
  };

  return (
      <div className="min-h-screen bg-[#fbfbfc] bg-[linear-gradient(90deg,rgba(0,0,0,.035)_1px,transparent_1px),linear-gradient(0deg,rgba(0,0,0,.035)_1px,transparent_1px)] bg-[length:28px_28px] p-5 sm:p-8 font-sans text-[#1b2233]">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <header className="flex items-center gap-3 mb-7">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-xl shadow-md flex-none">
            </div>
            <h1 className="text-2xl font-bold tracking-tight">
              Jarvis JIAL <span className="text-gray-400 font-semibold">— Board Layout</span>
            </h1>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start">
            {/* Voice Input */}
            <button
                onMouseDown={handleVoiceStart}
                onMouseUp={handleVoiceEnd}
                onMouseLeave={handleVoiceEnd}
                onTouchStart={(e) => {
                  e.preventDefault();
                  handleVoiceStart();
                }}
                onTouchEnd={handleVoiceEnd}
                className={`aspect-square rounded-full flex flex-col items-center justify-center gap-2.5 text-center p-6 shadow-[0_1px_2px_rgba(20,20,30,.04),0_8px_20px_-12px_rgba(20,20,30,.12)] border border-black/5 transition-transform ${
                    listening
                        ? "bg-[radial-gradient(circle_at_50%_30%,#fff8e3,#fdf3d3)] scale-[1.02]"
                        : "bg-[radial-gradient(circle_at_50%_30%,#fff8e3,#fdf3d3)]"
                }`}
            >
              <h2 className="text-lg font-semibold">Voice Input</h2>
              <div
                  className={`w-[72px] h-[72px] rounded-full flex items-center justify-center border border-black/5 transition-all ${
                      listening
                          ? "bg-[#f4d35e] shadow-[0_0_0_8px_rgba(244,211,94,.35)]"
                          : "bg-white/55"
                  }`}
              >
                <Mic size={28} className="text-[#8a6d1a]" />
              </div>
              <div className={`text-sm max-w-[150px] ${listening ? "text-[#8a6d1a] font-semibold" : "text-gray-500"}`}>
                {listening ? "höre zu…" : "gedrückt halten & sprechen"}
              </div>
              {listening && (
                  <span className="w-2 h-2 rounded-full bg-rose-600 animate-pulse" />
              )}
            </button>

            {/* Sound */}
            <button
                onClick={toggleSound}
                className="aspect-square rounded-full flex flex-col items-center justify-center gap-2.5 text-center p-6 shadow-[0_1px_2px_rgba(20,20,30,.04),0_8px_20px_-12px_rgba(20,20,30,.12)] border border-black/5 bg-[radial-gradient(circle_at_50%_30%,#f3f9ff,#e3f0fd)]"
            >
              <h2 className="text-lg font-semibold">Sound</h2>
              <div className={`w-[72px] h-[72px] rounded-full flex items-center justify-center bg-white/55 border border-black/5 ${!soundPlaying ? "opacity-40" : ""}`}>
                <Volume2 size={28} className="text-[#2f6fb0]" />
              </div>
              <div className="flex items-end gap-[3px] h-[18px]">
                {[6, 14, 9, 16, 7].map((h, i) => (
                    <span
                        key={i}
                        style={{
                          height: h,
                          animationDelay: `${i * 0.15}s`,
                        }}
                        className={`w-[3px] rounded bg-[#2f6fb0] ${
                            soundPlaying ? "opacity-100 animate-[eq_0.9s_ease-in-out_infinite]" : "opacity-50"
                        }`}
                    />
                ))}
              </div>
              <div className="text-sm text-gray-500">
                {soundPlaying ? "wird abgespielt…" : "antippen zum Abspielen"}
              </div>
            </button>

            {/* Output */}
            <div className="rounded-[20px] bg-[#e9f6ea] p-5 shadow-[0_1px_2px_rgba(20,20,30,.04),0_8px_20px_-12px_rgba(20,20,30,.12)] border border-black/5 min-h-[220px]">
              <h2 className="text-lg font-semibold text-[#3f8a4d]">Output</h2>
              <p className="text-sm text-gray-500 mb-3">Antworten der AI erscheinen hier</p>
              {output ? (
                  <div className="bg-white rounded-xl px-3.5 py-3 text-sm text-[#2b3446] leading-relaxed shadow-sm animate-[pop_.18s_ease]">
                    {output}
                  </div>
              ) : (
                  <div className="flex flex-col gap-2.5 mt-1">
                    <div className="h-2.5 rounded bg-[#3f8a4d]/25 w-[92%]" />
                    <div className="h-2.5 rounded bg-[#3f8a4d]/25 w-[78%]" />
                    <div className="h-2.5 rounded bg-[#3f8a4d]/25 w-[55%]" />
                  </div>
              )}
            </div>

            {/* Middle column: text input + games */}
            <div className="flex flex-col gap-5">
              <div className="rounded-[20px] bg-[#f3f4f6] p-4 flex items-center gap-3 shadow-[0_1px_2px_rgba(20,20,30,.04),0_8px_20px_-12px_rgba(20,20,30,.12)] border border-black/5">
                <input
                    type={inputHidden ? "password" : "text"}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                    placeholder="Nachricht eingeben…"
                    className="flex-1 bg-transparent outline-none text-[15px] placeholder:text-gray-400"
                />
                <button
                    onClick={() => {
                      setInputHidden((h) => !h);
                      show(inputHidden ? "Eingabe sichtbar" : "Eingabe verborgen");
                    }}
                    title="Ein-/Ausblenden"
                    className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-gray-600 shadow-sm active:scale-90 transition-transform flex-none"
                >
                  {inputHidden ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
                <button
                    onClick={sendMessage}
                    title="Senden"
                    className="w-9 h-9 rounded-full bg-[#f4d35e] hover:bg-[#eec84a] flex items-center justify-center text-[#7a5c00] shadow-sm active:scale-90 transition-transform flex-none"
                >
                  <Send size={16} />
                </button>
              </div>

              <div className="rounded-[20px] bg-[#fbe9d0] p-5 shadow-[0_1px_2px_rgba(20,20,30,.04),0_8px_20px_-12px_rgba(20,20,30,.12)] border border-black/5">
                <h2 className="text-lg font-semibold text-[#b06a1c]">Spiele-Menü</h2>
                <div className="flex gap-2.5 flex-wrap mt-3.5">
                  {GAMES.map((g) => (
                      <button
                          key={g.id}
                          onClick={() => {
                            setSelectedGame(g.id);
                            show(`Gewechselt zu ${g.label}`);
                          }}
                          className={`flex items-center gap-2 bg-white rounded-2xl px-4 py-3 font-semibold text-sm border-2 transition-all hover:-translate-y-0.5 ${
                              selectedGame === g.id
                                  ? "border-[#b06a1c] bg-orange-50"
                                  : "border-transparent"
                          }`}
                      >
                        <span>{g.emoji}</span>
                        {g.label}
                      </button>
                  ))}
                </div>
                <div className="mt-3 text-sm text-[#b06a1c]">
                  Aktives Spiel: <strong>{activeGame.label}</strong>
                </div>
              </div>
            </div>

            {/* History */}
            <div className="rounded-[20px] bg-[#fbe4e6] p-5 shadow-[0_1px_2px_rgba(20,20,30,.04),0_8px_20px_-12px_rgba(20,20,30,.12)] border border-black/5">
              <h2 className="text-lg font-semibold text-[#c14a56] flex items-center gap-1.5">
                <Clock size={18} /> History
              </h2>
              <p className="text-sm text-gray-500 mb-3">frühere Anfragen</p>
              <div className="flex flex-col gap-2">
                {history.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => loadFromHistory(item)}
                        className="bg-white rounded-xl px-3.5 py-2.5 flex items-center justify-between gap-2 text-left shadow-sm hover:translate-x-0.5 transition-transform"
                    >
                  <span>
                    <span className="block font-semibold text-sm">{item.title}</span>
                    <span className="block text-xs text-gray-500">{item.meta}</span>
                  </span>
                      <span className="w-2 h-2 rounded-full bg-rose-300 flex-none" />
                    </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Toast */}
        <div
            className={`fixed left-1/2 bottom-7 -translate-x-1/2 bg-[#1b2233] text-white px-5 py-2.5 rounded-full text-sm shadow-xl transition-all duration-300 z-50 max-w-[90vw] text-center ${
                toast ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3 pointer-events-none"
            }`}
        >
          {toast}
        </div>

        <style>{`
        @keyframes eq { 0%,100% { transform: scaleY(.6); } 50% { transform: scaleY(1.3); } }
        @keyframes pop { from { opacity:0; transform: translateY(4px); } to { opacity:1; transform: translateY(0); } }
      `}</style>
      </div>
  );
}