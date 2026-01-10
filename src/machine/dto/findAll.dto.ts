import { Transform } from 'class-transformer';
import {
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Max,
  Min,
} from 'class-validator';

// findAll.dto.ts - add better validation
export class FindAllMachinesDto {
  @IsOptional()
  @IsIn(['name', 'description', 'location', 'currency'])
  searchBy?: 'name' | 'description' | 'location' | 'currency';

  @IsOptional()
  @IsString()
  @Length(1, 100)
  searchValue?: string;

  @IsOptional()
  @IsIn(['id', 'pricePerDay', 'createdAt', 'updatedAt', 'name'])
  orderBy?: string;

  @IsOptional()
  @IsIn(['asc', 'desc'])
  @Transform(({ value }) => value?.toLowerCase())
  orderType?: 'asc' | 'desc';

  @IsOptional()
  @Transform(({ value }) => (value ? parseInt(value) : undefined))
  @IsNumber()
  @Min(0)
  skip?: number;

  @IsOptional()
  @Transform(({ value }) => (value ? parseInt(value) : undefined))
  @IsNumber()
  @Min(1)
  @Max(100)
  take?: number;
}
