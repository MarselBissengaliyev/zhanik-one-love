import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { RentalStatus } from 'generated/prisma';
import { MachineService } from 'src/machine/machine.service';
import { BookRentalDto } from './dto/book-rental.dto';
import { IRentalRepository } from './rental.repository.interface';

@Injectable()
export class RentalService {
  constructor(
    @Inject(IRentalRepository)
    private readonly rentalRepository: IRentalRepository,

    private readonly machineService: MachineService,
  ) {}

  async bookRental(rentalData: BookRentalDto) {
    const machine = await this.machineService.findById(rentalData.machineId);
    if (machine.ownerId === rentalData.renterId) {
      throw new BadRequestException('Owner cannot rent their own machine');
    }

    if (!machine.isAvailable) {
      throw new BadRequestException('Machine is not available for rental');
    }
    return this.rentalRepository.create({
        ...rentalData,
        renter: { connect: { id: rentalData.renterId } },
        machine: { connect: { id: rentalData.machineId } },
    });
  }

  async myRentals(userId: number) {
    return this.rentalRepository.findAll({ renterId: userId });
  }

  async confirmRental(rentalId: number, ownerId: number) {
    const rental = await this.rentalRepository.findById(rentalId, {
      machine: true,
    });

    if (!rental) {
      throw new BadRequestException('Rental not found');
    }

    if (rental.machine.ownerId !== ownerId) {
      throw new BadRequestException('Only the owner can confirm the rental');
    }

    return this.rentalRepository.update(rentalId, {
      status: RentalStatus.provider_confirmed,
    });
  }

  async rentalDetails(rentalId: number) {
    const rental = await this.rentalRepository.findById(rentalId, {
      machine: true,
      renter: true,
    });

    return rental;
  }
}
