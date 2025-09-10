export class NextUtil {
  // return true if application is in server side rendering
  public static get isSSR(): boolean {
    return typeof window === 'undefined';
  }
}
