import { Common, STPEvents } from './stripe-paymentcontext.common';

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

    createCustomerKeyWithAPIVersionCompletion(apiVersion: string, completion) {
        console.log("---->>>> createCustomerKeyWithAPIVersionCompletion");
        let url = this.baseURLString + "ephemeral_keys?api_version=" + apiVersion;
        // console.log("--->>> URL:" + url);
        // console.log("--->>> API VERSION:" + apiVersion);
        httpModule.request({
            url: url,
            method: "POST",
            headers: { "Content-Type": "application/json" },
            content: JSON.stringify({
                "api_version": apiVersion
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

