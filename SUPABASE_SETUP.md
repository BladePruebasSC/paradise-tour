# Configuración de Supabase

Este proyecto está configurado para usar Supabase como base de datos. Sigue estos pasos para completar la configuración:

## 1. Crear un proyecto en Supabase

1. Ve a [https://app.supabase.com](https://app.supabase.com)
2. Crea una cuenta o inicia sesión
3. Crea un nuevo proyecto
4. Espera a que se complete la configuración (puede tomar unos minutos)

## 2. Obtener las credenciales de API

1. En tu proyecto de Supabase, ve a **Settings** > **API**
2. Copia los siguientes valores:
   - **Project URL** (URL del proyecto)
   - **anon public** key (clave pública anónima)

## 3. Configurar las variables de entorno

1. Crea un archivo `.env` en la raíz del proyecto (si no existe)
2. Agrega las siguientes variables:

```env
VITE_SUPABASE_URL=tu_url_de_supabase
VITE_SUPABASE_ANON_KEY=tu_clave_anonima
```

**Ejemplo:**
```env
VITE_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 4. Crear las tablas en Supabase

1. En tu proyecto de Supabase, ve a **SQL Editor**
2. Abre el archivo `supabase-schema.sql` de este proyecto
3. Copia y pega todo el contenido en el editor SQL
4. Ejecuta el script (botón "Run" o F5)

Esto creará:
- La tabla `tours` con datos de ejemplo
- La tabla `combos` con datos de ejemplo
- La tabla `reviews` (reseñas) con datos de ejemplo
- La tabla `bookings` (reservas)
- La tabla `dashboard_users` (usuarios del dashboard con links de referidos)
- La tabla `referrals` (seguimiento de referidos)
- Las políticas de seguridad necesarias
- Funciones automáticas para generar números de reserva y códigos de referido
- Triggers para actualizar estadísticas automáticamente

## 5. Verificar la conexión

1. Reinicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```

2. Abre la aplicación en tu navegador
3. Deberías ver los tours y combos cargándose desde Supabase

## Estructura de las tablas

### Tabla `tours`
- `id` (UUID): Identificador único
- `title` (TEXT): Título del tour
- `description` (TEXT): Descripción del tour
- `category` (TEXT): Categoría (Acuático, Crucero, Cultural, Aventura, etc.)
- `image` (TEXT): URL de la imagen
- `duration` (TEXT): Duración del tour
- `price_adult` (DECIMAL): Precio para adultos
- `price_child` (DECIMAL): Precio para niños
- `price_infant` (DECIMAL): Precio para infantes
- `featured` (BOOLEAN): Si el tour está destacado
- `includes` (JSONB): Array de strings con lo que incluye
- `rating` (DECIMAL): Calificación (0-5)
- `reviews` (INTEGER): Número de reseñas
- `created_at` (TIMESTAMP): Fecha de creación
- `updated_at` (TIMESTAMP): Fecha de actualización

### Tabla `combos`
- `id` (TEXT): Identificador único
- `title` (TEXT): Título del combo
- `description` (TEXT): Descripción del combo
- `tour_ids` (TEXT[]): Array de IDs de tours incluidos
- `original_price` (DECIMAL): Precio original
- `discounted_price` (DECIMAL): Precio con descuento
- `discount` (INTEGER): Porcentaje de descuento
- `image` (TEXT): URL de la imagen
- `created_at` (TIMESTAMP): Fecha de creación
- `updated_at` (TIMESTAMP): Fecha de actualización

### Tabla `reviews`
- `id` (TEXT): Identificador único
- `tour_id` (TEXT): ID del tour (opcional, puede ser NULL para reseñas generales)
- `name` (TEXT): Nombre del reseñador
- `email` (TEXT): Email del reseñador (opcional)
- `rating` (INTEGER): Calificación de 1 a 5
- `comment` (TEXT): Comentario de la reseña
- `verified` (BOOLEAN): Si la reseña está verificada
- `created_at` (TIMESTAMP): Fecha de creación
- `updated_at` (TIMESTAMP): Fecha de actualización

### Tabla `bookings`
- `id` (TEXT): Identificador único
- `booking_number` (TEXT): Número único de reserva (generado automáticamente)
- `tour_id` (TEXT): ID del tour reservado
- `customer_name` (TEXT): Nombre del cliente
- `customer_email` (TEXT): Email del cliente
- `customer_phone` (TEXT): Teléfono del cliente
- `booking_date` (DATE): Fecha de la reserva
- `adults` (INTEGER): Número de adultos
- `children` (INTEGER): Número de niños
- `infants` (INTEGER): Número de infantes
- `total_price` (DECIMAL): Precio total
- `status` (TEXT): Estado (pending, confirmed, cancelled, completed)
- `notes` (TEXT): Notas adicionales
- `referral_code` (TEXT): Código de referido usado (opcional)
- `created_at` (TIMESTAMP): Fecha de creación
- `updated_at` (TIMESTAMP): Fecha de actualización

### Tabla `dashboard_users`
- `id` (TEXT): Identificador único
- `email` (TEXT): Email único del usuario
- `name` (TEXT): Nombre del usuario
- `referral_code` (TEXT): Código único de referido (generado automáticamente)
- `referral_link` (TEXT): Link de referido completo (generado automáticamente)
- `user_id` (UUID): ID del usuario en auth.users (opcional, para integración con Supabase Auth)
- `role` (TEXT): Rol del usuario (admin, affiliate, manager)
- `total_referrals` (INTEGER): Total de referidos
- `total_earnings` (DECIMAL): Ganancias totales
- `commission_rate` (DECIMAL): Porcentaje de comisión (por defecto 10%)
- `is_active` (BOOLEAN): Si el usuario está activo
- `created_at` (TIMESTAMP): Fecha de creación
- `updated_at` (TIMESTAMP): Fecha de actualización

### Tabla `referrals`
- `id` (TEXT): Identificador único
- `dashboard_user_id` (TEXT): ID del usuario del dashboard
- `booking_id` (TEXT): ID de la reserva asociada
- `referral_code` (TEXT): Código de referido usado
- `commission_amount` (DECIMAL): Monto de la comisión
- `status` (TEXT): Estado (pending, paid, cancelled)
- `created_at` (TIMESTAMP): Fecha de creación
- `paid_at` (TIMESTAMP): Fecha de pago (opcional)

## Funciones automáticas

El esquema incluye varias funciones y triggers automáticos:

1. **Generación de número de reserva**: Cuando se crea una reserva, se genera automáticamente un número único en formato `BK-YYYYMMDD-XXXX`

2. **Generación de código de referido**: Cuando se crea un usuario del dashboard, se genera automáticamente un código único de referido basado en su nombre

3. **Generación de link de referido**: Se crea automáticamente el link completo de referido para cada usuario

4. **Actualización de estadísticas**: Cuando se crea una reserva con un código de referido, se actualizan automáticamente:
   - El contador de referidos del usuario
   - Las ganancias totales
   - Se crea un registro en la tabla `referrals` con la comisión calculada

## Notas importantes

- Las políticas de seguridad están configuradas para permitir lectura pública en la mayoría de las tablas
- La creación de reservas y reseñas está permitida públicamente
- Los usuarios del dashboard solo son visibles públicamente si están activos
- Si necesitas escribir datos desde la aplicación, deberás crear políticas adicionales
- Los datos de ejemplo se insertan automáticamente al ejecutar el script SQL
- Puedes modificar o eliminar los datos de ejemplo desde el panel de Supabase
- Los códigos de referido se generan automáticamente, pero puedes personalizarlos manualmente si lo deseas

## Solución de problemas

### Error: "Missing Supabase environment variables"
- Verifica que el archivo `.env` existe y tiene las variables correctas
- Asegúrate de que las variables comienzan con `VITE_`
- Reinicia el servidor de desarrollo después de crear/modificar el `.env`

### Error: "relation does not exist"
- Asegúrate de haber ejecutado el script SQL en Supabase
- Verifica que las tablas se crearon correctamente en el panel de Supabase

### Los datos no se cargan
- Verifica la consola del navegador para ver errores
- Asegúrate de que las políticas de seguridad permiten lectura pública
- Verifica que las credenciales en `.env` son correctas

