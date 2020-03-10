const request = require('request');

/**
 * GCP Cloud Function entry point.
 * @param {Request} req HTTP request context.
 * @param {Response} res HTTP response context.
 */
exports.handleFbMessage = (req, res) => {
  switch (req.method) {
    case "GET":
      return handleGETRequest(req, res);
    case "POST":
      return handlePOSTRequest(req, res);
    default:
      console.error(`Unhandled http-method: ${req.method}`);
      return res.sendStatus(400);
  }
};

/**
 * @param {Request} req HTTP request context.
 * @param {Response} res HTTP response context.
 */
function handleGETRequest(req, res) {
  const hubMode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  // TODO: Consider changing to @google-cloud/secrets if necessary
  if (hubMode === "subscribe" && token === process.env.VERIFY_TOKEN) {
    res.status(200).send(challenge);
  } else {
    // not quite sure, but seems like the best code for invalid token
    res.sendStatus(403);
  }
}

/**
 * @param {Request} req HTTP request context.
 * @param {Response} res HTTP response context.
 */
function handlePOSTRequest({ body }, res) {
  console.log(body);
  if (body.object === "page") {
    body.entry.forEach(parseEntry);
  }
  // must always return 200
  res.sendStatus(200);
}

function parseEntry(entry) {
  // Only one will ever happen.
  const {
    sender,
    message: { text }
  } = entry.messaging[0];
  console.log("Got a message!");
  console.log(`Sender: ${sender.id}`);
	console.log(`Message: ${text}`);
	sendMessage(sender.id, `You sent: ${text}!`);
}

async function sendMessage(id, text) {
  const requestBody = {
    recipient: { id },
    message: { text },
  };

	request({
		uri: 'https://graph.facebook.com/v2.6/me/messages',
		qs: { access_token: process.env.MESSAGING_TOKEN },
		method: 'POST',
		json: requestBody,
	}, (err) => {
		if (err) {
			return console.error(err);
		}
		console.log('Sent response');
	});
}
