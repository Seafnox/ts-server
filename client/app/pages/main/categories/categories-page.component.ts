import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-categories',
    templateUrl: './categories-page.component.html',
    styleUrls: ['./categories-page.component.css'],
})
export class CategoriesPageComponent implements OnInit {
    ngOnInit(): void {
        console.log(this.constructor.name);
    }
}
