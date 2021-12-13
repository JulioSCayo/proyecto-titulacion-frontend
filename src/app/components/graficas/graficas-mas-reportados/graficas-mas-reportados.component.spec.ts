import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraficasMasReportadosComponent } from './graficas-mas-reportados.component';

describe('GraficasMasReportadosComponent', () => {
  let component: GraficasMasReportadosComponent;
  let fixture: ComponentFixture<GraficasMasReportadosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GraficasMasReportadosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GraficasMasReportadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
