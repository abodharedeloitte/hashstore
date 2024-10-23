import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {
  backend: string = 'http://localhost:8484/hashstore'
  constructor(public http: HttpClient) { }

  login(data: any): Observable<any> {
    return this.http.post<any>(this.backend + `/user/login`, data);
  }

  register(data: any): Observable<any> {
    return this.http.post(this.backend + `/user/register`, data);
  }

  getAllItems(): Observable<any> {
    return this.http.get(this.backend + `/items/getAllItems`);
  }

  getUserDetails(user_id: any): Observable<any> {
    console.log(user_id);
    return this.http.post(this.backend + `/user/getUserItems`, { user_id })
  }

  addToCard(data: any): Observable<any> {
    return this.http.post(this.backend + `/user/addItemToCard`, data)
  }

  removeItemFromCard(item_id: any, user_id: any): Observable<any> {
    return this.http.post(this.backend + `/user/removeItemFromCard`, { item_id, user_id })
  }


  generateTransaction(user_id: any, item_id: any, amount: any, payment_mode: any, paymentType: any, type: any): Observable<any> {
    return this.http.post(this.backend + `/transaction/generateTransaction`, { user_id, item_id, amount, payment_mode, paymentType, type })
  }

}
