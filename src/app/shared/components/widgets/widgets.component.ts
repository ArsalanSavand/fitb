import { Component, Input, OnInit } from '@angular/core';
import { Config, CONFIG, InputComponent, SelectComponent, Widget } from '@app/shared';
import { FormGroup, FormGroupDirective, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-widgets',
  standalone: true,
  imports: [
    SelectComponent,
    InputComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './widgets.component.html',
  styleUrl: './widgets.component.scss',
})
export class WidgetsComponent implements OnInit {

  /** Reference to the configuration to be used in the template. */
  protected readonly config: Config = CONFIG;

  /** Parent form group. */
  protected formGroup!: FormGroup;

  /** Widgets required to generate. */
  @Input({ required: true }) widgets!: Widget[];

  constructor(private form: FormGroupDirective) {
  }

  ngOnInit(): void {
    this.formGroup = this.form.control;
  }
}
