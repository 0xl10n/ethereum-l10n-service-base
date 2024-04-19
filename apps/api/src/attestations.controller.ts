import { Controller, Get, Post, Res, Body, HttpStatus } from '@nestjs/common';
import { CreateAttestationDto } from './create-attestation.dto';
import { Response } from 'express';
import { TranslationAttestation } from 'translation-attestation';
import 'dotenv/config'
import { SignedOffchainAttestation } from "@ethereum-attestation-service/eas-sdk";

(BigInt.prototype as any).toJSON = function () {
  // TODO: if the number is too large, it should not be casted as integer
  return parseInt(this);
};

@Controller('attestations')
export class AttestationsController {

  @Get()
  async findAll(@Res() res: Response): Promise<Response> {
    let translationAttestation = new TranslationAttestation(
        process.env.EthNetwork,
        process.env.AlchemyAPIKey,
        process.env.WalletPrivateKey,
        process.env.SchemaUid,
        process.env.SchemaRegistryContractAddress,
        process.env.EasContractAddress,
        process.env.RecipientAddress
    );
    translationAttestation.ping();
    let attestation = await translationAttestation.attestTranslationOffChain(1, 'videoId', 'lineId', 'translatedLineId');
    console.log(attestation);

    let verified = await translationAttestation.verifyTranslationAttestation({
      signer: attestation.signer,
      sig: attestation.sig as SignedOffchainAttestation
    });
    console.log(verified)

    return res.status(HttpStatus.OK).json(attestation);
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

    // verify if the attestations are valid
    const translationAttestation = new TranslationAttestation(
        process.env.EthNetwork,
        process.env.AlchemyAPIKey,
        process.env.WalletPrivateKey,
        process.env.SchemaUid,
        process.env.SchemaRegistryContractAddress,
        process.env.EasContractAddress,
        process.env.RecipientAddress
    );

    const verified = await translationAttestation.verifyTranslationAttestation({
      signer: createAttestationDto.signer,
      sig: {
        domain: {
          chainId: BigInt(createAttestationDto.sig.domain.chainId),
          name: createAttestationDto.sig.domain.name,
          verifyingContract: createAttestationDto.sig.domain.verifyingContract,
          version: createAttestationDto.sig.domain.version
        },
        primaryType: createAttestationDto.sig.primaryType,
        types: createAttestationDto.sig.types,
        signature: createAttestationDto.sig.signature,
        uid: createAttestationDto.sig.uid,
        message: {
          recipient: createAttestationDto.sig.message.recipient,
          schema: createAttestationDto.sig.message.schema,
          time: BigInt(createAttestationDto.sig.message.time),
          expirationTime: BigInt(createAttestationDto.sig.message.expirationTime),
          refUID: createAttestationDto.sig.message.refUID,
          data: createAttestationDto.sig.message.data,
          revocable: createAttestationDto.sig.message.revocable,
          salt: createAttestationDto.sig.message.salt,
          version: createAttestationDto.sig.message.version,
        },
        version: createAttestationDto.sig.version
      }
    });

    if (!verified) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: 'Attestation is not valid' });
    }

    // if the attestation is valid, store it in IPFS
    // TODO: store the attestation in IPFS

    // return the response
    return res.status(HttpStatus.OK).json({ message: 'Attestation is valid' });
  }
}
