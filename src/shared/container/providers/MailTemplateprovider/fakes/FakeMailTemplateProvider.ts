import IParseMailTemplateProvider from '../models/IMailTemplateProvider';

export default class FakeMailTemplateProvider
  implements IParseMailTemplateProvider {
  public async parser(): Promise<string> {
    return '';
  }
}
