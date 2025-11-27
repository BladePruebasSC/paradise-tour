# Dashboard de Administración

El dashboard de administración permite gestionar tours, modificar imágenes, descripciones, precios y activar/desactivar tours usando un código de referido.

## Acceso al Dashboard

1. Navega a `/dashboard/login` en tu aplicación
2. Ingresa tu código de referido (ej: `CDERF`)
3. Si el código es válido y el usuario está activo, serás redirigido al dashboard

## Crear un Usuario del Dashboard

Para crear un usuario del dashboard con código de referido, ejecuta este SQL en Supabase:

```sql
INSERT INTO dashboard_users (email, name, role, commission_rate, referral_code, referral_link, is_active)
VALUES (
  'admin@paradise-tour.com',
  'Administrador',
  'admin',
  10.00,
  'CDERF',
  'https://paradise-tour.com/ref/CDERF',
  true
)
ON CONFLICT (referral_code) DO NOTHING;
```

O si prefieres que se genere automáticamente el código:

```sql
INSERT INTO dashboard_users (email, name, role, commission_rate, is_active)
VALUES (
  'admin@paradise-tour.com',
  'Administrador',
  'admin',
  10.00,
  true
)
ON CONFLICT (email) DO NOTHING;
```

El código de referido y el link se generarán automáticamente.

## Funcionalidades del Dashboard

### Gestión de Tours

- **Ver todos los tours**: Lista completa de tours con información básica
- **Crear nuevo tour**: Botón "Nuevo Tour" para agregar tours
- **Editar tour**: Click en el botón de editar para modificar:
  - Título
  - Descripción
  - Categoría
  - URL de imagen
  - Duración
  - Precios (adulto, niño, infante)
  - Incluye (separado por comas)
  - Calificación
  - Número de reseñas
  - Destacado (switch)
- **Eliminar tour**: Botón de eliminar con confirmación
- **Activar/Desactivar destacado**: Switch en cada tarjeta de tour

### Estadísticas

El dashboard muestra:
- Total de tours
- Reservas totales
- Ingresos totales
- Tu código de referido
- Número de referidos
- Ganancias totales

## Estructura de Archivos

```
src/
├── contexts/
│   └── DashboardAuthContext.tsx    # Contexto de autenticación
├── pages/
│   ├── Dashboard.tsx                # Página principal del dashboard
│   └── DashboardLogin.tsx           # Página de login
├── components/
│   └── Dashboard/
│       ├── TourManager.tsx          # Componente de gestión de tours
│       └── ProtectedRoute.tsx       # Componente de ruta protegida
└── lib/
    └── supabase/
        └── tours.ts                 # Servicios para CRUD de tours
```

## Seguridad

**Nota importante**: Las políticas actuales de Supabase permiten actualización pública de tours. Para producción, deberías:

1. Implementar autenticación de Supabase Auth
2. Crear políticas RLS que verifiquen el rol del usuario
3. Validar que el usuario tenga permisos de administrador antes de permitir modificaciones

Ejemplo de política más segura:

```sql
-- Política que solo permite actualización a usuarios autenticados con rol admin
CREATE POLICY "Allow admin update tours" ON tours
  FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM dashboard_users 
      WHERE user_id = auth.uid() 
      AND role = 'admin' 
      AND is_active = true
    )
  );
```

## Uso

1. **Acceder al dashboard**: 
   - Ve a `http://localhost:8080/dashboard/login`
   - Ingresa el código de referido (ej: `CDERF`)

2. **Crear un tour**:
   - Click en "Nuevo Tour"
   - Completa el formulario
   - Click en "Guardar"

3. **Editar un tour**:
   - Click en el botón de editar (ícono de lápiz)
   - Modifica los campos deseados
   - Click en "Guardar"

4. **Destacar un tour**:
   - Usa el switch "Destacado" en la tarjeta del tour
   - Se actualiza automáticamente

5. **Eliminar un tour**:
   - Click en el botón de eliminar (ícono de basura)
   - Confirma la eliminación

## Solución de Problemas

### No puedo acceder con mi código
- Verifica que el código existe en la tabla `dashboard_users`
- Verifica que `is_active = true` para ese usuario
- Revisa la consola del navegador para errores

### Los cambios no se guardan
- Verifica las políticas de seguridad en Supabase
- Revisa la consola del navegador para errores
- Verifica que las credenciales de Supabase estén correctas

### No veo mis tours
- Verifica que los tours existan en la base de datos
- Revisa la consola del navegador para errores de carga
- Verifica la conexión a Supabase

