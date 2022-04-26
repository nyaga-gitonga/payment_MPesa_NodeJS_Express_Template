const express = require("express");
const router = express.Router();
const {utility} = require("../services/Utility");

// ValidationURL || ConfirmationURL || CallbackUrl
// QueueTimeoutURL || ResultURL
router.post("/:base/:id", function (req, res) {
  const id = req.params.id;
  const base = req.params.base;
  const body = req.body.Body;
  let msg = {};
  switch (base) {
    // C2B ValidationURL - /<api route name>/validation/c2b
    case "validation":
      utility.events.emitEvents("C2B_v", { base, data: body });
      utility.events.recieveEvents("return_v", async (e) => {
        res.json(e.message);
      });
      break;
    // C2B ConfirmationURL - /<api route name>/confirmation/c2b
    case "confirmation":
      utility.events.emitEvents("C2B_c", { base, data: body });
      utility.events.recieveEvents("return_c", async (e) => {
        res.json(e.message);
      });
      break;
    // Callback  - /<api route name>/callback/stk
    case "callback":
      msg = createEvent(base, "STK_PUSH");
      res.json(msg);
      break;
    // Timeout
    case "timeout":
      switch (id) {
        // B2C QueueTimeoutURL - /<api route name>/timeout/b2c
        case "b2c":
          msg = createEvent(base, "B2C");
          res.json(msg);
          break;
        // B2B QueueTimeoutURL - /<api route name>/timeout/b2b
        case "b2b":
          msg = createEvent(base, "B2B");
          res.json(msg);
          break;
        // accountBalance QueueTimeoutURL - /<api route name>/timeout/accountBalance
        case "acB":
          msg = createEvent(base, "A/C BALANCE");
          res.json(msg);
          break;
        // reverse QueueTimeoutURL - /<api route name>/timeout/reverse
        case "reverse":
          msg = createEvent(base, "REVERSE");
          res.json(msg);
          break;
        // status QueueTimeoutURL - /<api route name>/timeout/status
        case "status":
          msg = createEvent(base, "STATUS");
          res.json(msg);
          break;
        default:
          res.status(406).json({
            msg: " Not Acceptable",
          });
          break;
      }
      break;
    //Results
    case "result":
      switch (id) {
        // B2C QueueResultURL - /<api route name>/result/b2c
        case "b2c":
          msg = createEvent(base, "B2C");
          res.json(msg);
          break;

        // accountBalance QueueResultURL - /<api route name>/result/accountBalance
        case "acB":
          msg = createEvent(base, "A/C BALANCE");
          res.json(msg);
          break;
        // reverse QueueResultURL - /<api route name>/result/reverse
        case "reverse":
          msg = createEvent(base, "REVERSE");
          res.json(msg);
          break;
        // status QueueResultURL - /<api route name>/result/status
        case "status":
          msg = createEvent(base, "STATUS");
          res.json(msg);
          break;
        default:
          res.status(406).json({
            msg: " Not Acceptable",
          });
          break;
      }
      break;
    default:
      res.status(406).json({
        msg: " Not Acceptable",
      });
      break;
  }
});

module.exports = router;

function createEvent(
  base,
  title,
  message = { ResponseCode: "00000000", ResponseDesc: "success" }
) {
  utility.events.emitEvents(title, { base, data: body });
  return message;
}
