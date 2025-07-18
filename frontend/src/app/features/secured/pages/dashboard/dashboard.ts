import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    RouterLink
  ],
  template: `
    <div class="dashboard-container">
      <mat-card class="dashboard-card" routerLink="/schools">
        <mat-card-header>
          <mat-card-title>Schools</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <mat-icon>school</mat-icon>
        </mat-card-content>
      </mat-card>

      <mat-card class="dashboard-card" routerLink="/teachers">
        <mat-card-header>
          <mat-card-title>Teachers</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <mat-icon>person</mat-icon>
        </mat-card-content>
      </mat-card>

      <mat-card class="dashboard-card" routerLink="/students">
        <mat-card-header>
          <mat-card-title>Students</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <mat-icon>people</mat-icon>
        </mat-card-content>
      </mat-card>

      <mat-card class="dashboard-card" routerLink="/subjects">
        <mat-card-header>
          <mat-card-title>Subjects</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <mat-icon>book</mat-icon>
        </mat-card-content>
      </mat-card>

      <mat-card class="dashboard-card" routerLink="/timetable">
        <mat-card-header>
          <mat-card-title>Timetable</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <mat-icon>schedule</mat-icon>
        </mat-card-content>
      </mat-card>

      <mat-card class="dashboard-card" routerLink="/standards">
        <mat-card-header>
          <mat-card-title>Standards</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <mat-icon>class</mat-icon>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .dashboard-container {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      padding: 20px;
    }

    .dashboard-card {
      cursor: pointer;
      text-align: center;
      transition: transform 0.2s;

      &:hover {
        transform: translateY(-5px);
      }

      mat-card-content {
        padding: 20px;

        mat-icon {
          font-size: 48px;
          width: 48px;
          height: 48px;
        }
      }
    }
  `]
})
export class Dashboard {
}
