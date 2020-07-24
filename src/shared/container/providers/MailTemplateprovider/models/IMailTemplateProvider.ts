import IParseMailTemplateDTO from '../dtos/IParseMailTemplateDTO';

export default interface IMailTemplateProvider {
  parser(data: IParseMailTemplateDTO): Promise<string>;
}
