import handlebars from 'handlebars';
import fs from 'fs';
import IParseMailTemplateDTO from '../dtos/IParseMailTemplateDTO';
import IParseMailTemplateProvider from '../models/IMailTemplateProvider';

export default class HandleBarsMailTemplateProvider
  implements IParseMailTemplateProvider {
  public async parser({
    file,
    variables,
  }: IParseMailTemplateDTO): Promise<string> {
    const templateFileContent = await fs.promises.readFile(file, {
      encoding: 'utf-8',
    });
    const parseTemplate = handlebars.compile(templateFileContent);

    return parseTemplate(variables);
  }
}
