import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from 'src/app/common/product';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  productsList: Product[] | undefined;

  constructor(private service:ProductService,private route:Router) { }

  ngOnInit(): void {
  }
  doSearch(keyword : String){
    console.log(keyword)
    this.route.navigateByUrl(`/search/${keyword}`);
  }
}
