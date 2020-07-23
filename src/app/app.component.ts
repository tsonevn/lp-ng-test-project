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
  public variablesGet;
  public inputVal ="test text web";
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
      Leanplum.default.setUserId("2webUser");
      this.variablesGet = Leanplum.default.getVariables();
      console.log("variables",this.variablesGet);
      Leanplum.default.on('showMessage', function (args){
        var message = args.message;
        var context = args.context;
        console.log("MSG", message)
        // 2. Filter out unsupported message types
        if (message.__name__ !== 'Confirm') {
          return;
        }
        
        // 3. Track impression
        context.track();
        
        // 4. Show message and trigger attached actions
        //    (message can be rendered in HTML and actions can be called asynchronously)
        if (confirm(message.Message)) {
          context.runTrackedActionNamed('Accept action');
        } else {
          context.runTrackedActionNamed('Cancel action');
        }
      });
      if(Leanplum.default.isWebPushSupported()){
        Leanplum.default.isWebPushSubscribed().then(wpr=>{
          console.log("WPR", wpr);
          if(!wpr){
            console.log("Leanplum register for push");
            Leanplum.default.registerForWebPush("assets/sw.js").then(r=>{
              console.log("Register push result", r);
              
            }).catch(e=>{
              console.log("Error push result", e);
            })
          } else{
            // Leanplum.default.unregisterFromWebPush().then(r=>{
            //   console.log("Unregister push result", r);
            // }).catch(e=>{
            //   console.log("Error push unregister", e);
            // })
            
          }
        }).catch(wpe=>{
          console.log("err", wpe)
        })
      }
     });
  }
  setVar(){
    console.log("CLICK - val", this.inputVal);
    Leanplum.default.setVariables({"myWebVar":this.inputVal});
    setTimeout(() => {
      this.variablesGet = Leanplum.default.getVariables();
    }, 2000);
  }
  trackE(){
    Leanplum.default.track("Web like", {"myWebVarInput":this.inputVal});
  }
}
