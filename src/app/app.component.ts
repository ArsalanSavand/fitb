import { JsonPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import {
  CONFIG,
  Config,
  FormFieldData,
  WidgetFieldControl,
  WidgetNode,
  WidgetsComponent,
  WidgetValidator,
} from '@app/shared';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  standalone: true,
  imports: [
    RouterOutlet,
    ReactiveFormsModule,
    WidgetsComponent,
    JsonPipe,
  ],
})
export class AppComponent implements OnInit {

  protected readonly formGroup = this.formBuilder.group<Record<string, AbstractControl>>({});

  protected readonly config: Config = CONFIG;

  constructor(private readonly formBuilder: FormBuilder) {
  }

  /**
   * Add form control to {@link formGroup} based on given widget.
   * Also adds:
   *
   * - Validators.
   * - Conditional children form controls.
   *
   * @param widget Widget to add control from.
   */
  private generateControl(widget: WidgetFieldControl): void {
    const controlKey: string = widget.formDataPointer;
    const formFieldData: FormFieldData = this.config.formData[controlKey];
    // Generate validator.
    const validators: ValidatorFn[] = widget.validators.map((widgetValidator: WidgetValidator): ValidatorFn => {
      if (widgetValidator.type === 'required') {
        return Validators.required;
      }
      throw new Error(`Validator of type ${widgetValidator.type} is not supported!`);
    });
    // Add control.
    this.formGroup.addControl(controlKey, this.formBuilder.control(formFieldData.default, validators));
    const nodes: WidgetNode[] | undefined = widget.nodes;
    if (!nodes) {
      return;
    }
    for (const node of nodes) {
      for (const childWidget of node.children) {
        if (childWidget.type !== 'fieldControl') {
          continue;
        }
        this.generateControl(childWidget);
      }
    }
  }

  ngOnInit(): void {
    for (const widget of this.config.formDataFillInTheBlanks.data) {
      if (widget.type !== 'fieldControl') {
        continue;
      }
      this.generateControl(widget);
    }
    console.log(this.formGroup);
  }
}
