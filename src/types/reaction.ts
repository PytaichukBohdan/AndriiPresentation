export interface Reaction {
  id: string;
  destId: string;
  authorNick: string;
  text: string;
  ts: number;
}

export interface ReactionsExport {
  version: 1;
  exportedAt: string;
  reactions: Reaction[];
}
