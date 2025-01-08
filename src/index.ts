import { expressMiddleware } from "@apollo/server/express4";
import express from "express";
import createApolloGqlServer from "./graphql";
import UserService from "./services/user";

const init = async () => {
  const PORT = Number(process.env.PORT) || 8000;
  const app = express();

  //Middlewares
  app.use(express.json());

  app.get("/", (req, res) => {
    res.json({ message: "Server is up and running" });
  });

  app.use(
    "/graphql",
    expressMiddleware(await createApolloGqlServer(), {
      context: async ({ req }) => {
        const token = req.headers["token"];
        try {
          const user = UserService.decodeJWTToken(token as string);
          return { user };
        } catch (error) {
          return {};
        }
      },
    })
  );
  app.listen(PORT, () => console.log(`Sever is running on port ${PORT}`));
};

init();
