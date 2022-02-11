import { WebSocketLink } from "apollo-link-ws";
import { useQuery, gql, ApolloProvider, ApolloClient, InMemoryCache, split, HttpLink } from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities';


const httpLink1 = new HttpLink({
  uri: 'https://api.thegraph.com/subgraphs/name/ianlapham/uniswapv2'
});

const wsLink1 = new WebSocketLink({
  uri: 'wss://api.thegraph.com/subgraphs/name/ianlapham/uniswapv2',
  options: {
    reconnect: true,
    connectionParams: {
      headers: {
        Authorization: "Bearer yourauthtoken",
      },
    },
  },
});

const splitLink1 = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink1,
  httpLink1,
);

//////////////////////////////////////////////////////////////////////////////////

export const client = new ApolloClient({
  link: splitLink1,
  cache: new InMemoryCache(),
  shouldBatch: true,
});