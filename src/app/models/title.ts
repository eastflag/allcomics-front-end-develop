export interface Title {
    id?: string;
    image?: string;
    thumbnails?: {
        sq: string;
        vs: string;
        hs: string;
        hl: string;
    };
    description?: string;
    isNew?: boolean;
    genres?: string[];
    isRecommended?: boolean;
    name?: string;
    isCompleted?: boolean;
    isInSale?: boolean;
    isValid?: boolean;
    isFavorite?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
    titleId?: string;
    age?: number;
    episodeCount?: number;
    validEpisodeCount: number;
}
