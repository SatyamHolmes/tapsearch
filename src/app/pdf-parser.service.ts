import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PdfParserService {
  baseUri = 'https://api.ocr.space/parse/image';
  apikey = '8873a7e15288957';

  constructor(private httpClient: HttpClient) { }

  convert(filePath: string): Observable<any> {
    const formData = new FormData();
    formData.append('file', filePath);
    formData.append('apikey', this.apikey);
    return this.httpClient.post<any>(this.baseUri, formData)
  }
}
