import { ApolloServer } from "@apollo/server";
import { User } from "./user";

const createApolloGqlServer = async () => {
  const typeDefs = `#graphql
  ${User.typeDefs}
  type Query {

    ${User.queries}
    }
  
  type Mutation {
    ${User.mutations}
  }
  `;
  const resolvers = {
    Query: { ...User.resolvers.queries },
    Mutation: { ...User.resolvers.mutations },
  };

  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  await server.start();

  return server;
};

export default createApolloGqlServer;
