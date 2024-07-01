import { FormFieldType, NameValue } from '@app/shared';

export interface FormFieldData {
  placeholder: string;
  default: string | null;
  type: FormFieldType;
  options?: NameValue[];
}
