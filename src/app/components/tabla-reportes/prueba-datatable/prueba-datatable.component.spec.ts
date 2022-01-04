import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PruebaDatatableComponent } from './prueba-datatable.component';

describe('PruebaDatatableComponent', () => {
  let component: PruebaDatatableComponent;
  let fixture: ComponentFixture<PruebaDatatableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PruebaDatatableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PruebaDatatableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
