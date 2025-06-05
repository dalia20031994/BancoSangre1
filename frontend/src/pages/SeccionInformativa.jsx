import { useState } from "react";
import { Heart, Info, AlertCircle, CalendarClock, ShieldCheck } from "lucide-react";
const items = [
  {
    key: "requisitos",
    icon: <Info className="w-5 h-5 mr-2 text-red-500" />,
    title: "¿Cuáles son los requisitos básicos para donar sangre?",
    content: (
      <ul className="list-disc list-inside text-gray-700 space-y-1">
        <li>Tener entre 18 y 65 años de edad.</li>
        <li>Pesar más de 50 kg.</li>
        <li>Presentar una identificación oficial con fotografía.</li>
        <li>Haber dormido al menos 6 horas la noche anterior.</li>
        <li>No haber ingerido alcohol en las últimas 48 horas.</li>
        <li>No haberse hecho tatuajes, perforaciones o cirugías en los últimos 12 meses.</li>
        <li>Tener buena salud en general.</li>
      </ul>
    ),
  },
  {
    key: "antes",
    icon: <CalendarClock className="w-5 h-5 mr-2 text-red-500" />,
    title: "¿Qué debo hacer antes de donar sangre?",
    content: (
      <ul className="list-disc list-inside text-gray-700 space-y-1">
        <li>Desayunar ligero (evitar grasas y lácteos).</li>
        <li>Estar bien hidratado.</li>
        <li>Evitar fumar al menos 2 horas antes de donar.</li>
        <li>Asistir con ropa cómoda que permita el acceso al brazo.</li>
      </ul>
    ),
  },
  {
    key: "frecuencia",
    icon: <CalendarClock className="w-5 h-5 mr-2 text-red-500" />,
    title: "¿Con qué frecuencia se puede donar sangre?",
    content: (
      <ul className="list-disc list-inside text-gray-700 space-y-1">
        <li><strong>Hombres:</strong> cada 8 semanas (2 meses).</li>
        <li><strong>Mujeres:</strong> cada 12 semanas (3 meses).</li>
      </ul>
    ),
  },
  {
    key: "despues",
    icon: <AlertCircle className="w-5 h-5 mr-2 text-red-500" />,
    title: "¿Qué pasa después de donar?",
    content: (
      <ul className="list-disc list-inside text-gray-700 space-y-1">
        <li>Permanecer en observación por 10-15 minutos.</li>
        <li>Evitar esfuerzos físicos fuertes durante el resto del día.</li>
        <li>Beber abundantes líquidos y alimentarse bien.</li>
        <li>No consumir alcohol ni tabaco en las siguientes 4-6 horas.</li>
      </ul>
    ),
  },
  {
    key: "enfermedades",
    icon: <ShieldCheck className="w-5 h-5 mr-2 text-red-500" />,
    title: "¿Se puede contraer alguna enfermedad por donar sangre?",
    content: (
      <p className="text-gray-700">
        No. Todo el equipo utilizado es estéril y desechable. El procedimiento es seguro y no representa ningún riesgo de contagio.
      </p>
    ),
  },
];
export default function DonacionFAQ() {
  const [openItem, setOpenItem] = useState(null);

  const toggle = (key) => {
    setOpenItem(openItem === key ? null : key);
  };

  return (
    <section className="max-w-3xl mx-auto p-6 bg-white rounded-2xl shadow-lg">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-red-600 flex items-center justify-center gap-2">
          <Heart className="text-red-500 w-8 h-8" /> Preguntas Frecuentes – Donación de Sangre
        </h2>
        <p className="text-gray-600 mt-2">
          Todo lo que necesitas saber antes y después de donar sangre.
        </p>
      </div>

      <div className="space-y-4">
        {items.map(({ key, icon, title, content }) => (
          <div key={key} className="border border-gray-200 rounded-lg">
            <button
              onClick={() => toggle(key)}
              className="w-full flex items-center justify-between text-left px-4 py-3 text-lg font-semibold hover:bg-gray-50"
            >
              <span className="flex items-center">{icon}{title}</span>
              <span>{openItem === key ? "−" : "+"}</span>
            </button>
            {openItem === key && (
              <div className="px-5 pb-4">
                {content}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
