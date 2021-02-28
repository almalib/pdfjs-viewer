import {NgModule} from '@angular/core';
import {YouTubePlayerModule} from '@angular/youtube-player';
import {VideoViewerComponent} from './video-viewer.component';


@NgModule({
  imports: [
    YouTubePlayerModule,
  ],
  declarations: [VideoViewerComponent],
  exports: [VideoViewerComponent]
})
export class VideoModule {}
