import { Prisma, Rental } from 'generated/prisma';
import { BookRentalDto } from './dto/book-rental.dto';

export abstract class IRentalRepository {
  abstract create(data: Prisma.RentalCreateInput): Promise<Rental>;
  abstract findAll(
    where?: Prisma.RentalWhereInput,
    orderBy?: Prisma.RentalOrderByWithRelationInput,
    skip?: number,
    take?: number,
  ): Promise<Rental[]>;

  abstract findById<T extends Prisma.RentalInclude | undefined>(
    id: number,
    include?: T,
  ): Promise<Prisma.RentalGetPayload<{ include: T }> | null>;
  abstract update(id: number, data: Prisma.RentalUpdateInput): Promise<Rental>;
  abstract delete(id: number): Promise<Rental>;
  abstract count(where?: Prisma.RentalWhereInput): Promise<number>;
  abstract aggregate(
    options: Prisma.RentalAggregateArgs,
  ): Promise<Prisma.GetRentalAggregateType<Prisma.RentalAggregateArgs>>;

  abstract groupBy<T extends Prisma.RentalGroupByArgs>(
    options: Prisma.SelectSubset<T, Prisma.RentalGroupByArgs>,
  ): Promise<Prisma.GetRentalGroupByPayload<T>>;
}
