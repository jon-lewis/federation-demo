## Apollo Federation Demo - Modified

This repository is a demo of using Apollo Federation that shows my problems with distributed joins across services.


### Problem

Running the following query:

```graphql
query {
  topProducts(first: 2, name: "c") {
    upc
    name
    reviews(countGreaterThan: 1) {
      body
    }
  }
}
```

### Actual Results

Results in the following response where reviews are blank or null depending on what you return.

```json
{
  "data": {
    "topProducts": [
      {
        "upc": "2",
        "name": "Couch",
        "reviews": []
      },
      {
        "upc": "3",
        "name": "Chair",
        "reviews": []
      }
    ]
  }
}
```

### Expected Results

I want the following response because I want to filter the products that have more than 1 review instead of returning an empty array or null for the reviews field.

```json
{
  "data": {
    "topProducts": [
      {
        "upc": "4",
        "name": "Screwdriver",
        "reviews": [
          {
            "body": "Got the job done"
          },
          {
            "body": "Worked alright"
          },
          {
            "body": "Hated it"
          },
          {
            "body": "It was ok"
          }
        ]
      }
    ]
  }
}
```

I want to know if this is something that apollo federation supports.

### Installation

To run this demo locally, pull down the repository then run the following commands:

```sh
npm install
```

This will install all of the dependencies for the gateway and each underlying service.

```sh
npm run start-services
```

This command will run all of the microservices at once. They can be found at http://localhost:4001, http://localhost:4002, http://localhost:4003, and http://localhost:4004.

In another terminal window, run the gateway by running this command:

```sh
npm run start-gateway
```

This will start up the gateway and serve it at http://localhost:4000

### What is this?

This demo showcases four partial schemas running as federated microservices. Each of these schemas can be accessed on their own and form a partial shape of an overall schema. The gateway fetches the service capabilities from the running services to create an overall composed schema which can be queried. 

To see the query plan when running queries against the gateway, click on the `Query Plan` tab in the bottom right hand corner of [GraphQL Playground](http://localhost:4000)

To learn more about Apollo Federation, check out the [docs](https://www.apollographql.com/docs/apollo-server/federation/introduction)