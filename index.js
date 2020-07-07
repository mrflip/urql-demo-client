import React from "react";
import * as ReactDOM from "react-dom";
import { SubscriptionClient } from "subscriptions-transport-ws";
import { subscriptionExchange, createClient, defaultExchanges, Provider } from "urql";
import { Todos, Messages } from "./components";

const subscriptionClient = new SubscriptionClient("wss://0ufyz.sse.codesandbox.io/graphql", {});

const client = createClient({
  url: "https://0ufyz.sse.codesandbox.io",
  exchanges: [
    ...defaultExchanges,
    subscriptionExchange({
      forwardSubscription: (operation) => subscriptionClient.request(operation),
    }),
  ],
});

export const App = () => (
  <Provider value={client}>
    <main>
      <Todos />
      <Messages />
    </main>
  </Provider>
);

App.displayName = "App";

ReactDOM.render(<App />, document.getElementById("root"));
