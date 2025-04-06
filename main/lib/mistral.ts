import { Mistral } from '@mistralai/mistralai'

const apiKey = process.env.MISTRAL_API_KEY!;
const client = new Mistral({ apiKey });

export async function processPitchDeck(fileBuffer: Buffer) {
  // Convert Buffer to Readable Stream
  //const fileStream = Readable.from(fileBuffer);

  // Upload the file
  const uploaded = await client.files.upload({
    file: new Blob([fileBuffer], { type: 'application/pdf' }), // Adjust MIME type as needed
  });

  // Retrieve the signed URL
  const signedUrl = await client.files.getSignedUrl({ fileId: uploaded.id });

  // Process OCR
  const ocrResponse = await client.ocr.process({
    model: 'mistral-ocr-latest',
    document: {
      type: 'document_url',
      documentUrl: signedUrl.url,
    },
  });

  const documentText = ocrResponse.pages.map((p) => p.markdown).join('\n\n');

  const question = `
I have an OCR-extracted pitch deck below. I want you to extract specific information from it based on the following criteria. Please respond **only** in the given format.

Pitch Deck Evaluation:

question 1: Who are the founders?
answer: [Names of the founders]

question 2: What is the business model?
answer: [Brief explanation of the business model]

question 3: What are their achievements?
answer: [List of key achievements and recognitions]

question 4: Have they been incubated or supported by any accelerator programs?
answer: [Yes or No, with name(s) if available]

Please ensure your answers are based strictly on the pitch deck content.
`;

  const response = await client.chat.complete({
    model: 'mistral-medium',
    messages: [
      { role: 'system', content: 'You are an assistant that analyzes pitch decks and answers questions about them.' },
      { role: 'user', content: `Here is the content of a pitch deck:\n\n${documentText}` },
      { role: 'user', content: question },
    ],
  });
  if (!response.choices || response.choices.length === 0) {
    throw new Error('No response choices received from the model.');
  }
  return {
    summary: response.choices[0].message.content,
    context: documentText,
  };
}

export async function askFollowUp(context: string, question: string) {
  const response = await client.chat.complete({
    model: 'mistral-medium',
    messages: [
      { role: 'system', content: 'You are an assistant that answers follow-up questions about pitch decks.' },
      { role: 'user', content: `Context: ${context}` },
      { role: 'user', content: question },
    ],
  });
  if (!response.choices || response.choices.length === 0) {
    throw new Error('No response choices received from the model.');
  }
  return response.choices[0].message.content;
}
