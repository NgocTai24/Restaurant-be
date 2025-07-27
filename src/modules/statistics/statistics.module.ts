import { Module } from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { StatisticsController } from './statistics.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Statistic, StatisticSchema } from './schemas/statistic.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Statistic.name, schema: StatisticSchema }])],
  controllers: [StatisticsController],
  providers: [StatisticsService],
  exports: [MongooseModule],

})
export class StatisticsModule { }
