import { useMemo, useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  Circle,
  Inbox,
  ListTodo,
  Plus,
  Sparkles,
  Users,
  WandSparkles,
} from "lucide-react";

const initialItems = [
  {
    id: 1,
    type: "event",
    title: "Pediatra · Adriana",
    date: "Hoy · 17:15",
    person: "Adriana",
    source: "Calendario",
  },
  {
    id: 2,
    type: "task",
    title: "Preparar mochila de piscina",
    date: "Mañana",
    person: "Héctor",
    source: "Colegio",
  },
  {
    id: 3,
    type: "event",
    title: "Cumpleaños de Lucía",
    date: "Sábado · 17:30",
    person: "Familia",
    source: "WhatsApp",
  },
];

function classify(text) {
  const clean = text.trim();
  if (!clean) return null;

  const lower = clean.toLowerCase();
  const isTask =
    lower.includes("llevar") ||
    lower.includes("traer") ||
    lower.includes("comprar") ||
    lower.includes("firmar") ||
    lower.includes("recordar");

  const detectedPerson =
    ["adriana", "héctor", "hector"].find((name) => lower.includes(name)) || "familia";

  const person =
    detectedPerson === "adriana"
      ? "Adriana"
      : detectedPerson === "héctor" || detectedPerson === "hector"
        ? "Héctor"
        : "Familia";

  const dateMatch =
    clean.match(/\b(lunes|martes|miércoles|miercoles|jueves|viernes|sábado|sabado|domingo)\b/i) ||
    clean.match(/\b\d{1,2}[/-]\d{1,2}(?:[/-]\d{2,4})?\b/);

  return {
    id: Date.now(),
    type: isTask ? "task" : "event",
    title: clean.length > 72 ? clean.slice(0, 69) + "…" : clean,
    date: dateMatch ? dateMatch[0] : "Pendiente de confirmar",
    person,
    source: "Entrada rápida",
  };
}

export default function App() {
  const [items, setItems] = useState(initialItems);
  const [input, setInput] = useState("");
  const [done, setDone] = useState([]);

  const tasksPending = useMemo(
    () => items.filter((item) => item.type === "task" && !done.includes(item.id)).length,
    [items, done]
  );

  function addFromInbox() {
    const parsed = classify(input);
    if (!parsed) return;
    setItems((current) => [parsed, ...current]);
    setInput("");
  }

  function toggleDone(id) {
    setDone((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    );
  }

  return (
    <main className="app-shell">
      <section className="phone">
        <header className="topbar">
          <div>
            <p className="eyebrow">Mi familia</p>
            <h1>Nido</h1>
          </div>
          <button className="avatar" aria-label="Perfil familiar">
            RS
          </button>
        </header>

        <section className="hero-card">
          <div className="hero-icon">
            <Sparkles size={22} />
          </div>
          <div>
            <p className="eyebrow">Buenos días</p>
            <h2>Hoy está bastante controlado.</h2>
            <p>
              Tienes {tasksPending} {tasksPending === 1 ? "tarea pendiente" : "tareas pendientes"} y una cita esta tarde.
            </p>
          </div>
        </section>

        <section className="capture-card">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Entrada rápida</p>
              <h3>Mándame cualquier cosa</h3>
            </div>
            <WandSparkles size={22} />
          </div>

          <textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Pega un WhatsApp, una circular del colegio o escribe: «El martes Héctor tiene dentista a las 17:30»"
          />

          <div className="capture-footer">
            <span>La IA detectará persona, fecha y acción.</span>
            <button onClick={addFromInbox} disabled={!input.trim()}>
              <Plus size={18} />
              Organizar
            </button>
          </div>
        </section>

        <section className="stats">
          <article>
            <CalendarDays size={20} />
            <strong>3</strong>
            <span>Esta semana</span>
          </article>
          <article>
            <ListTodo size={20} />
            <strong>{tasksPending}</strong>
            <span>Pendientes</span>
          </article>
          <article>
            <Users size={20} />
            <strong>4</strong>
            <span>Familia</span>
          </article>
        </section>

        <section className="agenda">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Agenda familiar</p>
              <h3>Lo próximo</h3>
            </div>
            <button className="text-button">Ver todo</button>
          </div>

          <div className="agenda-list">
            {items.map((item) => {
              const completed = done.includes(item.id);
              return (
                <article className={`agenda-item ${completed ? "completed" : ""}`} key={item.id}>
                  <button
                    className="check"
                    onClick={() => item.type === "task" && toggleDone(item.id)}
                    aria-label={item.type === "task" ? "Marcar tarea" : "Evento"}
                  >
                    {item.type === "task" ? (
                      completed ? <CheckCircle2 size={22} /> : <Circle size={22} />
                    ) : (
                      <CalendarDays size={21} />
                    )}
                  </button>

                  <div className="agenda-copy">
                    <strong>{item.title}</strong>
                    <span>{item.date} · {item.person}</span>
                  </div>

                  <span className="source">{item.source}</span>
                </article>
              );
            })}
          </div>
        </section>

        <nav className="bottom-nav">
          <button className="active"><Inbox size={20} /><span>Inicio</span></button>
          <button><CalendarDays size={20} /><span>Agenda</span></button>
          <button><ListTodo size={20} /><span>Tareas</span></button>
          <button><Users size={20} /><span>Familia</span></button>
        </nav>
      </section>
    </main>
  );
}
