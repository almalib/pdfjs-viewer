import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PdfViewerV2Component } from './pdf-viewer-v2.component';

describe('PdfViewerV2Component', () => {
  let component: PdfViewerV2Component;
  let fixture: ComponentFixture<PdfViewerV2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PdfViewerV2Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PdfViewerV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
