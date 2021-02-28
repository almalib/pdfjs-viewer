import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'pdf-footer',
  templateUrl: './pdf-footer.component.html',
  styleUrls: ['./pdf-footer.component.scss']
})
export class PdfFooterComponent implements OnInit {

  @Input()
  public showPagingButtons = true;

  constructor() { }

  ngOnInit(): void {
  }

}
