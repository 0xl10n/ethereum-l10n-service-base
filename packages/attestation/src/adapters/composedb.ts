import { ComposeClient } from '@composedb/client';
import { ethers } from 'ethers';
// Import your compiled composite

import { definition } from '../__generated__/definition.js';
import { DIDSession } from 'did-session';
import { EthereumWebAuth, getAccountId } from '@didtools/pkh-ethereum';

import { Composite } from '@composedb/devtools';
import { DID } from 'dids';
import { Ed25519Provider } from 'key-did-provider-ed25519';
import { getResolver } from 'key-did-resolver';
import { fromString } from 'uint8arrays/from-string';
import { GRAPHQL_ENDPOINT } from './graphql.js';

// TODO reuse this at script composites.mjs
const authenticate = async () => {
  const seed = process.env.COMPOSEDB_PRIVATE_KEY!;
  const key = fromString(seed, 'base16');
  const did = new DID({
    resolver: getResolver(),
    provider: new Ed25519Provider(key),
  });
  await did.authenticate();
  return did;
};

// non graphql
export const getServerClient = async () => {
  const did = await authenticate();
  const compose = new ComposeClient({
    ceramic: 'http://localhost:7007',
    definition: definition as any,
  });

  compose.setDID(did);

  return compose;
};

export const getBrowserClient = async () => {
  // const provider = new ethers.AlchemyProvider(
  //   process.env.ETH_NETWORK,
  //   process.env.ALCHEMY_API_KEY,
  // );
  let provider;
  if (!window.ethereum) {
    provider = ethers.getDefaultProvider();
  }
  provider = new ethers.BrowserProvider(window.ethereum);

  const addresses = await provider.send('eth_requestAccounts', []);

  const accountId = await getAccountId(provider, addresses[0]);
  const authMethod = await EthereumWebAuth.getAuthMethod(provider, accountId);

  const compose = new ComposeClient({
    ceramic: GRAPHQL_ENDPOINT,
    // RuntimeCompositeDefinition not available
    definition: definition as any,
  });
  const session = await DIDSession.get(accountId, authMethod, {
    resources: compose.resources,
  });
  compose.setDID(session.did);

  return compose;
};
