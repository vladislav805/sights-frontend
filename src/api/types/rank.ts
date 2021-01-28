export type IUserRank = {
    points: number;
    rankId: number;
    title: string;
};

export type IRank = {
    rankId: number;
    title: string;
    min: number;
    max: number;
};
