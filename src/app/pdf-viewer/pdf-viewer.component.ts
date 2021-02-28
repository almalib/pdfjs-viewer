import {Component, Input, OnChanges, HostBinding, OnInit, ViewChild, ElementRef, Output} from '@angular/core';

declare const pdfjsLib: any;

@Component({
  selector: 'app-pdf-viewer',
  templateUrl: './pdf-viewer.component.html',
  styleUrls: ['./pdf-viewer.component.scss']
})
export class PdfViewerComponent implements OnChanges, OnInit {

  private _src = '';
  private _pages: any[] = [];
  miniVideo = false;


  @ViewChild('video') videoRef?: ElementRef;
  @ViewChild('miniVideo') miniVideoRef?: ElementRef;
  @ViewChild('pinch', {static: false}) pinchRef;

  @Input() spacerSize = '0';

  @HostBinding('style.width')
  @Input() width = '100%';

  @HostBinding('style.max-width')
  @Input() maxWidth = '800px';

  @Input() quality = 2;

   get src(): any {
    return this._src;
  }

  @Input() set src(value: any) {
    try {
      if (!value) {
        this._src = '';
      } else if (typeof value === typeof 'string') {
        this._src = value;
      } else {
        this._src = URL.createObjectURL(value);
      }
    } catch {
      this._src = '';
    }
  }

  get pages(): any[] {
    return this._pages;
  }

   ngOnChanges(): void {
    this._updatePages();
   }

   ngOnInit(): void {
     window.addEventListener('scroll', () => {
       const miniVideoContainer = this.videoRef?.nativeElement;
       if (!this.isVideoInViewport(miniVideoContainer)) {
         this.miniVideo = true;

       } else if (this.isVideoInViewport(miniVideoContainer)) {
         this.miniVideo = false;
       }
     });
   }

  private async _updatePages(): Promise<void> {
    if (!this.src) {
      return;
    }

    try {
      const loading = pdfjsLib.getDocument(this.src);
      const pdf = await loading.promise;
      const numPages = pdf.numPages;

      const pages = [];

      for (let i = 0; i < numPages; i++) {
        const page = await pdf.getPage(i + 1);
        pages.push(page);
      }

      this._pages = pages;
    } catch {
      this._pages = [];
    }
  }

  isVideoInViewport(el: any): any {
    const video = el.getBoundingClientRect();
    const windowHeight = (window.innerHeight || document.documentElement.clientHeight);
    const windowWidth = (window.innerWidth || document.documentElement.clientWidth);
    const vertInView = (video.top <= windowHeight) && ((video.top + video.height) >= 0);
    const horInView = (video.left <= windowWidth) && ((video.left + video.width) >= 0);
    return (vertInView && horInView);
  }

  zoomIn(): void {
    this.pinchRef.zoomIn();
  }

  zoomOut(): void {
     this.pinchRef.zoomOut();
  }

}
