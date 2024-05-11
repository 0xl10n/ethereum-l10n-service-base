import { CreateAttestationDto } from './create-attestation.dto';
import { Response } from 'express';
import 'dotenv/config';
export declare class AttestationsController {
    findAll(res: Response): Promise<Response>;
    create(createAttestationDto: CreateAttestationDto, res: Response): Promise<Response>;
}
//# sourceMappingURL=attestations.controller.d.ts.map