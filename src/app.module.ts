import { Module } from '@nestjs/common';
import { RehabModule } from './rehab/rehab.module';

@Module({
  imports: [RehabModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
