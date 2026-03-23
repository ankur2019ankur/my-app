import { swaggerSpec } from '@/lib/swagger';
import SwaggerClient from './SwaggerClient';

export default function ApiDocsPage() {
  return <SwaggerClient spec={swaggerSpec} />;
}
