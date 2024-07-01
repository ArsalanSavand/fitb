import { WidgetNode, WidgetValidator } from '@app/shared';

export interface WidgetFieldControl {
  type: 'fieldControl';
  formDataPointer: string;
  validators: WidgetValidator[];
  nodes?: WidgetNode[];
}
