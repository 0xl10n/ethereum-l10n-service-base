import { WitnessClient } from "@witnessco/client";

export default class Witness {
  protected client: WitnessClient;

  constructor() {
    console.log('witness client inited');
    // Instantiate a new client, default params should suffice for now.
    this.client = new WitnessClient();
  }

  async witness(text: string) {
    console.log('Witnessing');
    const leafHash = this.client.hash(text);
    console.log(`Timestamping leaf ${leafHash}`);

    // post the leafhash to the server
    await this.client.postLeaf(leafHash);
    console.log('posted the leafhash');
    // wait for the data to be included in an onchain checkpoint
    try {
      await this.client.waitForCheckpointedLeafHash(leafHash);
    } catch (e) {
        console.error('Error waiting for leafhash to be checkpointed', e);
        throw e;
    }
    console.log('leafhash is checkpointed');

    // get the timestamp for the leaf
    const timestamp = await this.client.getTimestampForLeafHash(leafHash);
    console.log(`Leaf ${leafHash} was timestamped at ${timestamp}`);

    // get the proof for the leaf
    const proof = await this.client.getProofForLeafHash(leafHash);

    // verify the proof against the chain
    const verifiedChain = await this.client.verifyProofChain(proof);

    return proof;
  }

  ping() {
    console.log('pong');
    return 'pong';
  }
}
