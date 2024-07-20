import { Express, Request, Response } from "express";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { version } from "../../../package.json";
const options: swaggerJsdoc.Options = {
   definition: {
      openapi: "3.0.0",
      info: {
         title: "UzChess API Docs",
         version,
         description: "BaseUrl is http://localhost:3000/api/v1",
      },
      servers: [
         {
            url: "http://localhost:3000",
            description: "Development server",
         },
      ],

      components: {
         schemas: {
            Register: {
               type: "object",
               required: ["name", "username", "password", "age", "country"],
               properties: {
                  name: {
                     type: "string",
                     description: "name of user",
                  },
                  username: {
                     type: "string",
                     description: "username of user",
                  },
                  password: {
                     type: "string",
                     description: "password must be at least 6 characters",
                     minimum: 6,
                  },
                  age: {
                     type: "number",
                     description: "age of the user",
                  },
                  country: {
                     type: "string",
                     description: "country of the user",
                  },
               },
               example: {
                  name: "user 1",
                  username: "example_username",
                  password: "123456",
                  age: 23,
                  country: "China",
               },
            },
            Login: {
               type: "object",
               required: ["username", "password"],
               properties: {
                  username: {
                     type: "string",
                     description: "username of user",
                     minimum: 5,
                     maximum: 20,
                  },
                  password: {
                     type: "string",
                     description: "password must be at least 6 characters",
                     minimum: 6,
                     maximum: 20,
                  },
               },
               example: {
                  username: "admin",
                  password: "123456",
               },
            },
            Error: {
               type: "object",
               properties: {
                  success: {
                     type: "boolean",
                  },
                  data: {
                     type: "object",
                     nullable: true,
                  },
                  error: {
                     type: "object",
                     properties: {
                        type: {
                           type: "string",
                        },
                        status: {
                           type: "integer",
                        },
                     },
                  },
               },
            },
         },
         responses: {
            400: {
               description: "ERROR",
               content: {
                  "application/json": {
                     schema: {
                        $ref: "#/components/schemas/Error",
                     },
                     example: {
                        message: "Error message",
                        errors: [],
                     },
                  },
               },
            },
         },
         securitySchemes: {
            bearerAuth: {
               type: "http",
               scheme: "bearer",
               bearerFormat: "JWT",
            },
         },
      },
      security: [
         {
            bearerAuth: ["/api/users/investors"],
         },
      ],
   },
   apis: ["./src/routers/**/*.ts"],
};

const swaggerSpec = swaggerJsdoc(options);

function swaggerDocs(app: Express, port: string) {
   //Swagger page
   app.use(
      `${process.env.API_URL}/docs`,
      swaggerUi.serve,
      swaggerUi.setup(swaggerSpec)
   );

   //Swagger in JSON format
   app.get("docs.json", (req: Request, res: Response) => {
      res.setHeader("Content-Type", "application/json");
      res.send(swaggerSpec);
   });

   console.log(
      `Docs available at \x1b[36mhttp://localhost:${
         port + process.env.API_URL
      }/docs\x1b[0m`
   );
}

export default swaggerDocs;
