import { classes } from '@automapper/classes';
import { AutomapperModule } from '@automapper/nestjs';
import { Test, TestingModule } from '@nestjs/testing';
import { UserProfile } from './mappers/user.profile';
import { UserService } from './users.service';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { connect, Connection, Model } from 'mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { getModelToken } from '@nestjs/mongoose';

describe('UsersService', () => {
  let service: UserService;
  let mongod: MongoMemoryServer;
  let mongoConnection: Connection;
  let userModel: Model<User>;

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    mongoConnection = (await connect(uri)).connection;
    userModel = mongoConnection.model(User.name, UserSchema);
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        AutomapperModule.forRoot({
          strategyInitializer: classes(),
        }),
      ],
      providers: [
        UserService,
        UserProfile,
        { provide: getModelToken(User.name), useValue: userModel },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a user', async () => {
    const createUserModel = {
      email: 'john2@gmail.com',
      firstName: 'John2',
      lastName: 'Doe2',
      userName: 'joe-doe2',
      password: 'changeme',
    };
    const createdUser = await service.create(createUserModel);

    expect(createdUser.userId).not.toBeNull();
    expect(createdUser.userId).not.toBe('');
    expect(createdUser.email).toBe(createUserModel.email);
    expect(createdUser.firstName).toBe(createUserModel.firstName);
    expect(createdUser.lastName).toBe(createUserModel.lastName);
    expect(createdUser.userName).toBe(createUserModel.userName);
    expect(createdUser.password).toBe(createUserModel.password);
    expect(createdUser.refreshToken).toBeNull();
  });

  afterAll(async () => {
    await mongoConnection.dropDatabase();
    await mongoConnection.close();
    await mongod.stop();
  });

  afterEach(async () => {
    const collections = mongoConnection.collections;
    for (const key in collections) {
      const collection = collections[key];
      await collection.deleteMany({});
    }
  });
});
