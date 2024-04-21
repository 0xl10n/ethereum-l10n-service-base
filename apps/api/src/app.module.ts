import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AttestationsController } from './attestations.controller';
import { SuggestionsController } from './suggestions.controller';

@Module({
  imports: [],
  controllers: [AppController, AttestationsController, SuggestionsController],
  providers: [AppService],
})
export class AppModule {}
