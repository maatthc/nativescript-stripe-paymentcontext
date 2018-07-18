# Nativescript Stripe PaymentContext Plugin

Easly Add Stripe Payment to your Nativescript App on iOS (Android coming soon).
Create you virtual wallet: save multiple credit card token - Supports Apple Pay!


![Screenshot](https://stripe.com/img/blog/posts/ui-components-for-ios/wallet@2x.png "Screenshot")


## Requirements

You will need Node/npm and NativeScript installed - check here how to get started : https://docs.nativescript.org/angular/start/introduction

Register on Stripe for free at
https://dashboard.stripe.com/register .

Copy your Publishable key ("pk_test_*") from
https://dashboard.stripe.com/account/apikeys


Deploy the backend piece on Heroku (Free account) or host it yourself using  https://github.com/maatthc/stripe-paymentcontext-backend
		
Give it a App name and use your Stripe Publishable key and save the URL.

In case you want to use Apple Pay on your App follow the steps here: 
https://stripe.com/docs/apple-pay/apps

## Installation

```
git clone git@github.com:maatthc/nativescript-stripe-paymentcontext.git
cd nativescript-stripe-paymentcontext
cp ./demo/app/stripe-settings.json.default ./demo/app/stripe-settings.json 
```

Edit ./demo/app/stripe-settings.json then

```
cd src
npm run demo.ios
```

## Apple Pay 

Stop/Close the execution after it shows you the application.

Open the Xcode Workspace at ./nativescript-stripe-paymentcontext/demo/platforms/ios/demo.xcworkspace

Enable Apple Pay on your project "Capabilities" - you might need to set up your app Bundle Identifier.

You are good to go.

## License

Apache License Version 2.0, January 2004
