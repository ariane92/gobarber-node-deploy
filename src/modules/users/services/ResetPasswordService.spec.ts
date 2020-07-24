import AppError from '@shared/errors/AppError';
import FakeUserRepository from '../repositories/fakes/FakeUserRepository';
import FakeUserTokensRepository from '../repositories/fakes/FakeUserTokensRepository';
import ResetPasswordService from './ResetPasswordService';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

let fakeUserRepository: FakeUserRepository;
let fakeUserTokensRepository: FakeUserTokensRepository;
let fakeHashProvider: FakeHashProvider;
let resetPasswordService: ResetPasswordService;

describe('ResetPasswordService', () => {
  beforeEach(() => {
    fakeUserRepository = new FakeUserRepository();
    fakeUserTokensRepository = new FakeUserTokensRepository();
    fakeHashProvider = new FakeHashProvider();

    resetPasswordService = new ResetPasswordService(
      fakeUserRepository,
      fakeUserTokensRepository,
      fakeHashProvider,
    );
  });

  it('should be able to reset the password', async () => {
    const user = await fakeUserRepository.create({
      name: 'John Doe',
      email: 'john@example.com',
      password: '123456',
    });

    const userToken = await fakeUserTokensRepository.generate(user.id);
    const generateHash = jest.spyOn(fakeHashProvider, 'generateHash');

    await resetPasswordService.execute({
      password: '1234567',
      token: userToken.token,
    });

    const updateUser = await fakeUserRepository.findById(user.id);

    expect(generateHash).toBeCalledWith('1234567');
    expect(updateUser?.password).toBe('1234567');
  });

  it('should not be able to reset the password with non-existing token', async () => {
    await expect(
      resetPasswordService.execute({
        token: 'non-existing-token',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to reset the password with non-existing user', async () => {
    const user = await fakeUserTokensRepository.generate('non-existing-user');

    await expect(
      resetPasswordService.execute({
        token: user.token,
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to reset the password if passed more than 2 hours', async () => {
    const user = await fakeUserRepository.create({
      name: 'John Doe',
      email: 'john@example.com',
      password: '123456',
    });

    const userToken = await fakeUserTokensRepository.generate(user.id);

    jest.spyOn(Date, 'now').mockImplementation(() => {
      const customDate = new Date();
      return customDate.setHours(customDate.getHours() + 3);
    });

    await expect(
      resetPasswordService.execute({
        password: '1234567',
        token: userToken.token,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
