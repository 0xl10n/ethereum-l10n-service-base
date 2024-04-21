import { Controller, Get, Post, Res, Body, HttpStatus } from '@nestjs/common';
import { ethers } from 'ethers';
import { CreateAttestationDto } from './create-attestation.dto';
import { Response } from 'express';
import {
  TRANSLATION_ATTESTATION_SCHEMA,
  encodeTranslationAttestationSchema,
  Attestor,
} from '@repo/attestation';
import 'dotenv/config';
import { SignedOffchainAttestation } from '@ethereum-attestation-service/eas-sdk';
import { uploadText } from 'lighthouse';
import { Witness } from 'witness';

(BigInt.prototype as any).toJSON = function () {
  // TODO: if the number is too large, it should not be casted as integer
  return parseInt(this);
};

@Controller('attestations')
export class AttestationsController {
  @Get()
  async findAll(@Res() res: Response): Promise<Response> {
    const recipientAddress = process.env.RECIPIENT_ADDRESS;
    const schemaRegistryContractAddress =
      process.env.SCHEMA_REGISTRY_CONTRACT_ADDRESS;
    const provider = new ethers.AlchemyProvider(
      process.env.ETH_NETWORK,
      process.env.ALCHEMY_API_KEY,
    );
    const signer = new ethers.Wallet(
      process.env.ATTESTOR_WALLET_PRIVATE_KEY,
      provider,
    );
    const easContractAddress = process.env.EAS_CONTRACT_ADDRESS;
    const schemaUid = process.env.SCHEMA_UID;
    const refUID = process.env.REF_UID;
    console.log(refUID);

    const data = {
      sourceId: 'youtube-a',
      sourceStringId: 'string-1',
      translatedStringId: 'string-2',
      score: 90,
    };

    const encodedData = encodeTranslationAttestationSchema(data);
    const attestor = new Attestor(
      signer,
      TRANSLATION_ATTESTATION_SCHEMA,
      schemaRegistryContractAddress,
      easContractAddress,
      recipientAddress,
      schemaUid,
    );

    // TODO take in attesation for storage

    const attestationStr = await attestor.attestOffChain(encodedData, true, refUID);
    const verifiedStr = await attestor.verify(attestationStr);
    console.log(verifiedStr);
    // const attestation = await attestor.attestOffChain(
    //   encodedData,
    //   false,
    //   refUID,
    // );
    // const verified = await attestor.verify(attestation);
    // console.log(verified);

    // const attestationStr = await attestor.attestOffChain(
    //   encodedData,
    //   true,
    //   refUID,
    // );
    // const verifiedStr = await attestor.verifyAttestationStr(attestationStr);
    // console.log(verifiedStr);

    uploadText('Hello World', process.env.LIGHTHOUSE_API_KEY);
    // let witness = new Witness();
    // witness.ping();
    // let proof = await witness.witness('Hello World');
    // console.log(proof);
    return res.status(HttpStatus.OK).json({
      message: 'pong',
      // attestation: attestation,
      // verified: verified,
      // attestationStr: attestationStr,
      // verifiedStr: verifiedStr,
    });
  }

  @Post()
  async create(
    @Body() createAttestationDto: CreateAttestationDto,
    @Res() res: Response,
  ): Promise<Response> {
    // validate the input
    if (
      createAttestationDto.sig === undefined ||
      createAttestationDto.signer === undefined
    ) {
      res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: 'sig and signer are required' });
    }

    // convert the attestationDto to a string
    // TODO: wrapper for json object to attestation
    const attestationStr = JSON.stringify(createAttestationDto);

    const recipientAddress = process.env.RECIPIENT_ADDRESS;
    const schemaRegistryContractAddress =
      process.env.SCHEMA_REGISTRY_CONTRACT_ADDRESS;
    const provider = new ethers.AlchemyProvider(
      process.env.ETH_NETWORK,
      process.env.ALCHEMY_API_KEY,
    );
    const signer = new ethers.Wallet(
      process.env.ATTESTOR_WALLET_PRIVATE_KEY,
      provider,
    );
    const easContractAddress = process.env.EAS_CONTRACT_ADDRESS;
    const schemaUid = process.env.SCHEMA_UID;

    const attestor = new Attestor(
      signer,
      TRANSLATION_ATTESTATION_SCHEMA,
      schemaRegistryContractAddress,
      easContractAddress,
      recipientAddress,
      schemaUid,
    );

    // verify the attestation
    const verified = await attestor.verify(attestationStr);

    if (!verified) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: 'Attestation is not valid' });
    }

    // if the attestation is valid, store it in IPFS
    const storedObj = await uploadText(
      JSON.stringify(createAttestationDto),
      process.env.LIGHTHOUSE_API_KEY,
    );

    // witness the attestation
    const witness = new Witness();
    const proof = await witness.witness(JSON.stringify(createAttestationDto));

    // return the response
    return res.status(HttpStatus.OK).json({ message: 'Attestation is valid', cid: storedObj.cid, proof: proof});
  }
}
