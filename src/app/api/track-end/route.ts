import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const cookieStore = await cookies();
    const threadTs = cookieStore.get('slack_thread_ts')?.value;
    const botToken = process.env.SLACK_BOT_TOKEN;
    const channelId = process.env.SLACK_CHANNEL_ID;

    if (!threadTs || !botToken || !channelId) {
      return NextResponse.json({ ok: true });
    }

    // Don't await this so it doesn't block the beacon response
    fetch('https://slack.com/api/chat.postMessage', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${botToken}`,
      },
      body: JSON.stringify({
        channel: channelId,
        text: `👋 *User left the website (Session Ended)*`,
        thread_ts: threadTs,
      }),
    }).catch(err => console.error('Slack session end error:', err));
    
  } catch (error) {
    console.error('Failed to track session end:', error);
  }
  return NextResponse.json({ ok: true });
}
