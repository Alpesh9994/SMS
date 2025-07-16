import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { School, SchoolService } from '../school.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-school-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './school-form.html',
  styleUrl: './school-form.scss'
})
export class SchoolForm implements OnInit {

  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private schoolService = inject(SchoolService);

  schoolForm = this.fb.group({
    name: ['', Validators.required],
    address: ['', Validators.required],
    logo: [''],
    adminEmail: ['', [Validators.required, Validators.email]],
    board: ['', Validators.required],
    medium: ['', Validators.required]
  });

  schoolId: string | null = null;
  loading = false;

  ngOnInit() {
    this.schoolId = this.route.snapshot.paramMap.get('id');
    if (this.schoolId) {
      this.loading = true;
      this.schoolService.getSchools().subscribe({
        next: (schools) => {
          const school = schools.find(s => s.id === this.schoolId);
          if (school) {
            this.schoolForm.patchValue({
              name: school.name,
              address: school.address,
              logo: school.logo ?? '',
              adminEmail: school.adminEmail,
              board: school.config?.board ?? '',
              medium: school.config?.medium ?? ''
            });
          }
          this.loading = false;
        },
        error: (err) => {
          console.error('Failed to load school', err);
          this.loading = false;
        }
      });
    }
  }

  onSubmit() {
    if (this.schoolForm.invalid) return;

    this.loading = true;

    const payload: Partial<School> = {
      name: this.schoolForm.value.name ?? '',
      address: this.schoolForm.value.address ?? '',
      logo: this.schoolForm.value.logo ?? '',
      adminEmail: this.schoolForm.value.adminEmail ?? '',
      config: {
        board: this.schoolForm.value.board ?? '',
        medium: this.schoolForm.value.medium ?? ''
      }
    };

    let request$ = this.schoolId
      ? this.schoolService.editSchool(this.schoolId, payload)
      : this.schoolService.addSchool(payload);

    request$.subscribe({
      next: (res) => {
        console.log('School saved', res);
        this.schoolForm.reset();
        this.loading = false;
        this.router.navigate(['/school']);
      },
      error: (err) => {
        console.error('Error saving school', err);
        this.loading = false;
      }
    });
  }

  onBackClick() {
    this.router.navigate(['/school']);
  }

}
