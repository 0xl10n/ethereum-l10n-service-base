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
        # sourceStringId
        # translatedStringId
        # score
        # time
      }
    }

    viewer {
      id
    }
  }
`;
export const TRANSLATION_ATTESTATION_QUERY = gql`
  query TranslationAttestation($id: ID!) {
    node(id: $id) {
      ... on TranslationAttestation {
        attestor
        recipient
        sourceStringId
        translatedStringId

        time
      }
    }

    viewer {
      id
    }
  }
`;

export const ATTESTATION_MUTATION = gql`
  mutation CreateAttestation(
    $content: TranslationAttestationInput!
    $options: CreateOptionsInput
    $clientMutationId: String
  ) {
    createTranslationAttestation(
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
  return await client.executeQuery(TRANSLATION_ATTESTATION_QUERY, { id });
};

// TODO derive type from graphql
export type AttestationInput = {
  attestor: string;
  recipient: string;
  sourceId: string;
  sourceStringId: string;
  translatedStringId: string;
  score: number;
  time: Date;
  uid: string;
  data: string;
};

export const createAttestation = async (
  input: Partial<AttestationInput>,
): Promise<any> => {
  const client = await getServerClient();
  return await client.executeQuery(ATTESTATION_MUTATION, {
    content: {
      ...input,
      time: input.time.toISOString(),
    },
    // options: {},
    // clientMutationid: '1',
  });
};
