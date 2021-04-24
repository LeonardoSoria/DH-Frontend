import { NgModule} from '@angular/core';
import {MatPaginatorModule} from '@angular/material/paginator';
import { RouterModule, Routes } from '@angular/router';
import {PageNotFoundComponent} from './components/page-not-found/page-not-found.component';
import {MainPageComponent} from './components/main-page/main-page.component';

const routes: Routes = [
  {
    path: '',
    component: MainPageComponent
  },
  {
    path: 'main-page',
    component: MainPageComponent
  },
  {
    path: 'administracion',
    loadChildren: () => import('./modules/administracion/administracion.module')
      .then(m => m.AdministracionModule),
  },
  {
    path: 'consultas',
    loadChildren: () => import('./modules/consultas/consultas.module')
      .then(m => m.ConsultasModule),
  },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes), MatPaginatorModule],
  exports: [RouterModule]
})
export class AppRoutingModule { }
