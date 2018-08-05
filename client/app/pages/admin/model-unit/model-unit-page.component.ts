import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-model-unit',
  templateUrl: './model-unit-page.component.html',
  styleUrls: ['./model-unit-page.component.css']
})
export class ModelUnitPageComponent implements OnInit {
    ngOnInit(): void {
        console.log(this.constructor.name);
    }
}
