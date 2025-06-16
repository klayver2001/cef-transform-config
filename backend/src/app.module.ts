import { Module } from '@nestjs/common';
import { ConfigGeneratorModule } from './config-generator/config-generator.module';

@Module({
  imports: [ConfigGeneratorModule],
  controllers: [],
  providers: [],
})
export class AppModule {}