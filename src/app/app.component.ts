import {Component, ViewChild} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  @ViewChild('pinch', {static: false}) pinchRef: any;

  pdf: Blob | undefined;

  constructor(private readonly http: HttpClient) {
    this.loadPdf();
  }
  private async loadPdf(): Promise<void> {
    this.pdf = await this.http.get('../assets/demo.pdf', { responseType: 'blob' }).toPromise();
  }

}
