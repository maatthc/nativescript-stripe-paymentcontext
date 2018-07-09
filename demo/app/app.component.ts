import { Component, AfterViewChecked } from "@angular/core";
import { StripePaymentContext } from "nativescript-stripe-paymentcontext";
import { StripeSettings } from "./stripe-settings";

@Component({
    selector: "ns-app",
    templateUrl: "app.component.html",
})

export class AppComponent implements AfterViewChecked {
    _stripe: StripePaymentContext;

    constructor() {
        let settings : StripeSettings = require('./stripe-settings.json');
        this._stripe  = new StripePaymentContext(settings.backendUrl, settings.publishableKey, settings.appleMerchantIdentifier);
    }

    ngAfterViewChecked() {
        console.log("  ------  >>>>>   ngAfterViewChecked");
        if (UIApplication.sharedApplication.keyWindow && !this._stripe.paymentContext.hostViewController){
            let appWindow = UIApplication.sharedApplication.keyWindow;
            this._stripe.paymentContext.hostViewController = appWindow.rootViewController;
        }
    }
    choosePayment() {
        this._stripe.paymentContext.presentPaymentMethodsViewController();
    }
}
