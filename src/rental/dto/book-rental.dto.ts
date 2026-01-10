import { Type } from 'class-transformer';
import { IsDate, IsEnum, IsInt, IsNumber } from 'class-validator';

export class BookRentalDto {
  @IsInt()
  machineId: number;

  @IsInt()
  renterId: number;

  @Type(() => Date)
  @IsDate()
  startDate: Date;

  @Type(() => Date)
  @IsDate()
  endDate: Date;

  @IsNumber({ maxDecimalPlaces: 2 })
  totalPrice: number;
}
