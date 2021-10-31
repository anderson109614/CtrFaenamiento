import { AfterViewInit, Component, Inject, OnInit } from '@angular/core';
import { SESSION_STORAGE, StorageService } from 'ngx-webstorage-service';
import { Router } from '@angular/router';
import { Usuario } from '../../modelos/Usuario';
import { UsuariosService } from 'src/app/servicios/usuarios.service';
import { BoardService } from 'src/app/servicios/board.service';
import { EncriptadoService } from 'src/app/servicios/encriptado.service';
import swal from 'sweetalert';

declare var Chart: any;
declare var $: any;
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements AfterViewInit {

  usuarioUso: Usuario = { Apellidos: '', Cedula: '', Estado: '', FechaCreacion: { date: '' }, IdPerfil: '', IdUsuario: '', Imagen: '', NombrePerfil: '', Nombres: '', token: '', };
  usuarioSelec: Usuario = { Apellidos: '', Cedula: '', Estado: '', FechaCreacion: { date: '' }, IdPerfil: '', IdUsuario: '', Imagen: '', NombrePerfil: '', Nombres: '', token: '', };
  NumeroUsuarios = 0;
  TotalGias = 0;
  TotalGiasHoy = 0;
  ListaConeoPorUsuarios: any = [];
  ListaConeoPorProductos: any = [];
  ListaBarras: any = [];
  ListaConeoPorProductosHoy: any = [];
  listaPerfiles: any = [];
  constructor(@Inject(SESSION_STORAGE) private storage: StorageService, public router: Router, private encriSer: EncriptadoService
    , private usrSer: UsuariosService, private boarSer: BoardService) { }

  ngAfterViewInit(): void {
    


  }

  async ngOnInit() {
    this.cargarUsuarioUso();
    await this.cragarListaConteoProducos();
    this.cargarCantidaUsuarios();
    this.cargarTotalGias();
    this.cargarTotalGiasHoy();
    this.cargarConteoPorUsuarios();
    this.cragarListaConteoProducosHoy()
    this.cragarListaConteoBarras();
    //this.cargarPorsentajes();
    this.barras();
  }

  barras() {

  }

  cargarUsuarioUso() {
    var us = this.storage.get('Usuario');
    this.usuarioUso = us;
    this.usrSer.verificarPermisos(this.usuarioUso.IdPerfil, 'usuarios', this.usuarioUso.token).subscribe(
      res => {
        console.log(res);
        if (!res.estado) {
          this.router.navigateByUrl('/home');

        }
      },
      err => {

        console.log(err);
      }
    );
  }
  async cragarListaConteoProducos() {
    await this.boarSer.getConteoPorProductos(this.usuarioUso.token).subscribe(
      res => {
        console.log('res', res);
        if (res.estado) {

          var desen = this.encriSer.desencriptar(res.res, false);
          console.log('conpro', desen);
          this.ListaConeoPorProductos = desen;
          var total = 0;
          for (let index = 0; index < this.ListaConeoPorProductos.length; index++) {
            total += this.ListaConeoPorProductos[index].Cantidades;

          }
          for (let index = 0; index < this.ListaConeoPorProductos.length; index++) {
            var superior = this.ListaConeoPorProductos[index].Cantidades * 100;
            var porcentaje = superior / total;
            this.ListaConeoPorProductos[index].Porsentaje = porcentaje;

          }


        }

      },
      err => {

        console.log(err);
      }
    );

  }
  async cragarListaConteoProducosHoy() {
    await this.boarSer.getConteoPorProductosHoy(this.usuarioUso.token).subscribe(
      res => {
        console.log('res hoy', res);
        if (res.estado) {

          var desen = this.encriSer.desencriptar(res.res, false);
          console.log('conpro', desen);
          this.ListaConeoPorProductosHoy = desen;
          var total = 0;
          for (let index = 0; index < this.ListaConeoPorProductosHoy.length; index++) {
            total += this.ListaConeoPorProductosHoy[index].Cantidades;

          }
          for (let index = 0; index < this.ListaConeoPorProductosHoy.length; index++) {
            var superior = this.ListaConeoPorProductosHoy[index].Cantidades * 100;
            var porcentaje = superior / total;
            this.ListaConeoPorProductosHoy[index].Porsentaje = porcentaje;

          }


        }

      },
      err => {

        console.log(err);
      }
    );

  }

  cargarPorsentajes() {
    console.log('porcentajes');

    for (let index = 0; index < this.ListaConeoPorProductos.length; index++) {
      var nombre = 'progress-' + this.ListaConeoPorProductos[index].Producto;
      console.log('nombre', nombre);
      var div = (<HTMLDivElement>document.getElementById(nombre));
      console.log('div', div);
      div.style.width = this.ListaConeoPorProductos[index].Porsentaje + "%";

    }


  }
  cargarConteoPorUsuarios() {
    this.boarSer.getConteoPorUsuarios(this.usuarioUso.token).subscribe(
      res => {
        console.log('res', res);
        if (res.estado) {

          var desen = this.encriSer.desencriptar(res.res, false);
          console.log('conusr', desen);
          this.ListaConeoPorUsuarios = desen;

        }
      },
      err => {

        console.log(err);
      }
    );
  }
  cargarCantidaUsuarios() {
    this.boarSer.getUsuariosCount(this.usuarioUso.token).subscribe(
      res => {
        console.log('res', res);
        if (res.estado) {

          var desen = this.encriSer.desencriptar(res.res, false);
          console.log('desen', desen);
          this.NumeroUsuarios = desen[0]

        }
      },
      err => {

        console.log(err);
      }
    );
  }
  cargarTotalGias() {
    this.boarSer.getTotalGias(this.usuarioUso.token).subscribe(
      res => {
        console.log('res', res);
        if (res.estado) {

          var desen = this.encriSer.desencriptar(res.res, false);
          console.log('desen', desen);
          this.TotalGias = desen[0]

        }
      },
      err => {

        console.log(err);
      }
    );
  }
  cargarTotalGiasHoy() {
    this.boarSer.getTotalGiasHoy(this.usuarioUso.token).subscribe(
      res => {
        console.log('res', res);
        if (res.estado) {

          var desen = this.encriSer.desencriptar(res.res, false);
          console.log('desen', desen);
          this.TotalGiasHoy = desen[0]

        }
      },
      err => {

        console.log(err);
      }
    );
  }
  labels: any = [];
  mesesLal: any = [];
  toros: any = [];
  vacas: any = [];
  meses = ["Ene", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"]
  cragarListaConteoBarras() {
    this.boarSer.getConteoListaBarras(this.usuarioUso.token).subscribe(
      res => {
        console.log('res barras', res);
        if (res.estado) {

          var desen = this.encriSer.desencriptar(res.res, false);
          console.log('barras', desen);
          this.ListaBarras = desen;
          var mesuso: any = this.ListaBarras[0].mes;
          this.labels.push(this.meses[this.ListaBarras[0].mes-1]);
          this.mesesLal.push(this.ListaBarras[0].mes);
          for (let index = 0; index < this.ListaBarras.length; index++) {
            if (this.ListaBarras[index].mes != mesuso) {
              this.labels.push(this.meses[this.ListaBarras[index].mes-1]);
              this.mesesLal.push(this.ListaBarras[index].mes);
            }


            mesuso = this.ListaBarras[index].mes;


          }
          console.log('lavel', this.labels,this.mesesLal);
          for(let index = 0; index < this.mesesLal.length; index++){
            var aux=false;
            for (let index2 = 0; index2 < this.ListaBarras.length; index2++) {
              if(this.ListaBarras[index2].mes==this.mesesLal[index] && this.ListaBarras[index2].Producto=='Vacas'){
                this.vacas.push(this.ListaBarras[index2].Cantidades);
                aux=true;
              }
              
            }
            if(!aux){
              this.vacas.push(0);
            }
            var aux2=false;
            for (let index2 = 0; index2 < this.ListaBarras.length; index2++) {
              if(this.ListaBarras[index2].mes==this.mesesLal[index] && this.ListaBarras[index2].Producto=='Toros'){
                this.toros.push(this.ListaBarras[index2].Cantidades);
                aux2=true;
              }
              
            }
            if(!aux2){
              this.toros.push(0);
            }

          }
          console.log('vacas',this.vacas,this.toros);
          this.GraficoBarras();
        }

      },
      err => {

        console.log(err);
      }
    );

  }
  GraficoBarras() {

    var barChartData = {
      labels: this.labels,
      datasets: [
        {
          fillColor: "#FC8213",
          data: this.vacas
        },
        {
          fillColor: "#337AB7",
          data: this.toros
        }
      ]

    };
    console.log('chart',barChartData);
    var a = new Chart((<HTMLCanvasElement>document.getElementById("bar")).getContext("2d")).Bar(barChartData);
  }

}
