const swaggerJsDoc = require('swagger-jsdoc')

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "API Port Russell",
            version: "1.0.0",
            description: "API de gestion du port de plaisance"
        }
    },
    apis: ["./routes/*.js"]
}

module.exports = swaggerJsDoc(options)