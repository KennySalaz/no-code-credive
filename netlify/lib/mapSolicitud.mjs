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

  // Cuestionario (paso 2): se agrega cada dato solo si viene.
  if (input.fuenteIngresos) fields["Fuente de Ingresos"] = String(input.fuenteIngresos);
  if (input.sectorEconomico) fields["Sector Económico"] = String(input.sectorEconomico);
  if (input.rangoIngresos) fields["Rango de Ingresos"] = String(input.rangoIngresos);
  if (input.destinoCredito) fields["Destino del Crédito"] = String(input.destinoCredito);

  return fields;
}
