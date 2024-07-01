import { Widget, WidgetNodeFilter } from '@app/shared';

export interface WidgetNode {
  filter: WidgetNodeFilter;
  children: Widget[];
}
