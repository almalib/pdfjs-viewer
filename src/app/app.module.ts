import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PdfViewerComponent } from './pdf-viewer/pdf-viewer.component';
import { PageViewerComponent } from './pdf-viewer/res/view/page-viewer/page-viewer.component';
import {HttpClientModule} from '@angular/common/http';
import {PinchZoomModule} from './ivypinch/pinch-zoom.module';
import {VideoModule} from './pdf-viewer/res/video-viewer/video-viewer.module';
import {PdfViewerV2Component} from './pdf-viewer-v2/pdf-viewer-v2.component';
import {NgxExtendedPdfViewerModule} from './pdf-viewer-v2/lib/ngx-extended-pdf-viewer.module';
import { PdfFooterComponent } from './pdf-viewer-v2/lib/footer/pdf-footer.component';

@NgModule({
  declarations: [
    AppComponent,
    PdfViewerComponent,
    PageViewerComponent,
    PdfViewerV2Component,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    PinchZoomModule,
    VideoModule,
    NgxExtendedPdfViewerModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
