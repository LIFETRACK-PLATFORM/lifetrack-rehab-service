-- Antes del fix de upsertForDay, cada tap de +/- creaba una fila nueva en
-- ExerciseLog en vez de actualizar la del dia, y el progreso sumaba todas
-- las filas. Esto deja "current" inflado (ej. 2446/90) para exercises con
-- multiples logs el mismo dia. Esta migracion colapsa esos duplicados,
-- dejando una sola fila por (exerciseId, dia calendario): la mas reciente,
-- que ya tiene el valor final correcto de esa sesion.
DELETE FROM "ExerciseLog" el
WHERE el.id NOT IN (
  SELECT DISTINCT ON ("exerciseId", "date"::date) id
  FROM "ExerciseLog"
  ORDER BY "exerciseId", "date"::date, "date" DESC
);
