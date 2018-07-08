import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'app-side-categories',
    templateUrl: './side-categories.component.html',
    styleUrls: ['./side-categories.component.css'],
})
export class SideCategoriesComponent {
    @Input() opened = true;
    @Output() openedChange = new EventEmitter<boolean>();
}
