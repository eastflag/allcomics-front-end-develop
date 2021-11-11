import { createReducer, on, Action, createFeatureSelector, createSelector } from '@ngrx/store';
import * as HomeActions from './home.actions';

import { Banner } from '@app/models/banner';
import { Title } from '@app/models/title';

export interface State {
    // banners
    bannersTotal: number;
    banners: Banner[];
    slideBanner: Banner;
    bottomAdsBanner: Banner;
    goodsBanner: Banner;
    // titles
    rankings: Title[];
    populars: Title[];
    recentlyUpdated: Title[];
    romance: Title[];
    boysLove: Title[];
    completed: Title[];
}

export const initialState: State = {
    // banners
    bannersTotal: null,
    banners: null,
    slideBanner: null,
    bottomAdsBanner: null,
    goodsBanner: null,
    // titles
    rankings: null,
    populars: null,
    recentlyUpdated: null,
    romance: null,
    boysLove: null,
    completed: null,
};

export const _homeReducer = createReducer(
    initialState,

    // banners
    on(HomeActions.SetBannerList, (state, { total, list }) => ({
        ...state,
        bannersTotal: total,
        banners: list,
    })),
    on(HomeActions.SetSlideBanner, (state, { slideBanner }) => ({
        ...state,
        slideBanner,
    })),
    on(HomeActions.SetBottomAdsBanner, (state, { bottomAdsBanner }) => ({
        ...state,
        bottomAdsBanner,
    })),
    on(HomeActions.SetGoodsBanner, (state, { goodsBanner }) => ({
        ...state,
        goodsBanner,
    })),
    // titles
    on(HomeActions.SetRankings, (state, { rankings }) => ({
        ...state,
        rankings,
    })),
    on(HomeActions.SetPopulars, (state, { populars }) => ({
        ...state,
        populars,
    })),
    on(HomeActions.SetRecentlyUpdated, (state, { recentlyUpdated }) => ({
        ...state,
        recentlyUpdated,
    })),
    on(HomeActions.SetRomance, (state, { romance }) => ({
        ...state,
        romance,
    })),
    on(HomeActions.SetBoysLove, (state, { boysLove }) => ({
        ...state,
        boysLove,
    })),
    on(HomeActions.SetCompleted, (state, { completed }) => ({
        ...state,
        completed,
    })),
    on(HomeActions.RequestSuccess, (state) => ({
        ...state,
    })),
);

export function homeReducer(state: State | undefined, action: Action) {
    return _homeReducer(state, action);
}

const selectHome = createFeatureSelector<State>('home');
// banners
export const getBanners = createSelector(selectHome, (state: State) => state.banners);
export const getSlideBanner = createSelector(selectHome, (state: State) => state.slideBanner);
export const getBottomAdsBanner = createSelector(selectHome, (state: State) => state.bottomAdsBanner);
export const getGoodsBanner = createSelector(selectHome, (state: State) => state.goodsBanner);
// titles
export const getRankings = createSelector(selectHome, (state: State) => state.rankings);
export const getPopulars = createSelector(selectHome, (state: State) => state.populars);
export const getRecentlyUpdated = createSelector(selectHome, (state: State) => state.recentlyUpdated);
export const getRomance = createSelector(selectHome, (state: State) => state.romance);
export const getBoysLove = createSelector(selectHome, (state: State) => state.boysLove);
export const getCompleted = createSelector(selectHome, (state: State) => state.completed);
