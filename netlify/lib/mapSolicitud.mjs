// Lógica PURA: mapea el payload del formulario a los campos REALES de la
// tabla Clientes. Solo incluye campos que existen hoy en Airtable.
export function mapSolicitud(input, token) {
  const fields = {
    Nombres: String(input.nombre ?? "").trim(),
    Correo: String(input.correo ?? "").trim(),
    Celular: String(input.telefono ?? "").trim(),
    // OJO: la opción del select "Estado" en Airtable tiene un espacio inicial heredado
    // (" Por Verificar"). Debe coincidir EXACTAMENTE o Airtable rechaza el registro.
    Estado: " Por Verificar",
    Token: token,
  };

  // Cedula es de tipo number en Airtable: extraer solo dígitos.
  const digits = String(input.cedula ?? "").replace(/\D/g, "");
  if (digits.length > 0) {
    fields.Cedula = Number(digits);
  }

  return fields;
}
