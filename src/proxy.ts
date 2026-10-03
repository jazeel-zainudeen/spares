import { type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

export async function proxy(request: NextRequest, event: any) {
  const response = await updateSession(request)

  const botToken = process.env.SLACK_BOT_TOKEN;
  const channelId = process.env.SLACK_CHANNEL_ID;
  const threadTs = request.cookies.get('slack_thread_ts')?.value;
  const lastPath = request.cookies.get('last_visited_path')?.value;
  const path = request.nextUrl.pathname;

  // Only track if we have the config and they are visiting a new path
  if (botToken && channelId && lastPath !== path) {
    response.cookies.set('last_visited_path', path, { path: '/' });

    if (!threadTs) {
      // First visit: send main message and await response to get thread_ts
      const ip = request.ip || request.headers.get('x-real-ip') || 'Unknown IP';
      const geo = request.geo || {};
      const city = geo.city || request.headers.get('x-vercel-ip-city') || 'Unknown City';
      const country = geo.country || request.headers.get('x-vercel-ip-country') || 'Unknown Country';
      const userAgent = request.headers.get('user-agent') || 'Unknown Device';

      const isSupabaseLoggedIn = Array.from(request.cookies.getAll()).some(
        (cookie) => cookie.name.startsWith('sb-') && cookie.name.endsWith('-auth-token')
      );

      const text = `🚀 *New Session Started*
*Path:* \`${path}\`
*Location:* ${city}, ${country}
*Auth:* ${isSupabaseLoggedIn ? 'Authenticated 👤' : 'Guest 🕵️'}
*IP:* ${ip}
*Agent:* \`${userAgent}\``;

      try {
        const res = await fetch('https://slack.com/api/chat.postMessage', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${botToken}`,
          },
          body: JSON.stringify({
            channel: channelId,
            text: text,
          }),
        });
        
        const data = await res.json();
        if (data.ok && data.ts) {
          response.cookies.set('slack_thread_ts', data.ts, { path: '/' });
        }
      } catch (err) {
        console.error('Slack bot error:', err);
      }
    } else {
      // Subsequent visit: reply to thread in background
      const text = `📍 *Page View:* \`${path}\``;
      
      const trackReq = fetch('https://slack.com/api/chat.postMessage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${botToken}`,
        },
        body: JSON.stringify({
          channel: channelId,
          text: text,
          thread_ts: threadTs,
        }),
      }).catch((err) => console.error('Slack thread reply error:', err));

      if (event && event.waitUntil) {
        event.waitUntil(trackReq);
      }
    }
  }

  return response
}

export default proxy

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|manifest.json|sw.js|offline.html|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
