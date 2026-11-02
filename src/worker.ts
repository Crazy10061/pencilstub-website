import { handle } from '@astrojs/cloudflare/handler';
import { handleStatsRequest, refreshStats, type StatsEnv } from './mouldy_shoe/worker/stats';

type AppEnv = Env & Pick<StatsEnv, 'YOUTUBE_API_KEY' | 'YOUTUBE_CHANNEL_HANDLE'>;

const SITES: Record<string, string> = {
	'mouldyshoe.pencilstub.dev': '/mouldy_shoe',
	'mouldyshoe.localhost': '/mouldy_shoe'
};

const GROUP_PREFIXES = ['/mouldy_shoe', '/nexil'];

const isFile = (pathname: string) => /\.[a-z0-9]+$/i.test(pathname);

const isGroupPath = (pathname: string) =>
	GROUP_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));

export default {
	async fetch(request: Request, env: AppEnv, ctx: ExecutionContext): Promise<Response> {
		const url = new URL(request.url);
		const prefix = SITES[url.hostname];

		// API routes
		if (prefix === '/mouldy_shoe' && url.pathname === '/api/stats') {
			return handleStatsRequest(env, ctx);
		}

		if (!isFile(url.pathname)) {
			if (prefix) {
				if (isGroupPath(url.pathname)) return new Response('Not found', { status: 404 });
				url.pathname = prefix + (url.pathname === '/' ? '/' : url.pathname);
				return handle(new Request(url, request), env, ctx);
			}
			if (isGroupPath(url.pathname)) return new Response('Not found', { status: 404 });
		}

		return handle(request, env, ctx);
	},

	async scheduled(_event: ScheduledController, env: AppEnv, ctx: ExecutionContext): Promise<void> {
		ctx.waitUntil(refreshStats(env));
	},
} satisfies ExportedHandler<AppEnv>;
