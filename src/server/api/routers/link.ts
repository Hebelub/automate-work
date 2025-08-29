import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "../trpc";
import { links } from "~/server/db/schema";
import { eq } from "drizzle-orm";

export const linkRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.select().from(links).orderBy(links.createdAt);
  }),

  create: publicProcedure
    .input(
      z.object({
        url: z.string().url().max(1000),
        description: z.string().max(1000).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.insert(links).values(input);
    }),

  update: publicProcedure
    .input(
      z.object({
        id: z.number(),
        url: z.string().url().max(1000).optional(),
        description: z.string().max(1000).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...updateData } = input;
      return await ctx.db
        .update(links)
        .set(updateData)
        .where(eq(links.id, id));
    }),

  delete: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.delete(links).where(eq(links.id, input.id));
    }),
});
