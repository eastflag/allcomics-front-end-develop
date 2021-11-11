import { createAction, props } from '@ngrx/store';
import { Banner } from '@app/models/banner';
import { Title } from '@app/models/title';

export const FetchBannerList = createAction(
    '[HOME] Fetch Banner List',
    props<{ params: any, category: string }>()
);

export const SetBannerList = createAction(
    '[HOME] Set Banner List',
    props<{ total: number, list: Banner[] }>()
);

export const FetchSlideBanner = createAction(
    '[HOME] Fetch Slide Banner',
    props<{ slideBannerId: string }>()
);

export const SetSlideBanner = createAction(
    '[HOME] Set Slide Banner',
    props<{ slideBanner: Banner }>()
);

export const FetchBottomAdsBanner = createAction(
    '[HOME] Fetch Bottom Ads Banner',
    props<{ bottomAdsBannerId: string }>()
);

export const SetBottomAdsBanner = createAction(
    '[HOME] Set Bottom Ads Banner',
    props<{ bottomAdsBanner: Banner }>()
);

export const FetchGoodsBanner = createAction(
    '[HOME] Fetch Goods Banner',
    props<{ goodsBannerId: string }>()
);

export const SetGoodsBanner = createAction(
    '[HOME] Set Goods Banner',
    props<{ goodsBanner: Banner }>()
);

// Titles
export const FetchRankings = createAction(
    '[HOME] Fetch Rankings',
    props<{ params: { page: number, limit: number } }>()
);

export const SetRankings = createAction(
    '[HOME] Set Rankings',
    props<{ rankings: Title[] }>()
);

export const FetchPopulars = createAction(
    '[HOME] Fetch Populars',
    props<{ params: { page: number, limit: number } }>()
);

export const SetPopulars = createAction(
    '[HOME] Set Populars',
    props<{ populars: Title[] }>()
);

export const FetchRecentlyUpdated = createAction(
    '[HOME] Fetch Recently Updated',
    props<{ params: { page: number, limit: number } }>()
);

export const SetRecentlyUpdated = createAction(
    '[HOME] Set Recently Updated',
    props<{ recentlyUpdated: Title[] }>()
);

export const FetchRomance = createAction(
    '[HOME] Fetch Romance',
    props<{ params: { page: number, limit: number } }>()
);

export const SetRomance = createAction(
    '[HOME] Set Romance',
    props<{ romance: Title[] }>()
);

export const FetchBoysLove = createAction(
    '[HOME] Fetch BoysLove',
    props<{ params: { page: number, limit: number } }>()
);

export const SetBoysLove = createAction(
    '[HOME] Set BoysLove',
    props<{ boysLove: Title[] }>()
);

export const FetchCompleted = createAction(
    '[HOME] Fetch Completed',
    props<{ params: { page: number, limit: number } }>()
);

export const SetCompleted = createAction(
    '[HOME] Set Completed',
    props<{ completed: Title[] }>()
);

export const RequestSuccess = createAction(
    '[HOME] Request Success'
);

export const RequestFailure = createAction(
    '[HOME] Request Failure',
    props<{ error: any }>()
);
