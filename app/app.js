import express from 'express';
import router from './oauth.js';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

const app = express();

const swaggerOptions = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'Streamshare API',
        description: "Documentation for Streamshare's REST API.",
        version: '1.0.0',
      },
    },
    apis: ["./app/*.js"], // files containing annotations as above
};
const swaggerDocs = swaggerJsdoc(swaggerOptions);


// Configure Express.js parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/oauth', router);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs))

export default app;