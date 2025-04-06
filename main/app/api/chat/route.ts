import { NextApiRequest, NextApiResponse } from 'next';
import { Mistral } from '@mistralai/mistralai';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  const { message, history } = req.body;
  const client = new Mistral({ apiKey: process.env.MISTRAL_API_KEY });

  try {
    const chatResponse = await client.chat.complete({
      model: 'mistral-medium',
      messages: [
        { role: 'system', content: 'You are an assistant that answers questions about a pitch deck.' },
        ...history,
        { role: 'user', content: message },
      ],
    });
    if (!chatResponse.choices || chatResponse.choices.length === 0) {
      throw new Error('No response choices received from the model.');
    }
    res.status(200).json({ reply: chatResponse.choices[0].message.content });
  } catch (error) {
    console.error('Chat processing failed:', error);
    res.status(500).json({ error: 'Chat processing failed' });
  }
}
