import * as bunyan from 'bunyan';
import settings from '../../package.json';

class Config {
    public name;

    public version;

    public static readonly serviceTimeout: number = 30;

    public log;

    constructor (level: string) {
      this.name = settings.name;
      this.version = settings.version;
      this.log = this.getLogger(level);
    }

    private getLogger (level: string) {
      return bunyan.createLogger({ name: `${this.name}:${this.version}`, level });
    }
}

export default Config;
