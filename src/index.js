import React from "react";
import * as ReactDOM from "react-dom";
import { SubscriptionClient } from "subscriptions-transport-ws";
import { subscriptionExchange, createClient, dedupExchange, fetchExchange, Provider } from "urql";
import { devtoolsExchange } from "@urql/devtools";
import { relayPagination } from "@urql/exchange-graphcache/extras";
import { cacheExchange } from "@urql/exchange-graphcache";
//
import { Todos, Messages } from "./components";
import schema from "./schema";

// Search for the corresponding sandbox using the first part
const SERVER_URL = "tlg5t.sse.codesandbox.io";

const subscriptionClient = new SubscriptionClient(`wss://${SERVER_URL}/graphql`, {});

const client = createClient({
  url: `https://${SERVER_URL}`,
  exchanges: [
    devtoolsExchange,
    dedupExchange,
    cacheExchange({
      schema,
      resolvers: {
        Query: {
          todos: relayPagination(),
        },
      },
    }),
    fetchExchange,
    subscriptionExchange({
      forwardSubscription: (operation) => subscriptionClient.request(operation),
    }),
  ],
});

client.query("query { messages { edges { node { id } } } }", {}).toPromise();
client
  .query(
    `query TodoQuery { 
  todos(first: 5) {
    __typename 
    totalCount 
    pageInfo { hasNextPage endCursor } 
    edges { id } 
  } 
}`,
    {},
  )
  .toPromise()
  .then((res) => console.log("Initial Query:", res));

export const App = () => (
  <Provider value={client}>
    <main>
      <Todos />
    </main>
  </Provider>
);

// <Messages />

App.displayName = "App";

ReactDOM.render(<App />, document.getElementById("root"));
