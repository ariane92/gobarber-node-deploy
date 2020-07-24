import AppError from '@shared/errors/AppError';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';

import FakeUserRepository from '../repositories/fakes/FakeUserRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import CreateUserService from './CreateUserService';

let fakeUserRepository: FakeUserRepository;
let fakeHashProvider: FakeHashProvider;
let createUser: CreateUserService;
let fakeCacheProvider: FakeCacheProvider;

describe('CreateUser', () => {
  beforeEach(() => {
    fakeUserRepository = new FakeUserRepository();
    fakeHashProvider = new FakeHashProvider();
    fakeCacheProvider = new FakeCacheProvider();
    createUser = new CreateUserService(
      fakeUserRepository,
      fakeHashProvider,
      fakeCacheProvider,
    );
  });
  it('should be able to create new user', async () => {
    const user = await createUser.execute({
      name: 'John Doe',
      email: 'john@example.com',
      password: '123456',
    });

    expect(user).toHaveProperty('id');
  });

  it('should not be able to create a new user with same email from another', async () => {
    const userEmail = 'john@example.com';

    await createUser.execute({
      name: 'John Doe',
      email: userEmail,
      password: '123456',
    });

    await expect(
      createUser.execute({
        name: 'John Doe',
        email: userEmail,
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
