import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraficasComparacionComponent } from './graficas-comparacion.component';

describe('GraficasComparacionComponent', () => {
  let component: GraficasComparacionComponent;
  let fixture: ComponentFixture<GraficasComparacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GraficasComparacionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GraficasComparacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
