import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-timetable',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatSelectModule,
    ReactiveFormsModule
  ],
  template: `
    <div class="container">
      <h1>Timetable</h1>

      <mat-card class="filters">
        <form [formGroup]="filterForm">
          <mat-form-field appearance="outline">
            <mat-label>Standard</mat-label>
            <mat-select formControlName="standard">
              <mat-option value="1">Standard 1</mat-option>
              <mat-option value="2">Standard 2</mat-option>
              <!-- TODO: Load standards dynamically -->
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Division</mat-label>
            <mat-select formControlName="division">
              <mat-option value="A">Division A</mat-option>
              <mat-option value="B">Division B</mat-option>
              <!-- TODO: Load divisions dynamically -->
            </mat-select>
          </mat-form-field>
        </form>
      </mat-card>

      <table mat-table [dataSource]="timeSlots" class="mat-elevation-z8">
        <ng-container matColumnDef="time">
          <th mat-header-cell *matHeaderCellDef>Time</th>
          <td mat-cell *matCellDef="let slot">{{slot.time}}</td>
        </ng-container>

        <ng-container matColumnDef="monday">
          <th mat-header-cell *matHeaderCellDef>Monday</th>
          <td mat-cell *matCellDef="let slot">{{slot.monday}}</td>
        </ng-container>

        <ng-container matColumnDef="tuesday">
          <th mat-header-cell *matHeaderCellDef>Tuesday</th>
          <td mat-cell *matCellDef="let slot">{{slot.tuesday}}</td>
        </ng-container>

        <ng-container matColumnDef="wednesday">
          <th mat-header-cell *matHeaderCellDef>Wednesday</th>
          <td mat-cell *matCellDef="let slot">{{slot.wednesday}}</td>
        </ng-container>

        <ng-container matColumnDef="thursday">
          <th mat-header-cell *matHeaderCellDef>Thursday</th>
          <td mat-cell *matCellDef="let slot">{{slot.thursday}}</td>
        </ng-container>

        <ng-container matColumnDef="friday">
          <th mat-header-cell *matHeaderCellDef>Friday</th>
          <td mat-cell *matCellDef="let slot">{{slot.friday}}</td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
      </table>
    </div>
  `,
  styles: [`
    .container {
      padding: 20px;

      .filters {
        margin-bottom: 20px;
        padding: 20px;

        form {
          display: flex;
          gap: 20px;
        }
      }

      table {
        width: 100%;
      }
    }
  `]
})
export class Timetable {
  filterForm: FormGroup;
  displayedColumns = ['time', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
  timeSlots = [];

  constructor(private fb: FormBuilder) {
    this.filterForm = this.fb.group({
      standard: [''],
      division: ['']
    });

    this.filterForm.valueChanges.subscribe(() => {
      this.loadTimetable();
    });
  }

  loadTimetable() {
    // TODO: Implement timetable loading
  }
}
