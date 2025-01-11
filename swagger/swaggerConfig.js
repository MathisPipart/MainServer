const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const path = require('path');

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Main Server API",
            version: "1.0.0",
            description: "Centralized API documentation for Main Server, including MongoDB and SpringBoot routes.",
        },
        servers: [
            {
                url: "http://localhost:3000",
                description: "Main Server",
            },
        ],
    },
    apis: [path.join(__dirname, '../routes/mongoDB.js'), path.join(__dirname, '../routes/index.js'), path.join(__dirname, '../routes/springboot.js')],
};

const swaggerSpec = swaggerJsDoc(options);

module.exports = { swaggerUi, swaggerSpec };
