import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { MessageList } from '@app/modules/support/store/support.reducer';

import { ComicService } from '@core/services/comic.service';
import { LemonAuthService } from '@core/services/lemon-auth.service';
import { filter, switchMap } from 'rxjs/operators';
import { Message } from '@app/models/message';

@Component({
    selector: 'app-history',
    templateUrl: './history.component.html',
    styleUrls: ['./history.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class HistoryComponent implements OnInit {

    @Input() inquiryList: MessageList;
    public detailInquiryList = [];

    constructor(private route: Router,
                private comicService: ComicService,
                private lemonAuthService: LemonAuthService) { }

    ngOnInit() {
    }

    onShowDetail(id: any) {
        localStorage.setItem('tab_selected', 'history');
        this.route.navigateByUrl('/support/history-detail/' + id);
    }

    onAfterExpand(item: Message) {
        const { id } = item;
        const shouldNotGetMessage = this.detailInquiryList.some(inquiry => inquiry.id === id);
        if (shouldNotGetMessage) {
            return;
        }

        const detailMessage$ = this.lemonAuthService.isAuthenticated$().pipe(
            filter(isAuth => !!isAuth),
            switchMap(() => this.comicService.getMessageById(id)),
        );
        detailMessage$.subscribe(res => this.detailInquiryList.push(res));
    }

    getDetailMessage(item: Message) {
        const { id } = item;
        return this.detailInquiryList.filter(detail => detail.id === id)[0] || null;
    }
}
