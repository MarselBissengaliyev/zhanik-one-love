import { Module } from '@nestjs/common';
import { RentalController } from './rental.controller';
import { RentalRepository } from './rental.repository';
import { IRentalRepository } from './rental.repository.interface';
import { RentalService } from './rental.service';
import { MachineService } from 'src/machine/machine.service';
import { MachineModule } from 'src/machine/machine.module';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [MachineModule, PrismaModule],
  providers: [
    RentalService,
    {
      provide: IRentalRepository,
      useClass: RentalRepository,
    },
  ],
  controllers: [RentalController],
})
export class RentalModule {}
