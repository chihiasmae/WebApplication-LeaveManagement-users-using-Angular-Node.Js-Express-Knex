import { Component, ViewChild, OnInit, ElementRef } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, MatDialog } from '@angular/material';
import { FormControl } from '@angular/forms';
import { COMMA, TAB, SPACE, ENTER, SLASH } from '@angular/cdk/keycodes';
import * as XLSX from 'xlsx';
import { CraService } from '../_service/cra.service';
import {DupService} from '../_services/dup.service';
import {Pdup} from '../Pdup';

import {DataSource} from '@angular/cdk/table';

import {FormEmployeComponent} from '../form-Employe/form-Employe.component';

import {Observable} from 'rxjs';
import { CongeService } from '../_service/conge.service';
import { PerService } from '../_service/personnel.service';
import { personnel } from '../personnel';
import { AuthenticationService } from '../_services';
import { User } from '../_models/user';
import { Router } from '@angular/router';
import { ToasterService } from '../toaster.service';
import { FormCongeComponent } from '../formConge/formConge.component';


export interface Numb {
  num: string;
}
export interface SearchItem {
  charge: number;
  projet: string;
  date: string;
  Taction: string;
  fiche: string;
}

@Component({
  selector: 'app-visuliser-mes-cras',
  templateUrl: './visuliser-mes-cras.component.html',
  styleUrls: ['./visuliser-mes-cras.component.scss']
})
export class VisuliserMesCrasComponent implements OnInit {

  user :personnel[];
  name:string;
  currentUser: User;
  c="";
  conges:MatTableDataSource<Pdup>;
  conge:MatTableDataSource<Pdup>;
  sort: MatSort;

  congeSelected:any[]=[];
  

  constructor(private authenticationService: AuthenticationService,private dupService: DupService, public dialog: MatDialog,
    public congeService: PerService, public per:PerService,private router: Router,private toaster:ToasterService) { 
      this.authenticationService.currentUser.subscribe(x => this.currentUser = x);

      congeService.getAllperso().subscribe(data=>
      {
           
        this.conge=data;
       for(let i of data){
    
          
        
 this.congeSelected.push(i);
        
        }
  
        this.conges=new MatTableDataSource(this.congeSelected); 
   
  
          this.conges.sort=this.sort;
        }
    
  
    );



    
   
  








    
    per.getAllp().subscribe(user => {
     
      this.user=user;
      
    })
  }
  displayedColumns = ['etat','email','fonction', 'tele','type','ville','motDePass','date_posted', 'dateDebut','delete'];
  dataSource = new PostDataSource(this.dupService);

  async ngOnInit() {
    await this.congeService.getAllperso().toPromise();

       
  }
  async supprimer(id) {
   
    let j;
    for(j=0;j<this.congeSelected.length;j++){
if(id==this.congeSelected[j].id){
 
  this.toaster.show('success','La ligne est supprimée avec succée !');
  window.location.reload();
  await this.congeService.supprimer({ data:this.congeSelected[j]}.data).toPromise();
  this.dataSource.filter="";
  }
  }
  }
  openDialog(): void {
    let dialogRef = this.dialog.open(FormEmployeComponent, {
      width: '600px',
      data: 'Add Post'
    });
    dialogRef.componentInstance.event.subscribe((result) => {
     // this.dupService.addPost(result.data);
      this.dataSource = new PostDataSource(this.dupService);
    });
  }
  
  
  

}
export class PostDataSource extends DataSource<any> {
  paginator: MatPaginator;
  sort: MatSort;
  filter: string;
  constructor(private dupService: DupService) {
    super();
  }

  connect(): Observable<Pdup[]> {
    return this.dupService.getDataconge();
  }


  

  disconnect() {
  }
  
}
