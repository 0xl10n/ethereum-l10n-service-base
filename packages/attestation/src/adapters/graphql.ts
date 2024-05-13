import { gql, GraphQLClient } from 'graphql-request';

export const GRAPHQL_ENDPOINT = 'http://localhost:5001';

export const getClient = () => {
  return new GraphQLClient(GRAPHQL_ENDPOINT);
};
