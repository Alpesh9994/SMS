import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { AuthService } from '@shared/services/auth.service';
import { UserRole } from '@shared/enums/user-role.enum';

@Component({
  selector: 'app-secured-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatSidenavModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatMenuModule
  ],
  templateUrl: './layout.html',
  styleUrls: ['./layout.scss']
})
export class SecuredLayout {
  isMenuOpen = true;

  constructor(private authService: AuthService) {}

  get currentUser() {
    return this.authService.getCurrentUser();
  }

  get isSuperAdmin() {
    return this.currentUser?.role === UserRole.SUPER_ADMIN;
  }

  get isSchoolAdmin() {
    return this.currentUser?.role === UserRole.SCHOOL_ADMIN;
  }

  logout() {
    this.authService.logout();
  }
}
