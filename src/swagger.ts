import swaggerJSDoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Magic Transporters API",
      version: "1.0.0",
      description: "API documentation for Magic Transporters",
      contact: {
        name: "Fayez Almedani",
        email: "fayezalmedani7@gmail.com",
      },
    },
    servers: [
      {
        url: "http://localhost:3030/",
      },
    ],
  },
  apis: ["./src/routes/*.ts"],
};

const swaggerSpec = swaggerJSDoc(options);

export { swaggerSpec };
