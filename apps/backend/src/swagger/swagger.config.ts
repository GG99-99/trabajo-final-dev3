import swaggerJsdoc from 'swagger-jsdoc'

const PORT = Number(process.env.PORT) || 3030

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Obsidian API',
      version: '1.0.0',
      description: 'Documentación de la API de Obsidian',
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
        description: 'Servidor local',
      },
    ],
    components: {
      securitySchemes: {
        cookieAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'jwt_token',
          description: 'Token JWT almacenado en cookie httpOnly. Hacer login primero en /api/auth/login.',
        },
      },
      schemas: {
        ApiResponse: {
          type: 'object',
          properties: {
            ok:    { type: 'boolean' },
            data:  { },
            error: { nullable: true },
          },
        },
        LoginData: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email:    { type: 'string', format: 'email', example: 'admin@example.com' },
            password: { type: 'string', format: 'password', example: 'secret123' },
          },
        },
        CreatePerson: {
          type: 'object',
          required: ['name', 'email', 'password'],
          properties: {
            name:     { type: 'string', example: 'Juan Pérez' },
            email:    { type: 'string', format: 'email', example: 'juan@example.com' },
            password: { type: 'string', format: 'password', example: 'mypassword' },
          },
        },
        Worker: {
          type: 'object',
          properties: {
            id:       { type: 'integer' },
            personId: { type: 'integer' },
            name:     { type: 'string' },
            email:    { type: 'string' },
          },
        },
        Client: {
          type: 'object',
          properties: {
            id:       { type: 'integer' },
            personId: { type: 'integer' },
            name:     { type: 'string' },
            email:    { type: 'string' },
            phone:    { type: 'string' },
          },
        },
        Product: {
          type: 'object',
          properties: {
            id:          { type: 'integer' },
            name:        { type: 'string' },
            description: { type: 'string' },
            price:       { type: 'number' },
            categoryId:  { type: 'integer' },
          },
        },
        Appointment: {
          type: 'object',
          properties: {
            id:       { type: 'integer' },
            clientId: { type: 'integer' },
            workerId: { type: 'integer' },
            date:     { type: 'string', format: 'date-time' },
            status:   { type: 'string', enum: ['pending', 'confirmed', 'cancelled', 'done'] },
          },
        },
        Category: {
          type: 'object',
          properties: {
            id:   { type: 'integer' },
            name: { type: 'string' },
          },
        },
        Schedule: {
          type: 'object',
          properties: {
            id:       { type: 'integer' },
            workerId: { type: 'integer' },
            dayOfWeek:{ type: 'integer', minimum: 0, maximum: 6 },
            startTime:{ type: 'string', example: '09:00' },
            endTime:  { type: 'string', example: '18:00' },
          },
        },
        Seat: {
          type: 'object',
          properties: {
            id:     { type: 'integer' },
            number: { type: 'integer' },
            status: { type: 'string' },
          },
        },
        Bill: {
          type: 'object',
          properties: {
            id:        { type: 'integer' },
            clientId:  { type: 'integer' },
            total:     { type: 'number' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        Payment: {
          type: 'object',
          properties: {
            id:       { type: 'integer' },
            billId:   { type: 'integer' },
            amount:   { type: 'number' },
            method:   { type: 'string' },
            paidAt:   { type: 'string', format: 'date-time' },
          },
        },
        Inventory: {
          type: 'object',
          properties: {
            id:        { type: 'integer' },
            productId: { type: 'integer' },
            quantity:  { type: 'integer' },
          },
        },
      },
    },
    security: [{ cookieAuth: [] }],
    tags: [
      { name: 'Auth',            description: 'Autenticación y registro' },
      { name: 'Workers',         description: 'Gestión de trabajadores' },
      { name: 'Clients',         description: 'Gestión de clientes' },
      { name: 'Appointments',    description: 'Citas y bloques de tiempo' },
      { name: 'Products',        description: 'Catálogo de productos' },
      { name: 'Categories',      description: 'Categorías de productos' },
      { name: 'Bills',           description: 'Facturas' },
      { name: 'Payments',        description: 'Pagos' },
      { name: 'Inventory',       description: 'Inventario' },
      { name: 'Stock Movements', description: 'Movimientos de stock' },
      { name: 'Schedules',       description: 'Horarios de trabajadores' },
      { name: 'Seats',           description: 'Puestos de trabajo' },
      { name: 'Attendances',     description: 'Asistencias' },
      { name: 'Assists',         description: 'Registro de asistencia' },
      { name: 'No-Assists',      description: 'Ausencias' },
      { name: 'Tattoos',         description: 'Registro de tatuajes' },
      { name: 'Providers',       description: 'Proveedores' },
      { name: 'Persons',         description: 'Personas' },
      { name: 'Cashiers',        description: 'Cajeros' },
      { name: 'Punch',           description: 'Fichaje de entrada/salida' },
      { name: 'Fingerprints',    description: 'Huellas dactilares' },
      { name: 'Images',          description: 'Subida de imágenes' },
      { name: 'Audit',           description: 'Auditoría del sistema' },
      { name: 'Public',          description: 'Endpoints públicos' },
    ],
  },
  apis: ['./src/swagger/docs/**/*.yaml'],
}

export const swaggerSpec = swaggerJsdoc(options)
