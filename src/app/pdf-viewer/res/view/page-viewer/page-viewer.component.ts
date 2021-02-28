import {Component, ElementRef, ViewChild, Input, HostBinding, OnChanges} from '@angular/core';

@Component({
  selector: 'app-page-viewer',
  templateUrl: './page-viewer.component.html',
  styleUrls: ['./page-viewer.component.scss']
})
export class PageViewerComponent implements OnChanges {
  @ViewChild('canvas', { static: true }) canvasRef!: ElementRef;

  @HostBinding('style.padding-top')
  @Input() paddingTop = '0';

  @Input() quality = 2;

  @Input() page: any = undefined;

   get canvas(): HTMLCanvasElement {
    return this.canvasRef.nativeElement;
  }

   get canvasContext(): CanvasRenderingContext2D {
    return this.canvas.getContext('2d') as CanvasRenderingContext2D;
  }

   ngOnChanges(): void {
    this._render();
  }

  private async _render(): Promise<any> {
    if (!this.page) {
      return;
    }

    const viewport = this.page.getViewport({ scale: this.quality });
    this.canvas.width = viewport.width;
    this.canvas.height = viewport.height;

    await this.page.render({
      canvasContext: this.canvasContext,
      viewport
    });
  }
}
