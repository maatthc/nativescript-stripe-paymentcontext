import { Component, ChangeDetectorRef, ChangeDetectionStrategy } from "@angular/core";
import { StripePaymentContext, STPEvents } from "nativescript-stripe-paymentcontext";
import { StripeSettings } from "./stripe-settings";

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
        let settings: StripeSettings = require('./stripe-settings.json');
        this._stripe = new StripePaymentContext(settings.backendUrl, settings.publishableKey, settings.appleMerchantIdentifier);

        // this._stripe.on(STPEvents.paymentContextDidChange, (event: any) => {
        this._stripe.on("paymentContextDidChange", (event: any) => {
            console.log(" >>>>>>>>>>>>>>>>> >>>>>>>>>>>>>>>>>> >>>>>>>>>>>>>>> STPEvents.paymentContextDidChange");
            this.changeDetectionRef.detectChanges();
            // console.dir(event);
        });

        // this._stripe.on(STPEvents.paymentContextDidCreatePaymentResultCompletion, (event: any) => {
        this._stripe.on("paymentContextDidCreatePaymentResultCompletion", (event: any) => {
            console.log(" >>>>>>>>>>>>>>>>> >>>>>>>>>>>>>>>>>> >>>>>>>>>>>>>>> STPEvents.paymentContextDidCreatePaymentResultCompletion");
            console.dir(event);
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
