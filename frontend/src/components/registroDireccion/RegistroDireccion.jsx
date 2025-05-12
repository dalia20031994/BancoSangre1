/* renderiza el formulario  para registrar una dirección que incluye los campos de texto y el mapa asi como la logica para la direccion*/
import { forwardRef } from "react";
import { AlertTriangle } from "lucide-react";
import usarRegistroDireccion from "./usarRegistroDireccion";
import LocationMap from "./MapComponents/LocationMap";
import MunicipioInput from "./FormComponents/MunicipioInput";
import ColoniaInput from "./FormComponents/ColoniaInput";
import CalleInput from "./FormComponents/CalleInput";
import NumeroInput from "./FormComponents/NumeroInput";

const RegistroDireccion = forwardRef((props, ref) => {
 
const {
    token,
    formState,
    formActions,
    formValidation,
    handleSubmit,
    cargando
  } = usarRegistroDireccion(props, ref);
  return (
    <div className="min-h-screen">
      <form onSubmit={handleSubmit} className="bg-white max-w-md mx-auto mt-8 p-6 rounded-lg shadow space-y-4">
        {formValidation.errores.general && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded">
            {formValidation.errores.general}
          </div>
        )}
        {formValidation.errores.ubicacion && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded">
            {formValidation.errores.ubicacion}
          </div>
        )}

        <LocationMap 
          latitud={formState.latitud} 
          longitud={formState.longitud} 
          nombreMunicipio={formState.nombreMunicipio}
          onMarkerDragEnd={formActions.handleMarkerDragEnd}
          onDetectLocation={formActions.detectarUbicacion}
        />

        <MunicipioInput
          value={formState.nombreMunicipio}
          onChange={formActions.setNombreMunicipio}
          municipioTocado={formState.municipioTocado}
          municipioValido={formValidation.municipioValido}
          errores={formValidation.errores}
          sugerencias={formState.sugerencias}
          onSuggestionClick={formActions.handleSuggestionClick}
          inputRef={formActions.inputRef}
        />

        <ColoniaInput
          value={formState.colonia}
          onChange={formActions.setColonia}
          disabled={!formValidation.municipioValido}
          isValid={formValidation.municipioValido && formState.colonia.trim() !== ""}
        />

        <CalleInput
          value={formState.calle}
          onChange={formActions.setCalle}
          disabled={!formValidation.municipioValido}
          isValid={formValidation.municipioValido && formState.calle.trim() !== ""}
        />

        <NumeroInput
          label="Número Exterior"
          required
          value={formState.numeroExterior}
          onChange={formActions.setNumeroExterior}
          disabled={!formValidation.municipioValido}
          isValid={formValidation.municipioValido && formState.numeroExterior.trim() !== "" && formValidation.validarNumero(formState.numeroExterior)}
          error={formState.numeroExterior === '' || !formValidation.validarNumero(formState.numeroExterior)}
          errorMessage={
            formState.numeroExterior === '' 
              ? "Debe ingresar un número o 'S/N' si no tiene número exterior."
              : "Número exterior inválido. Solo se permiten números mayores a 0 o 'S/N'."
          }
          placeholder='Número Exterior (o "S/N")'
        />

        <NumeroInput
          label="Número Interior"
          value={formState.numeroInterior}
          onChange={formActions.setNumeroInterior}
          disabled={!formValidation.municipioValido || !formValidation.validarNumero(formState.numeroExterior)}
          isValid={(formValidation.municipioValido && formState.numeroExterior.trim() !== "" && formValidation.validarNumero(formState.numeroInterior)) || formState.numeroInterior.trim() === ""}
          error={formState.numeroInterior !== '' && !formValidation.validarNumero(formState.numeroInterior)}
          errorMessage="Número interior inválido. Solo se permiten números mayores a 0 o 'S/N'."
          placeholder="Número Interior (opcional)"
        />

        {!props.hideSubmitButton && (
          <div className="flex justify-center">
            <div className="relative group">
              <button
                type="submit"
                disabled={!formValidation.formularioValido}
                className={`
                  bg-teal-700 text-white py-2 px-6 rounded-lg
                  hover:bg-teal-800 transition-colors
                  ${cargando || !formValidation.formularioValido ? "cursor-not-allowed opacity-50" : ""}
                `}
              >
                {cargando ? "Guardando..." : props.submitButtonText || "Guardar"}
              </button>

              {(!formValidation.formularioValido && !cargando) && (
                <div className="
                  absolute top-full mt-2 left-1/2 -translate-x-1/2
                  opacity-0 group-hover:opacity-100
                  transition-opacity
                  whitespace-nowrap
                  bg-red-600 text-white text-sm
                  flex items-center gap-1
                  px-3 py-2
                  rounded-lg shadow-lg
                  pointer-events-none
                ">
                  <AlertTriangle size={16} />
                  Completa todos los campos marcados con *
                </div>
              )}
            </div>
          </div>
        )}
      </form>
    </div>
  );
});

export default RegistroDireccion;