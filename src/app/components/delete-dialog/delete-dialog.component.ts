import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {DeleteDialog} from '../../interfaces/DeleteDialog.interface';
import {HttpClient} from '@angular/common/http';
import {AlertService} from '../../ng-alerts/alert.service';

@Component({
  selector: 'app-delete-dialog',
  templateUrl: './delete-dialog.component.html',
  styleUrls: ['./delete-dialog.component.css']
})
export class DeleteDialogComponent implements OnInit {

  spinner = false;

  constructor(@Inject(MAT_DIALOG_DATA) public data: DeleteDialog,
              private dialogRef: MatDialogRef<any>,
              private http: HttpClient,
              private alertService: AlertService) { }

  ngOnInit(): void {}

  onDelete(): void {
    this.spinner = true;
    this.http.delete<any>(this.data.url).subscribe(res => {
      this.dialogRef.close();
      if ( res ) {
        this.alertService.success('Acción realizada correctamente', 'Eliminar');
        this.spinner = false;
        this.dialogRef.close();
      }
    });
  }

}
