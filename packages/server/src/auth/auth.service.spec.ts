import { classes } from '@automapper/classes';
import { AutomapperModule } from '@automapper/nestjs';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../users/users.service';
import { AuthService } from './auth.service';
import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { UserModel } from '../users/models/user.model';

describe('AuthService', () => {
  let service: AuthService;
  let mockedUserService: DeepMocked<UserService>;
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        AutomapperModule.forRoot({
          strategyInitializer: classes(),
        }),
      ],
      providers: [
        AuthService,
        JwtService,
        ConfigService,
        { provide: UserService, useValue: createMock<UserService>() },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    mockedUserService = module.get<DeepMocked<UserService>>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('signUp should throw ConflictException if user exists', async () => {
    const user: UserModel = {
      userId: '1',
      firstName: 'John2',
      lastName: 'Doe2',
      userName: 'joe-doe2',
      email: 'john2@gmail.com',
      password: 'changeme',
      refreshToken: null,
    };
    mockedUserService.findOneByEmail.mockReturnValueOnce(Promise.resolve(user));

    await expect(
      service.signUp({
        email: 'john2@gmail.com',
        firstName: 'John2',
        lastName: 'Doe2',
        userName: 'joe-doe2',
        password: 'changeme',
      }),
    ).rejects.toThrowError();
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });
});
