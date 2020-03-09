// for typings
import {Request, Response} from 'express';

/**
 * GCP Cloud Function entry point.
 * @param {Request} req HTTP request context.
 * @param {Response} res HTTP response context.
 */
exports.handleFbMessage = (req, res) => {
	switch (req.method) {
		case 'GET':
			return handleGETRequest(req, res);
		case 'POST':
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
	const hubMode = req.query['hub.mode'];
	const token = req.query['hub.verify_token'];
	const challenge = req.query['hub.challenge'];
	
	// TODO: Consider changing to @google-cloud/secrets if necessary
	if (hubMode === 'subscribe' && token === process.env.VERIFY_TOKEN) {
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
function handlePOSTRequest(req, res) {
	console.log(req.body);
	// must always return 200
	res.sendStatus(200);
}