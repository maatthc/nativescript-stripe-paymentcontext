import { Component, ChangeDetectorRef, ChangeDetectionStrategy } from "@angular/core";
import { StripePaymentContext, STPEvents } from "nativescript-stripe-paymentcontext";
import { StripeSettings } from "./stripe-settings";
const httpModule = require("http");

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
    stripSettings: StripeSettings;

    constructor(private changeDetectionRef: ChangeDetectorRef) {
        this.stripSettings = require('./stripe-settings.json');
        this._stripe = new StripePaymentContext(this.stripSettings.backendUrl + this.stripSettings.ephemeral_keysUrl, this.stripSettings.publishableKey, this.stripSettings.appleMerchantIdentifier);

        // this._stripe.on(STPEvents.paymentContextDidChange, (event: any) => {
        this._stripe.on("paymentContextDidChange", (event: any) => {
            console.log(" >>>>>>>>>>>>>>>>> >>>>>>>>>>>>>>>>>> >>>>>>>>>>>>>>> STPEvents.paymentContextDidChange");
            // Update screen components
            this.changeDetectionRef.detectChanges();
        });

        // this._stripe.on(STPEvents.paymentContextDidCreatePaymentResultCompletion, (event: any) => {
        this._stripe.on("paymentContextDidCreatePaymentResultCompletion", (event: any) => {
            console.log(" >>>>>>>>>>>>>>>>> >>>>>>>>>>>>>>>>>> >>>>>>>>>>>>>>> STPEvents.paymentContextDidCreatePaymentResultCompletion");
            console.dir(event);
            console.dir(event);
            console.log(event.data[0].source);
            //  payment transaction id
            console.log(event.data[0].source.stripeID);
            const completion = event.data[1](null);
            httpModule.request({
                url: this.stripSettings.backendUrl + this.stripSettings.createChargeUrl,
                method: "POST",
                headers: { "Content-Type": "application/json" },
                content: JSON.stringify({
                    "api_version": 1,
                    "uuid": 1
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
