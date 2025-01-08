const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Main Server API",
            version: "1.0.0",
            description: "Centralized API documentation for Main Server, including MongoDB routes.",
        },
        servers: [
            {
                url: "http://localhost:3000",
                description: "Main Server",
            },
        ],
    },
    apis: ["./routes/mongoDB.js"], // Inclure le fichier actuel
};

const swaggerSpec = swaggerJsDoc(options);

module.exports = { swaggerUi, swaggerSpec };
