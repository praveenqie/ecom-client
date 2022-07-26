import { Component, OnInit } from '@angular/core';
import { CartItem } from 'src/app/common/cart-item';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-cart-details',
  templateUrl: './cart-details.component.html',
  styleUrls: ['./cart-details.component.css']
})
export class CartDetailsComponent implements OnInit {

  constructor(private cartService:CartService) { }

  cartItems : CartItem[] = [];
  totalPrice :number = 0;
  totalQuantity : number =0;

  ngOnInit(): void {
    this.listCartDetails();
  }
  listCartDetails() {
   
    this.cartItems = this.cartService.cartItems;
    this.cartService.totalPrice.subscribe(
      data =>{
        this.totalPrice = data;
      }
    )
    this.cartService.totalQuantity.subscribe(
      data =>{
        this.totalQuantity = data;
      }
    )
    this.cartService.computeCartTotals();
  }
  getSubTotal(cartItems:CartItem){
    if(cartItems.quantity != undefined && cartItems.unitPrice != undefined)
        return cartItems.quantity * cartItems.unitPrice;
    else
        return 0;
  }
  incrementQuantity(cartItems:CartItem){
   this.cartService.addToCart(cartItems);
  }

  decrementQuantity(cartItems:CartItem){
    this.cartService.decrementQuantity(cartItems);
  }
  removeQuantity(cartItems:CartItem){
    this.cartService.removeItem(cartItems);
  }
}
