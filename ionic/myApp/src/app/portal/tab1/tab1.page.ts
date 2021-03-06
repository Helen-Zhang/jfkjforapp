import { Component } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { PopoverComponent } from './component/popover/popover.component';
import { NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { StorageService } from '../../services/storage/storage.service';
import { GetAppPortalService } from '../../services/get-app-portal.service';
import { first } from 'rxjs/operators';
import { LoadingController } from '@ionic/angular';
import { ActivatedRoute, Params } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { LogoutService } from '../../services/logout/logout.service';
import { GetousService } from "../../services/getous.service";
import {AppConfig } from '../../config'
@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  public name: string;
  public type: string;
  public portalTile: string;
  public portalKey: string;
  public data = [

  ];
  public portalInfo: any;
  public loading: any
  public listIco = { 'background': 'url(sfv3/appmgt.nsf//va_IconLib//collect.png//$FILE//collect.png) no-repeat top left' };
  public titlelog :string ;
  public sdomain:string;
  public folder:string;
  constructor(
    public popoverController: PopoverController,
    public Nav: NavController,
    private storage: Storage,
    public storageService: StorageService,
    public geapp: GetAppPortalService,
    public logoutService: LogoutService,
    public loadingController: LoadingController,
    public activeRoute: ActivatedRoute,
    public translate: TranslateService,
    private getou:GetousService
  ) {

    this.show()
    this.storage.get("loginDetails").then(data => {
      this.sdomain = data.server;
      this.folder = data.folder;
      this.geapp.getPortalInfoV2(data).pipe(first())
        .subscribe(data => {
          console.log(data)
          data = JSON.parse(data.data);
          this.portalInfo = data
          this.portalTile = data.selectedPortal
          this.data = this.getDataBykey(this.portalTile, "Title")
          this.hide()
        })
        this.getou.getLoginPic(data.username,data.password,data.server,data.folder).pipe(first()).subscribe(data => {
          console.log(data)
          data = JSON.parse(data.data);
          this.titlelog=data.HeaderCompanyLogo
          
        });

    })
    this.activeRoute.queryParams.subscribe(res => {
      this.portalTile = res.title
      if (res.key) {
        this.data = this.getDataBykey(res.title, "Title")
      }
    });
  }

  ngOnInit() {

  }
  async presentPopover(ev: any) {
    const popover = await this.popoverController.create({
      component: PopoverComponent,
      event: ev,
      componentProps: { type: "setup", portalTile: this.portalTile },
      translucent: true
    });
    return await popover.present();
  }
  async presentPopoverPortal(ev: any) {
    const popover = await this.popoverController.create({
      component: PopoverComponent,
      event: ev,
      componentProps: { type: "portal", portal: this.portalInfo },
      translucent: true
    });
    return await popover.present();
  }
  logout() {
    //portalTile http://oa.jf81.com/sfv3/appmgt.nsf/xp_ws.xsp/Logout?&email=zding@jf81.com&languageCode=zh&portalGroup=app.integrum Group A
    console.log(this.portalTile)
    let lan = this.translate.getDefaultLang();
    console.log(this.logoutService)
    this.storage.get("loginDetails").then(data => {
      this.logoutService.setLogout(data.username, data.password, data.email, lan, this.portalTile,data.server,data.folder).pipe(first())
        .subscribe(res => {
          console.log(res)
          res = JSON.parse(res.data);
          if (res.status) {
            console.log('退出登录');
            this.Nav.navigateRoot('loginpass');
            localStorage.setItem('hasLogged', "false");
          }
        })
    })



  }
  getInfo() {

  }
  async  show() {
    this.loading = await this.loadingController.create({
      message: 'loading....',
      duration: 2000
    });
    await this.loading.present();
  }
  async hide() {
    if (this.loading) {
      await this.loading.dismiss();
    }
  }

  getDataBykey(key: string, objkey: string): any {
    let res: any;
    if(this.portalInfo){
      this.portalInfo.items.forEach(element => {
        if (element[objkey].trim() == key.trim() && element[objkey] != "") {
          res = this.getNoBlankData(element.allportal)
        }
      });
      return res
    }
   
  }
  getNoBlankData(data: any): any {
    let arr = [];
    let index = 0
    data.forEach(function (obj) {
      if (obj.LinkTitle != "") {
        // obj.index=index
        obj.SFMImage = "sfv3/" + obj.SFMImage
        arr.push(obj)
        //  index=index+1
      }
    })
    return arr;
  }
  


}
