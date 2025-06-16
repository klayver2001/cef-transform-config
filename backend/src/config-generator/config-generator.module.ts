import { Module } from '@nestjs/common';
import { ConfigGeneratorController } from './config-generator.controller';
import { ConfigGeneratorService } from './config-generator.service';

@Module({
  controllers: [ConfigGeneratorController],
  providers: [ConfigGeneratorService]
})
export class ConfigGeneratorModule {}