import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { ErrorTailorModule } from '@ngneat/error-tailor';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { InicioComponent } from './components/inicio/inicio.component';
import { RegistroComunComponent } from './components/registro-comun/registro-comun.component';
import { RegistroEspecialComponent } from './components/registro-especial/registro-especial.component';
import { RegistroResponsableComponent } from './components/registro-responsable/registro-responsable.component';
import { BarraNavegacionComponent } from './components/components/barra-navegacion/barra-navegacion.component';
import { MenuDesplegableComponent } from './components/components/menu-desplegable/menu-desplegable.component';
import { ListaUsuariosComponent } from './components/lista-usuarios/lista-usuarios.component';
import { MapaReportesComponent } from './components/mapa-reportes/mapa-reportes/mapa-reportes.component';

import { AutenticacionGuard } from './services/guard/autenticacion.guard';
import { TokenInterceptorService } from './services/token-interceptor/token-interceptor.service';
import { TablaComunesComponent } from './components/tabla-comunes/tabla-comunes.component';
import { TablaEspecialesComponent } from './components/tabla-especiales/tabla-especiales.component';
import { TablaResponsablesComponent } from './components/tabla-responsables/tabla-responsables.component';
import { BtnsTablasUsuariosComponent } from './components/components/btns-tablas-usuarios/btns-tablas-usuarios.component';
import { BusquedaUsuariosPipe } from './pipes/busqueda-usuarios.pipe';


@NgModule({
  declarations: [
    AppComponent,
    RegistroComunComponent,
    RegistroEspecialComponent,
    RegistroResponsableComponent,
    InicioComponent,
    BarraNavegacionComponent,
    MenuDesplegableComponent,
    ListaUsuariosComponent,
    MapaReportesComponent,
    TablaComunesComponent,
    TablaEspecialesComponent,
    TablaResponsablesComponent,
    BtnsTablasUsuariosComponent,
    BusquedaUsuariosPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    ErrorTailorModule.forRoot({
      errors: {
        useValue: {
          required: 'Este campo es requerido',
          minlength: ({ requiredLength, actualLength }) => 
                      `Expect ${requiredLength} but got ${actualLength}`,
          // invalidAddress: error => `El correo electronico no es valido`,
          email: 'El email no es valido',
          validator: 'La contraseña no coincide'          
        }
      }
    })
  ],
  providers: [
    AutenticacionGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
