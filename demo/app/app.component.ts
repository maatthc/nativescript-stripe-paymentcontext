import { Component, ChangeDetectorRef, ChangeDetectionStrategy } from "@angular/core";
import { StripePaymentContext, STPEvents } from "nativescript-stripe-paymentcontext";
import { StripeSettings } from "./stripe-settings";
const httpModule = require("http");
import {
    getString,
    setString,
} from "tns-core-modules/application-settings";

@Component({
    moduleId: module.id,
    selector: "ns-app",
    templateUrl: "app.component.html",
    styleUrls: [
        'app.component.css'
      ],
    changeDetection: ChangeDetectionStrategy.Default
})

export class AppComponent {
    _stripe: StripePaymentContext;

    constructor(private changeDetectionRef: ChangeDetectorRef) {
        let stripSettings: StripeSettings = require('./stripe-settings.json');

        this._stripe = new StripePaymentContext(stripSettings.backendUrl + stripSettings.ephemeral_keysUrl, stripSettings.publishableKey, stripSettings.appleMerchantIdentifier);

        // this._stripe.on(STPEvents.paymentContextDidChange, (event: any) => {
        this._stripe.on("paymentContextDidChange", (event: any) => {
            console.log(" >>>>>>>>>>>>>>>>> >>>>>>>>>>>>>>>>>> >>>>>>>>>>>>>>> STPEvents.paymentContextDidChange");
            // Update the user interface
            this.changeDetectionRef.detectChanges();
        });

        // this._stripe.on(STPEvents.paymentContextDidCreatePaymentResultCompletion, (event: any) => {
        this._stripe.on("paymentContextDidCreatePaymentResultCompletion", (event: any) => {
            console.log(" >>>>>>>>>>>>>>>>> >>>>>>>>>>>>>>>>>> >>>>>>>>>>>>>>> STPEvents.paymentContextDidCreatePaymentResultCompletion");
            console.dir(event);
            console.log(event.data[0].source);
            //  payment transaction id
            console.log(event.data[0].source.stripeID);
            const completion = event.data[1](null);
            if (!getString("AppUniqueID")) {
                console.error("Setting 'AppUniqueID' does NOT exist!");
                return;
            }
            httpModule.request({
                url: stripSettings.backendUrl + stripSettings.createChargeUrl,
                method: "POST",
                headers: { "Content-Type": "application/json" },
                content: JSON.stringify({
                    "api_version": 1,
                    "uuid": getString("AppUniqueID")
                })
            }).then((response) => {
                const result = response.content.toJSON();
                console.dir(result);
                // Should  trigger the call of paymentContext:didFinishWithStatus:error
                completion(null);
            }, (e) => {
                console.error(e);
                completion(e);
            });
        });

        // this._stripe.on(STPEvents.paymentContextDidFailToLoadWithError, (event: any) => {
        this._stripe.on("paymentContextDidFailToLoadWithError", (event: any) => {
            console.log(" >>>>>>>>>>>>>>>>> >>>>>>>>>>>>>>>>>> >>>>>>>>>>>>>>> STPEvents.paymentContextDidFailToLoadWithError");
            console.dir(event);
        });

        // this._stripe.on(STPEvents.paymentContextDidFinishWithError, (event: any) => {
        this._stripe.on("paymentContextDidFinishWithError", (event: any) => {
            console.log(" >>>>>>>>>>>>>>>>> >>>>>>>>>>>>>>>>>> >>>>>>>>>>>>>>> STPEvents.paymentContextDidFinishWithError");
            console.dir(event);
        });
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
        this._stripe.paymentContext.paymentAmount = 500;
        this._stripe.paymentContext.requestPayment();
    }
}
