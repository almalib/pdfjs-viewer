import { NgZone } from '@angular/core';
import { IPDFViewerApplicationOptions } from './options/pdf-viewer-application-options';

export class PinchOnMobileSupport {
  private viewer: any;
  private startX = 0;
  private startY = 0;
  private initialPinchDistance = 0;
  private pinchScale = 1;
  private firstDoubleTap = true;
  private isTapedTwice = false;
  private doubleTapTimeout: any;
  private doubleTapMinTimeout = 300;
  private lastTap = 0;

  constructor(private _zone: NgZone) {
    if (this.isMobile()) {
      this.initializePinchZoom();
    }
  }

  private isMobile() {
    return 'ontouchstart' in document.documentElement;
  }

  private onViewerTouchStart(event: TouchEvent): void {
    this.initialPinchDistance = 0;

    if (event.touches.length === 2) {
      const container = document.getElementById('viewerContainer') as HTMLDivElement;
      const rect = container.getBoundingClientRect();
      if (event.touches[0].pageX >= rect.left && event.touches[0].pageX <= rect.right) {
        if (event.touches[0].pageY >= (rect.top + window.scrollY) && event.touches[0].pageY <= (rect.bottom + window.scrollY)) {
          if (event.touches[1].pageX >= rect.left && event.touches[1].pageX <= rect.right) {
            if (event.touches[1].pageY >= (rect.top + window.scrollY) && event.touches[1].pageY <= (rect.bottom + window.scrollY)) {
              this.startX = (event.touches[0].pageX + event.touches[1].pageX) / 2;
              this.startY = (event.touches[0].pageY + event.touches[1].pageY) / 2;
              this.initialPinchDistance = Math.hypot(event.touches[1].pageX - event.touches[0].pageX, event.touches[1].pageY - event.touches[0].pageY);
              event.preventDefault();
              event.stopPropagation();
            }
          }
        }
      }
    }
  }

  private onViewerTouchMove(event: TouchEvent): void {
    const PDFViewerApplicationOptions: IPDFViewerApplicationOptions = (window as any).PDFViewerApplicationOptions;
    const PDFViewerApplication: any = (window as any).PDFViewerApplication;

    if (this.initialPinchDistance <= 0 || event.touches.length !== 2) {
      return;
    }
    if (this.pinchScale !== 1) {
      event.preventDefault();
    }
    const pinchDistance = Math.hypot(event.touches[1].pageX - event.touches[0].pageX, event.touches[1].pageY - event.touches[0].pageY);
    const container = document.getElementById('viewerContainer') as HTMLDivElement;
    const originX = this.startX + container.scrollLeft;
    const originY = this.startY + container.scrollTop;
    this.pinchScale = pinchDistance / this.initialPinchDistance;
    let minZoom = Number(PDFViewerApplicationOptions.get('minZoom'));
    if (!minZoom) {
      minZoom = 0.1;
    }

    const currentZoom = PDFViewerApplication.pdfViewer._currentScale;
    if (currentZoom * this.pinchScale < minZoom) {
      this.pinchScale = minZoom / currentZoom;
    }
    let maxZoom = Number(PDFViewerApplicationOptions.get('maxZoom'));
    if (!maxZoom) {
      maxZoom = 10;
    }
    if (currentZoom * this.pinchScale > maxZoom) {
      this.pinchScale = maxZoom / currentZoom;
    }
    this.viewer.style.transform = `scale(${this.pinchScale})`;
    this.viewer.style.transformOrigin = `${originX}px ${originY}px`;
    event.preventDefault();
    event.stopPropagation();
  }

  private onViewerTouchEnd(event: TouchEvent): void {
    const PDFViewerApplication: any = (window as any).PDFViewerApplication;
    if (this.initialPinchDistance <= 0) {
      return;
    }
    this.viewer.style.transform = `none`;
    this.viewer.style.transformOrigin = `unset`;
    PDFViewerApplication.pdfViewer.currentScale *= this.pinchScale;
    const container = document.getElementById('viewerContainer') as HTMLDivElement;
    const rect = container.getBoundingClientRect();
    const dx = this.startX - rect.left;
    const dy = this.startY - rect.top;
    container.scrollLeft += dx * (this.pinchScale - 1);
    container.scrollTop += dy * (this.pinchScale - 1);
    this.resetPinchZoomParams();
    event.preventDefault();
    event.stopPropagation();
  }

  detectDoubleTap(): boolean {
    const currentTime = new Date().getTime();
    const tapLength = currentTime - this.lastTap;
    clearTimeout(this.doubleTapTimeout);
    if (tapLength < this.doubleTapMinTimeout && tapLength > 0) {
      return true;
    } else {
      this.doubleTapTimeout = setTimeout(() => {
        clearTimeout(this.doubleTapTimeout);
      }, this.doubleTapMinTimeout);
    }
    this.lastTap = currentTime;
  }

  doubleTapZoom(event: TouchEvent): void {
    const container = document.getElementById('viewerContainer') as HTMLDivElement;
    const PDFViewerApplication: any = (window as any).PDFViewerApplication;
    if (this.detectDoubleTap()) {
      if (this.firstDoubleTap) {
        const offset = {
          x: container.scrollLeft,
          y: container.scrollTop
        };
        const loc = {
          x: event.touches[0].pageX + offset.x,
          y: event.touches[0].pageY + offset.y
        };
        const zoomPoint = {
          x: loc.x / PDFViewerApplication.pdfViewer.currentScale,
          y: loc.y / PDFViewerApplication.pdfViewer.currentScale
        };

        // zoom
        PDFViewerApplication.pdfViewer.currentScale += PDFViewerApplication.pdfViewer.currentScale;

        const zoomPointNew = {
          x: zoomPoint.x * PDFViewerApplication.pdfViewer.currentScale,
          y: zoomPoint.y * PDFViewerApplication.pdfViewer.currentScale
        };
        const newScroll = {
          x: zoomPointNew.x - event.touches[0].pageX,
          y: zoomPointNew.y - event.touches[0].pageY
        };

        container.scrollTop = newScroll.y;
        container.scrollLeft = newScroll.x;
        this.firstDoubleTap = false;

      } else {
        PDFViewerApplication.pdfViewer.currentScale /= 2;
        this.firstDoubleTap = true;
      }
      event.preventDefault();
    }

  }


  private resetPinchZoomParams(): void {
    this.startX = this.startY = this.initialPinchDistance = 0;
    this.pinchScale = 1;
  }

  public initializePinchZoom(): void {
    this.viewer = document.getElementById('viewer');
    this._zone.runOutsideAngular(() => {
      document.addEventListener('touchstart', this.onViewerTouchStart.bind(this));
      document.addEventListener('touchstart', this.doubleTapZoom.bind(this), {passive: false});
      document.addEventListener('touchmove', this.onViewerTouchMove.bind(this), {passive: false});
      document.addEventListener('touchend', this.onViewerTouchEnd.bind(this));
    });
  }

  public destroyPinchZoom(): void {
    if (this.isMobile()) {
      document.removeEventListener('touchstart', this.onViewerTouchStart);
      document.removeEventListener('touchstart', this.doubleTapZoom);
      document.removeEventListener('touchmove', this.onViewerTouchMove);
      document.removeEventListener('touchend', this.onViewerTouchEnd);
    }
  }
}
