import { Component, AfterViewChecked, OnInit, DoCheck, AfterViewInit } from "@angular/core";
import { StripePaymentContext } from "nativescript-stripe-paymentcontext";
import { StripeSettings } from "./stripe-settings";

@Component({
    moduleId: module.id,
    selector: "ns-app",
    templateUrl: "app.component.html",
    styleUrls: [
        'app.component.css'
      ],
})

export class AppComponent {
    _stripe: StripePaymentContext;

    constructor() {
        let settings: StripeSettings = require('./stripe-settings.json');
        this._stripe = new StripePaymentContext(settings.backendUrl, settings.publishableKey, settings.appleMerchantIdentifier);
    }

    checkStripeHostViewController() {
        // UIApplication.sharedApplication.keyWindow is only available long after the App starts..
        if (UIApplication.sharedApplication.keyWindow && !this._stripe.paymentContext.hostViewController) {
            let appWindow = UIApplication.sharedApplication.keyWindow;
            this._stripe.paymentContext.hostViewController = appWindow.rootViewController;
        }
    }

    choosePayment() {
        this.checkStripeHostViewController();
        this._stripe.paymentContext.presentPaymentMethodsViewController();
    }

    request_payment() {
        this.checkStripeHostViewController();
        this._stripe.paymentContext.requestPayment();
    }
}
