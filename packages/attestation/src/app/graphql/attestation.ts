import { request, gql } from 'graphql-request';
import { getServerClient } from '../../adapters/composedb';

interface AttestationsQuery {
  attestations: {
    id: string;
    title: string;
    to: string;
  }[];
}

export const ATTESTATION_QUERY = gql`
  query Attestation($id: ID!) {
    node(id: $id) {
      ... on Attestation {
        attestor
        recipient
      }
    }

    viewer {
      id
    }
  }
`;

export const ATTESTATION_MUTATION = gql`
  mutation CreateAttestation(
    $content: AttestationInput!
    $options: CreateOptionsInput
    $clientMutationId: String
  ) {
    createAttestation(
      input: {
        content: $content
        options: $options
        clientMutationId: $clientMutationId
      }
    ) {
      document {
        id
      }
      clientMutationId
    }
  }
`;

const SMOKE_QUERY = gql`
  query Attestations {
    viewer {
      id
    }
  }
`;

// graphql-request only works for query
// use compose for prd

export const querySmoke = async (): Promise<any> => {
  const client = await getServerClient();
  return await client.executeQuery(SMOKE_QUERY);
};
export const queryAttestation = async (id: string): Promise<any> => {
  const client = await getServerClient();
  return await client.executeQuery(ATTESTATION_QUERY, { id });
};

export type AttestationInput = {
  attestor: string;
  recipient: string;
};

export const createAttestation = async (
  input: AttestationInput,
): Promise<any> => {
  const client = await getServerClient();
  return await client.executeQuery(ATTESTATION_MUTATION, {
    content: input,
    // options: {},
    // clientMutationid: '1',
  });
};
