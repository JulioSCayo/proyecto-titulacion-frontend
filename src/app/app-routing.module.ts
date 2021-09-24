import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InicioComponent } from "./components/inicio/inicio.component";
import { RegistroComunComponent } from "./components/registro-comun/registro-comun.component";
import { RegistroEspecialComponent } from "./components/registro-especial/registro-especial.component";
import { RegistroResponsableComponent } from "./components/registro-responsable/registro-responsable.component";
import { MapaReportesComponent } from "./components/mapa-reportes/mapa-reportes.component";
import { TablaComunesComponent } from "./components/tabla-comunes/tabla-comunes.component";
import { TablaEspecialesComponent } from "./components/tabla-especiales/tabla-especiales.component";
import { TablaResponsablesComponent } from "./components/tabla-responsables/tabla-responsables.component";
import { InformacionComponent } from "./components/informacion/informacion/informacion.component";
import { ConoceMasComponent } from "./components/informacion/conoce-mas/conoce-mas.component";


import { AutenticacionGuard } from './services/guard/autenticacion.guard';
import { ResponsableGuard } from './services/guard/guard-usuario-responsable/responsable.guard';
import { ComunGuard } from './services/guard/guard-usuario-comun/comun.guard';
import { AdminGuard } from './services/guard/guard-usuario-admin/admin.guard';
import { EspecialGuard } from './services/guard/guard-usuario-especial/especial.guard';

const routes: Routes = [
  {path: '', component: InicioComponent},
  {path: 'registro', component: RegistroComunComponent},
  {path: 'registro-especial', component: RegistroEspecialComponent},
  {path: 'registro-responsable', component: RegistroResponsableComponent, canActivate: [AutenticacionGuard]},
  {path: 'usuarios', component: TablaComunesComponent, canActivate: [AutenticacionGuard, ResponsableGuard]},
  {path: 'usuarios-comunes', component: TablaComunesComponent, canActivate: [AutenticacionGuard, ResponsableGuard]},
  {path: 'usuarios-especiales', component: TablaEspecialesComponent, canActivate: [AutenticacionGuard, ResponsableGuard]},
  {path: 'usuarios-responsables', component: TablaResponsablesComponent, canActivate: [AutenticacionGuard, ResponsableGuard]},
  {path: 'mapa-reportes', component: MapaReportesComponent, canActivate: [AutenticacionGuard]},
  {path: 'informacion', component: InformacionComponent},
  {path: 'informacion/conoce-mas', component: ConoceMasComponent},
  {path: '**', component: InicioComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }