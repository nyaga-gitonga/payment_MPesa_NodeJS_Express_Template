module.exports = {
  CONSTANSTS: require("./consatants"),
  mpesaApi: {
    consumer: {
      key: process.env.MPESA_ConsumerKey,
      secret: process.env.MPESA_ConsumerSecret,
    },
    till: process.env.MPESA_Till,
    api_cert,
    api_env,
    shortcode: process.env.MPESA_Shortcode,
    initiatorName: process.env.MPESA_InitiatorName,
    initiatorPass: process.env.MPESA_InitiatorPass,
    passkey: process.env.MPESA_Passkey,
    transactionType: process.env.MPESA_stkpushType,
    timestamp: function tStamp(date = new Date()) {
      function add(str, x) {
        if (x.length == 1) {
          return (str += "0" + x);
        }
        return (str += x);
      }
      let raw = [
        date.getFullYear().toString(),
        (date.getMonth() + 1).toString(),
        date.getDate().toString(),
        date.getHours().toString(),
        date.getMinutes().toString(),
        date.getSeconds().toString(),
      ];
      let timestamp = "";
      raw.forEach((element) => {
        timestamp = add(timestamp, element);
      });
      return timestamp;
    },
  },
};
