import { fail } from '@sveltejs/kit';
import { desc, eq, sql, count, and } from 'drizzle-orm';
import { command, form, getRequestEvent, query } from '$app/server';

import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';

const getGuestBooksPrepared = db
	.select({
		id: table.guestBook.id,
		content: table.guestBook.content,
		userId: table.guestBook.userId,
		username: table.user.username,
		createdAt: table.guestBook.createdAt,
		likeCount: count(table.guestBookLike.userId).mapWith(Number),
		liked: sql<number>`count(case when ${table.guestBookLike.userId} = ${sql.placeholder('currentUserId')} then 1 end)`.mapWith((val) => val > 0)
	})
	.from(table.guestBook)
	.innerJoin(table.user, eq(table.guestBook.userId, table.user.id))
	.leftJoin(table.guestBookLike, eq(table.guestBookLike.guestBookId, table.guestBook.id))
	.groupBy(table.guestBook.id, table.user.username)
	.orderBy(desc(table.guestBook.createdAt))
	.prepare('get_guest_books');

export const getGuestsBook = query(async () => {
	const { locals } = getRequestEvent();

	const currentUserId = locals.user?.id ?? null;
	const guestBooks = await getGuestBooksPrepared.execute({ currentUserId });
	const replies = await db
		.select({
			id: table.guestBookReply.id,
			guestBookId: table.guestBookReply.guestBookId,
			content: table.guestBookReply.content,
			userId: table.guestBookReply.userId,
			username: table.user.username,
			createdAt: table.guestBookReply.createdAt
		})
		.from(table.guestBookReply)
		.innerJoin(table.user, eq(table.guestBookReply.userId, table.user.id))
		.orderBy(table.guestBookReply.createdAt);

	return {
		user: locals.user,
		guestBooks: guestBooks.map((item) => ({
			...item,
			replies: replies.filter((reply) => reply.guestBookId === item.id)
		}))
	};
});

export const insertGuestBook = form('unchecked', async ({ content }: { content: string }) => {
	const { locals } = getRequestEvent();
	if (!locals.user) return fail(401, { error: 'Unauthorized' });
	if (!content || content.trim().length < 3 || content.length > 140) return fail(400, { content, error: 'Invalid content length' });

	await db.insert(table.guestBook).values({ content, userId: locals.user.id, createdAt: new Date() }).returning({
		id: table.guestBook.id,
		content: table.guestBook.content,
		userId: table.guestBook.userId,
		createdAt: table.guestBook.createdAt
	});

	await getGuestsBook().refresh();
});

export const toggleLikeGuestBook = command('unchecked', async (guestBookId: number) => {
	const { locals } = getRequestEvent();
	if (!locals.user) return fail(401, { error: 'Unauthorized' });

	await db.transaction(async (tx) => {
		const [exist] = await tx
			.select({ id: table.guestBookLike.guestBookId })
			.from(table.guestBookLike)
			.where(and(eq(table.guestBookLike.guestBookId, guestBookId), eq(table.guestBookLike.userId, locals.user!.id)));

		if (exist) {
			await tx.delete(table.guestBookLike).where(and(eq(table.guestBookLike.guestBookId, guestBookId), eq(table.guestBookLike.userId, locals.user!.id)));
		} else {
			const [guestBookExists] = await tx.select({ id: table.guestBook.id }).from(table.guestBook).where(eq(table.guestBook.id, guestBookId));
			if (!guestBookExists) return;
			await tx.insert(table.guestBookLike).values({ guestBookId: guestBookId, userId: locals.user!.id });
		}
	});

	await getGuestsBook().refresh();
});

export const deleteGuestBook = command('unchecked', async (guestBookId: number) => {
	const { locals } = getRequestEvent();
	if (!locals.user) return fail(401, { error: 'Unauthorized' });

	await db.delete(table.guestBook).where(and(eq(table.guestBook.id, guestBookId), eq(table.guestBook.userId, locals.user.id)));
	await getGuestsBook().refresh();
});


export const insertGuestBookReply = command(
	'unchecked',
	async ({ guestBookId, content }: { guestBookId: number; content: string }) => {
		const { locals } = getRequestEvent();
		if (!locals.user) return fail(401, { error: 'Unauthorized' });
		if (locals.user.username.toLowerCase() !== 'benjamin-blanke') return fail(403, { error: 'Owner only' });
		if (!content || content.trim().length < 1 || content.trim().length > 140) return fail(400, { error: 'Invalid content length' });

		const [guestBookExists] = await db
			.select({ id: table.guestBook.id })
			.from(table.guestBook)
			.where(eq(table.guestBook.id, guestBookId));
		if (!guestBookExists) return fail(404, { error: 'Message not found' });

		await db.insert(table.guestBookReply).values({
			guestBookId,
			userId: locals.user.id,
			content: content.trim(),
			createdAt: new Date()
		});

		await getGuestsBook().refresh();
	}
);
