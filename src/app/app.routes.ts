import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard';
import { HomepageComponent } from './pages/homepage/homepage';

export const routes: Routes = [
  { path: '', component: HomepageComponent },
  { path: 'dashboard', component: DashboardComponent },
];
