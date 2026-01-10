import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User } from 'generated/prisma';
import { CreateUserDto } from './dto/create-user.dto';
import { IUserRepository } from './user.repository.inteface';
import { UserRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(
    private readonly userRepo: UserRepository, // напрямую
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private configService: ConfigService,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepo.findByEmail(email);
  }

  async findById(id: number): Promise<User | null> {
    const cacheKey = this.getCacheKey(id);

    const cached = await this.cacheManager.get<User>(cacheKey);
    if (cached) return cached;

    const user = await this.userRepo.findById(id);
    if (!user) throw new NotFoundException(`User with id ${id} not found`);

    await this.cacheManager.set(cacheKey, user, this.configService.get('CACHE_TTL'));
    return user;
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      return await this.userRepo.create(createUserDto);
    } catch (error: any) {
      if (error.code === 'P2002') {
        throw new ConflictException('User with this email already exists');
      }
      throw error;
    }
  }

  private getCacheKey(id: number): string {
    return `user:${id}`;
  }
}