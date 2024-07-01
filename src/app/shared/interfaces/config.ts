import { FormDataFillInTheBlanks, FormFieldData } from '@app/shared';

export interface Config {
  formData: Record<string, FormFieldData>;
  formDataFillInTheBlanks: FormDataFillInTheBlanks;
}
