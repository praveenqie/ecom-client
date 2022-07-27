import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { CartItem } from '../common/cart-item';


@Injectable({
  providedIn: 'root'
})
export class CartService {

  cartItems: CartItem[] = [];

  totalPrice: Subject<number> = new Subject<number>();
  totalQuantity: Subject<number> = new Subject<number>();

  constructor() { }

  addToCart(theCartItem: CartItem) {

    //Check if already have the item in cart
    
    let alreadyExistsInCart: boolean = false;
  
    let existingCartItem :   CartItem | undefined;

    if (this.cartItems.length > 0) {
      existingCartItem = this.cartItems.find( tempCart=> tempCart.id === theCartItem.id)
      alreadyExistsInCart = (existingCartItem != undefined);

    }
    if (alreadyExistsInCart && existingCartItem?.quantity !=undefined) {
      existingCartItem.quantity++;
    }
    else {
      this.cartItems.push(theCartItem);
    }
    this.computeCartTotals();
  }
  computeCartTotals() {
    
    let totalPriceValue : number = 0;
    let totalQuantityValue : number = 0;
   
    for(let currentItems of this.cartItems){
      if(currentItems?.quantity != undefined &&  currentItems.unitPrice != undefined){
        totalPriceValue += currentItems.quantity * currentItems.unitPrice;
      }
      if(currentItems?.quantity != undefined){
        totalQuantityValue += currentItems.quantity;
      }
    }

    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue);
   
      console.log(totalPriceValue);
      console.log(totalQuantityValue);
    
  }
 
  
}
