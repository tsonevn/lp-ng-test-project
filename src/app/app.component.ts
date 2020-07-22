import { Component, OnInit } from '@angular/core';
import * as Leanplum from "leanplum-sdk";
// import { SwPush } from '@angular/service-worker';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'lp-ng-test-project';
  private appId = "app_LHSAoCGQmodSCH4h4zzBLNJGf4RpmPfKaa8W5t5IPy4";
  private pKey = "prod_ZDyF2k234EfqYkssD8HCfZy4VLFVXnICw4KsmasMR40";
  private dKey = "dev_tbYvOXgbLyTQX1RXOEQogq76iDLhDKcYG6BT2hpbXZs";
  private isDevelopmentMode = true;

  // Sample variables. This can be any JSON object.
  private variables = {
   items: {
     color: 'red',
     size: 20,
     showBadges: true
   },
   showAds: true
  };
  constructor(){}
  ngOnInit(){
    if (this.isDevelopmentMode) {
      Leanplum.default.setAppIdForDevelopmentMode(this.appId, this.dKey);
     } else {
      Leanplum.default.setAppIdForProductionMode(this.appId, this.pKey);
     }
     
     Leanplum.default.setVariables(this.variables);
    //  Leanplum.default.track("View Cart", {itemsInCart: 4});
     Leanplum.default.start((success) => {
      console.log('Success: ' + success);
      console.log('Variables', Leanplum.default.getVariables());
      Leanplum.default.setUserId("webUser");
      
      if(Leanplum.default.isWebPushSupported()){
        Leanplum.default.isWebPushSubscribed().then(wpr=>{
          console.log("WPR", wpr);
          if(!wpr){
            console.log("Leanplum register for push");
            // Leanplum.default.registerForWebPush(this.swPush).then(r=>{
            //   console.log("Register push result", r);
            // }).catch(e=>{
            //   console.log("Error push result", e);
            // })
          }
        }).catch(wpe=>{
          console.log("err", wpe)
        })
      }
     });
  }
}
