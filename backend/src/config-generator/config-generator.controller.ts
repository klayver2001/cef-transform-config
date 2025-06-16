import { Controller, Post, Body, Res, HttpCode, HttpStatus, HttpException } from '@nestjs/common';
import { ConfigGeneratorService } from './config-generator.service';
import { GenerateScriptDto } from './dto/generate-script.dto';
import { Response } from 'express';

@Controller('generate-script')
export class ConfigGeneratorController {
  constructor(private readonly configGeneratorService: ConfigGeneratorService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  async generateScript(@Body() generateScriptDto: GenerateScriptDto, @Res() res: Response) {
    try {
      const script = await this.configGeneratorService.generate(generateScriptDto);
      res.setHeader('Content-Type', 'text/plain');
      res.send(script);
    } catch (error) {
        if (error instanceof HttpException) {
            throw error;
        }
        throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}