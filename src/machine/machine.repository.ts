// machine.repository.ts
import { Injectable } from '@nestjs/common';
import { Machine, Prisma } from 'generated/prisma';
import { PrismaService } from 'src/prisma/prisma.service';

import { BaseRepository } from 'src/common/repositories/base.repository';
import { IMachineRepository } from './machine.repository.interface';

@Injectable()
export class MachineRepository
  extends BaseRepository<
    Machine,
    Prisma.MachineCreateInput,
    Prisma.MachineUpdateInput,
    Prisma.MachineWhereInput,
    Prisma.MachineOrderByWithRelationInput,
    Prisma.MachineAggregateArgs,
    Prisma.MachineGroupByArgs
  >
  implements IMachineRepository
{
  constructor(prisma: PrismaService) {
    super(prisma, 'machine');
  }
}
