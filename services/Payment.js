const crypto = require("crypto");
const fs = require("fs");
const config = require("../config");
const constants = config.CONSTANTS;
const { utility } = require("./Utility");
const axios = require("axios");

class MpesaApi {
  constructor() {
    var self = this;
    function encrypt(bufferToEncrypt) {
      var privatekey = fs.readFileSync(
        `./assets/${config.mpesaApi.api_cert}.cer`,
        "utf8"
      );
      var encrypted = crypto.publicEncrypt(
        {
          key: privatekey,
          padding: constants.RSA_PKCS1_PADDING,
        },
        bufferToEncrypt
      );
      var output = encrypted.toString("base64");
      return output;
    }
    this.b2c = async function (body) {
      let token = await self.auth(
        config.mpesaApi.consumer.key,
        config.mpesaApi.consumer.secret
      );
      if (token) {
        time = config.mpesaApi.timestamp();
        var url = `https://${config.mpesaApi.api_env}.safaricom.co.ke/mpesa/b2c/v1/paymentrequest`,
          auth = `Bearer ${token}`;
        const response = await axios({
          method: "POST",
          url: url,
          headers: {
            Authorization: auth,
          },
          data: {
            InitiatorName: config.mpesaApi.initiator,
            SecurityCredential: encrypt(
              new Buffer.from(config.mpesaApi.initiatorPass)
            ),
            CommandID: "BusinessPayment",
            Amount: body.Amount,
            PartyA: body.PartyA,
            PartyB: body.PartyB,
            Remarks: body.Remarks,
            QueueTimeOutURL: config.host + "/<api route name>/timeout/b2c",
            ResultURL: config.host + "/<api route name>/result/b2c",
            Occasion: body.Occasion,
          },
        });
        if (response.status == 200) {
          return response.data;
        }
      }
      return 0;
    };
    this.c2bRegisteUrl = async function (ResponseType) {
      let token = await self.auth(
        config.mpesaApi.consumer.key,
        config.mpesaApi.consumer.secret
      );
      if (token) {
        time = config.mpesaApi.timestamp();
        var url = `https://${config.mpesaApi.api_env}.safaricom.co.ke/mpesa/c2b/v1/registerurl`;
        auth = `Bearer ${token}`;
        const response = await axios({
          method: "POST",
          url: url,
          headers: {
            Authorization: auth,
          },
          data: {
            ShortCode: config.mpesaApi.shortcode,
            ResponseType: ResponseType,
            ConfirmationURL: config.host + "/<api route name>/confirmation/c2b",
            ValidationURL: config.host + "/<api route name>/validation/c2b",
          },
        });
        if (response.status == 200) {
          return response.data;
        }
      }
      return 0;
    };
    this.accountBalance = async function (body) {
      let token = await self.auth(
        config.mpesaApi.consumer.key,
        config.mpesaApi.consumer.secret
      );
      if (token) {
        var url = `https://${config.mpesaApi.api_env}.safaricom.co.ke/mpesa/accountbalance/v1/query`;
        auth = `Bearer ${token}`;
        const response = await axios({
          method: "POST",
          url: url,
          headers: {
            Authorization: auth,
          },
          data: {
            Initiator: config.mpesaApi.initiator,
            SecurityCredential: encrypt(
              new Buffer.from(config.mpesaApi.initiatorPass)
            ),
            CommandID: "AccountBalance",
            PartyA: body.PartyA,
            IdentifierType: "4",
            Remarks: body.Remarks,
            QueueTimeOutURL: config.host + "/<api route name>/result/acB",
            ResultURL: config.host + "/<api route name>/timeout/acB",
          },
        });
        if (response.status == 200) {
          return response.data;
        }
      }
      return 0;
    };
    this.transactionStatus = async function (body) {
      let token = await self.auth(
        config.mpesaApi.consumer.key,
        config.mpesaApi.consumer.secret
      );
      if (token) {
        var url = `https://${config.mpesaApi.api_env}.safaricom.co.ke/mpesa/transactionstatus/v1/query`;
        auth = `Bearer ${token}`;
        const response = await axios({
          method: "POST",
          url: url,
          headers: {
            Authorization: auth,
          },
          data: {
            Initiator: config.mpesaApi.initiator,
            SecurityCredential: encrypt(
              new Buffer.from(config.mpesaApi.initiatorPass)
            ),
            CommandID: "TransactionStatusQuery",
            TransactionID: body.TransactionID,
            PartyA: body.PartyA,
            IdentifierType: "1",
            ResultURL: `${config.host}/<api route name>/result/status`,
            QueueTimeOutURL: `${config.host}/<api route name>/timeout/status`,
            Remarks: body.Remarks,
            Occasion: body.Occasion,
          },
        });
        if (response.status == 200) {
          return response.data;
        }
      }
      return 0;
    };
    this.reversal = async function (body) {
      let token = await self.auth(
        config.mpesaApi.consumer.key,
        config.mpesaApi.consumer.secret
      );
      if (token) {
        var url = `https://${config.mpesaApi.api_env}.safaricom.co.ke/mpesa/reversal/v1/request`,
          auth = "Bearer " + token;
        const response = await axios({
          method: "POST",
          url: url,
          headers: {
            Authorization: auth,
          },
          data: {
            Initiator: config.mpesaApi.initiator,
            SecurityCredential: encrypt(
              new Buffer.from(config.mpesaApi.initiatorPass)
            ),
            CommandID: "TransactionReversal",
            TransactionID: body.TransactionID,
            Amount: body.Amount,
            ReceiverParty: body.ReceiverParty,
            RecieverIdentifierType: "4",
            ResultURL: `${config.host}/<api route name>/result/reverse`,
            QueueTimeOutURL: `${config.host}/<api route name>/timeout/reverse`,
            Remarks: body.Remarks,
            Occasion: body.Occasion,
          },
        });
        if (response.status == 200) {
          return response.data;
        }
      }
      return 0;
    };
    this.stkpush = async function (body) {
      var time = config.mpesaApi.timestamp();
      let token = await self.auth(
        config.mpesaApi.consumer.key,
        config.mpesaApi.consumer.secret
      );
      if (token) {
        time = config.mpesaApi.timestamp();
        var url = `https://${config.mpesaApi.api_env}.safaricom.co.ke/mpesa/stkpush/v1/processrequest`,
          auth = "Bearer " + token;
        const response = await axios({
          method: "POST",
          url: url,
          headers: {
            Authorization: auth,
          },
          data: {
            BusinessShortCode: config.mpesaApi.shortcode,
            Password: new Buffer.from(
              config.mpesaApi.shortcode + config.mpesaApi.passkey + time
            ).toString("base64"),
            Timestamp: time,
            TransactionType: config.mpesaApi.transactionType,
            Amount: body.Amount,
            PartyA: body.PhoneNumber,
            PartyB: config.mpesaApi.till,
            PhoneNumber: body.PhoneNumber,
            CallBackURL: `${config.host}/<api route name>/callback/stkpush`,
            AccountReference: body.AccountReference,
            TransactionDesc: body.TransactionDesc,
          },
        });
        if (response.status == 200) {
          return response.data;
        }
      }
      return 0;
    };
    this.stkpushQuery = async function (CheckoutRequestID) {
      var time = config.mpesaApi.timestamp();
      var url = `https://${config.mpesaApi.api_env}.safaricom.co.ke/mpesa/stkpushquery/v1/query`;
      let token = await self.auth(
        config.mpesaApi.consumer.key,
        config.mpesaApi.consumer.secret
      );
      if (token) {
        time = config.mpesaApi.timestamp();
        var url = `https://${config.mpesaApi.api_env}.safaricom.co.ke/mpesa/stkpush/v1/processrequest`,
          auth = "Bearer " + token;
        const response = await axios({
          method: "POST",
          url: url,
          headers: {
            Authorization: auth,
          },
          data: {
            BusinessShortCode: config.mpesaApi.shortcode,
            Password: new Buffer.from(
              config.mpesaApi.shortcode + config.mpesaApi.initiatorPass + time
            ).toString("base64"),
            Timestamp: time,
            CheckoutRequestID: CheckoutRequestID,
          },
        });
        if (response.status == 200) {
          return response.data;
        }
      }
      return 0;
    };
    this.auth = async function (consumer_key, consumer_secret) {
      var url = `https://${config.mpesaApi.api_env}.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials`,
        buffer = new Buffer.from(consumer_key + ":" + consumer_secret).toString(
          "base64"
        ),
        auth = `Basic ${buffer}`;
      const response = await axios({
        method: "get",
        url: url,
        headers: {
          Authorization: auth,
        },
      });
      if (response.status == 200) {
        return response.data.access_token;
      }
      return 0;
    };
    this.init = async () => {
      utility.events.recieveEvents("STK_PUSH", async (e) => {
        console.log(user);
        if (e.data.stkCallback.ResultCode != 0) {
          /*
                    do stuff if stk failed
                     */
        }
        /*
                do more stuff if stk is succesfull
                 */
      });
    };
  }
}

const mpesaApi = new MpesaApi();

mpesaApi.init();

module.exports = { mpesaApi };
