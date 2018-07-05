import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelUnitPage } from './model-unit-page.component';

describe('ModelUnitPage', () => {
  let component: ModelUnitPage;
  let fixture: ComponentFixture<ModelUnitPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModelUnitPage ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModelUnitPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
