import { Controller, Get, Post, Res, Body, HttpStatus } from '@nestjs/common';
import { CreateAttestationDto } from './create-attestation.dto';
import { Response } from 'express';
import { TranslationAttestation } from 'translation-attestation';
import 'dotenv/config'
import { SignedOffchainAttestation } from "@ethereum-attestation-service/eas-sdk";

@Controller('attestations')
export class AttestationsController {
  @Get()
  findAll(): string {
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
    return 'This action returns all attestations';
  }

  @Post()
  async create(
      @Body() createAttestationDto: CreateAttestationDto,
      @Res() res: Response,
  ): Promise<string> {
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

    let verified = await translationAttestation.verifyTranslationAttestation({
        signer: createAttestationDto.signer,
        sig: createAttestationDto.sig as SignedOffchainAttestation
    });
    console.log(verified);

    // if valid, save the attestations to the database

    // if not valid, return an error message
    return 'This action adds a new attestation';
  }
}
