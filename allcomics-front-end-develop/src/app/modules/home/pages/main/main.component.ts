import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { SwiperConfigInterface } from 'ngx-swiper-wrapper';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { TemplateInfo } from '@app/models/templateInfo';

import { ComicService } from '@core/services/comic.service';
import { LemonAuthService } from '@core/services/lemon-auth.service';
import { EventService } from '@core/services/event.service';
import { LoaderService } from '@core/services/loader.service';

import { environment } from '@environments/environment';
import { isNull } from 'util';

import { Title } from '@app/models/title';

import { Observable, ReplaySubject } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { filter, map, switchMap, take, takeUntil, tap, withLatestFrom } from 'rxjs/operators';

import * as fromRoot from '../../../../store/root/root.reducer';
import * as RootActions from '../../../../store/root/root.actions';

import * as fromHome from '../../store/home.reducer';
import * as HomeActions from '../../store/home.actions';
import { Banner } from '@app/models/banner';

export interface UserInfo {
    profile: any;
    account: any;
}

@Component({
    selector: 'app-main',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit, AfterViewInit, OnDestroy {

    public lastScrollTop = 0;
    public config: SwiperConfigInterface = {};
    public config2: SwiperConfigInterface = {};
    public config3: SwiperConfigInterface = {};
    public config4: SwiperConfigInterface = {};
    public templateInfo: TemplateInfo;
    public isToggle: boolean;

    ranking$: Observable<Title[]>;
    populars$: Observable<Title[]>;
    recentlyUpdated$: Observable<Title[]>;
    romance$: Observable<Title[]>;
    boysLove$: Observable<Title[]>;
    completed$: Observable<Title[]>;

    private profile$: Observable<any>;
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    public bannerList$: Observable<Banner[]>;
    public slideBanner$: Observable<Banner>;
    public bottomAdsBanner$: Observable<Banner>;
    public goodsBanner$: Observable<Banner>;
    public myPageBanner$: Observable<Banner>;

    public isProduction = false;
    // TODO: get idol items via API
    public adsIdols = [
        {
            id: 1,
            src: 'https://i.imgur.com/p7khVVU.jpg',
            title: 'SM 아티스트퍼즐 패키지',
            price: '27',
            oldPrice: '30',
            salesPercent: '10'
        },
        {
            id: 2,
            src: 'https://i.imgur.com/KDbW9jk.png',
            title: '샤이니 카드지갑 패키지',
            price: '28',
            oldPrice: '28',
            salesPercent: ''
        },
        {
            id: 3,
            src: 'https://i.imgur.com/p7khVVU.jpg',
            title: '샤이니 카드지갑 패키지',
            price: '36',
            oldPrice: '40',
            salesPercent: '10'
        },
        {
            id: 4,
            src: 'https://i.imgur.com/KDbW9jk.png',
            title: 'SM 아티스트퍼즐 패키지',
            price: '27',
            oldPrice: '27',
            salesPercent: ''
        },
        {
            id: 5,
            src: 'https://i.imgur.com/p7khVVU.jpg',
            title: 'SM 아티스트퍼즐 패키지',
            price: '50',
            oldPrice: '50',
            salesPercent: ''
        }
    ];

    constructor(private eventService: EventService,
                private comicService: ComicService,
                private authService: LemonAuthService,
                private loaderService: LoaderService,
                private translate: TranslateService,
                private route: Router,
                private rootStore$: Store<fromRoot.State>,
                private homeStore$: Store<fromHome.State>) {
        this.isProduction = environment.production;
        this.isToggle = false;
    }

    ngOnInit() {
        window.addEventListener('scroll', this.scroll, true);
        this.setupTemplateInfo();
        this.setupProfileListener();
        this.setupBannerListener();
        this.setupTitleListener();
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

    private setupTitleListener() {
        this.ranking$ = this.homeStore$.pipe(select(fromHome.getRankings), filter(title => !!title), takeUntil(this.destroyed$));
        this.populars$ = this.homeStore$.pipe(select(fromHome.getPopulars), filter(title => !!title), takeUntil(this.destroyed$));
        this.recentlyUpdated$ = this.homeStore$.pipe(select(fromHome.getRecentlyUpdated), filter(title => !!title), takeUntil(this.destroyed$));
        this.romance$ = this.homeStore$.pipe(select(fromHome.getRomance), filter(title => !!title), takeUntil(this.destroyed$));
        this.boysLove$ = this.homeStore$.pipe(select(fromHome.getBoysLove), filter(title => !!title), takeUntil(this.destroyed$));
        this.completed$ = this.homeStore$.pipe(select(fromHome.getCompleted), filter(title => !!title), takeUntil(this.destroyed$));

        const shouldFetchRankings$ = this.homeStore$.pipe(select(fromHome.getRankings), filter(title => !!!title), take(1), takeUntil(this.destroyed$));
        shouldFetchRankings$.subscribe(() => this.getRankings());

        const shouldFetchPopulars$ = this.homeStore$.pipe(select(fromHome.getPopulars), filter(title => !!!title), take(1), takeUntil(this.destroyed$));
        shouldFetchPopulars$.subscribe(() => this.getPopular());

        const shouldFetchRecentlyUpdated$ = this.homeStore$.pipe(select(fromHome.getRecentlyUpdated), filter(title => !!!title), take(1), takeUntil(this.destroyed$));
        shouldFetchRecentlyUpdated$.subscribe(() => this.getRecentlyUpdated());

        const shouldFetchRomance$ = this.homeStore$.pipe(select(fromHome.getRomance), filter(title => !!!title), take(1), takeUntil(this.destroyed$));
        shouldFetchRomance$.subscribe(() => this.getRomance());

        const shouldFetchBoysLove$ = this.homeStore$.pipe(select(fromHome.getBoysLove), filter(title => !!!title), take(1), takeUntil(this.destroyed$));
        shouldFetchBoysLove$.subscribe(() => this.getBoysLove());

        const shouldFetchCompleted$ = this.homeStore$.pipe(select(fromHome.getCompleted), filter(title => !!!title), take(1), takeUntil(this.destroyed$));
        shouldFetchCompleted$.subscribe(() => this.getCompleted());
    }

    private setupBannerListener() {
        this.bannerList$ = this.homeStore$.pipe(select(fromHome.getBanners), filter(banners => !!banners), takeUntil(this.destroyed$));
        this.bottomAdsBanner$ = this.homeStore$.pipe(select(fromHome.getBottomAdsBanner), filter(banner => !!banner), takeUntil(this.destroyed$));
        this.goodsBanner$ = this.homeStore$.pipe(select(fromHome.getGoodsBanner), filter(banner => !!banner), takeUntil(this.destroyed$));
        this.slideBanner$ = this.homeStore$.pipe(select(fromHome.getSlideBanner), filter(banner => !!banner), takeUntil(this.destroyed$));
        this.myPageBanner$ = this.rootStore$.pipe(select(fromRoot.getMyPageBanner), filter(banner => !!banner), takeUntil(this.destroyed$));

        this.slideBanner$.subscribe(banner => {
            if (banner.hasOwnProperty('items')) {
                const { items } = banner;
                const slideSpeed = items[0].slideSpeed;
                this.config = {
                    a11y: true,
                    direction: 'horizontal',
                    slidesPerView: 1,
                    keyboard: true,
                    mousewheel: true,
                    scrollbar: false,
                    navigation: false,
                    pagination: true,
                    lazy: true,
                    autoplay: {
                        delay: slideSpeed
                    }
                };
            }
        });

        const shouldFetchBannerList$ = this.homeStore$.pipe(select(fromHome.getBanners), filter(banners => !!!banners), take(1), takeUntil(this.destroyed$));
        shouldFetchBannerList$.subscribe(() => {
            const params = {};
            const category = 'main';
            this.homeStore$.dispatch(HomeActions.FetchBannerList({ params, category }));
        });

        const shouldFetchSlideBanner$ = this.bannerList$.pipe(
            map(banners => banners.filter(banner => banner.category === 'main' && banner.subCategory === 'slide')),
            filter(banners => !!banners),
            filter(banners => banners.length > 0),
            map(banners => banners[0].id), // get slideBannerId
            withLatestFrom(this.homeStore$.pipe(select(fromHome.getSlideBanner))),
            filter(([bannerId, banner]) => !!!banner),
            map(([bannerId, banner]) => bannerId),
            takeUntil(this.destroyed$)
        );
        shouldFetchSlideBanner$.subscribe(slideBannerId => this.homeStore$.dispatch(HomeActions.FetchSlideBanner({ slideBannerId })));

        const shouldFetchBottomAdsBanner$ = this.bannerList$.pipe(
            map(banners => banners.filter(banner => banner.category === 'main' && banner.subCategory === 'bottom-ads')),
            filter(banners => !!banners),
            filter(banners => banners.length > 0),
            map(banners => banners[0].id),
            withLatestFrom(this.homeStore$.pipe(select(fromHome.getBottomAdsBanner))),
            filter(([bannerId, banner]) => !!!banner),
            map(([bannerId, banner]) => bannerId),
            takeUntil(this.destroyed$)
        );
        shouldFetchBottomAdsBanner$.subscribe(bottomAdsBannerId => this.homeStore$.dispatch(HomeActions.FetchBottomAdsBanner({ bottomAdsBannerId })));

        const shoudFetchGoodsBanner$ = this.bannerList$.pipe(
            map(banners => banners.filter(banner => banner.category === 'main' && banner.subCategory === 'goods')),
            filter(banners => !!banners),
            filter(banners => banners.length > 0),
            map(banners => banners[0].id),
            withLatestFrom(this.homeStore$.pipe(select(fromHome.getGoodsBanner))),
            filter(([bannerId, banner]) => !!!banner),
            map(([bannerId, banner]) => bannerId),
            takeUntil(this.destroyed$)
        );
        shoudFetchGoodsBanner$.subscribe(goodsBannerId => this.homeStore$.dispatch(HomeActions.FetchGoodsBanner({ goodsBannerId })));

        const shoudFetchMyPageBanner$ = this.bannerList$.pipe(
            map(banners => banners.filter(banner => banner.category === 'main' && banner.subCategory === 'mypage')),
            filter(banners => !!banners),
            filter(banners => banners.length > 0),
            map(banners => banners[0].id),
            withLatestFrom(this.rootStore$.pipe(select(fromRoot.getMyPageBanner))),
            filter(([bannerId, banner]) => !!!banner),
            map(([bannerId, banner]) => bannerId),
            takeUntil(this.destroyed$)
        );
        shoudFetchMyPageBanner$.subscribe(myPageBannerId => this.rootStore$.dispatch(RootActions.FetchMyPageBanner({ myPageBannerId })));
    }

    private setupProfileListener() {
        this.profile$ = this.rootStore$.pipe(select(fromRoot.getProfile));
        this.profile$.subscribe(profile => {
            if (profile) {
                return;
            }
            this.loadAuthInfo();
        });
    }

    private loadAuthInfo() {
        this.loaderService.show();
        const isNotAuthenticated$ = this.authService.isAuthenticated$().pipe(
            filter(isAuth => !isAuth),
            takeUntil(this.destroyed$)
        );
        isNotAuthenticated$.subscribe(() => this.loaderService.hide());

        const getAuthenticatedAccount$ = this.authService.isAuthenticated$().pipe(
            filter(isAuth => isAuth),
            switchMap(() => this.authService.getCredentials$()),
            switchMap(() => this.authService.getUserProfile$()),
            take(1),
            takeUntil(this.destroyed$)
        );
        getAuthenticatedAccount$.subscribe(profile => {
            this.eventService.emit('logged', true);
            // Get Device info
            this.postDeviceInfo(profile);
            this.loaderService.hide();
        }, err => {
            this.loaderService.hide();
            console.log(err);
        });
    }

    private setupTemplateInfo() {
        this.templateInfo = new TemplateInfo();
        this.templateInfo.topbar = 1;
        this.templateInfo.botbar = true;
        this.templateInfo.txtTitle = 'login';
    }

    toggleSidebar() {
        this.eventService.emit('toggleSidebar', true);
    }

    getRankings() {
        const params = { page: 0, limit: 4 };
        this.homeStore$.dispatch(HomeActions.FetchRankings({ params }));
    }

    getPopular() {
        const params = { page: 0, limit: 6 };
        this.homeStore$.dispatch(HomeActions.FetchPopulars({ params }));
    }

    getRecentlyUpdated() {
        const params = { page: 0, limit: 6 };
        this.homeStore$.dispatch(HomeActions.FetchRecentlyUpdated({ params }));
    }

    getRomance() {
        const params = { page: 0, limit: 4 };
        this.homeStore$.dispatch(HomeActions.FetchRomance({ params }));
    }

    getBoysLove() {
        const params = { page: 0, limit: 4 };
        this.homeStore$.dispatch(HomeActions.FetchBoysLove({ params }));
    }

    getCompleted() {
        const params = { page: 0, limit: 4 };
        this.homeStore$.dispatch(HomeActions.FetchCompleted({ params }));
    }

    postDeviceInfo(user: UserInfo) {
        const deviceInfo$ = this.rootStore$.pipe(
            select(fromRoot.getDeviceInfo),
            filter(info => !!info),
            takeUntil(this.destroyed$)
        );
        deviceInfo$.subscribe(profile => {
            const { platform, deviceToken: newToken } = profile;

            const originToken = profile.deviceToken || '';
            if (originToken !== newToken) {
                // TODO: diff origin deviceToken from user info
                this.authService.getCredentials()
                    .then(() => this.authService.request('POST', environment.oauthAPI, '/user/0/device-token', {}, { token: newToken, platform }))
                    .then(res => {
                        console.log('res: ', res);
                    });
            }
        });
    }

    getCurrentLanguage() {
        return this.translate.currentLang || this.translate.defaultLang;
    }

    onToggleInformation() {
        this.isToggle = !this.isToggle;
    }

    onClickSlideItem(link: string) {
        this.route.navigateByUrl(link);
    }

    onClickPolicyItem(link: string) {
        this.route.navigateByUrl(`/home/${link}`);
    }

    onShowDetail(id: string) {
        this.route.navigateByUrl('/webtoon/detail/' + id);
    }

    getTranslateGenre(genres: any) {
        return genres ? genres.map(genre => this.translate.instant(`common.genre.${genre}`)) : [];
    }

    getBadgeColor(badge: string) {
        const badgeColors = {
            discount: 'red',
            updated: 'pir',
            recommended: 'yellow',
            completed: 'blue',
        };
        return badgeColors[badge] || 'red';
    }

    private setSwiperConfig() {
        this.config = {
            a11y: true,
            direction: 'horizontal',
            slidesPerView: 1,
            observer: true,
            keyboard: true,
            mousewheel: false,
            scrollbar: false,
            navigation: false,
            pagination: true,
            lazy: true,
            autoplay: {
                delay: 6000
            }
        };

        this.config2 = {
            a11y: true,
            direction: 'horizontal',
            slidesPerView: 2,
            observer: true,
            keyboard: true,
            mousewheel: false,
            scrollbar: false,
            navigation: false,
            pagination: false,
            slidesOffsetAfter: -95,
            autoplay: {
                delay: 6000
            }
        };

        this.config3 = {
            a11y: true,
            direction: 'horizontal',
            slidesPerView: 2,
            keyboard: true,
            mousewheel: false,
            scrollbar: false,
            navigation: false,
            pagination: false,
            lazy: true,
            slidesOffsetBefore: 0,
            autoplay: {
                delay: 6000
            }
        };

        this.config4 = {
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
    }
}
