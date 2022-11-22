import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/index';
import { UiMessage, UiMessageType, UiService } from 'src/app/services/ui.service';

@Component({
  selector: 'app-ui-messages',
  templateUrl: './ui-messages.component.html',
  styleUrls: ['./ui-messages.component.scss'],
})
export class UiMessagesComponent implements OnInit {
  messages$: Observable<UiMessage | null> | undefined;
  types = UiMessageType;

  constructor(private uiService: UiService) {}

  ngOnInit() {
    this.messages$ = this.uiService.getMessages();
  }
}
