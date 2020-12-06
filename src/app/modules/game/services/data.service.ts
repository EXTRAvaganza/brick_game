import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  record:number = 0;
  constructor() { }
  getData(): number {
    return this.record;
  }
  setData(record:number) {
    this.record = record;
  }
}
