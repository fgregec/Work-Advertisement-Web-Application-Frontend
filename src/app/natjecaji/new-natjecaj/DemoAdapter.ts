import { HttpClient, HttpRequest, HttpEvent, HttpEventType } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { FilePickerAdapter, UploadResponse, UploadStatus, FilePreviewModel } from 'ngx-awesome-uploader';
import { filter } from 'rxjs/operators';

export class DemoAdapter extends FilePickerAdapter {
  constructor(private http: HttpClient) {
    super();
  }

  public uploadFile(fileItem: FilePreviewModel): Observable<UploadResponse> {
    const form = new FormData();
    form.append('file', fileItem.file);
    const api = 'https://ngx-awesome-uploader.free.beeceptor.com/upload';
    const req = new HttpRequest('POST', api, form, { reportProgress: true });

    return this.http.request(req).pipe(
      map((res: HttpEvent<any>) => {
        if (res.type === HttpEventType.Response) {
          const responseFromBackend = res.body;
          return {
            body: responseFromBackend,
            status: UploadStatus.UPLOADED,
            progress: 100
          };
        } else if (res.type === HttpEventType.UploadProgress && res.total) {
          const uploadProgress = Math.round((100 * res.loaded) / res.total);
          return {
            status: UploadStatus.IN_PROGRESS,
            progress: uploadProgress
          };
        }

        // If the event type is neither Response nor UploadProgress, return undefined
        return undefined;
      }),
      catchError(er => {
        console.log(er);
        return of({
          status: UploadStatus.ERROR,
          body: er
        });
      }),
      filter((value: UploadResponse | undefined): value is UploadResponse => value !== undefined)
    );
  }



  public removeFile(fileItem: FilePreviewModel): Observable<any> {
    const id = 50;
    const removeApi = 'https://run.mocky.io/v3/dedf88ec-7ce8-429a-829b-bd2fc55352bc';
    return this.http.post(removeApi, { id });  }
}
