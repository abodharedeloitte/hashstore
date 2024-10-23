import { ChangeDetectorRef, Component, ElementRef, HostListener, Inject, NgModule, Renderer2 } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { ChangeDetectionStrategy, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  constructor(private fb: FormBuilder, private dialogRef: MatDialogRef<LoginComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {

    this.register_form = this.fb.group({
      name: ['', Validators.required],
      mobile: ['', [Validators.required, Validators.maxLength(10)]],
      emailID: ['', [Validators.required]],
      password: ['', Validators.required]
    });


    this.login_form = this.fb.group({
      emailID: ['', [Validators.required]],
      password: ['', Validators.required]
    });
  }

  register_form: FormGroup;
  login_form: FormGroup;

  ngOnInit() {
    console.log("Login")
  }
  submitRegisterForm() {
    if (this.register_form.valid) {
      this.dialogRef.close(this.register_form.value);
    }
  }

  submitLoginForm() {
    if (this.login_form.valid) {
      this.dialogRef.close(this.login_form.value);
    }
  }
}
