import { Response } from 'express';
import { CreateSuggestionDto } from './create-suggestion.dto';
export declare class SuggestionsController {
    getHello(): string;
    create(createSuggestionDto: CreateSuggestionDto, res: Response): Promise<Response>;
}
//# sourceMappingURL=suggestions.controller.d.ts.map