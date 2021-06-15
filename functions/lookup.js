exports.handler = function (context, event, callback) {
  const response = new Twilio.Response();
  response.appendHeader("Content-Type", "application/json");

  if (event.phone === "" || typeof event.phone === "undefined") {
    response.setBody({
      success: false,
      error: "Missing parameter; please provide a phone number.",
    });
    response.setStatusCode(400);
    return callback(null, response);
  }

  const client = context.getTwilioClient();

  const allow = ["US", "CA", "MX"];

  client.lookups
    .phoneNumbers(event.phone)
    .fetch()
    .then((resp) => {
      console.log(resp);
      if (allow.includes(resp.countryCode)) {
        response.setStatusCode(200);
        response.setBody({
          success: true,
        });
        return callback(null, response);
      } else {
        response.setStatusCode(401);
        response.setBody({
          success: false,
          error: "Country code not allowed",
        });
        return callback(null, response);
      }
    })
    .catch((error) => {
      console.log(error);
      response.setStatusCode(error.status);
      response.setBody({
        success: false,
        error: error.message,
      });
      return callback(null, response);
    });
};
