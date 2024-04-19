import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AttestationsController } from './attestations.controller';

@Module({
  imports: [],
  controllers: [AppController, AttestationsController],
  providers: [AppService],
})
export class AppModule {}
