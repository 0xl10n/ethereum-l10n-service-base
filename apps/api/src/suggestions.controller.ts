import { Controller, Get, Post, Res, Body, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { CreateSuggestionDto } from './create-suggestion.dto';
import { uploadText } from 'lighthouse';

@Controller('suggestions')
export class SuggestionsController {
  @Get()
  getHello(): string {
    return "hello";
  }

  @Post()
  async create(
    @Body() createSuggestionDto: CreateSuggestionDto,
    @Res() res: Response,
  ): Promise<Response> {
    // verify the suggestion
    if (
      createSuggestionDto.sourceId === undefined ||
      createSuggestionDto.sourceStringId === undefined ||
      createSuggestionDto.text === undefined
    ) {
      res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: 'invalid input'});
    }

    // store to ipfs
    const storedObj = await uploadText(JSON.stringify(createSuggestionDto), process.env.LIGHTHOUSE_API_KEY);

    // TODO: send to weblate

    return res.status(HttpStatus.CREATED).json({ message: 'stored to ipfs', cid: storedObj.cid});
  }
}
