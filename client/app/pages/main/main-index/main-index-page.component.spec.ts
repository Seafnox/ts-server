import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MainIndexPageComponent } from './main-index-page.component';

describe('MainIndexPageComponent', () => {
    let component: MainIndexPageComponent;
    let fixture: ComponentFixture<MainIndexPageComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [MainIndexPageComponent],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(MainIndexPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
