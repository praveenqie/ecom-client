import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Product } from '../common/product';
import { ProductCategory } from '../common/product-category';

@Injectable({
  providedIn: 'root'
})
export class ProductService {



  private baseUrl = "http://localhost:8080/api/products";
  private categoryUrl = "http://localhost:8080/api/product-category"
  constructor(private httpcleint: HttpClient) {
  }


  getProductList(catagoryId: number): Observable<Product[]> {
    const seachUrl = `${this.baseUrl}/search/findByCategoryId?id=${catagoryId}`
    return this.newMethod(seachUrl);
  }

  getProductCategories(): Observable<ProductCategory[]> {
    return this.httpcleint.get<GetResponseProductCategory>(this.categoryUrl).pipe(
      map(response => response._embedded.productCategory)
    );
  }

  searchProducts(theKeyword: string | null): Observable<Product[]> {
    const seachUrl = `${this.baseUrl}/search/findByNameContaining?name=${theKeyword}`
    return this.newMethod(seachUrl);
  }

  private newMethod(seachUrl: string): Observable<Product[]> {
    return this.httpcleint.get<GetResponseProducts>(seachUrl).pipe(
      map(response => response._embedded.products)
    );
  }

  getProducts(theProductId: number): Observable<Product> {
    const productUrl = `${this.baseUrl}/${theProductId}`;
    return this.httpcleint.get<Product>(productUrl);
  }

  getProductListPaginate(thePage: number, thePageSize: number, catagoryId: number): Observable<GetResponseProducts> {
    const seachUrl = `${this.baseUrl}/search/findByCategoryId?id=${catagoryId}`+ `&page=${thePage}&size=${thePageSize}`;
    return this.httpcleint.get<GetResponseProducts>(seachUrl);
  }
  
  searchProductsPaginate(thePage: number, thePageSize: number, theKeyword: string): Observable<GetResponseProducts> {
    const seachUrl = `${this.baseUrl}/search/findByNameContaining?name=${theKeyword}`+ `&page=${thePage}&size=${thePageSize}`;
    return this.httpcleint.get<GetResponseProducts>(seachUrl);
  }
}
interface GetResponseProducts {
  _embedded: {
    products: Product[];
  },
  page: {
    size: number,
    totalElements: number,
    totalPages: number,
    number: number
  }
}

interface GetResponseProductCategory {
  _embedded: {
    productCategory: ProductCategory[];
  }
}
