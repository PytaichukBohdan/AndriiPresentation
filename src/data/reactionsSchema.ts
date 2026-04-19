import { z } from "zod";

export const reactionSchema = z.object({
  id: z.string().min(1),
  destId: z.string().min(1),
  authorNick: z.string().min(1),
  text: z.string().min(1).max(140),
  ts: z.number().int().nonnegative(),
});

export const reactionsExportSchema = z.object({
  version: z.literal(1),
  exportedAt: z.string(),
  reactions: z.array(reactionSchema),
});

export type ReactionsExport = z.infer<typeof reactionsExportSchema>;
