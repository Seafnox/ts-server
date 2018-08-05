import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelUnitPageComponent } from './model-unit-page.component';

describe('ModelUnitPageComponent', () => {
    let component: ModelUnitPageComponent;
    let fixture: ComponentFixture<ModelUnitPageComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ModelUnitPageComponent],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ModelUnitPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
