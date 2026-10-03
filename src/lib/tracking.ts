'use server';

import { cookies } from 'next/headers';

export async function trackAction(message: string) {
  try {
    const cookieStore = await cookies();
    const threadTs = cookieStore.get('slack_thread_ts')?.value;
    const botToken = process.env.SLACK_BOT_TOKEN;
    const channelId = process.env.SLACK_CHANNEL_ID;

    // Only send the message if we have an active thread and the bot is configured
    if (!threadTs || !botToken || !channelId) {
      return;
    }

    const res = await fetch('https://slack.com/api/chat.postMessage', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${botToken}`,
      },
      body: JSON.stringify({
        channel: channelId,
        text: message,
        thread_ts: threadTs,
      }),
    });
    const data = await res.json();
    if (!data.ok) {
      console.error('Slack bot failed to track action:', data);
    }
  } catch (error) {
    console.error('Failed to track action to Slack:', error);
  }
}
