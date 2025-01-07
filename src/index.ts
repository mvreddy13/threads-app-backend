import { expressMiddleware } from "@apollo/server/express4";
import express from "express";
import createApolloGqlServer from "./graphql";

const init = async () => {
  const PORT = Number(process.env.PORT) || 8000;
  const app = express();

  //Middlewares
  app.use(express.json());

  app.get("/", (req, res) => {
    res.json({ message: "Server is up and running" });
  });

  app.use("/graphql", expressMiddleware(await createApolloGqlServer()));
  app.listen(PORT, () => console.log(`Sever is running on port ${PORT}`));
};

init();
