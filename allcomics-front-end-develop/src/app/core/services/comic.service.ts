import { Injectable } from '@angular/core';
import { BaseService } from './base.service';

import { Title } from '@app/models/title';
import { Inqueries } from '@app/models/inqueries';
import { Episode, EpisodeDetail, PayEpisode } from '@app/models/episode';
import { Account } from '@app/models/account';
import { Message } from '@app/models/message';
import { Favorite } from '@app/models/favorite';

import { environment } from '@environments/environment';

import 'rxjs/add/observable/fromPromise';
import { catchError, delay, map, switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs';

// 1 tdn => 0.87 dollar
// 1 tdn => 1000원
// 1 tdn => 19.27 // = 1dollar
const CURRENCY_RATIO = {
    KRW: 0.001, // 1 / 1000
    USD: 1.149425287356322, // 1 / 0.87
    MXN: 0.051894135962636 // 1 / 19.27
};

@Injectable({
    providedIn: 'root'
})
export class ComicService extends BaseService {

    /* ----- MAIN -----*/
    getWeeks(params: { page?: number, limit?: number }): Observable<Title[]> {
        params = Object.assign({ page: 0, limit: 0 }, params);

        return this.isAuthenticated$().pipe(
            switchMap(isAuth => {
                const path = isAuth ? `/showcases/popular` : `/public/showcases/popular`;
                return this.request$('GET', environment.apiUrl, path, { ...params });
            }),
            map(res => res.list.map((comic: Title) => comic)),
        );
    }

    getRankings(params: { page?: number, limit?: number }): Observable<Title[]> {
        params = Object.assign({ page: 0, limit: 0 }, params);

        return this.isAuthenticated$().pipe(
            switchMap(isAuth => {
                const path = isAuth ? `/showcases/ranking` : `/public/showcases/ranking`;
                return this.request$('GET', environment.apiUrl, path, { ...params });
            }),
            map(res => res.list.map((comic: Title) => comic)),
        );
    }

    getPopular(params: { page?: number, limit?: number }): Observable<Title[]> {
        params = Object.assign({ page: 0, limit: 0 }, params);

        return this.isAuthenticated$().pipe(
            switchMap(isAuth => {
                const path = isAuth ? `/showcases/popular` : `/public/showcases/popular`;
                return this.request$('GET', environment.apiUrl, path, { ...params });
            }),
            map(res => res.list.map((comic: Title) => comic)),
        );
    }

    getRecentlyUpdated(params: { page?: number, limit?: number }): Observable<Title[]> {
        params = Object.assign({ page: 0, limit: 0 }, params);

        return this.isAuthenticated$().pipe(
            switchMap(isAuth => {
                const path = isAuth ? `/showcases/recently-updated` : `/public/showcases/recently-updated`;
                return this.request$('GET', environment.apiUrl, path, { ...params });
            }),
            map(res => res.list.map((comic: Title) => comic)),
        );
    }

    getRomance(params: { page?: number, limit?: number }): Observable<Title[]> {
        params = Object.assign({ page: 0, limit: 0 }, params);

        return this.isAuthenticated$().pipe(
            switchMap(isAuth => {
                const path = isAuth ? `/showcases/romance` : `/public/showcases/romance`;
                return this.request$('GET', environment.apiUrl, path, { ...params });
            }),
            map(res => res.list.map((comic: Title) => comic)),
        );
    }

    getBoysLove(params: { page?: number, limit?: number }): Observable<Title[]> {
        params = Object.assign({ page: 0, limit: 0 }, params);

        return this.isAuthenticated$().pipe(
            switchMap(isAuth => {
                const path = isAuth ? `/showcases/boys-love` : `/public/showcases/boys-love`;
                return this.request$('GET', environment.apiUrl, path, { ...params });
            }),
            map(res => res.list.map((comic: Title) => comic)),
        );
    }

    getCompleted(params: { page?: number, limit?: number }): Observable<Title[]> {
        params = Object.assign({ page: 0, limit: 0 }, params);

        return this.isAuthenticated$().pipe(
            switchMap(isAuth => {
                const path = isAuth ? `/showcases/completed` : `/public/showcases/completed`;
                return this.request$('GET', environment.apiUrl, path, { ...params });
            }),
            map(res => res.list.map((comic: Title) => comic)),
        );
    }
    /* ----- MAIN -----*/

    /* ----- MY LIB -----*/
    getOrders(params: { page?: number, limit?: number }): Observable<Title[]> {
        params = Object.assign({ page: 0, limit: 3 }, params);

        return this.request$('GET', environment.apiUrl, `/orders`, params).pipe(
            map(res => res.list.map((comic: Title) => comic)),
        );
    }

    getFavorites(params: { page?: number, limit?: number }): Observable<Favorite[]> {
        params = Object.assign({ page: 0, limit: 3 }, params);

        return this.request$('GET', environment.apiUrl, `/favorites`, params).pipe(
            map(res => res.list.map((comic: Favorite) => comic)),
        );
    }

    getPurchased$(params: { page?: number, limit?: number }): Observable<any> {
        params = Object.assign({ page: 0, limit: 3 }, params);

        return this.request$('GET', environment.apiUrl, `/titles/0/purchased`, params);
    }

    getFavoriteList$(params: { page?: number, limit?: number }): Observable<any> {
        params = Object.assign({ page: 0, limit: 3 }, params);

        return this.request$('GET', environment.apiUrl, `/titles/0/favorites`, params);
    }

    getRecentlyViewed$(params: { page?: number, limit?: number }): Observable<any> {
        params = Object.assign({ page: 0, limit: 3 }, params);

        return this.request$('GET', environment.apiUrl, `/titles/0/viewed`, params);
    }

    getRecentlyViewed(params: { page?: number, limit?: number }): Observable<Title[]> {
        params = Object.assign({ page: 0, limit: 3 }, params);

        return this.request$('GET', environment.apiUrl, `/recently-viewed`, params).pipe(
            map(res => res.list.map((comic: Title) => comic)),
        );
    }
    /* ----- MY LIB -----*/

    /* ----- MY PAGE -----*/
    getAccount(): Observable<Account> {
        return this.request$('GET', environment.apiUrl, `/account/0`).pipe(
            map((res) => new Account(res)),
        );
    }

    setAccount(body: Account): Observable<any> {
        return this.request$('POST', environment.apiUrl, '/account/0', {}, body).pipe(
            map((res) => new Account(res)),
        );
    }

    deleteAccountByReason(params: { reason: string }): Observable<any> {
        return this.request$('DELETE', environment.apiUrl, `/account/0`, params);
    }
    /* ----- MY PAGE -----*/

    /* ----- CUSTOMER SUPPORT -----*/
    getInqueries(params: { page?: number, limit?: number }): Observable<Inqueries[]> {
        params = Object.assign({ page: 0, limit: 10 }, params);

        return this.request$('GET', environment.apiUrl, `/inquiries`, params).pipe(
            map((res) => res.list.map(inquiries => new Inqueries(inquiries))),
        );
    }

    getInquerieDetail(id: string): Observable<Inqueries> {
        return this.request$('GET', environment.apiUrl, `/inquiries/${id}`).pipe(
            map((res) => res.map(inquiries => new Inqueries(inquiries))),
        );
    }

    postInqueries(data: any): Observable<any> {
        return this.request$('POST', environment.apiUrl, `/inquiries`, {}, data).pipe(
            map((res) => new Inqueries(res)),
        );
    }

    postInquiry(data: any): Observable<any> {
        return this.request$('POST', environment.apiUrl, `/boards/0`, {}, { ...data });
    }
    /* ----- CUSTOMER SUPPORT -----*/

    /* ----- WEB TOON -----*/
    searchItem(params: { query: string, page?: number, limit?: number }) {
        return this.isAuthenticated$().pipe(
            switchMap(isAuth => {
                const path = isAuth ? `/titles` : `/public/titles`;
                return this.request$('GET', environment.apiUrl, path, { ...params });
            }),
        );
    }

    getTitles(id: string) {
        return this.isAuthenticated$().pipe(
            switchMap(isAuth => {
                const path = isAuth ? `/titles/${id}` : `/public/titles/${id}`;
                return this.request$('GET', environment.apiUrl, path);
            }),
            map((res: Title) => res),
        );
    }

    getGenreTitles(params: { genre: string, page?: number, limit?: number }): Observable<any> {
        return this.isAuthenticated$().pipe(
            switchMap(isAuth => {
                const path = isAuth ? `/titles` : `/public/titles`;
                return this.request$('GET', environment.apiUrl, path, { ...params });
            }),
        );
    }

    getEpisodes(params: { id?: string, page?: number, limit?: number, sort?: string }): Observable<{ page: number, limit: number, total: number, sort?: string, list: Episode[] }> {
        return this.isAuthenticated$().pipe(
            switchMap(isAuth => {
                const path = isAuth ? `/titles/${params.id}/episodes` : `/public/episodes/${params.id}`;
                return this.request$('GET', environment.apiUrl, path, { ...params });
            }),
            map(res => {
                const { total, list: rawData, page, limit, sort } = res;
                const list: Episode[] = rawData.map((episode: Episode) => episode);
                return { total, page, limit, list, sort };
            }),
        );
    }

    postOrders(params: { episodeId?: number, type?: string }): Observable<Title> {
        // type : 소장 또는 대여 ('purchase' | 'rent')
        params = Object.assign({ episodeId: 1, type: 'purchase'}, params);
        return this.request$('POST', environment.apiUrl, `/orders`, {}, params).pipe(
            map(res => res.map((comic: Title) => comic)),
        );
    }

    getEpisodeDetail(id: string): Observable<EpisodeDetail> {
        return this.isAuthenticated$().pipe(
            switchMap(isAuth => {
                const path = isAuth ? `/episodes/${id}` : `/public/episodes/${id}`;
                return this.request$('GET', environment.apiUrl, path);
            }),
            map((res: EpisodeDetail) => res),
        );
    }

    getFirstEpisode(titleId: string): Observable<EpisodeDetail> {
        return this.isAuthenticated$().pipe(
            switchMap(isAuth => {
                const path = isAuth ? `/titles/${titleId}/first-episode` : `/public/episodes/${titleId}?mode=first-episode`;
                return this.request$('GET', environment.apiUrl, path);
            }),
            map((res: EpisodeDetail) => res),
        );
    }

    postFavorites(titleId: string): Observable<Title> {
        return this.request$('POST', environment.apiUrl, `/titles/${titleId}/favorites`).pipe(
            map(res => res.map((comic: Title) => comic)),
        );
    }

    deleteFavoriteById(id: string): Observable<any> {
        return this.request$('DELETE', environment.apiUrl, `/titles/${id}/favorites`);
    }
    /* ----- WEB TOON -----*/

    getExchange$(currency: string) {
        const defaultRatio = CURRENCY_RATIO['USD'];
        const defaultDecimal = 2;
        return of({ source: currency, target: 'KTDN', ratio: CURRENCY_RATIO[currency] || defaultRatio, decimal: defaultDecimal }).pipe(delay(100));
    }

    getExchange(currency: string) {
        const defaultRatio = CURRENCY_RATIO['USD'];
        const defaultDecimal = 2;
        return { source: currency, target: 'KTDN', ratio: CURRENCY_RATIO[currency] || defaultRatio, decimal: defaultDecimal };
    }

    payEpisode(episodeId: any, payData: PayEpisode) {
        return this.request$('POST', environment.apiUrl, `/episodes/${episodeId}/pay`, {}, { ...payData });
    }

    // Banner
    getBanners(param: any = {}) {
        const { category } = param;
        return this.isAuthenticated$().pipe(
            switchMap(isAuth => {
                const path = isAuth ? `/banners` : `/public/banners`;
                return this.request$('GET', environment.apiUrl, path, { category });
            }),
        );
    }

    getDetailBanner(id: string) {
        return this.isAuthenticated$().pipe(
            switchMap(isAuth => {
                const path = isAuth ? `/banners/${id}` : `/public/banners/${id}`;
                return this.request$('GET', environment.apiUrl, path);
            }),
        );
    }

    // Message
    addMessage(data: any) {
        return this.request$('POST', environment.apiUrl, `/boards/0`, {}, { ...data });
    }

    getMessageById(id: any) {
        return this.isAuthenticated$().pipe(
            switchMap(isAuth => {
                const path = isAuth ? `/boards/${id}` : `/public/boards/${id}`;
                return this.request$('GET', environment.apiUrl, path);
            })
        );
    }

    getMessageList(param: any = { page: 0 }) {
        const params = this.deleteUndefinedProperty(param);
        return this.isAuthenticated$().pipe(
            switchMap(isAuth => {
                const path = isAuth ? `/boards` : `/public/boards`;
                return this.request$('GET', environment.apiUrl, path, { ...params });
            })
        );
    }

    updateMessage(id: string, data: Message) {
        return this.request$('PUT', environment.apiUrl, `/boards/${id}`, {}, { ...data });
    }

    deleteMessage(id: string) {
        return this.request$('DELETE', environment.apiUrl, `/boards/${id}`);
    }

    // TDN API
    getTDNGraph() {
        return this.request$('GET', environment.apiUrl, `/tdn`);
    }

    getTDNBalance() {
        return this.request$('GET', environment.apiUrl, `/tdn/0/balance`);
    }

    chargeTDN(body: any = {}) {
        return this.request$('POST', environment.apiUrl, `/tdn/0/charge`, {}, { ...body });
    }

    getTDNHistory$(params: any = {}) {
        params = Object.assign({ page: 0, limit: 10 }, params);
        return this.request$('GET', environment.apiUrl, `/tdn/0/history`, params);
    }

    private deleteUndefinedProperty(query: any) {
        Object.keys(query).forEach(key => (query[key] === undefined || query[key] === '') && delete query[key]);
        return query;
    }

}
