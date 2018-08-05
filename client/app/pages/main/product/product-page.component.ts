import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-product',
    templateUrl: './product-page.component.html',
    styleUrls: ['./product-page.component.css'],
})
export class ProductPageComponent implements OnInit {
    ngOnInit(): void {
        console.log(this.constructor.name);
    }
}
