declare global {
  namespace NodeJS {
    interface Global {
      chrome: any;
    }
  }
}
export default global;
