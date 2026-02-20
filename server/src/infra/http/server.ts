import { fastifyCors } from '@fastify/cors'
import { fastify } from 'fastify'
import {
  hasZodFastifySchemaValidationErrors,
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod'

const server = fastify()

server.setValidatorCompiler(validatorCompiler)
server.setSerializerCompiler(serializerCompiler)

server.setErrorHandler((error, request, reply) => {
  if (hasZodFastifySchemaValidationErrors(error)) {
    return reply.status(400).send({
      message: 'Validation Error',
      issues: error.validation,
    })
  }

  //envia erro para uma ferramenta de observalidade Sentry/Datadog/Grafana/Otel
  console.error(error)

  return reply.status(500).send({ message: 'Internal server Error.' })
})

server.register(fastifyCors, {
  origin: '*',
})

server.listen({ port: 3333, host: '0.0.0.0' }).then(() => {
  console.log('HTTP server is running!')
})
