import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartItem } from 'src/app/common/cart-item';
import { Product } from 'src/app/common/product';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  categoryId: number = 1;
  searchMode: boolean = false;

  thePageNumber: number = 1;
  thePageSize: number = 5;
  theTotalElements: number = 0;
  previousCategoryId: number = 1;

  priviusKeyword: string = "";

  constructor(private productService: ProductService, private route: ActivatedRoute, private cartService: CartService) { }

  ngOnInit(): void {

    this.route.paramMap.subscribe(() => {
      this.listProducts();
    });

  }

  listProducts() {
    this.searchMode = this.route.snapshot.paramMap.has('keyword');
    if (this.searchMode) {
      this.handleSearchProducts()
    } else {
      this.handleListProducts()
    }

  }
  handleSearchProducts() {
    const theKeyword = this.route.snapshot.paramMap.get("keyword");

    if (this.priviusKeyword != theKeyword) {
      this.thePageNumber = 1;
    }

    this.priviusKeyword = String(theKeyword);

    this.productService.searchProductsPaginate(this.thePageNumber - 1,
      this.thePageSize,
      String(theKeyword))
      .subscribe(
        data => {
          this.products = data._embedded.products;
          this.thePageNumber = data.page.number + 1;
          this.thePageSize = data.page.size;
          this.theTotalElements = data.page.totalElements;
        });
  }


  handleListProducts() {
    //check if catagory is available
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');
    if (hasCategoryId) {
      this.categoryId = Number(this.route.snapshot.paramMap.get('id'));
    } else {
      this.categoryId = 1;
    }

    //check if we have differenct catgory id than previous
    if (this.previousCategoryId != this.categoryId) {
      this.thePageNumber = 1;
    }
    this.previousCategoryId = this.categoryId;
    this.productService.getProductListPaginate(this.thePageNumber - 1,
      this.thePageSize,
      this.categoryId)
      .subscribe(
        data => {
          this.products = data._embedded.products;
          this.thePageNumber = data.page.number + 1;
          this.thePageSize = data.page.size;
          this.theTotalElements = data.page.totalElements;
        });

  }

  updatePageSize(pageSize: Event) {
    this.thePageSize = Number((pageSize.target as HTMLInputElement).value);
    this.thePageNumber = 1;
    this.listProducts();
  }

  addToCart(product: Product) {

    const theCartItem = new CartItem(product);

    this.cartService.addToCart(theCartItem);

  }
}
