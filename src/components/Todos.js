import React, { useCallback, useMemo, useState } from "react";
import gql from "graphql-tag";
import { useQuery, useClient } from "urql";
import { Loading, Error, Todo } from ".";

export const Todos = () => {
  const [fetchingMore, setFetchingMore] = useState(false);
  const graphqlClient = useClient();
  const [res, executeQuery] = useQuery({ query: TodoQuery });
  const refetch = useCallback(() => {
    executeQuery({ requestPolicy: "network-only" });
  }, [executeQuery]);
  console.log("Todos", "render", res);

  const todosLayout = useMemo(() => {
    if (res.fetching || res.data === undefined) {
      return <Loading />;
    }

    if (res.error) {
      return <Error>{res.error.message}</Error>;
    }

    const { todos } = res.data;

    return (
      <ul>
        {todos.edges.map((todo) => (
          <Todo key={todo.node.id} {...todo.node} />
        ))}
      </ul>
    );
  }, [res]);

  const fetchMore = useCallback(() => {
    const { pageInfo } = res?.data?.todos || {};
    if (!res?.data || fetchingMore || !pageInfo?.hasNextPage) {
      return;
    }
    setFetchingMore(true);
    console.log("fetchMore", pageInfo, fetchingMore, setFetchingMore);
    graphqlClient
      .query(TodoQuery, { first: 2, after: pageInfo.endCursor })
      .toPromise()
      .then((moreData) => {
        console.log("fetchMore", moreData);
        setFetchingMore(false);
      });
  }, [graphqlClient, res, fetchingMore, setFetchingMore]);

  return (
    <>
      <h1>Todos</h1>
      {todosLayout}
      <button onClick={refetch}>Refetch</button>
      <button onClick={fetchMore}>FetchMore</button>
      <p>{fetchingMore ? "fetching" : "ready"}</p>
    </>
  );
};

Todos.displayName = "Todos";

const TodoQuery = gql`
  query TodoQuery($first: Int = 3, $after: String) {
    todos(first: $first, after: $after) {
      totalCount
      pageInfo {
        hasNextPage
        endCursor
      }
      edges {
        node {
          id
          text
          complete
        }
      }
    }
  }
`;
