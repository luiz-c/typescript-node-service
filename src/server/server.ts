import express from 'express';
import Service from './lib/Service';
import Config from '../config';

class Server {
  public express;

  private config: Config;

  private service: Service;

  constructor () {
    this.express = express();

    if (this.express.get('env') === 'development') {
      this.config = new Config('debug');
      this.express.use((req, res, next) => {
        this.config.log.info(`${req.method}: ${req.url}`);
        return next();
      });
    } else if (this.express.get('env') === 'test') {
      this.config = new Config('fatal');
    } else {
      this.config = new Config('info');
    }

    this.service = new Service(this.config.log);
    this.mountRoutes();
  }

  private mountRoutes (): void {
    const router = express.Router();
    // eslint-disable-next-line no-unused-vars
    router.use((error, req, res, next) => {
      res.status(error.status || 500);
      // Log out the error to the console
      this.config.log.error(error);
      return res.json({
        error: {
          message: error.message,
        },
      });
    });

    router.put('/put/:content', (req, res) => {
      const { content } = req.params;

      const added = this.service.put(content);

      return res.json({ result: added });
    });

    router.delete('/delete/:content', (req, res) => {
      const { content } = req.params;

      const deleted = this.service.delete(content);

      return res.json({ result: deleted });
    });

    router.get('/findAllContent', (req, res) => {
      const svc = this.service.get();
      if (!svc) {
        return res.status(404).json({ result: 'No content found' });
      }
      return res.json(svc);
    });

    this.express.use('/', router);
  }
}

export default new Server().express;
