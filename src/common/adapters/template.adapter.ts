import * as fs from 'fs/promises';
import * as handlebars from 'handlebars';

export class TemplateAdapter {
  static async readHtml<T>(templatePath: string, context: T): Promise<string> {
      const file = await fs.readFile(templatePath, {
        encoding: 'utf-8',
      });
      const htmlTemplate = handlebars.compile(file);
      const html = htmlTemplate(context);
      
      return html;
  }
}
