import { Component, OnDestroy, OnInit } from '@angular/core';
import { SwiperConfigInterface } from 'ngx-swiper-wrapper';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { LemonAuthService } from '@core/services/lemon-auth.service';
import { ComicService } from '@core/services/comic.service';

import { TemplateInfo } from '@app/models/templateInfo';
import { Title } from '@app/models/title';

import { select, Store } from '@ngrx/store';
import * as fromRoot from '@app/store/root/root.reducer';
import { filter, takeUntil, tap } from 'rxjs/operators';
import { Observable, ReplaySubject } from 'rxjs';
import { Favorite } from '@app/models/favorite';

import { LoginDialogComponent } from '@shared/components/login-dialog/login-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { isNull } from 'util';
import { AlertDialogComponent } from '@shared/components/alert-dialog/alert-dialog.component';

@Component({
    selector: 'app-my-library',
    templateUrl: './my-library.component.html',
    styleUrls: ['./my-library.component.scss']
})
export class MyLibraryComponent implements OnInit, OnDestroy {

    public lastScrollTop = 0;
    public ordersConfig: SwiperConfigInterface = {};
    public favoriteConfig: SwiperConfigInterface = {};
    public recentlyViewedConfig: SwiperConfigInterface = {};
    public templateInfo: TemplateInfo;

    orders: Title[];
    favorites: Favorite[];
    recentlyViewed: Title[];

    public profile: any;
    public isAuth = false;
    public pleaseLoginText = '';

    public isAuthenticated$: Observable<boolean>;
    public profile$: Observable<any>;
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    constructor(private lemonService: LemonAuthService,
                private comicService: ComicService,
                private translate: TranslateService,
                private rootStore$: Store<fromRoot.State>,
                public dialog: MatDialog,
                public router: Router,
                private route: Router) { }

    ngOnInit() {
        this.translate.get('setting.please-login').subscribe(text => this.pleaseLoginText = text);
        this.setTemplateInfo();
        this.setupReducerListener();
        this.getUserData();
        window.addEventListener('scroll', this.scroll, true);
    }

    ngOnDestroy() {
        window.removeEventListener('scroll', this.scroll, true);
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    ngAfterViewInit() {
        this.setSwiperConfig();
    }

    scroll(event: any) {
        const position = event.target.scrollTop;
        const maxScroll = event.target.scrollHeight - event.target.offsetHeight;
        const bottomBar = document.getElementById('bottom-bar');
        if (!isNull(bottomBar)) {
            (position > this.lastScrollTop) && (maxScroll - position > 0) ? bottomBar.classList.add('height0') : bottomBar.classList.remove('height0');
        }
        this.lastScrollTop = position;
    }

    showAlertDialog() {
        this.translate.get('common.coming-soon').subscribe(message => {
            const alertDialogRef = this.dialog.open(AlertDialogComponent, {
                width: '300px',
                maxWidth: '90%',
                hasBackdrop: true,
                data: { message }
            });
        });
    }

    navigateToChargeHistory() {
        if (!this.isAuth) {
            this.openLoginDialog();
            return;
        }
        this.route.navigateByUrl('/payment/history');
    }

    navigateToNotice() {
        this.route.navigateByUrl('/support/notice');
    }

    onShowDetail(id: string) {
        this.route.navigateByUrl('/webtoon/detail/' + id);
    }

    navigateToBilling() {
        this.route.navigateByUrl('/payment');
    }

    openLoginDialog() {
        const redirectPath = this.router.url;
        const loginDialogRef = this.dialog.open(LoginDialogComponent, {
            width: '400px',
            maxWidth: '90%',
            hasBackdrop: true,
            data: { redirectPath }
        });
    }

    navigateToPurchase() {
        if (!this.isAuth) {
            this.openLoginDialog();
            return;
        }
        this.route.navigateByUrl('/mypage/purchase');
    }

    navigateToFavorite() {
        if (!this.isAuth) {
            this.openLoginDialog();
            return;
        }
        this.route.navigateByUrl('/mypage/favorite');
    }

    private setupReducerListener() {
        this.profile$ = this.rootStore$.pipe(
            select(fromRoot.getProfile),
            filter(profile => !!profile),
            takeUntil(this.destroyed$)
        );
        this.isAuthenticated$ = this.lemonService.isAuthenticated$().pipe(
            tap(isAuth => this.isAuth = isAuth),
            takeUntil(this.destroyed$),
        );
    }

    private getUserData() {
        this.profile$.subscribe(profile => this.profile = profile);
        this.isAuthenticated$.subscribe(isAuth => {
            if (!isAuth) {
                return;
            }
            this.getOrders();
            this.getFavorites();
            this.getRecentlyViewed();
        });
    }

    private setTemplateInfo() {
        this.templateInfo = new TemplateInfo();
        this.templateInfo.topbar = 3;
        this.templateInfo.botbar = true;
        this.templateInfo.txtTitle = 'mylib';
    }

    private getRecentlyViewed() {
        this.comicService.getRecentlyViewed$({ page: 0, limit: 6 }).subscribe(recentlyViewed => {
            const { list } = recentlyViewed;
            this.recentlyViewed = list;
        });
    }

    private getFavorites() {
        this.comicService.getFavoriteList$({ page: 0, limit: 6 }).subscribe(favorites => {
            const { list } = favorites;
            this.favorites = list;
        });
    }

    private getOrders() {
        this.comicService.getPurchased$({ page: 0, limit: 6 }).subscribe(orders => {
            const { list } = orders;
            this.orders = list;
        });
    }

    private setSwiperConfig() {
        const defaultSwiperConfig = {
            a11y: true,
            direction: 'horizontal',
            slidesPerView: 3,
            observer: true,
            keyboard: true,
            mousewheel: false,
            scrollbar: false,
            navigation: false,
            pagination: false,
            autoplay: {
                delay: 6000
            }
        };

        this.ordersConfig = { ...defaultSwiperConfig };
        this.favoriteConfig = { ...defaultSwiperConfig };
        this.recentlyViewedConfig = { ...defaultSwiperConfig };
    }
}
