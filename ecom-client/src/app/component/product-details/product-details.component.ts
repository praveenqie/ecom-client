import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartItem } from 'src/app/common/cart-item';
import { Product } from 'src/app/common/product';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {
  product : Product = new Product();
  productId : number | undefined;

  constructor(private service: ProductService,private route:ActivatedRoute,private cartService:CartService) { }

  ngOnInit(): void {

    this.getProductDetails();
  }
  getProductDetails() {
    this.productId = Number(this.route.snapshot.paramMap.get('id'));
    this.service.getProducts(this.productId).subscribe(
      data => {
        this.product = data;
      }
    )
  }
  addToCart(product : Product){
    const theCartItem = new CartItem(product);
    this.cartService.addToCart(theCartItem);
  }

}
