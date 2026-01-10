// base.repository.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export abstract class BaseRepository<
  T,
  CreateInput,
  UpdateInput,
  WhereInput,
  OrderByInput,
  AggregateArgs,
  GroupByArgs,
> {
  constructor(
    protected readonly prisma: PrismaService,
    private readonly model: string,
  ) {}

  create(data: CreateInput): Promise<T> {
    return this.prisma[this.model].create({ data });
  }

  findAll(
    where?: WhereInput,
    orderBy?: OrderByInput,
    skip?: number,
    take?: number,
  ): Promise<T[]> {
    return this.prisma[this.model].findMany({ where, orderBy, skip, take });
  }

  findById(id: number, include?: any): Promise<T | null> {
    return this.prisma[this.model].findUnique({ where: { id }, include });
  }

  update(id: number, data: UpdateInput): Promise<T> {
    return this.prisma[this.model].update({ where: { id }, data });
  }

  delete(id: number): Promise<T> {
    return this.prisma[this.model].delete({ where: { id } });
  }

  count(where?: WhereInput): Promise<number> {
    return this.prisma[this.model].count({ where });
  }

  aggregate(options: AggregateArgs): Promise<any> {
    return this.prisma[this.model].aggregate(options);
  }

  groupBy(options: GroupByArgs): Promise<any> {
    return this.prisma[this.model].groupBy(options);
  }
}
