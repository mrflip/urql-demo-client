import React from "react";
import gql from "graphql-tag";
import { useSubscription } from "urql";
import { Error, Message } from ".";

export const Messages = () => {
  const handleSubscription = (messages = [], response) => [
    response.newMessages,
    ...messages
  ];

  const [res] = useSubscription(
    { query: NewMessageSubQuery },
    handleSubscription
  );

  if (res.error !== undefined) {
    return <Error>{res.error.message}</Error>;
  }

  if (res.data === undefined) {
    return <p>No new messages</p>;
  }

  console.log(res);

  return (
    <ul>
      <h1>Messages</h1>
      {res.data.map(notif => (
        <Message key={notif.id} {...notif} />
      ))}
    </ul>
  );
};

Messages.displayName = "Messages";

const NewMessageSubQuery = gql`
  subscription messageSub {
    newMessages {
      id
      from
      message
    }
  }
`;
