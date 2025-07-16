import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CashierSummaryModalComponent } from './cashier-summary-modal.component';

describe('CashierSummaryModalComponent', () => {
  let component: CashierSummaryModalComponent;
  let fixture: ComponentFixture<CashierSummaryModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CashierSummaryModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CashierSummaryModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
