import { FormControl, ValidationErrors } from "@angular/forms";

export class FormValidators {

    static noOnlyWhiteSpace(control: FormControl): ValidationErrors {
        if ((control.value != null) && (control.value.trim().length === 0)) {

            return { 'noOnlyWhiteSpace': true };
        } else {
            return null as any;
        }
    }
}
