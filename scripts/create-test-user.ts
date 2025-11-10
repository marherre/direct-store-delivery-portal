/**
 * Script para crear un usuario de prueba en Supabase
 * Ejecutar con: npm run create-user
 * O con email y password personalizados: npm run create-user -- test@example.com MyPassword123
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Error: Faltan variables de entorno');
  console.error('Asegúrate de tener NEXT_PUBLIC_SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY en .env.local');
  process.exit(1);
}

// Usar service role key para crear usuarios directamente
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function createTestUser() {
  const email = process.argv[2] || 'test@example.com';
  const password = process.argv[3] || 'Test123456!';

  console.log('🔐 Creando usuario de prueba...');
  console.log(`📧 Email: ${email}`);
  console.log(`🔑 Password: ${password}`);

  try {
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Confirmar email automáticamente
      user_metadata: {
        full_name: 'Test User',
      },
    });

    if (error) {
      console.error('❌ Error al crear usuario:', error.message);
      process.exit(1);
    }

    console.log('✅ Usuario creado exitosamente!');
    console.log('👤 ID:', data.user.id);
    console.log('📧 Email:', data.user.email);
    console.log('\n🎉 Ahora puedes iniciar sesión con estas credenciales');
  } catch (err) {
    console.error('❌ Error inesperado:', err);
    process.exit(1);
  }
}

createTestUser();
