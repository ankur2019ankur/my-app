'use client';

import SwaggerUI from 'swagger-ui-react';

type SwaggerClientProps = {
  spec: object;
};

export default function SwaggerClient({ spec }: SwaggerClientProps) {
  return <SwaggerUI spec={spec} />;
}
