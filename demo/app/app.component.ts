import { Component, ChangeDetectorRef, ChangeDetectionStrategy } from "@angular/core";
import { StripePaymentContext, STPEvents } from "nativescript-stripe-paymentcontext";
import { StripeSettings } from "./stripe-settings";
const httpModule = require("http");
import { getString, setString } from "tns-core-modules/application-settings";
import * as dialogs from "ui/dialogs";

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
    isStripeBusy: boolean = false;

    constructor(private changeDetectionRef: ChangeDetectorRef) {
        this.stripSettings = require('./stripe-settings.json');
        this._stripe = new StripePaymentContext(this.stripSettings.backendUrl + this.stripSettings.ephemeral_keysUrl, this.stripSettings.publishableKey, this.stripSettings.appleMerchantIdentifier);

        // this._stripe.on(STPEvents.paymentContextDidChange, (event: any) => {
        this._stripe.on("paymentContextDidChange", (event: any) => {
            console.log(" >>>>>>>>>>>>>>>>> >>>>>>>>>>>>>>>>>> >>>>>>>>>>>>>>> STPEvents.paymentContextDidChange");
            // Update the user interface
            this.changeDetectionRef.detectChanges();
        });

        // this._stripe.on(STPEvents.paymentContextDidCreatePaymentResultCompletion, (event: any) => {
        this._stripe.on("paymentContextDidCreatePaymentResultCompletion", (event: any) => {
            console.log(" >>>>>>>>>>>>>>>>> >>>>>>>>>>>>>>>>>> >>>>>>>>>>>>>>> STPEvents.paymentContextDidCreatePaymentResultCompletion");
            // console.dir(event);
            //  payment transaction id
            this.isStripeBusy = true;
            // Update the user interface
            this.changeDetectionRef.detectChanges();
            const source = event.data[0].source.stripeID;
            const completion = event.data[1];
            if (!getString("AppUniqueID")) {
                console.error("Setting 'AppUniqueID' does NOT exist!");
                return;
            }
            let json_payload = {
                    "api_version": 1,
                    "customerAppUuid": getString("AppUniqueID"),
                    "source": source,
                    "amount": 100,
                    "currency": "AUD",
                    "country": "AU",
                    "shoppingCart": [
                        {
                            "price": 50,
                            "tittle": "Book",
                            "keycode": 1,
                            "quantity" : 1
                        },
                        {
                            "price": 25,
                            "tittle": "Hat",
                            "keycode": 1,
                            "quantity" : 2
                        }
                    ],
                    "loyaltyCard": 666,
            };
            httpModule.request({
                url: this.stripSettings.backendUrl + this.stripSettings.createChargeUrl,
                method: "POST",
                headers: { "Content-Type": "application/json" },
                content: JSON.stringify(json_payload),
            }).then((response) => {
                if (response.statusCode === 200) {
                    console.log(response.content);
                    // console.dir(completion);
                    // Should  trigger the call of paymentContext:didFinishWithStatus:error
                    completion(null);
                } else {
                    console.error(response.content);
                    completion(response.content);
                }

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

        // this._stripe.on(STPEvents.paymentContextDidFinishWithStatusError, (event: any) => {
        this._stripe.on("paymentContextDidFinishWithStatusError", (event: any) => {
            // console.dir(event.data);
            console.log(" || >>>>>>>>>>>>>>>>> >>>>>>>>>>>>>>>>>> >>>>>>>>>>>>>>> STPEvents.paymentContextDidFinishWithStatusError !!");
            const status = event.data[0];
            const error = event.data[1];
            this.isStripeBusy = false;
            this.changeDetectionRef.detectChanges();
            if (status === 2){
                // ApplePay Cancel button
                return;
            }
            if (status === 0){
                dialogs.alert({
                    title: "Payment Result",
                    message: "Your payment was successful ! ",
                    okButtonText: "Have a nice day."
                }).then(() => {
                    console.log("Dialog successful closed!");
                });
            } else {
                dialogs.alert({
                    title: "Payment Result",
                    message: "Your payment was NOT successful : " + error.toString() ,
                    okButtonText: "Please try again."
                }).then(() => {
                    console.log("Dialog error closed!");
                });
            }
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
