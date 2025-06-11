const { Client, RemoteAuth } = require('whatsapp-web.js');
const { MongoStore } = require('wwebjs-mongo');
const qrcode = require('qrcode-terminal');
const mongoose = require('mongoose');
const express = require('express');
const app = express();
const OpenAI = require('openai');
const port = process.env.PORT || 3000;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

mongoose.connect(process.env.MONGODB_URL).then(() => {
  console.log('🟢 Conectado a MongoDB');

  const client = new Client({
    authStrategy: new RemoteAuth({
      store: new MongoStore({ mongoose: mongoose }),
      backupSyncIntervalMs: 300000,
    }),
    puppeteer: {
      args: ['--no-sandbox'],
    },
  });

  client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
  });

  client.on('ready', () => {
    console.log('✅ Bot listo');
  });

  client.on('message', async (message) => {
    const input = message.body;
    if (!input.startsWith('!')) return;

    const prompt = input.slice(1);
    const response = await openai.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'gpt-3.5-turbo',
    });

    client.sendMessage(message.from, response.choices[0].message.content);
  });

  client.initialize();
});

app.get('/', (req, res) => {
  res.send('Bot de WhatsApp está funcionando 🚀');
});

app.listen(port, () => {
  console.log(`Servidor corriendo en el puerto ${port}`);
});

