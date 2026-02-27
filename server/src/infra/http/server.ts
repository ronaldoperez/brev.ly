import { fastifyCors } from '@fastify/cors'
import { fastifySwagger } from '@fastify/swagger'
import { fastifySwaggerUi } from '@fastify/swagger-ui'
import { fastify } from 'fastify'
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod'
import { env } from '@/env'
import { errorHandler } from './error-handler'
import { createUrlRoute } from './routes/create-url'
import { deleteUrlRoute } from './routes/delete-url'
import { exportUrlsRoute } from './routes/export-urls'
import { getAllUrlsRoute } from './routes/get-all-urls'
import { getUrlRoute } from './routes/get-url'

const server = fastify()

server.setValidatorCompiler(validatorCompiler)
server.setSerializerCompiler(serializerCompiler)

server.setErrorHandler(errorHandler)

server.register(fastifyCors, {
  origin: '*',
})

server.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'Brev.ly',
      version: '1.0.0',
    },
  },
  transform: jsonSchemaTransform,
})

server.register(fastifySwaggerUi, {
  routePrefix: '/docs',
})

server.register(exportUrlsRoute)
server.register(createUrlRoute)
server.register(deleteUrlRoute)
server.register(getUrlRoute)
server.register(getAllUrlsRoute)

server.listen({ port: env.PORT, host: '0.0.0.0' }).then(() => {
  console.log('HTTP server is running!')
})
