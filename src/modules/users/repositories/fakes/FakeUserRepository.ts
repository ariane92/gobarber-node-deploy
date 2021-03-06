import { uuid } from 'uuidv4';
import IUserRepository from '@modules/users/repositories/IUserRepository';
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';
import IFindAllProviders from '@modules/users/dtos/IFindAllProvidersDTO';

import User from '../../infra/typeorm/entities/User';

export default class FakeUsersRepository implements IUserRepository {
  private users: User[] = [];

  public async findById(id: string): Promise<User | undefined> {
    const findUserId = this.users.find((user) => user.id === id);
    return findUserId;
  }

  public async findByEmail(email: string): Promise<User | undefined> {
    const findUserEmail = this.users.find((user) => user.email === email);
    return findUserEmail;
  }

  public async findAllProviders({
    except_user_id,
  }: IFindAllProviders): Promise<User[]> {
    let { users } = this;

    if (except_user_id) {
      users = this.users.filter((user) => user.id !== except_user_id);
    }
    return users;
  }

  public async create(userData: ICreateUserDTO): Promise<User> {
    const user = new User();

    Object.assign(user, { id: uuid() }, userData);
    this.users.push(user);

    return user;
  }

  public async save(user: User): Promise<User> {
    const findIndex = this.users.findIndex(
      (findUser) => findUser.id === user.id,
    );
    this.users[findIndex] = user;
    return user;
  }
}
