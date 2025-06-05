import React, { useEffect, useState, useContext, useRef } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { AuthContext } from '../auth/AuthContext';
import { getAuthenticatedUser } from '../api/usuarios.api';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28CFF', '#FF6699'];

export default function Reportes() {
  const { token } = useContext(AuthContext);
  const { nombreRol } = useParams();

  const [esValido, setEsValido] = useState(null);
  const [nombreUsuario, setNombreUsuario] = useState('');
  const [donadores, setDonadores] = useState([]);
  const [citas, setCitas] = useState([]);
  const [notificaciones, setNotificaciones] = useState([]);
  const [direcciones, setDirecciones] = useState([]);
  const [colonias, setColonias] = useState([]);
  const [municipios, setMunicipios] = useState([]);
  const [loadingDatos, setLoadingDatos] = useState(false);
  const [errorDatos, setErrorDatos] = useState(null);

  const donadoresChartRef = useRef(null);
  const citasChartRef = useRef(null);
  const litrosChartRef = useRef(null);

  useEffect(() => {
    async function validarUsuario() {
      if (!token) {
        setEsValido(false);
        return;
      }
      try {
        const usuarioData = await getAuthenticatedUser(token);
        const rol = usuarioData.rol?.toLowerCase();
        const usuario = usuarioData.nombre_usuario;
        if (rol === nombreRol.toLowerCase()) {
          setNombreUsuario(usuario);
          setEsValido(true);
        } else {
          setEsValido(false);
        }
      } catch (error) {
        console.error('Error al obtener usuario autenticado:', error);
        setEsValido(false);
      }
    }
    validarUsuario();
  }, [token, nombreRol]);

  useEffect(() => {
    if (esValido) {
      async function fetchData() {
        setLoadingDatos(true);
        try {
          const [
            donRes, citasRes, notRes, dirRes, colRes, munRes
          ] = await Promise.all([
            fetch('http://localhost:8000/api/donador', { headers: { Authorization: `Bearer ${token}` } }),
            fetch('http://localhost:8000/api/cita', { headers: { Authorization: `Bearer ${token}` } }),
            fetch('http://localhost:8000/api/notificaciones/historial/', { headers: { Authorization: `Bearer ${token}` } }),
            fetch('http://localhost:8000/api/direccion', { headers: { Authorization: `Bearer ${token}` } }),
            fetch('http://localhost:8000/api/colonia', { headers: { Authorization: `Bearer ${token}` } }),
            fetch('http://localhost:8000/api/municipio', { headers: { Authorization: `Bearer ${token}` } }),
          ]);

          if (!donRes.ok || !citasRes.ok || !notRes.ok || !dirRes.ok || !colRes.ok || !munRes.ok) {
            throw new Error('Error cargando datos de la API');
          }

          const [donData, citasData, notData, dirData, colData, munData] = await Promise.all([
            donRes.json(), citasRes.json(), notRes.json(),
            dirRes.json(), colRes.json(), munRes.json()
          ]);

          setDonadores(donData);
          setCitas(citasData);
          setNotificaciones(notData);
          setDirecciones(dirData);
          setColonias(colData);
          setMunicipios(munData);
          setErrorDatos(null);
        } catch (err) {
          console.error('Error fetching data:', err);
          setErrorDatos(err.message);
        } finally {
          setLoadingDatos(false);
        }
      }
      fetchData();
    }
  }, [esValido, token]);

  const donadoresPorTipoSangre = donadores.reduce((acc, don) => {
    acc[don.tipoSangre] = (acc[don.tipoSangre] || 0) + 1;
    return acc;
  }, {});
  const donadoresData = Object.entries(donadoresPorTipoSangre).map(([tipo, count]) => ({ tipo, count }));

  const citasPorEstado = citas.reduce((acc, cita) => {
    acc[cita.estado] = (acc[cita.estado] || 0) + 1;
    return acc;
  }, {});
  const citasData = Object.entries(citasPorEstado).map(([estado, count]) => ({ estado, count }));

  const litrosPorTipoSangre = notificaciones.reduce((acc, not) => {
    acc[not.tipo_sangre] = (acc[not.tipo_sangre] || 0) + (not.litros_requeridos || 0);
    return acc;
  }, {});
  const litrosData = Object.entries(litrosPorTipoSangre).map(([tipo, litros]) => ({ tipo, litros }));

  const exportToExcel = () => {
    const wb = XLSX.utils.book_new();

    const donadoresSheetData = [
      ['Nombre Completo', 'Tipo Sangre', 'Última Donación', 'Dirección Completa'],
      ...donadores.map(don => {
        const nombreCompleto = `${don.nombre} ${don.apellidoP} ${don.apellidoM}`;
        const ultimaDon = don.ultimaDonacion !== '1900-01-01' ? don.ultimaDonacion : 'N/A';
        const direccion = direcciones.find(dir => dir.id === don.direccion);
        const calle = direccion?.calle || '';
        const numero = direccion?.numero || '';
        const colonia = colonias.find(c => c.id === direccion?.colonia);
        const municipio = municipios.find(m => m.id === direccion?.municipio);
        const direccionCompleta = `${calle} ${numero}, ${colonia?.nombre || ''}, ${municipio?.nombre || ''}`;
        return [nombreCompleto, don.tipoSangre, ultimaDon, direccionCompleta];
      }),
    ];
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(donadoresSheetData), 'Donadores');

    const citasSheetData = [
      ['Donador', 'Fecha', 'Hora', 'Estado'],
      ...citas.map(cita => {
        const donador = donadores.find(d => d.id === cita.donador);
        const nombreCompleto = donador ? `${donador.nombre} ${donador.apellidoP} ${donador.apellidoM}` : `ID: ${cita.donador}`;
        return [nombreCompleto, cita.fecha, cita.hora, cita.estado];
      }),
    ];
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(citasSheetData), 'Citas');

    const notificacionesSheetData = [
      ['Título', 'Mensaje', 'Tipo Sangre', 'Litros Requeridos', 'Fecha Creación'],
      ...notificaciones.map(not => [
        not.titulo, not.mensaje, not.tipo_sangre, not.litros_requeridos, not.fecha_creacion,
      ]),
    ];
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(notificacionesSheetData), 'Notificaciones');

    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    saveAs(new Blob([wbout], { type: 'application/octet-stream' }), 'reportes.xlsx');
  };

  const exportToPDF = async () => {
    const doc = new jsPDF('p', 'mm', 'a4');
    const chartRefs = [donadoresChartRef, citasChartRef, litrosChartRef];
    const titles = [
      'Distribución de Donadores por Tipo de Sangre',
      'Estado de Citas',
      'Litros Requeridos por Tipo de Sangre',
    ];

    for (let i = 0; i < chartRefs.length; i++) {
      const ref = chartRefs[i];
      const element = ref.current;

      if (element) {
        const canvas = await html2canvas(element);
        const imgData = canvas.toDataURL('image/png');
        const pageWidth = doc.internal.pageSize.getWidth();
        const imgProps = doc.getImageProperties(imgData);
        const pdfHeight = (imgProps.height * pageWidth) / imgProps.width;

        if (i > 0) doc.addPage();
        doc.setFontSize(16);
        doc.text(titles[i], 10, 20);
        doc.addImage(imgData, 'PNG', 10, 30, pageWidth - 20, pdfHeight);
      }
    }

    doc.save('reportes_graficos.pdf');
  };

  if (esValido === null) return <div className="text-center mt-10 text-lg text-gray-700">Validando usuario...</div>;
  if (!esValido) return <Navigate to="/login" replace />;
  if (loadingDatos) return <div className="p-4 text-center text-lg font-semibold">Cargando reportes...</div>;
  if (errorDatos) return <div className="p-4 text-center text-red-600 font-semibold">Error: {errorDatos}</div>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Reportes para {nombreUsuario}</h1>

      <div className="mb-8 flex gap-4">
        <button
          onClick={exportToExcel}
          className="bg-blue-600 text-white px-5 py-2 rounded shadow hover:bg-blue-700 transition"
        >
          Descargar Reportes (Excel)
        </button>
        <button
          onClick={exportToPDF}
          className="bg-green-600 text-white px-5 py-2 rounded shadow hover:bg-green-700 transition"
        >
          Descargar Gráficos (PDF)
        </button>
      </div>

      <section className="mb-12" ref={donadoresChartRef}>
        <h2 className="text-2xl font-semibold mb-4">Distribución de Donadores por Tipo de Sangre</h2>
        {donadoresData.length === 0 ? (
          <p>No hay datos disponibles.</p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={donadoresData}>
              <XAxis dataKey="tipo" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#8884d8" name="Cantidad" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </section>

      <section className="mb-12" ref={citasChartRef}>
        <h2 className="text-2xl font-semibold mb-4">Estado de Citas</h2>
        {citasData.length === 0 ? (
          <p>No hay datos disponibles.</p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={citasData}
                dataKey="count"
                nameKey="estado"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={(entry) => entry.estado}
              >
                {citasData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        )}
      </section>

      <section ref={litrosChartRef}>
        <h2 className="text-2xl font-semibold mb-4">Litros Requeridos por Tipo de Sangre</h2>
        {litrosData.length === 0 ? (
          <p>No hay datos disponibles.</p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={litrosData}>
              <XAxis dataKey="tipo" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="litros" fill="#ffc658" name="Litros Requeridos" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </section>
    </div>
  );
}
