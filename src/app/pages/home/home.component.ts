import { Component, Inject, OnInit } from '@angular/core';
import { SESSION_STORAGE, StorageService } from 'ngx-webstorage-service';
import { Router } from '@angular/router';
import {EncriptadoService} from '../../servicios/encriptado.service';
import { UsuariosService } from 'src/app/servicios/usuarios.service';
import {Usuario} from '../../modelos/Usuario'
declare var $: any;
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {
  
  constructor(@Inject(SESSION_STORAGE) private storage: StorageService,  public router: Router,private encriSer:EncriptadoService,private usrSer:UsuariosService) { }
  usuraioUso:Usuario={Apellidos:'',Cedula:'',Estado:'',FechaCreacion:{date:''},IdPerfil:'',IdUsuario:'',Imagen:'',NombrePerfil:'',Nombres:'',token:''};
  permisos:any=[];
  ngOnInit(): void {
    this.ScriptInicioTemplate();
    this.validarUsuario();
    this.getPerfil();

  }
  ScriptInicioTemplate() {
    var navoffeset = $(".header-main").offset().top;
    $(window).scroll(function () {
      var scrollpos = $(window).scrollTop();
      if (scrollpos >= navoffeset) {
        $(".header-main").addClass("fixed");
      } else {
        $(".header-main").removeClass("fixed");
      }
    });
    var toggle = true;
    $(".sidebar-icon").click(function () {
      if (toggle) {
        $(".page-container").addClass("sidebar-collapsed").removeClass("sidebar-collapsed-back");
        $("#menu span").css({ "position": "absolute" });
      }
      else {
        $(".page-container").removeClass("sidebar-collapsed").addClass("sidebar-collapsed-back");
        setTimeout(function () {
          $("#menu span").css({ "position": "relative" });
        }, 400);
      }
      toggle = !toggle;
    });
  }
  validarUsuario(){
    var usr=this.storage.get('Usuario');
    console.log('usr',usr);
    if(usr==undefined){
      this.router.navigateByUrl('/login');
    }else{
      this.usuraioUso=usr;
      console.log('uso',this.usuraioUso);
    }
  }
  getPerfil(){
    this.usrSer.getPerfil(this.usuraioUso.IdPerfil, this.usuraioUso.token).subscribe(
      res => {
        console.log(res);
        if (res.estado) {
          var peril = this.encriSer.desencriptar(res.res, false);
          this.permisos=peril[0].Permisos;

          console.log(this.permisos,peril,);
          

        }
      },
      err => {

        console.log(err)
      }
    );
  }
  exitsRuta(name:string){
    return this.permisos.findIndex((element:any) => element.Nombre ==name)!=-1;
  }
  clickCerrarSecion(){
    this.storage.remove('Usuario');
    this.router.navigateByUrl('/login');
  }
}
