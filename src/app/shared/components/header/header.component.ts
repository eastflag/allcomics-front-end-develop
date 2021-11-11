import { Component, Input, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { MatDialog, MatSnackBar } from '@angular/material';

import { TemplateInfo } from '../../../models/templateInfo';
import { Title } from '../../../models/title';

import { EventService } from '../../../core/services/event.service';
import { ComicService } from '../../../core/services/comic.service';
import { SidenavService } from '@core/services/sidenav.service';

import { Store } from '@ngrx/store';
import * as fromRoot from '@app/store/root/root.reducer';
import * as RootActions from '@app/store/root/root.actions';
import { Observable, ReplaySubject } from 'rxjs';
import { LemonAuthService } from '@core/services/lemon-auth.service';
import { takeUntil } from 'rxjs/operators';
import { LoginDialogComponent } from '@shared/components/login-dialog/login-dialog.component';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
    animations: [
        trigger('hideTop', [
            state('show', style({
                top: '0'
            })),
            state('hide', style({
                top: '-55px'
            })),
            transition('show=>hide', animate('100ms')),
            transition('hide=>show', animate('100ms'))
        ])
    ]
})
export class HeaderComponent implements OnInit {
    @Input() templateInfo: TemplateInfo;
    @Input() controlState: string;
    @Input() episodeName: string;
    @Input() titleName: string;
    @Input() titleId: string;
    @Input() isFollow = false;

    public titleRes: Title;
    public keyWord: string;

    isAuth = false;
    public isAuthenticated$: Observable<boolean>;
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    constructor(private location: Location,
                private eventService: EventService,
                private sidenavService: SidenavService,
                private comicService: ComicService,
                private router: Router,
                private dialog: MatDialog,
                private lemonService: LemonAuthService,
                private rootStore$: Store<fromRoot.State>,
                private snackBar: MatSnackBar) {
    }

    ngOnInit() {
        this.isAuthenticated$ = this.lemonService.isAuthenticated$().pipe(takeUntil(this.destroyed$));
        this.isAuthenticated$.subscribe(isAuth => this.isAuth = isAuth);
    }

    onGoBack() {
        this.location.back();
    }

    filterLike($event) {

    }

    toggleSidebar() {
        this.sidenavService.toggle();
    }

    onSearch() {
        this.router.navigateByUrl('/home/search');
    }

    onFavorite(isFollow: boolean) {
        if (!this.isAuth) {
            this.openLoginDialog();
            return;
        }

        // change icon star
        this.isFollow = isFollow;
        // if is authenticated
        if (isFollow) {
            // call api postFavorites
            this.comicService.postFavorites(this.titleId).subscribe((res: Title) => {
                this.titleRes = res;
            });
            // open snackbar
            this.openSnackBar('관심상품으로 저장되었습니다');
        } else {
            // call api deleteFavoriteById
            this.comicService.deleteFavoriteById(this.titleId);
            // open snackbar
            this.openSnackBar('관심상품을 해제되었습니다');
        }
    }

    onChangeKeyWord(object) {
        this.keyWord = object.target.value;
    }

    doSearch() {
        this.eventService.emit('doSearch', this.keyWord);
    }

    openSnackBar(message: string) {
        this.snackBar.open(message, '', {
            duration: 1000,
            verticalPosition: 'bottom',
            horizontalPosition: 'center',
        });
    }

    openLoginDialog(): void {
        const redirectPath = this.router.url;
        const dialogRef = this.dialog.open(LoginDialogComponent, {
            width: '400px',
            maxWidth: '90%',
            hasBackdrop: true,
            data: { redirectPath }
        });
    }
}
