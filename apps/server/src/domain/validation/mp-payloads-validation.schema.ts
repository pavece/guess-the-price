import { z } from 'zod';

export const requiresPlayerIdPayloadSchema = z.object({
	playerId: z.string().uuid({ message: 'playerId is required and must be an uuid' }),
});

export const JoinSessionPayloadSchema = z.object({
	sessionId: z.string().uuid({ message: 'sessionId must be an uuid' }).optional(),
});

export const GuessPricePayloadSchema = z.object({
	playerId: z.string().uuid({ message: 'playerId is required and must be an uuid' }),
	guessedPrice: z.number({ message: 'guessedPrice must be a number' }),
});

export const ReconnectPayloadSchema = z.object({
	playerId: z.string().uuid({ message: 'playerId is required and must be an uuid' }),
	sessionId: z.string().uuid({ message: 'sessionId is required and must be an uuid' }),
});
