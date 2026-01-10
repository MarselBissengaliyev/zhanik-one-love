// Rental.repository.ts
import { Injectable } from '@nestjs/common';
import { Prisma, Rental } from 'generated/prisma';
import { PrismaService } from 'src/prisma/prisma.service';

import { BaseRepository } from 'src/common/repositories/base.repository';

@Injectable()
export class RentalRepository
  extends BaseRepository<
    Rental,
    Prisma.RentalCreateInput,
    Prisma.RentalUpdateInput,
    Prisma.RentalWhereInput,
    Prisma.RentalOrderByWithRelationInput,
    Prisma.RentalAggregateArgs,
    Prisma.RentalGroupByArgs
  >
{
  constructor(prisma: PrismaService) {
    super(prisma, 'rental');
  }
}
