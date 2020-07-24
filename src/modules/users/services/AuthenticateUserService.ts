import { sign } from 'jsonwebtoken';
import { injectable, inject } from 'tsyringe';

import authConfig from '@config/auth';
import AppError from '@shared/errors/AppError';
import User from '../infra/typeorm/entities/User';
import IUsersRepository from '../repositories/IUserRepository';

import IHashProvider from '../providers/HashProvider/models/IHashProvider';

interface IRequestDTO {
  email: string;
  password: string;
}

interface IResponse {
  user: User;
  token: string;
}
@injectable()
class AuthenticateUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute({ email, password }: IRequestDTO): Promise<IResponse> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new AppError('Incorret email/password combination', 401);
    }

    const { secret, expiresIn } = authConfig.jwt;
    const token = sign({}, secret, {
      subject: user.id,
      expiresIn,
    });

    const passwordMatch = await this.hashProvider.compareHash(
      password,
      user.password,
    );

    if (!passwordMatch) {
      throw new AppError('Incorret email/password combination', 401);
    }

    return {
      user,
      token,
    };
  }
}

export default AuthenticateUserService;
