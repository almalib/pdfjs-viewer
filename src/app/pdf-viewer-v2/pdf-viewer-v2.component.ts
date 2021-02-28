import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-pdf-viewer-v2',
  templateUrl: './pdf-viewer-v2.component.html',
  styleUrls: ['./pdf-viewer-v2.component.scss']
})
export class PdfViewerV2Component implements OnInit {

  public enablePinchOnMobile = true;

  constructor() { }

  ngOnInit(): void {
  }

  pagesLoaded(): void {
    const page = document.querySelector('.page');
    page?.insertAdjacentHTML('afterend', '<div id="video-container"><div id="mini-video"><iframe width="100%" height="100%" style="position: absolute; left: 0; top: 0;" src="https://www.youtube.com/embed/OwQaBbW3OKU?playsinline=1" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div></div>');
    const viewerContainer = document.getElementById('viewerContainer');
    const video = document.getElementById('video-container');
    viewerContainer?.addEventListener('scroll', () => {
      if (!this.isVideoInViewport(video)) {
        video?.firstElementChild?.classList.add('fixed');

      } else if (this.isVideoInViewport(video)) {
        video?.firstElementChild?.classList.remove('fixed');
      }
    });
  }

  private isVideoInViewport(el: any): any {
    const video = el.getBoundingClientRect();
    const windowHeight = (window.innerHeight || document.documentElement.clientHeight);
    const windowWidth = (window.innerWidth || document.documentElement.clientWidth);
    const vertInView = (video.top <= windowHeight) && ((video.top + video.height) >= 0);
    const horInView = (video.left <= windowWidth) && ((video.left + video.width) >= 0);
    return (vertInView && horInView);
  }

}
