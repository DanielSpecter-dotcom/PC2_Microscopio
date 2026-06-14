import { inject, Injectable } from '@angular/core';
import { environment } from '../enviroments/enviroments';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { Microscopio } from '../model/microscopio';

@Injectable({
  providedIn: 'root',
})
export class MicroscopioService {
  private url = environment.apiURL;
  private hhtpClient: HttpClient = inject(HttpClient);

  constructor() {}
  list(): Observable<any> {
    return this.hhtpClient.get(environment.apiURL + '/microscopios');
  }
  listId(id: number): Observable<Microscopio> {
    return this.hhtpClient.get<Microscopio>(environment.apiURL + '/microscopio/' + id);
  }
  insert(microscopio: Microscopio): Observable<any> {
    console.log(microscopio);
    return this.hhtpClient.post(environment.apiURL + '/microscopio', microscopio);
  }
  delete(id: number) {
    return this.hhtpClient.delete(environment.apiURL + '/microscopio/' + id);
  }
}
