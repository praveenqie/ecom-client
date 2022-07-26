import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from 'src/app/common/product';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {
  product : Product = new Product();
  productId : number | undefined;

  constructor(private service: ProductService,private route:ActivatedRoute) { }

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

}
