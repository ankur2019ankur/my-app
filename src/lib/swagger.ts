import path from 'node:path';
import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Contact API',
      version: '1.0.0',
      description: 'API documentation for contact endpoints',
    },
    servers: [
      {
        url: 'http://localhost:3001',
        description: 'JSON Server',
      },
    ],
  },
  apis: [path.join(process.cwd(), 'src/app/api/**/*.ts')],
};

export const swaggerSpec = swaggerJsdoc(options);
