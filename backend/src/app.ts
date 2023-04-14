import express from 'express';

import { initApp } from './init';


(async () => {
  const app = express();
  initApp(app);
  const port = process.env.PORT || 8080;
  await new Promise((resolve, reject) => {
    const server = app.listen(port, () => {
      console.log(`Listening on port ${port}...`);
    });
    server.on('close', () => console.log('Server closing...'));
  });
})().catch(err => {
  console.error(err);
});
