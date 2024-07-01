import { ChangeDetectorRef, Component, Input, Optional, Self } from '@angular/core';
import { FormGroupDirective, NgControl, NgForm } from '@angular/forms';
import { FormFieldData } from '@app/shared';
import { BaseValueAccessorDirective } from '@app/shared/directives';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [],
  templateUrl: './input.component.html',
  styleUrl: './input.component.scss',
})
export class InputComponent extends BaseValueAccessorDirective<string | null> {

  /** Data for input */
  @Input({ required: true }) data!: FormFieldData;

  constructor(@Self() @Optional() public override ngControl: NgControl,
              @Optional() protected override parentForm: NgForm,
              @Optional() protected override parentFormGroup: FormGroupDirective,
              changeDetectorRef: ChangeDetectorRef) {
    super(ngControl, parentForm, parentFormGroup, changeDetectorRef);
  }

  /**
   * Selects and emits change event to set the model value.
   *
   * @param event Input event.
   */
  onInput(event: Event): void {
    const element: HTMLInputElement = event.target as HTMLInputElement;
    this._value = element.value;
    this.valueChange.emit(element.value);
    this.onChange(element.value);
    this.changeDetectorRef.markForCheck();
  }

  /** Mark as touched on blur. */
  onBlur(): void {
    if (!this.disabled) {
      this.onTouched();
      this.changeDetectorRef.markForCheck();
    }
  }
}
