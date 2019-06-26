class Service {
  private log;
  private serviceInfo: Array<string>;

  constructor (log) {
    this.log = log;
    this.serviceInfo = [];
  }

  get() {
    return this.serviceInfo;
  }

  put(content: string) {
    let added = false;
    if (this.serviceInfo.indexOf(content) === -1) {
      this.serviceInfo.push(content);
      added = true;
    }
    return added;
  }

  delete(content: string) {
    let deleted = false;
    const index = this.serviceInfo.indexOf(content);
    if (index !== -1) {
      this.serviceInfo.splice(index, 1);
      deleted = true;
    }
    return deleted;
  }
  
}

export default Service;
