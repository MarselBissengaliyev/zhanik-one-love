import { Body, Controller, Get, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { User } from 'src/users/users.decorator';
import { BookRentalDto } from './dto/book-rental.dto';
import { RentalService } from './rental.service';

@Controller('rental')
export class RentalController {
  constructor(private readonly rentalService: RentalService) {}

  @Post('/book')
  async bookRental(@Body() rentalData: BookRentalDto) {
    return this.rentalService.bookRental(rentalData);
  }

  @Get('/my-rentals')
  async myRentals(@User('sub') userId: number) {
    return this.rentalService.myRentals(userId);
  }

  @Post('/confirm')
  async confirmRental(
    @Body() confirmData: { rentalId: number },
    @User('sub') ownerId: number,
  ) {
    return this.rentalService.confirmRental(confirmData.rentalId, ownerId);
  }

  @Get('/:id')
  async rentalDetails(@Param('id', ParseIntPipe) rentalId: number) {
    return this.rentalService.rentalDetails(rentalId);
  }
}
