import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Country } from 'src/app/common/country';
import { State } from 'src/app/common/state';
import { CartService } from 'src/app/services/cart.service';
import { CreditCardFormService } from 'src/app/services/credit-card-form.service';
import { FormValidators } from 'src/app/validators/form-validators';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  checkoutFormGroup!: FormGroup;

  totalPrice: number = 0
  totalQuantity: number = 0;

  creditCardYears: number[] = [];
  creditCardMonths: number[] = [];

  countries: Country[] = [];
  shippingAddressStates: State[] = [];
  billingAddressStates: State[] = [];



  constructor(private formBuilder: FormBuilder,
    private creditCardService: CreditCardFormService,
    private cartService: CartService) { }

  ngOnInit(): void {

    this.reviewCartDetails();
    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: new FormControl('', [Validators.required, Validators.minLength(2), FormValidators.noOnlyWhiteSpace]),
        lastName: new FormControl('', [Validators.required, Validators.minLength(2), FormValidators.noOnlyWhiteSpace]),
        email: new FormControl('',
          [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'), FormValidators.noOnlyWhiteSpace]),
      })
      ,
      shippingAddress: this.formBuilder.group(
        {
          country: new FormControl('', [Validators.required]),
          street: new FormControl('', [Validators.required, Validators.minLength(2), FormValidators.noOnlyWhiteSpace]),
          city: new FormControl('', [Validators.required, Validators.minLength(2), FormValidators.noOnlyWhiteSpace]),
          state: new FormControl('', [Validators.required]),
          zipCode: new FormControl('', [Validators.required, Validators.minLength(2), FormValidators.noOnlyWhiteSpace]),
        }),
      billingAddress: this.formBuilder.group(
        {
          country: new FormControl('', [Validators.required]),
          street: new FormControl('', [Validators.required, Validators.minLength(2), FormValidators.noOnlyWhiteSpace]),
          city: new FormControl('', [Validators.required, Validators.minLength(2), FormValidators.noOnlyWhiteSpace]),
          state: new FormControl('', [Validators.required]),
          zipCode: new FormControl('', [Validators.required, Validators.minLength(2), FormValidators.noOnlyWhiteSpace]),
        }),
      creditCard: this.formBuilder.group(
        {
          cardType: new FormControl('', [Validators.required]),
          nameOnCard: new FormControl('', [Validators.required, Validators.minLength(2), FormValidators.noOnlyWhiteSpace]),
          cardNumber: new FormControl('', [Validators.pattern('[0-9]{16}'), Validators.required]),
          securityCode: new FormControl('', [Validators.pattern('[0-9]{3}'), Validators.required]),
          expirationMonth: [''],
          expirationYear: ['']
        })
    });




    // populate credit card months


    const startMonth: number = new Date().getMonth() + 1;

    this.creditCardService.getCreditCardMonths(startMonth).subscribe(
      data => {
        this.creditCardMonths = data;
      }
    );

    //populate credit card years

    this.creditCardService.getCreditCardYears().subscribe(
      data => {
        this.creditCardYears = data;
      }
    );
    //Populate Countries

    this.creditCardService.getCountries().subscribe(
      data => {
        console.log(JSON.stringify(data));
        this.countries = data;
      }
    )
  }

  reviewCartDetails() {
    this.cartService.totalPrice.subscribe(
      data => {
        this.totalPrice = data;
      }
    )

    this.cartService.totalQuantity.subscribe(
      data => {
        this.totalQuantity = data;
      }
    )
  }

  handleMonthsAndYears() {
    const currentYear: number = new Date().getFullYear();
    const selectedYear = Number(this.checkoutFormGroup.controls['creditCard'].get(['expirationYear']));

    let startMonth: number;

    if (currentYear === selectedYear) {
      startMonth = new Date().getMonth() + 1;
    }
    else {
      startMonth = 1;
    }
    this.creditCardService.getCreditCardMonths(startMonth).subscribe(
      data => {
        this.creditCardMonths = data;
      }
    )
  }
  onSubmit() {
    console.log('shdvashvd');
    if (this.checkoutFormGroup.invalid) {
      this.checkoutFormGroup.markAllAsTouched();
    }
  }

  get firstName() { return this.checkoutFormGroup.get('customer.firstName'); }
  get lastName() { return this.checkoutFormGroup.get('customer.lastName'); }
  get email() { return this.checkoutFormGroup.get('customer.email'); }

  get shippingAddressStreet() { return this.checkoutFormGroup.get('shippingAddress.street'); }
  get shippingAddressCity() { return this.checkoutFormGroup.get('shippingAddress.city'); }
  get shippingAddressCountry() { return this.checkoutFormGroup.get('shippingAddress.country'); }
  get shippingAddressState() { return this.checkoutFormGroup.get('shippingAddress.state'); }
  get shippingAddressZipCode() { return this.checkoutFormGroup.get('shippingAddress.zipCode'); }

  get billingAddressStreet() { return this.checkoutFormGroup.get('billingAddress.street'); }
  get billingAddressCity() { return this.checkoutFormGroup.get('billingAddress.city'); }
  get billingAddressCountry() { return this.checkoutFormGroup.get('billingAddress.country'); }
  get billingAddressState() { return this.checkoutFormGroup.get('billingAddress.state'); }
  get billingAddressZipCode() { return this.checkoutFormGroup.get('billingAddress.zipCode'); }

  get getCreditCardType() { return this.checkoutFormGroup.get('creditCard.cardType'); }
  get getCreditCardNameOnCard() { return this.checkoutFormGroup.get('creditCard.nameOnCard'); }
  get getCreditCardNumber() { return this.checkoutFormGroup.get('creditCard.cardNumber'); }
  get getCreditCardSecurityCode() { return this.checkoutFormGroup.get('creditCard.securityCode'); }





  copyShippingAddressToBillingAddress(events: any) {
    if (events.target.checked) {
      this.checkoutFormGroup.controls['billingAddress']
        .setValue(this.checkoutFormGroup.controls['shippingAddress'].value);
      this.billingAddressStates = this.shippingAddressStates;
    } else {
      this.checkoutFormGroup.controls['billingAddress'].reset();
      this.billingAddressStates = [];
    }
  }
  getStates(formGroupName: string) {

    const formGroup = this.checkoutFormGroup.get(formGroupName);
    console.log(formGroup);
    const countryCode = formGroup?.value.country.code;
    const countryName = formGroup?.value.country.name;
    console.log(`${formGroupName} here it is ${countryName}`)

    this.creditCardService.getStates(countryCode).subscribe(
      data => {
        if (formGroupName === 'shippingAddress') {
          this.shippingAddressStates = data;
        } else {
          this.billingAddressStates = data;
        }
        formGroup?.get('state')?.setValue(data[0]);
      }
    );
  }
}
