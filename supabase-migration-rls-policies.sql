-- Migración: Agregar políticas RLS para dashboard_users
-- Ejecuta este script en el SQL Editor de Supabase

-- Eliminar políticas existentes si existen
DROP POLICY IF EXISTS "Allow public read active dashboard users" ON dashboard_users;
DROP POLICY IF EXISTS "Allow public insert dashboard users" ON dashboard_users;
DROP POLICY IF EXISTS "Allow public update dashboard users" ON dashboard_users;

-- Política para lectura: solo usuarios activos
CREATE POLICY "Allow public read active dashboard users" ON dashboard_users
  FOR SELECT USING (is_active = true);

-- Política para inserción: permitir crear usuarios (para el dashboard)
CREATE POLICY "Allow public insert dashboard users" ON dashboard_users
  FOR INSERT WITH CHECK (true);

-- Política para actualización: permitir actualizar usuarios (para el dashboard)
CREATE POLICY "Allow public update dashboard users" ON dashboard_users
  FOR UPDATE USING (true)
  WITH CHECK (true);

