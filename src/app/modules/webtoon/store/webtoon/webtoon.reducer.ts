import { Action, createFeatureSelector, createReducer, createSelector, on } from '@ngrx/store';
import * as WebtoonActions from './webtoon.actions';
import { Banner } from '@app/models/banner';

export const DEFAULT_LIMIT = 10;
export const DEFAULT_PAGE = 0;

export interface WebtoonList {
    list: any;
    total: number;
    page: number;
    limit: number;
    totalPage: number;
    isInit?: boolean;
    banner?: Banner;
}

export type WebtoonGenre = 'all' | 'romance' | 'drama' | 'sports' | 'BL' | 'fantasy' | 'action' | 'etc';

export interface State {
    all: WebtoonList;
    romance: WebtoonList;
    drama: WebtoonList;
    sports: WebtoonList;
    BL: WebtoonList;
    fantasy: WebtoonList;
    action: WebtoonList;
    etc: WebtoonList;
    activeGenre: WebtoonGenre;
    bannerList: Banner[];
    isFetching: boolean;
}

export const initialState: State = {
    all: { list: [], total: 0, page: DEFAULT_PAGE, limit: DEFAULT_LIMIT, totalPage: DEFAULT_PAGE, isInit: false, banner: null },
    romance: { list: [], total: 0, page: DEFAULT_PAGE, limit: DEFAULT_LIMIT, totalPage: DEFAULT_PAGE, isInit: false, banner: null },
    drama: { list: [], total: 0, page: DEFAULT_PAGE, limit: DEFAULT_LIMIT, totalPage: DEFAULT_PAGE, isInit: false, banner: null },
    sports: { list: [], total: 0, page: DEFAULT_PAGE, limit: DEFAULT_LIMIT, totalPage: DEFAULT_PAGE, isInit: false, banner: null },
    BL: { list: [], total: 0, page: DEFAULT_PAGE, limit: DEFAULT_LIMIT, totalPage: DEFAULT_PAGE, isInit: false, banner: null },
    fantasy: { list: [], total: 0, page: DEFAULT_PAGE, limit: DEFAULT_LIMIT, totalPage: DEFAULT_PAGE, isInit: false, banner: null },
    action: { list: [], total: 0, page: DEFAULT_PAGE, limit: DEFAULT_LIMIT, totalPage: DEFAULT_PAGE, isInit: false, banner: null },
    etc: { list: [], total: 0, page: DEFAULT_PAGE, limit: DEFAULT_LIMIT, totalPage: DEFAULT_PAGE, isInit: false, banner: null },
    activeGenre: 'all',
    bannerList: null,
    isFetching: false,
};

export const _webtoonReducer = createReducer(
    initialState,
    on(WebtoonActions.RequestSuccess, (state) => ({
        ...state,
    })),
    on(WebtoonActions.SetActiveGenre, (state, { genre }) => ({
        ...state,
        activeGenre: genre
    })),
    on(WebtoonActions.SetWebtoonList, (state, { genre, res }) => {
        const { list, total, page, limit, totalPage } = res;
        state[genre] = { list, total, page, limit, totalPage, isInit: true, banner: state[genre].banner };
        return { ...state };
    }),
    on(WebtoonActions.SetActiveGenreBanner, (state, { genre, banner }) => {
        state[genre] = { ...state[genre], banner };
        return { ...state };
    }),
    on(WebtoonActions.SetGenresBannerList, (state, { total, list }) => ({
        ...state,
        bannerList: list
    })),
    on(WebtoonActions.SetIsFetching, (state, { isFetching }) => ({
        ...state,
        isFetching
    })),
);

export function webtoonReducer(state: State | undefined, action: Action) {
    return _webtoonReducer(state, action);
}

const selectWebtoon = createFeatureSelector<State>('webtoon');
export const getActiveGenreAndWebtoon = createSelector(selectWebtoon, (state: State) => {
    const genre = state.activeGenre;
    return { genre, webtoon: state[genre] };
});
export const getActiveWebtoonList = createSelector(selectWebtoon, (state: State) => state[state.activeGenre].list);
export const getActiveWebtoonTotal = createSelector(selectWebtoon, (state: State) => state[state.activeGenre].total);
export const getActiveWebtoonPage = createSelector(selectWebtoon, (state: State) => state[state.activeGenre].page);
export const getActiveWebtoonIsInit = createSelector(selectWebtoon, (state: State) => state[state.activeGenre].isInit);
export const getActiveWebtoonTotalPage = createSelector(selectWebtoon, (state: State) => state[state.activeGenre].totalPage);
export const getActiveWebtoonBanner = createSelector(selectWebtoon, (state: State) => state[state.activeGenre].banner);
export const getActiveGenre = createSelector(selectWebtoon, (state: State) => state.activeGenre);

export const getBannerList = createSelector(selectWebtoon, (state: State) => state.bannerList);
export const getIsFetching = createSelector(selectWebtoon, (state: State) => state.isFetching);
