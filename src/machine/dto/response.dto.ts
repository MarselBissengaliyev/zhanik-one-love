import { ApiProperty } from '@nestjs/swagger';
import { Machine } from 'generated/prisma';

export class PaginatedMachineResponseDto {
  @ApiProperty()
  data: Machine[];

  @ApiProperty({ example: 150 })
  total: number;

  @ApiProperty({ example: false })
  hasMore: boolean;
}
