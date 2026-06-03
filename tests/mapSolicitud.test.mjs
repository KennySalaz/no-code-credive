import { test } from "node:test";
import assert from "node:assert/strict";
import { mapSolicitud } from "../netlify/lib/mapSolicitud.mjs";

const input = {
  nombre: "  Ana Pérez ",
  correo: "ana@example.com",
  telefono: "0412-1234567",
  cedula: "V-12.345.678",
};

test("usa los nombres de campo reales de la tabla Clientes", () => {
  const f = mapSolicitud(input, "tok-123");
  assert.deepEqual(
    Object.keys(f).sort(),
    ["Cedula", "Celular", "Correo", "Estado", "Nombres", "Token"].sort()
  );
});

test("recorta el nombre y fija estado inicial y token", () => {
  const f = mapSolicitud(input, "tok-123");
  assert.equal(f.Nombres, "Ana Pérez");
  assert.equal(f.Estado, " Por Verificar");
  assert.equal(f.Token, "tok-123");
});

test("convierte la cédula a número (Cedula es number en Airtable)", () => {
  const f = mapSolicitud(input, "tok-123");
  assert.equal(f.Cedula, 12345678);
  assert.equal(typeof f.Cedula, "number");
});

test("omite Cedula si no hay dígitos válidos", () => {
  const f = mapSolicitud({ ...input, cedula: "abc" }, "tok-123");
  assert.equal(f.Cedula, undefined);
});

test("incluye el cuestionario cuando viene", () => {
  const f = mapSolicitud(
    {
      ...input,
      fuenteIngresos: "Negocio propio",
      sectorEconomico: "Comercio",
      rangoIngresos: "VES 1M-3M",
      destinoCredito: "Compra inventario",
    },
    "tok-123"
  );
  assert.equal(f["Fuente de Ingresos"], "Negocio propio");
  assert.equal(f["Sector Económico"], "Comercio");
  assert.equal(f["Rango de Ingresos"], "VES 1M-3M");
  assert.equal(f["Destino del Crédito"], "Compra inventario");
});

test("no agrega campos de cuestionario si no vienen", () => {
  const f = mapSolicitud(input, "tok-123");
  assert.equal(f["Fuente de Ingresos"], undefined);
  assert.equal(f["Destino del Crédito"], undefined);
});
