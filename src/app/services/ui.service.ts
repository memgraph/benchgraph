import { Injectable } from '@angular/core';
import { Observable, Subject, timer } from 'rxjs';

export enum UiMessageType {
  Success = 'SUCCESS',
  Error = 'ERROR',
  Warning = 'WARNING',
}

export interface UiMessage {
  message: string;
  type: UiMessageType;
  persistent?: boolean;
}

@Injectable()
export class UiService {
  private messages$ = new Subject<UiMessage | null>();

  public addMessage(message: UiMessage): void {
    this.messages$.next(message);
    timer(5000).subscribe(() => {
      this.messages$.next(null);
    });
  }

  public getMessages(): Observable<UiMessage | null> {
    return this.messages$;
  }
}
