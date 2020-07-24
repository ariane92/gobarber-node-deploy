import AppError from '@shared/errors/AppError';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';

import FakeUserRepository from '@modules/users/repositories/fakes/FakeUserRepository';
import ListProvidersService from './ListProvidersService';

let fakeUserRepository: FakeUserRepository;
let listProvidersService: ListProvidersService;
let fakeCacheProvider: FakeCacheProvider;

describe('ListProviders', () => {
  beforeEach(() => {
    fakeUserRepository = new FakeUserRepository();
    fakeCacheProvider = new FakeCacheProvider();
    listProvidersService = new ListProvidersService(
      fakeUserRepository,
      fakeCacheProvider,
    );
  });

  it('should be able to list the providers', async () => {
    const user1 = await fakeUserRepository.create({
      name: 'John 1',
      email: 'john1@example.com',
      password: '123456',
    });

    const user2 = await fakeUserRepository.create({
      name: 'John 2',
      email: 'john2@example.com',
      password: '123456',
    });

    const loggedUser = await fakeUserRepository.create({
      name: 'John 3',
      email: 'john3@example.com',
      password: '123456',
    });

    const providers = await listProvidersService.execute({
      user_id: loggedUser.id,
    });

    expect(providers).toEqual([user1, user2]);
  });
});
