import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { CartItem } from '../common/cart-item';


@Injectable({
  providedIn: 'root'
})
export class CartService {

  cartItems: CartItem[] = [];

  totalPrice: Subject<number> = new BehaviorSubject<number>(0);
  totalQuantity: Subject<number> = new BehaviorSubject<number>(0);

  constructor() { }

  addToCart(theCartItem: CartItem) {

    //Check if already have the item in cart

    let alreadyExistsInCart: boolean = false;

    let existingCartItem: CartItem | undefined;

    if (this.cartItems.length > 0) {
      existingCartItem = this.cartItems.find(tempCart => tempCart.id === theCartItem.id)
      alreadyExistsInCart = (existingCartItem != undefined);

    }
    if (alreadyExistsInCart && existingCartItem?.quantity != undefined) {
      existingCartItem.quantity++;
    }
    else {
      this.cartItems.push(theCartItem);
    }
    this.computeCartTotals();
  }
  computeCartTotals() {

    let totalPriceValue: number = 0;
    let totalQuantityValue: number = 0;

    for (let currentItems of this.cartItems) {
      if (currentItems?.quantity != undefined && currentItems.unitPrice != undefined) {
        totalPriceValue += currentItems.quantity * currentItems.unitPrice;
      }
      if (currentItems?.quantity != undefined) {
        totalQuantityValue += currentItems.quantity;
      }
    }

    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue);

    console.log(totalPriceValue);
    console.log(totalQuantityValue);

  }

  decrementQuantity(cartItem: CartItem) {
    if (cartItem.quantity != undefined) {
      cartItem.quantity--;
    }
    if (cartItem.quantity === 0) {
      this.removeItem(cartItem);
    } else {
      this.computeCartTotals()
    }


  }
  removeItem(cartItem: CartItem) {
    const index = this.cartItems.findIndex(temp => temp.id === cartItem.id);
    if (index > -1) {
      this.cartItems.splice(index, 1);
      this.computeCartTotals();
    }
  }

}
