import {Injectable} from '@angular/core';
import {ToastrService} from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor(private toast: ToastrService) {
  }

  success(message: any, title: any): void {
    this.toast.success(message, title);
  }

  error(message: any, title: any): void {
    this.toast.error(message, title);
  }

  info(message: any, title: any): void {
    this.toast.info(message, title);
  }

  clear(message: any): void {
    this.toast.clear(message);
  }
}
