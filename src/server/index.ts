import getPort from 'get-port';
import server from './server';
import Config from '../config';
import axios from 'axios';

const config = new Config('debug');

async function initialize() {
  const randomPort = await getPort({ port: getPort.makeRange(3000, 3100) });

  server.listen(randomPort, (err) => {
    if (err) {
      return config.log.error(err);
    }

    const registerService = () =>
      axios.put(`http://localhost:3000/register/${config.name}/${config.version}/${randomPort}`);

    const unregisterService = () => 
      axios.delete(`http://localhost:3000/register/${config.name}/${config.version}/${randomPort}`)
        .catch(err => this.log.fatal(err));

    registerService();

    const interval = setInterval(registerService, (Config.serviceTimeout * 500));
    const cleanup = async () => {
      let clean = false;
      if (!clean) {
        clean = true;
        clearInterval(interval);
        await unregisterService();
      }
    };

    process.on('uncaughtException', async () => {
      await cleanup();
      process.exit(0);
    });

    process.on('SIGINT', async () => {
      await cleanup();
      process.exit(0);
    });

    process.on('SIGTERM', async () => {
      await cleanup();
      process.exit(0);
    });

    return config.log.info(`Server is listening on port ${randomPort}`);

  });
}

initialize();
