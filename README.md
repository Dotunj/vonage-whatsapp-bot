# Vonage WhatsApp Bot
This is a basic demo of WhatsApp Chatbot that performs currency conversion using Coinbase's API.

## Topics
Node, Express, Vonage, WhatsApp

## Prerequisites

* A Nexmo account, [sign up for a new account here](https://dashboard.nexmo.com/sign-up) if you don't have one already
* **EITHER** a WhatsApp Business number **OR** you can try this app using the [Messages API Sandbox](https://developer.nexmo.com/messages/concepts/messages-api-sandbox) - but only telephone numbers that you whitelist through the dashboard can be used. This makes the sandbox ideal for testing with a controlled group of numbers.
* NodeJS and NPM

## Set up the application to run locally

1. Using the Messages Sandbox, configure the sandbox URL for Inbound Messages to point to the URL `[APP URL]/webhooks/inbound-message`.
  - Your application must be publicly available. If running locally, you might find the [guide to using Ngrok for development](https://developer.nexmo.com/tools/ngrok) helpful.
3. Clone this repo, and run `npm install`
4. Copy the `.env.example` file to `.env`
5. Add your configuration values to the `.env` file, this will include your Nexmo credentials.
6. Run `npm start` in your terminal

## Further Reading

* Check out the Developer Documentation at <https://developer.nexmo.com>
* More information about the Messages API Sandbox: <https://developer.nexmo.com/messages/concepts/messages-api-sandbox>


## Help

If you have any issues, Nexmo's [developer support team](https://mailface.xyz/developers) is here to help you. You can find them on [Slack](https://app.slack.com/client/T24SLSN21/DLUCX7A8G/thread/CB8BKH075-1564343170.005000)