import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PdfFooterComponent } from './pdf-footer.component';

describe('FooterComponent', () => {
  let component: PdfFooterComponent;
  let fixture: ComponentFixture<PdfFooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PdfFooterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PdfFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
