import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class UtilService {
  constructor() {
    // Do nothing.
  }

  public openLinkInExternal(url: string): void {
    return (window as any).open(url);
  }
}
