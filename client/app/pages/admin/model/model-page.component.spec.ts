import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelPage } from './model-page.component';

describe('ModelPage', () => {
  let component: ModelPage;
  let fixture: ComponentFixture<ModelPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModelPage ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModelPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
