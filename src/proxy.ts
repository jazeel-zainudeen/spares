import { type NextRequest, userAgent } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

export async function proxy(request: NextRequest, event: any) {
  const response = await updateSession(request)

  const botToken = process.env.SLACK_BOT_TOKEN;
  const channelId = process.env.SLACK_CHANNEL_ID;
  const threadTs = request.cookies.get('slack_thread_ts')?.value;
  const lastPath = request.cookies.get('last_visited_path')?.value;
  const path = request.nextUrl.pathname;

  // Ignore unwanted background requests like .well-known, API calls, or files
  const isUnwantedPath = path.startsWith('/.') || path.startsWith('/_') || path.startsWith('/api') || path.includes('.');
  
  // Ignore Next.js background prefetching
  const isPrefetch = request.headers.get('next-router-prefetch') === '1' || request.headers.get('purpose') === 'prefetch';

  // Only track if we have the config, they are visiting a new path, and it's a real page
  if (botToken && channelId && lastPath !== path && !isUnwantedPath && !isPrefetch) {
    response.cookies.set('last_visited_path', path, { path: '/' });

    if (!threadTs) {
      // First visit: send main message and await response to get thread_ts
      const ip = request.ip || request.headers.get('x-real-ip') || 'Unknown IP';
      const geo = request.geo || {};
      const city = geo.city || request.headers.get('x-vercel-ip-city') || 'Unknown City';
      const country = geo.country || request.headers.get('x-vercel-ip-country') || 'Unknown Country';
      
      // Parse the user agent nicely using Next.js helper
      const { browser, os, device } = userAgent(request);
      const deviceType = device.type === 'mobile' ? '📱 Mobile' : device.type === 'tablet' ? '💊 Tablet' : '💻 Desktop';
      const parsedAgent = `${browser.name || 'Unknown Browser'} on ${os.name || 'Unknown OS'} (${deviceType})`;

      const isSupabaseLoggedIn = Array.from(request.cookies.getAll()).some(
        (cookie) => cookie.name.startsWith('sb-') && cookie.name.endsWith('-auth-token')
      );

      const text = `🚀 *New Session Started*
*Path:* \`${path}\`
*Location:* ${city}, ${country}
*Auth:* ${isSupabaseLoggedIn ? 'Authenticated 👤' : 'Guest 🕵️'}
*IP:* ${ip}
*Device:* \`${parsedAgent}\``;

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
        } else {
          console.error('Slack bot failed to start thread:', data);
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
      }).then(res => res.json()).then(data => {
        if (!data.ok) console.error('Slack thread reply error:', data)
      }).catch((err) => console.error('Slack thread reply exception:', err));

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
