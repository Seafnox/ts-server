import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-model',
    templateUrl: './model-page.component.html',
    styleUrls: ['./model-page.component.css'],
})
export class ModelPageComponent implements OnInit {
    ngOnInit(): void {
        console.log(this.constructor.name);
    }
}
