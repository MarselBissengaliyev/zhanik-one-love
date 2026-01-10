// create-machine.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import {
    IsDecimal,
    IsIn,
    IsNumber,
    IsPositive,
    IsString,
    Length
} from 'class-validator';

export class CreateMachineDto {
  @ApiProperty({ example: 'Excavator X-200', minLength: 2, maxLength: 50 })
  @IsString()
  @Length(2, 50)
  name: string;

  @ApiProperty({
    example: 'Heavy-duty excavator for construction work',
    minLength: 10,
    maxLength: 500,
  })
  @IsString()
  @Length(10, 500)
  description: string;

  @ApiProperty({ example: 150.0, minimum: 0 })
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  pricePerDay: number;

  @ApiProperty({ example: 'KZT', enum: ['KZT', 'USD', 'EUR'] })
  @IsString()
  @IsIn(['KZT', 'USD', 'EUR'])
  @Length(3, 3)
  currency: string = 'KZT';

  @ApiProperty({ example: 'Almaty, Kazakhstan', minLength: 2, maxLength: 50 })
  @IsString()
  @Length(2, 50)
  location: string;
}
