import { User } from 'generated/prisma';
import { CreateUserDto } from './dto/create-user.dto';

export abstract class IUserRepository {
  abstract findByEmail(email: string): Promise<User | null>;
  abstract findById(id: number): Promise<User | null>;
  abstract create(createUserDto: CreateUserDto): Promise<User>;
  abstract count(): Promise<number>;
}
