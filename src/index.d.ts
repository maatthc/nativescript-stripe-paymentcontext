import { Common } from './stripe-paymentcontext.common';
import { Observable } from 'tns-core-modules/data/observable';

export interface ISTPEvents {
    paymentContextDidChange: string;
    paymentContextDidCreatePaymentResultCompletion: string;
    paymentContextDidFinishWithError: string;
    paymentContextDidFailToLoadWithError: string;
}

export declare const STPEvents: ISTPEvents;

export declare class StripePaymentContext extends Common {
  private _customerContext;
  private _sharedInstance;
  _paymentContext: any;
  constructor(url: string, publishableKey: string, appleMerchantIdentifier?: string);
  readonly paymentContext: any;
}