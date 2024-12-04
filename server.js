const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// Example API key stored in .env file
const API_KEY = "123456789";

// Example endpoint
app.get('/ping', (req, res) => {
  const userApiKey = req.header('X-API-Key');
  if (userApiKey && userApiKey === API_KEY) {
    res.json({ message: 'API is working!' });
  } else {
    res.status(401).json({ error: 'Unauthorized: Invalid API Key' });
  }
});
const subscriptions = {};

// Endpoint to register a webhook subscription
app.post('/webhook-subscriptions', (req, res) => {
    const { webhook_url } = req.body;
    console.log(req.body)

    if (!webhook_url) {
        return res.status(400).json({ error: 'webhook_url is required' });
    }

    // Generate a subscription ID
    const subscriptionId=  `sub_${Date.now()}`;
    subscriptions[subscriptionId] = webhook_url;

    console.log(`Webhook registered: ${webhook_url}`);
    res.status(200).json({ subscription_id: subscriptionId });
});

// Endpoint to unregister a webhook subscription
app.delete('/webhook-subscriptions/:id', (req, res) => {
    const { id } = req.params;

    if (!subscriptions[id]) {
        return res.status(404).json({ error: 'Subscription not found' });
    }

    delete subscriptions[id];
    console.log(`Webhook unregistered: ${id}`);
    res.status(200).json({ success: true });
});

// Endpoint to simulate an event
app.post('/send-event', (req, res) => {
    const { event } = req.body;

    if (!event) {
        return res.status(400).json({ error: 'event data is required' });
    }

    console.log('Simulating event:', event);

    // Send the event to all registered webhook URLs
    Object.values(subscriptions).forEach((webhookUrl) => {
        console.log(`Sending event to ${webhookUrl}:`, event);
        // In production, use a request library like axios or node-fetch to send POST requests
    });

    res.status(200).json({ message: 'Event sent to all subscribers' });
  })

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));