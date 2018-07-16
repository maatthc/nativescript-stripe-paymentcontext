import { Common, STPEvents } from './stripe-paymentcontext.common';
import * as platform from 'tns-core-modules/platform';
import {
    getString,
    setString,
} from "tns-core-modules/application-settings";

declare var STPPaymentContextDelegate, STPCustomerContext, STPEphemeralKeyProvider, STPPaymentContext, STPPaymentConfiguration;

const httpModule = require("http");

class StripePaymentContextDelegate extends NSObject {
    public static ObjCProtocols = [STPPaymentContextDelegate];
    private _owner: WeakRef<StripePaymentContext>;

    public static initWithOwner(owner: WeakRef<StripePaymentContext>): StripePaymentContextDelegate {
        let delegate  = <StripePaymentContextDelegate> StripePaymentContextDelegate.new();
        delegate._owner = owner;
        return delegate;
    }

    paymentContextDidChange(context) {
        this._owner.get().notify({
            eventName: STPEvents.paymentContextDidChange,
            object: this._owner.get(),
            data: context
        });
    }

    paymentContextDidCreatePaymentResultCompletion (context, result, completion) {
        this._owner.get().notify({
            eventName: STPEvents.paymentContextDidCreatePaymentResultCompletion,
            object: this._owner.get(),
            data: [result, completion]
        });
        completion(null);
    }

    paymentContextDidFinishWithStatusError(contex, status, error?: NSError) {
        this._owner.get().notify({
            eventName: STPEvents.paymentContextDidChange,
            object: this._owner.get(),
            data: [status, error]
        });
    }

    paymentContextDidFailToLoadWithError(paymentContext, error: NSError) {
        this._owner.get().notify({
            eventName: STPEvents.paymentContextDidChange,
            object: this._owner.get(),
            data: error
        });
    }
}


export class StripePaymentContext extends Common {
    private _customerContext;
    private _sharedInstance;
    public _paymentContext;

    constructor(url: string, publishableKey: string, appleMerchantIdentifier?: string) {
        super();
        STPPaymentConfiguration.sharedConfiguration().publishableKey = publishableKey;
        if (appleMerchantIdentifier) {
            STPPaymentConfiguration.sharedConfiguration().appleMerchantIdentifier = appleMerchantIdentifier;
        }
        this._sharedInstance = KeyProvider.new();
        this._sharedInstance.baseURLString = url;
        this._customerContext = STPCustomerContext.alloc().initWithKeyProvider(this._sharedInstance);
        this._paymentContext = STPPaymentContext.alloc().initWithCustomerContext(this._customerContext);
        this._paymentContext.delegate = StripePaymentContextDelegate.initWithOwner(new WeakRef(this));
    }

    get paymentContext() {
        return this._paymentContext;
    }
}

class KeyProvider extends NSObject {
    public static ObjCProtocols = [STPEphemeralKeyProvider];

    baseURLString: string;
    // This will identify this user anonymously with Stripe to keep saved cards
    uuid: string;

    private getUniqueID() {
        if (getString("UniqueID")){
            return getString("UniqueID") + "-" + platform.device.uuid;
        }
        else {
            let _rand = this.randomInt(1,10000000).toString();
            setString("UniqueID", _rand);
            return _rand + "-" +platform.device.uuid;
        }
    }
    private randomInt(min, max){
        return Math.floor(Math.random() * (max - min + 1)) + min;
     }

    createCustomerKeyWithAPIVersionCompletion(apiVersion: string, completion) {
        console.log("---->>>> createCustomerKeyWithAPIVersionCompletion");
        this.uuid = this.getUniqueID();
        let url = this.baseURLString + "?api_version=" + apiVersion + "&uuid=" + this.uuid;
        // console.log("--->>> URL:" + url);
        // console.log("--->>> API VERSION:" + apiVersion);
        httpModule.request({
            url: url,
            method: "POST",
            headers: { "Content-Type": "application/json" },
            content: JSON.stringify({
                "api_version": apiVersion,
                "uuid": this.uuid
            })
        }).then((response) => {
            const result = response.content.toJSON();
            console.dir(result);
            completion(result, null);
        }, (e) => {
            console.error(e);
            completion(null, e);
        });
    }

}

const rootVC = function() {
    let appWindow = UIApplication.sharedApplication.keyWindow;
    return appWindow.rootViewController;
};

