import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-school',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule
  ],
  template: `
    <div class="container">
      <h1>Add School</h1>

      <form [formGroup]="schoolForm" (ngSubmit)="onSubmit()">
        <mat-form-field appearance="outline">
          <mat-label>Name</mat-label>
          <input matInput formControlName="name" required>
          <mat-error *ngIf="schoolForm.get('name')?.errors?.['required']">
            Name is required
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Address</mat-label>
          <textarea matInput formControlName="address" required rows="3"></textarea>
          <mat-error *ngIf="schoolForm.get('address')?.errors?.['required']">
            Address is required
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Phone</mat-label>
          <input matInput formControlName="phone" required>
          <mat-error *ngIf="schoolForm.get('phone')?.errors?.['required']">
            Phone is required
          </mat-error>
        </mat-form-field>

        <div class="actions">
          <button mat-button type="button" (click)="goBack()">Cancel</button>
          <button mat-raised-button color="primary" type="submit" [disabled]="schoolForm.invalid">
            Save
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .container {
      padding: 20px;
      max-width: 600px;
      margin: 0 auto;

      form {
        display: flex;
        flex-direction: column;
        gap: 20px;

        .actions {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
        }
      }
    }
  `]
})
export class AddSchool {
  schoolForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {
    this.schoolForm = this.fb.group({
      name: ['', Validators.required],
      address: ['', Validators.required],
      phone: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.schoolForm.valid) {
      // TODO: Implement save functionality
      this.router.navigate(['/schools']);
    }
  }

  goBack() {
    this.router.navigate(['/schools']);
  }
}
