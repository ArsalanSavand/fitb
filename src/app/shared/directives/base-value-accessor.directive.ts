import {
  booleanAttribute,
  ChangeDetectorRef,
  Directive,
  DoCheck,
  EventEmitter,
  Input,
  Optional,
  Output,
  Self,
} from '@angular/core';
import { AbstractControl, ControlValueAccessor, FormGroupDirective, NgControl, NgForm } from '@angular/forms';

@Directive()
export abstract class BaseValueAccessorDirective<T = any> implements ControlValueAccessor, DoCheck {

  /**
   * Keeps track of the previous form control assigned to the model.
   * Used to detect if it has changed.
   */
  private previousControl: AbstractControl | null | undefined;

  protected _value: T | undefined;

  /** Determines whether the control is valid also checks dirty. */
  protected invalid: boolean = false;

  /**
   * Event that emits whenever the raw value of the model changes. This is here primarily
   * to facilitate the two-way binding for the `value` input.
   */
  @Output() readonly valueChange: EventEmitter<T> = new EventEmitter<T>();

  /** `View -> model callback called when value changes` */
  protected onChange: (value: any) => void = (): void => {
  };

  /** Needed to properly implement ControlValueAccessor. */
  protected onTouched: () => any = (): void => {
  };

  @Input()
  get value(): T | undefined {
    return this._value;
  }

  set value(newValue: T) {
    const hasAssigned: boolean = this.assignValue(newValue);

    if (hasAssigned) {
      this.onChange(newValue);
    }
  }

  /** Whether state is disabled. */
  @Input({ transform: booleanAttribute })
  disabled: boolean = false;

  constructor(@Optional() @Self() public ngControl: NgControl,
              @Optional() protected parentForm: NgForm,
              @Optional() protected parentFormGroup: FormGroupDirective,
              protected changeDetectorRef: ChangeDetectorRef) {
    if (this.ngControl) {
      // Note: we provide the value accessor through here, instead of
      // the `providers` to avoid running into a circular import.
      this.ngControl.valueAccessor = this;
    }
  }

  /** Updates control's validity.  */
  private updateValidity(): void {
    const parent: FormGroupDirective | NgForm = this.parentFormGroup || this.parentForm;
    const submitted: boolean = parent && parent.submitted;
    const extra: boolean = this.ngControl.dirty || this.ngControl.touched || submitted;
    this.invalid = !!(this.ngControl && this.ngControl.invalid && extra);
  }

  ngDoCheck(): void {
    const ngControl: NgControl = this.ngControl;

    if (ngControl) {
      // The disabled state might go out of sync if the form group is swapped out.
      if (this.previousControl !== ngControl.control) {
        if (
          this.previousControl !== undefined &&
          ngControl.disabled !== null &&
          ngControl.disabled !== this.disabled
        ) {
          this.disabled = ngControl.disabled;
        }

        this.previousControl = ngControl.control;
      }

      this.updateValidity();
    }
  }

  /**
   * Assigns a specific value to the model. Returns whether the value has changed.
   *
   * @param newValue New value to assign.
   */
  protected assignValue(newValue: any): boolean {
    if (newValue !== this._value) {
      this._value = newValue;
      this.changeDetectorRef.markForCheck();
      return true;
    }
    return false;
  }

  /**
   * Sets the model's value. Part of the ControlValueAccessor interface
   * required to integrate with Angular's core forms API.
   *
   * @param value New value to be written to the model.
   */
  writeValue(value: any): void {
    this.assignValue(value);
  }

  /**
   * Saves a callback function to be invoked when the model value
   * changes from user input. Part of the ControlValueAccessor interface
   * required to integrate with Angular's core forms API.
   *
   * @param fn Callback to be triggered when the value changes.
   */
  registerOnChange(fn: (value: any) => void): void {
    this.onChange = fn;
  }

  /**
   * Saves a callback function to be invoked when the model is blurred
   * by the user. Part of the ControlValueAccessor interface required
   * to integrate with Angular's core forms API.
   *
   * @param fn Callback to be triggered when the component has been touched.
   */
  registerOnTouched(fn: () => {}): void {
    this.onTouched = fn;
  }

  /**
   * Disables the model. Part of the ControlValueAccessor interface required
   * to integrate with Angular's core forms API.
   *
   * @param isDisabled Sets whether the component is disabled.
   */
  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    this.changeDetectorRef.markForCheck();
  }
}
