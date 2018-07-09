import { Observable } from 'tns-core-modules/data/observable';
import * as app from 'tns-core-modules/application';

export interface ISTPEvents {
  paymentContextDidChange: string;
  paymentContextDidCreatePaymentResultCompletion: string;
  paymentContextDidFinishWithError: string;
  paymentContextDidFailToLoadWithError: string;
}

export const STPEvents: ISTPEvents = {
  paymentContextDidChange : "paymentContextDidChange",
  paymentContextDidCreatePaymentResultCompletion : "paymentContextDidCreatePaymentResultCompletion",
  paymentContextDidFinishWithError : "paymentContextDidFinishWithError",
  paymentContextDidFailToLoadWithError : "paymentContextDidFailToLoadWithError"
};

export class Common extends Observable {
  constructor() {
    super();
  }
}
