import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EngineComponent } from './components/engine.component';
import { AuthGuard } from '../auth';

// Each routing module augments the route configuration in the order of import
const routes: Routes = [
  { 
      path: 'engine', component: EngineComponent, canActivate: [AuthGuard]
    },
    { path: '', redirectTo: '/engine', pathMatch: 'full' }
];

@NgModule({
  imports: [
    // For all routing modules NOT at app level use forChild
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class EngineUIRoutingModule { }