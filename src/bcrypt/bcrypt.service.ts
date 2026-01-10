import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class BcryptService {
  async hash(password: string, saltOrRounds: number = 10) {
    return await bcrypt.hash(password, saltOrRounds);
  }

  async getSalt() {
    return await bcrypt.genSalt();
  }

  async compare(password: string, hash: string) {
    return bcrypt.compare(password, hash);
  }
}
