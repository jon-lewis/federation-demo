const { ApolloServer, gql } = require("apollo-server");
const { buildFederatedSchema } = require("@apollo/federation");

const typeDefs = gql`
  type Review @key(fields: "id") {
    id: ID!
    body: String
    author: User @provides(fields: "username")
    product: Product
  }

  extend type User @key(fields: "id") {
    id: ID! @external
    username: String @external
    reviews: [Review]
  }

  extend type Product @key(fields: "upc") {
    upc: String! @external
    reviews(countGreaterThan: Int, upc: String): [Review]
  }
`;

const resolvers = {
  Review: {
    author(review) {
      return { __typename: "User", id: review.authorID };
    }
  },
  User: {
    reviews(user) {
      return reviews.filter(review => review.authorID === user.id);
    },
    numberOfReviews(user) {
      return reviews.filter(review => review.authorID === user.id).length;
    },
    username(user) {
      const found = usernames.find(username => username.id === user.id);
      return found ? found.username : null;
    }
  },
  Product: {
    reviews(product, args) {
      let temp = reviews.filter(review => review.product.upc === product.upc);
      temp = temp.filter(r => !args.upc || r.product.upc === args.upc);
      if (!args.countGreaterThan || temp.length > args.countGreaterThan) {
        return temp;
      }
      return [];
    }
  }
};

const server = new ApolloServer({
  schema: buildFederatedSchema([
    {
      typeDefs,
      resolvers
    }
  ])
});

server.listen({ port: 4002 }).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});

const usernames = [
  { id: "1", username: "@ada" },
  { id: "2", username: "@complete" }
];
const reviews = [
  {
    id: "1",
    authorID: "1",
    product: { upc: "1" },
    body: "Love it!"
  },
  {
    id: "2",
    authorID: "1",
    product: { upc: "2" },
    body: "Too expensive."
  },
  {
    id: "3",
    authorID: "2",
    product: { upc: "3" },
    body: "Could be better."
  },
  {
    id: "4",
    authorID: "2",
    product: { upc: "1" },
    body: "Prefer something else."
  },
  {
    id: "5",
    authorID: "2",
    product: { upc: "4" },
    body: "Got the job done"
  },
  {
    id: "6",
    authorID: "2",
    product: { upc: "4" },
    body: "Worked alright"
  },
  {
    id: "7",
    authorID: "2",
    product: { upc: "4" },
    body: "Hated it"
  },
  {
    id: "8",
    authorID: "2",
    product: { upc: "4" },
    body: "It was ok"
  }
];
