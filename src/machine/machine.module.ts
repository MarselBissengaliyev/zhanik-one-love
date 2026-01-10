import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { MachineController } from './machine.controller';
import { MachineRepository } from './machine.repository';
import { IMachineRepository } from './machine.repository.interface';
import { MachineService } from './machine.service';

@Module({
  imports: [PrismaModule],
  providers: [
    MachineService,
    {
      provide: IMachineRepository,
      useClass: MachineRepository,
    },
  ],
  exports: [MachineService],
  controllers: [MachineController],
})
export class MachineModule {}
