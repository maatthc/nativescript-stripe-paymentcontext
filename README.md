# Nativescript Stripe PaymentContext Plugin

Ignore: Add your plugin badges here. See [nativescript-urlhandler](https://github.com/hypery2k/nativescript-urlhandler) for example.

Add Stripe Payment to your Nativescript App on iOS (Android coming soon).


![Screenshot](https://stripe.com/img/blog/posts/ui-components-for-ios/wallet@2x.png "Screenshot")


## Requirements

You will need Node/npm and NativeScript installed - check here how to get started : https://docs.nativescript.org/angular/start/introduction

Register on Stripe for free at
https://dashboard.stripe.com/register .

Copy your Publishable key ("pk_test_*") from
https://dashboard.stripe.com/account/apikeys


Deploy the backend piece on Heroku (Free account) using  https://github.com/stripe/example-ios-backend
		
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


Stop/Close the execution after it shows you the application.

Open the Xcode Workspace at ./nativescript-stripe-paymentcontext/demo/platforms/ios/demo.xcworkspace

Set up your Bundle Identifier and Apple Pay.

You are good to go.
## Usage 

Not yet.

## API

Not even close.

## License

Apache License Version 2.0, January 2004
