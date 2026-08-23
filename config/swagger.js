const swaggerJsDoc = require('swagger-jsdoc')

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API Port de Plaisance Russell',
            version: '1.0.0',
            description:
                "API privée de gestion des catways (emplacements d'amarrage), des réservations et des utilisateurs de la capitainerie du port de plaisance de Russell. " +
                'Toutes les routes (hors /login) nécessitent un cookie de session obtenu via /login.'
        },
        servers: [{ url: '/', description: 'Serveur courant' }],
        components: {
            securitySchemes: {
                cookieAuth: {
                    type: 'apiKey',
                    in: 'cookie',
                    name: 'token'
                }
            },
            schemas: {
                Catway: {
                    type: 'object',
                    properties: {
                        catwayNumber: { type: 'integer', example: 1 },
                        catwayType: { type: 'string', enum: ['long', 'short'] },
                        catwayState: { type: 'string', example: 'bon état' }
                    }
                },
                Reservation: {
                    type: 'object',
                    properties: {
                        _id: { type: 'string' },
                        catwayNumber: { type: 'integer', example: 1 },
                        clientName: { type: 'string', example: 'Thomas Martin' },
                        boatName: { type: 'string', example: 'Carolina' },
                        startDate: { type: 'string', format: 'date-time' },
                        endDate: { type: 'string', format: 'date-time' }
                    }
                },
                User: {
                    type: 'object',
                    properties: {
                        username: { type: 'string', example: 'admin' },
                        email: { type: 'string', example: 'admin@mail.com' },
                        password: { type: 'string', example: '123456', writeOnly: true }
                    }
                },
                Error: {
                    type: 'object',
                    properties: {
                        message: { type: 'string' }
                    }
                }
            }
        },
        security: [{ cookieAuth: [] }]
    },
    apis: ['./routes/*.js']
}

module.exports = swaggerJsDoc(options)
