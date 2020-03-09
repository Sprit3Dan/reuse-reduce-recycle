/**
 * Background Cloud Function to be triggered by Pub/Sub.
 * This function is exported by index.js, and executed when
 * the trigger topic receives a message.
 *
 * @param {object} pubSubEvent The event payload.
 * @param {object} context The event metadata.
 */
exports.helloPubSub = (pubSubEvent, context) => {
    const name = pubSubEvent.data
      ? Buffer.from(pubSubEvent.data, 'base64').toString()
      : 'World';
  
    console.log(`Hello, ${name}!`);
  };