import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, Optional, Self } from '@angular/core';
import { FormGroupDirective, NgControl, NgForm } from '@angular/forms';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { FormFieldData, NameValue } from '@app/shared';
import { BaseValueAccessorDirective } from '@app/shared/directives';

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrl: './select.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    NgbDropdownModule,
    JsonPipe,
  ],
})
export class SelectComponent extends BaseValueAccessorDirective<string> {

  /** Comparison function to specify which option is displayed. Defaults to object equality. */
  private readonly compareWith = (o1: NameValue, o2: string): boolean => o1.value === o2;

  /** Options to display. */
  @Input({ required: true }) options!: NameValue[];

  /** Data of select */
  @Input({ required: true }) formFieldData!: FormFieldData;

  /** Selected option based on value. */
  selectedOption?: NameValue;

  constructor(@Self() @Optional() public override ngControl: NgControl,
              @Optional() protected override parentForm: NgForm,
              @Optional() protected override parentFormGroup: FormGroupDirective,
              changeDetectorRef: ChangeDetectorRef) {
    super(ngControl, parentForm, parentFormGroup, changeDetectorRef);
  }

  /**
   * Finds and selects and option based on its value.
   * @returns Option that has the corresponding value.
   */
  private selectOptionByValue(value: any): NameValue | undefined {
    return this.options.find((option: NameValue): boolean => option.value != null && this.compareWith(option, value));
  }

  /** Assigns a specific value to the select. Returns whether the value has changed. */
  override assignValue(newValue: any | any[]): boolean {
    if (newValue !== this._value) {
      if (this.options) {
        this.selectedOption = this.selectOptionByValue(newValue);
        this.changeDetectorRef.markForCheck();
      }

      this._value = newValue;
      return true;
    }
    return false;
  }

  /**
   * Selects and emits change event to set the model value.
   *
   * @param value value to select.
   */
  onSelect(value: string): void {
    this.selectedOption = this.selectOptionByValue(value);
    this._value = value;
    this.valueChange.emit(value);
    this.onChange(value);
    this.changeDetectorRef.markForCheck();
  }

  /**
   * Mark as touched once dropdown closes.
   *
   * @param opened Whether dropdown is opened.
   */
  openChanged(opened: boolean): void {
    if (!this.disabled && !opened) {
      this.onTouched();
      this.changeDetectorRef.markForCheck();
    }
  }
}
