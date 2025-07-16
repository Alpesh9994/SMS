import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { SchoolService, School } from './school.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-school-list',
  standalone: true,
  imports: [
    CommonModule, 
    MatTableModule, 
    MatButtonModule, 
    MatIconModule, 
    MatDialogModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './school-list.html',
  styleUrl: './school-list.scss'
})
export class SchoolList implements OnInit {
  schools: School[] = [];
  displayedColumns = ['name', 'address', 'adminEmail', 'actions'];
  loading = false;

  constructor(
    private schoolService: SchoolService,
    private router: Router,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadSchools();
  }

  loadSchools() {
    this.loading = true;
    this.schoolService.getSchools().subscribe({
      next: (data) => {
        this.schools = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => { this.loading = false; }
    });
  }

  addSchool() {
    this.router.navigate(['/school/new']);
  }

  editSchool(id: string) {
    this.router.navigate(['/school', id, 'edit']);
  }

  deleteSchool(id: string) {
    const confirmed = window.confirm('Are you sure you want to delete this school?');
    if (confirmed) {
      this.schoolService.deleteSchool(id).subscribe({
        next: () => this.loadSchools(),
        error: (err) => { console.error(err); }
      });
    }
  }
}
