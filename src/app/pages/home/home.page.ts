import { Component } from '@angular/core';
import { Health } from '@ionic-native/health/ngx';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  Steps: string;
  startDate: Date;


  constructor(
    private health: Health,
    private platform: Platform
  ) {
    this.startDate = new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000);
  }

  ionViewWillEnter() {
    console.log(this.startDate);
    this.CheckPoints();

  }

  CheckPoints() {
    if (this.platform.is('cordova')) {
      this.health.isAvailable()
        .then((available: boolean) => {
          alert('IS AVAILABLE ' + available);
          this.health.requestAuthorization([
            'distance', 'nutrition', 'steps',
          {
            write: ['height', 'weight']
          }])
          .then(res => {
            alert('Authorization success ' + res);
            this.health.queryAggregated({
              startDate: this.startDate,
              endDate: new Date(), // now
              dataType: 'steps',
              bucket: 'week'
            })
            .then(success => {
              this.Steps = success[success.length - 1].value;
              console.log('STEPS ' + JSON.stringify(success));
              alert('YOUR STEPS ARE ' + success[success.length - 1].value);
            }).catch(e => { console.log('Get steps ERROR' + e); });
          }).catch(e => alert('Authorization ERROR' + e));
        }).catch(e => alert('AVAILABLE is not working ' + e));
    }
  }
}
