const express = require("express");
const path = require("path");
const db = require("./config/connection");
// const routes = require("./routes");

const app = express();
const PORT = process.env.PORT || 3001;

const { typeDefs, resolvers } = require("./schemas");

// import ApolloServer
const { ApolloServer } = require("apollo-server-express");
// import Auth
const { authMiddleware } = require("./utils/auth");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// create a new Apollo server and pass in our schema data
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware,
});

// Create a new instance of an Apllo server with the GraphQL schema
const startApolloServer = async (typeDefs, resolvers) => {
  await server.start();
  //intergrate our Apollo server with the Express application as middleware
  server.applyMiddleware({ app });

  // if we're in production, serve client/build as static assets
  if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../client/build")));
  }
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/build/index.html"));
  });

  db.once("open", () => {
    app.listen(PORT, () => {
      console.log(`API server running on port ${PORT}!`);
      console.log(
        `Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`
      );
    });
  });
};

//Call the async function to start the server
startApolloServer(typeDefs, resolvers);
