import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-category',
  templateUrl: './category-page.component.html',
  styleUrls: ['./category-page.component.css']
})
export class CategoryPage implements OnInit {
    ngOnInit(): void {
        console.log(this.constructor.name);
    }
}