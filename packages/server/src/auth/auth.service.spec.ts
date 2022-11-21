import { classes } from '@automapper/classes';
import { AutomapperModule } from '@automapper/nestjs';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../users/users.service';
import { AuthService } from './auth.service';
import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { UserModel } from '../users/models/user.model';
import { ConflictException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let mockedUserService: DeepMocked<UserService>;
  let mockedConfigService: DeepMocked<ConfigService>;
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
        { provide: ConfigService, useValue: createMock<ConfigService>() },
        { provide: UserService, useValue: createMock<UserService>() },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    mockedUserService = module.get<DeepMocked<UserService>>(UserService);
    mockedConfigService = module.get<DeepMocked<ConfigService>>(ConfigService);
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

    mockedConfigService.get.mockReturnValueOnce('secret');
    mockedUserService.findOneByEmail.mockReturnValueOnce(Promise.resolve(user));

    await expect(
      service.signUp({
        email: 'john2@gmail.com',
        firstName: 'John2',
        lastName: 'Doe2',
        userName: 'joe-doe2',
        password: 'changeme',
      }),
    ).rejects.toThrow();
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });
});
