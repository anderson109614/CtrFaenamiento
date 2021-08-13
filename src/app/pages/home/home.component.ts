import { Component, Inject, OnInit } from '@angular/core';
import { SESSION_STORAGE, StorageService } from 'ngx-webstorage-service';
import { Router } from '@angular/router';
import {EncriptadoService} from '../../servicios/encriptado.service';
declare var $: any;
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {
  
  constructor(@Inject(SESSION_STORAGE) private storage: StorageService,  public router: Router,private encriSer:EncriptadoService) { }
  usuraioUso:any;
  ngOnInit(): void {
    this.ScriptInicioTemplate();
    this.validarUsuario();

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
  clickCerrarSecion(){
    this.storage.remove('Usuario');
    this.router.navigateByUrl('/login');
  }
}
