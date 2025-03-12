"use client"; // Indica que este archivo es un componente de cliente en Next.js
import { useState } from "react"; // Importa el hook useState de React para manejar el estado del componente
import * as XLSX from "xlsx"; // Importa la librería xlsx para manejar archivos Excel
import { Trabajador } from "../lib/definitions"; // Importa la definición del tipo Trabajador
import { registrarTrabajador } from "../lib/actions"; // Importa la función registrarTrabajador para registrar los datos del trabajador
import { ToastContainer, toast } from "react-toastify"; // Importa ToastContainer y toast de react-toastify
import "react-toastify/dist/ReactToastify.css"; // Importa los estilos de react-toastify
import { ClipLoader } from "react-spinners"; // Importa ClipLoader de react-spinners

export default function Page() {
  // Define el componente Page
  const [file, setFile] = useState<File | null>(null); // Define el estado 'file' para almacenar el archivo seleccionado
  const [loading, setLoading] = useState(false); // Define el estado 'loading' para manejar el estado de carga

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Maneja el cambio de archivo en el input
    if (e.target.files) {
      // Verifica si hay archivos seleccionados
      setFile(e.target.files[0]); // Establece el primer archivo seleccionado en el estado 'file'
    }
  };

  const processTrabajador = (trabajador: Trabajador) => {
    // Procesa los datos de un trabajador
    const formData = new FormData(); // Crea un nuevo objeto FormData para enviar los datos del trabajador
    formData.append("documento", trabajador.documento); // Agrega el documento del trabajador a formData
    formData.append("nombre", trabajador.nombre); // Agrega el nombre del trabajador a formData
    formData.append("genero", trabajador.genero); // Agrega el género del trabajador a formData

    const excelDate = trabajador.fechaNacimiento; // Obtiene la fecha de nacimiento del trabajador desde el archivo Excel
    const parsedDate = XLSX.SSF.parse_date_code(excelDate); // Parsea la fecha de nacimiento desde el formato Excel
    const fechaNacimiento = new Date(
      parsedDate.y,
      parsedDate.m - 1,
      parsedDate.d - 1
    ); // Crea un objeto Date con la fecha de nacimiento
    formData.append("fechaNacimiento", fechaNacimiento.toISOString()); // Agrega la fecha de nacimiento formateada a formData
    formData.append("cargo", trabajador.cargo); // Agrega el cargo del trabajador a formData
    formData.append("eps", trabajador.eps); // Agrega la EPS del trabajador a formData
    formData.append("salario", trabajador.salario.toString()); // Agrega el salario del trabajador a formData
    formData.append("ocupacion", trabajador.ocupacion); // Agrega la ocupación del trabajador a formData
    formData.append("tipoVinculacion", trabajador.tipoVinculacion); // Agrega el tipo de vinculación del trabajador a formData
    formData.append("afp", trabajador.afp); // Agrega la AFP del trabajador a formData
    formData.append("jornada", trabajador.jornada); // Agrega la jornada del trabajador a formData
    formData.append("contratacion", trabajador.contratacion); // Agrega la contratación del trabajador a formData
    registrarTrabajador(formData, "masivo"); // Llama a la función registrarTrabajador para registrar los datos del trabajador
  };

  const handleFileUpload = async () => {
    // Maneja la subida del archivo
    if (!file) return; // Si no hay archivo seleccionado, no hace nada

    setLoading(true); // Establece el estado de carga a true
    toast.info("Procesando archivo, por favor espere sin cerrar ni cambiar de pagina..."); // Muestra una notificación de información

    try {
      const reader = new FileReader(); // Crea un nuevo FileReader para leer el archivo
      reader.onload = async (e) => {
        // Define la función que se ejecuta cuando el archivo se ha leído
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer); // Convierte el resultado de la lectura a un Uint8Array
          const workbook = XLSX.read(data, { type: "array" }); // Lee el archivo Excel y crea un workbook
          const sheetName = workbook.SheetNames[0]; // Obtiene el nombre de la primera hoja del workbook
          const worksheet = XLSX.utils.sheet_to_json(
            workbook.Sheets[sheetName]
          ); // Convierte la hoja a un array de objetos JSON

          worksheet.forEach((row) => {
            // Itera sobre cada fila del worksheet
            const trabajador = row as Trabajador; // Convierte la fila a un objeto Trabajador
            processTrabajador(trabajador); // Procesa los datos del trabajador
          });

          toast.success("Archivo procesado exitosamente!"); // Muestra una notificación de éxito
        } catch (error) {
          console.error("Error processing file:", error); // Imprime un error en consola si ocurre un problema al procesar el archivo
          toast.error("Error procesando el archivo."); // Muestra una notificación de error
        } finally {
          setLoading(false); // Establece el estado de carga a false
        }
      };
      reader.readAsArrayBuffer(file); // Lee el archivo como un ArrayBuffer
    } catch (error) {
      console.error("Error reading file:", error); // Imprime un error en consola si ocurre un problema al leer el archivo
      toast.error("Error leyendo el archivo."); // Muestra una notificación de error
      setLoading(false); // Establece el estado de carga a false
    }
  };

  return (
    // Renderiza el componente
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md">
        <h1 className="text-2xl font-bold mb-4 text-black">Cargue Masivo</h1>{" "}
        {/*Título de la página*/}
        <input
          type="file"
          accept=".xlsx"
          onChange={handleFileChange}
          className="mb-4"
          style={{ color: "black" }} // Cambia el color del texto a negro
        />
        {/*Input para seleccionar el archivo Excel*/}
        <div className="flex flex-col space-y-4">
          <button
            onClick={handleFileUpload}
            className="bg-blue-500 text-white px-4 py-2 rounded"
            disabled={loading} // Deshabilita el botón si está cargando
          >
            {loading ? <ClipLoader size={20} color={"#fff"} /> : "Cargar"}
          </button>
          {/*Botón para subir el archivo*/}
          <button
            onClick={() => window.history.back()}
            className="bg-gray-500 text-white px-4 py-2 rounded"
            disabled={loading} // Deshabilita el botón si está cargando
          >
            Regresar
          </button>
          {/*Botón para regresar*/}
        </div>
      </div>
      <ToastContainer /> {/* Contenedor de notificaciones */}
    </div>
  );
}
