export type User = {
   id?: number;
   name: string;
   username: string;
   password: string;
   rating: number;
   age: number;
   country: string;
   player?: Player[];
};

export type Tournament = {
   id?: number;
   name: string;
   started: Date;
   ended: Date;

   players?: Player[];
   matches?: Match[];
};

export type Player = {
   int?: number;
   score: number;

   user?: User;
   userId?: number;
   tournament?: Tournament;
   tournamentId?: number;

   white: Match[];
   black: Match[];
};

export type Match = {
   id?: number;
   won: string;
   round: number;
   started?: Date;
   ended?: Date;

   white?: Player;
   whiteId?: number;
   black?: Player;
   blackId?: number;
   tournament?: Tournament;
   tournamentId?: number;
};
