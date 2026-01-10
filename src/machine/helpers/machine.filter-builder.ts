import { Prisma } from 'generated/prisma';
import { FindAllMachinesDto } from '../dto/findAll.dto';

// machine.filter-builder.ts
export function buildMachineWhere(
  query: FindAllMachinesDto,
): Prisma.MachineWhereInput {
  const where: Prisma.MachineWhereInput = {};

  if (query.searchBy && query.searchValue) {
    where[query.searchBy] = {
      contains: query.searchValue,
      mode: 'insensitive',
    };
  }

  return where;
}
