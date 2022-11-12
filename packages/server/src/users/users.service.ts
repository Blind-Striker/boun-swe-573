import { Injectable } from '@nestjs/common';
import { UserModel } from 'src/auth/models/user.model';

// This should be a real class/interface representing a user entity
export type User = any;

@Injectable()
export class UserService {
  private readonly users: User[] = [
    {
      userId: 1,
      username: 'john',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@gmail.com',
      password: 'changeme',
    },
    {
      userId: 2,
      username: 'maria',
      firstName: 'Maria',
      lastName: 'Mercedes',
      email: 'maria@gmail.com',
      password: 'guess',
    },
  ];

  async findOneByEmail(email: string): Promise<UserModel | undefined> {
    return this.users.find((user) => user.email === email);
  }
}
