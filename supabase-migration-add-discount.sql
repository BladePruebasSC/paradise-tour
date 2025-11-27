-- Migración: Agregar columna discount_percentage a dashboard_users
-- Ejecuta este script en el SQL Editor de Supabase si ya tienes la tabla creada

-- Agregar columna discount_percentage si no existe
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'dashboard_users' 
    AND column_name = 'discount_percentage'
  ) THEN
    ALTER TABLE dashboard_users 
    ADD COLUMN discount_percentage DECIMAL(5, 2) DEFAULT 0 
    CHECK (discount_percentage >= 0 AND discount_percentage <= 100);
  END IF;
END $$;

-- Actualizar registros existentes para tener descuento 0 por defecto
UPDATE dashboard_users 
SET discount_percentage = 0 
WHERE discount_percentage IS NULL;

