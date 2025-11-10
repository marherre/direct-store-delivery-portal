# Admin Portal DSD

Portal de administración construido con Next.js 14, TypeScript, Supabase y Clean Architecture.

## 🏗️ Arquitectura

Este proyecto sigue los principios de **Clean Architecture**, organizando el código en capas bien definidas:

- **Domain**: Entidades, casos de uso e interfaces de repositorios
- **Application**: Servicios, DTOs y mappers
- **Infrastructure**: Implementaciones de repositorios y adaptadores externos (Supabase)
- **Presentation**: Componentes React, hooks y providers

## 🚀 Inicio Rápido

### Prerrequisitos

- Node.js 18+ 
- npm o yarn
- Cuenta de Supabase

### Instalación

1. Clona el repositorio
2. Instala las dependencias:
```bash
npm install
```

3. Configura las variables de entorno:
```bash
cp .env.example .env.local
```

Edita `.env.local` y agrega tus credenciales de Supabase:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

4. Ejecuta el servidor de desarrollo:
```bash
npm run dev
```

5. Abre [http://localhost:3000](http://localhost:3000) en tu navegador

## 📁 Estructura del Proyecto

```
admin_portal_dsd/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Rutas de autenticación
│   ├── (dashboard)/        # Rutas del dashboard
│   └── api/                # API Routes
├── src/
│   ├── domain/             # Capa de Dominio
│   ├── application/        # Capa de Aplicación
│   ├── infrastructure/     # Capa de Infraestructura
│   ├── presentation/       # Capa de Presentación
│   └── shared/             # Código compartido
└── public/                 # Archivos estáticos
```

## 🛠️ Tecnologías

- **Next.js 14**: Framework React con App Router
- **TypeScript**: Tipado estático
- **Supabase**: Backend como servicio (Auth, Database)
- **Tailwind CSS**: Estilos
- **React Hook Form**: Manejo de formularios
- **Zod**: Validación de esquemas

## 📝 Scripts Disponibles

- `npm run dev`: Inicia el servidor de desarrollo
- `npm run build`: Construye la aplicación para producción
- `npm run start`: Inicia el servidor de producción
- `npm run lint`: Ejecuta el linter
- `npm run type-check`: Verifica los tipos de TypeScript

## 🔐 Autenticación

El proyecto utiliza Supabase Auth para la autenticación. La implementación sigue Clean Architecture:

- **Domain**: Define las interfaces y casos de uso
- **Infrastructure**: Implementa la conexión con Supabase
- **Presentation**: Proporciona componentes y hooks para la UI

## 🎯 Próximos Pasos

- [ ] Implementar protección de rutas
- [ ] Agregar más casos de uso
- [ ] Implementar refresh token automático
- [ ] Agregar tests unitarios e integración
- [ ] Configurar CI/CD

## 📄 Licencia

Este proyecto es privado.

