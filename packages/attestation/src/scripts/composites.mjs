import { readFileSync } from "fs";
import { CeramicClient } from "@ceramicnetwork/http-client";
import {
    createComposite,
    readEncodedComposite,
    writeEncodedComposite,
    writeEncodedCompositeRuntime,
} from "@composedb/devtools-node";
import { Composite } from "@composedb/devtools";
import { DID } from "dids";
import { Ed25519Provider } from "key-did-provider-ed25519";
import { getResolver } from "key-did-resolver";
import { fromString } from "uint8arrays/from-string";

const ceramic = new CeramicClient('http://localhost:7007');

/**
 * @param {Ora} spinner - to provide progress status.
 * @return {Promise<void>} - return void when composite finishes deploying.
 */
export const writeComposite = async () => {
    await authenticate();
    console.log("writing composite to Ceramic");

    const composite = await createComposite(
        ceramic,
        "./src/app/composites/all.graphql"
    );

    await writeEncodedComposite(composite, "./src/__generated__/definition.json");
    console.log("creating composite for runtime usage");
    await writeEncodedCompositeRuntime(
        ceramic,
        "./src/__generated__/definition.json",
        "./src/__generated__/definition.js"
    );
    console.log("deploying composite");
    const deployComposite = await readEncodedComposite(
        ceramic,
        "./src/__generated__/definition.json"
    );

    await deployComposite.startIndexingOn(ceramic);
    console.log("composite deployed & ready for use");
};

/**
 * Authenticating DID for publishing composite
 * @return {Promise<void>} - return void when DID is authenticated.
 */
const authenticate = async () => {
    const seed = process.env.COMPOSEDB_PRIVATE_KEY;
    const key = fromString(seed, "base16");
    const did = new DID({
        resolver: getResolver(),
        provider: new Ed25519Provider(key),
    });
    await did.authenticate();
    ceramic.did = did;
};

await authenticate();
await writeComposite();