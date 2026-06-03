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
