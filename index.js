const { Client, RemoteAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const mongoose = require('mongoose');
const { MongoStore } = require('wwebjs-mongo');
const express = require('express');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
require('dotenv').config();

const app = express();

mongoose.connect(process.env.MONGODB_URL).then(async () => {
  const store = new MongoStore({ mongoose });
  const { stdout: chromiumPath } = await exec("which chromium");

  const client = new Client({
    authStrategy: new RemoteAuth({
      store,
      backupSyncIntervalMs: 300000
    }),
    puppeteer: {
      headless: true,
      args: ['--no-sandbox'],
      executablePath: chromiumPath.trim()
    },
    webVersionCache: {
      type: 'remote',
      remotePath: 'https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2409.2.html'
    }
  });

  client.on('qr', qr => qrcode.generate(qr, { small: true }));
  client.on('ready', () => console.log('✅ Cliente listo'));
  client.on('remote_session_saved', () => console.log('💾 Sesión guardada en MongoDB'));

  client.on('message', async message => {
    const msg = message.body.toLowerCase();

    if (msg.includes('hola') || msg.includes('buenas')) {
      await message.reply('¡Hola! 👋 ¿Qué auto te interesa?');
    } else if (msg.includes('crédito') || msg.includes('enganche') || msg.includes('financiamiento')) {
      await message.reply('📢 Manejamos crédito con Caja Real del Potosí ✅\nCalculamos por cada $100,000 aprox. $140,000.\nEntre más enganche des, menos pagas. ¿Te interesa uno en especial?');
    } else if (msg.includes('ubicación') || msg.includes('dónde están')) {
      await message.reply('📍 Estamos en Av. Saucito #450, SLP\n⏰ Lun-Vie 9am a 7pm, Sáb 10am a 4pm\n📌 https://maps.app.goo.gl/9GRHMK9Gkfp6MxbP9');
    } else if (msg.includes('catálogo') || msg.includes('inventario')) {
      await message.reply('🛒 Revisa todo nuestro inventario actualizado aquí:\n👉 https://www.autoventaslp.com.mx/inventario');
    } else {
      await message.reply('Gracias por escribir. ¿Me puedes decir qué auto te interesa o qué necesitas? 🚗🙂');
    }
  });

  app.get('/', (_, res) => res.send('🟢 Bot corriendo en Railway'));

  app.listen(3000, () => console.log('Servidor en puerto 3000'));

  client.initialize();
});
const { Client, RemoteAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const mongoose = require('mongoose');
const { MongoStore } = require('wwebjs-mongo');
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.MONGODB_URL).then(async () => {
  const store = new MongoStore({ mongoose });

  const client = new Client({
    authStrategy: new RemoteAuth({
      store,
      backupSyncIntervalMs: 300000
    }),
    puppeteer: {
      headless: true,
      args: ['--no-sandbox'],
    },
    webVersionCache: {
      type: 'remote',
    }
  });

  client.on('qr', qr => qrcode.generate(qr, { small: true }));

  client.on('ready', () => {
    console.log('✅ Cliente de WhatsApp listo.');
  });

  client.on('message', async msg => {
    const texto = msg.body.toLowerCase();

    if (texto.includes('hola') || texto.includes('buenas')) {
      return msg.reply('¡Hola! 👋 Bienvenido a Auto Ventas SLP. ¿Qué vehículo te interesa? 🚗');
    }
    if (texto.includes('credito') || texto.includes('financiamiento') || texto.includes('enganche')) {
      return msg.reply('💳 Manejamos crédito con Caja Real del Potosí.\n✔️ Desde $5,000 de enganche\n✔️ Hasta 60 meses\n📄 ¿Quieres saber los requisitos?');
    }
    if (texto.includes('requisitos')) {
      return msg.reply('📋 Requisitos:\n✅ INE\n✅ Comprobante domicilio\n✅ Comprobante ingresos\n✅ Predial en SLP, Soledad, Rioverde o Villa de Pozos\n(O aval en su defecto)');
    }
    if (texto.includes('ubicacion') || texto.includes('donde estan') || texto.includes('direccion')) {
      return msg.reply('📍 Estamos en Av. Saucito #450 Col. Saucito\nA un costado del Parque Tangamanga I\n🕘 Lunes a Viernes 9am a 7pm, Sábados 10am a 4pm');
    }
    if (texto.includes('inventario') || texto.includes('catalogo') || texto.includes('autos disponibles')) {
      return msg.reply('🚗 Consulta nuestro inventario actualizado aquí:\n👉 https://www.autoventaslp.com.mx/inventario');
    }
    if (texto.includes('buró') || texto.includes('mal buro')) {
      return msg.reply('📉 Se revisa buró de crédito. Si está mal, no podríamos continuar 😔\nSi gustas, podemos revisarlo sin compromiso.');
    }

    return msg.reply('🚘 ¿Buscas un auto, crédito o tienes alguna duda? Estoy para ayudarte 💬');
  });

  app.get('/', (_, res) => res.send('🟢 Bot activo en Railway'));
  app.listen(PORT, () => console.log(`🟢 Servidor corriendo en puerto ${PORT}`));

  client.initialize();
});
