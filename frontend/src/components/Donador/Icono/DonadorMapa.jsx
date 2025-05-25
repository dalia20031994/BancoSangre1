// components/BloodIcon.jsx
import L from 'leaflet';

const DonadorMapa = ({ tipoSangre }) => {
  const colors = {
    'A+': '#FF5252', 'A-': '#E53935',
    'B+': '#448AFF', 'B-': '#2962FF',
    'AB+': '#4CAF50', 'AB-': '#2E7D32',
    'O+': '#FF9800', 'O-': '#E65100'
  };
  
  return L.divIcon({
    html: `
      <div class="flex flex-col items-center font-sans relative w-8">
        <div class="flex justify-center gap-0.5 mb-0.5">
          <div class="w-1 h-1.5 rounded-sm" style="background-color: ${colors[tipoSangre] || '#E53935'}"></div>
          <div class="w-1 h-2.5 rounded-sm" style="background-color: ${colors[tipoSangre] || '#E53935'}"></div>
          <div class="w-1 h-1.5 rounded-sm" style="background-color: ${colors[tipoSangre] || '#E53935'}"></div>
        </div>
        <div class="relative w-8 h-10 rounded-md flex items-center justify-center text-white font-semibold text-[0.85rem] border border-white/80 shadow-sm select-none tracking-wide"
          style="background: linear-gradient(to top, ${colors[tipoSangre] || '#E53935'} 80%, rgba(255,255,255,0.4) 80%);">
          ${tipoSangre}
          <svg width="10" height="10" viewBox="0 0 24 24" fill="#e53935" class="absolute -top-1 -right-1 drop-shadow-[0_1px_1px_rgba(0,0,0,0.2)]">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 
                     2 6.01 4.01 4 6.5 4c1.74 0 3.41 1.01 
                     4.13 2.44h1.74C14.09 5.01 15.76 4 17.5 4 
                     19.99 4 22 6.01 22 8.5c0 3.78-3.4 6.86-8.55 
                     11.54L12 21.35z"/>
          </svg>
        </div>
      </div>
    `,
    iconSize: [32, 48],
    iconAnchor: [16, 48],
  });
};

export default DonadorMapa;