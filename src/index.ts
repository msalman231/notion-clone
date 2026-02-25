import { Hono } from 'hono';
import { cors } from 'hono/cors';
import OpenAI from 'openai';

type Bindings = {
	OPEN_AI_KEY: string;
	AI: Ai;
};
const app = new Hono<{ Bindings: Bindings }>();

app.use(
	'/*',
	cors({
		origin: '*',
		allowHeaders: ['X-Custom-Header', 'Upgrade_insecure-Requests', 'Content-Type'],
		allowMethods: ['POST', 'GET', 'OPTIONS', 'PUT'],
		exposeHeaders: ['Content-Length', 'X-Kuma-Revision'],
		maxAge: 600,
		credentials: true,
	}),
);
app.get('/', (c) => {
	return c.text('AI Worker is running 🚀');
});
app.post('/translateDocument', async (c) => {
	const { documentData, targetLang } = await c.req.json();

	const summaryResponse = await c.env.AI.run('@cf/facebook/bart-large-cnn', {
		input_text: documentData,
		max_length: 1000,
	});

	const res = await c.env.AI.run('@cf/meta/m2m100-1.2b', {
		text: summaryResponse.summary,
		source_lang: 'english',
		target_lang: targetLang,
	});

	return new Response(JSON.stringify(res));
});

// app.post('/chatToDocument', async (c) => {
// 	const openai = new OpenAI({
// 		apiKey: c.env.OPEN_AI_KEY,
// 	});

// 	const { documentData, question } = await c.req.json();

// 	const documentText = typeof documentData === 'string' ? documentData : JSON.stringify(documentData, null, 2);

// 	const chatCompletion = await openai.chat.completions.create({
// 		messages: [
// 			{
// 				role: 'system',
// 				content:
// 					'You are an AI assistant that answers questions strictly based on the provided document. ' +
// 					'If the answer is not present in the document, say "The document does not contain this information."',
// 			},
// 			{
// 				role: 'system',
// 				content: `DOCUMENT CONTENT:\n${documentText}`,
// 			},
// 			{
// 				role: 'user',
// 				content: question,
// 			},
// 		],
// 		model: 'gpt-4o',
// 		temperature: 0.5,
// 	});
// 	const res = chatCompletion.choices[0].message.content;

// 	return c.json({ message: res });
// });

app.post('/chatToDocument', async (c) => {
	try {
		const openai = new OpenAI({
			apiKey: c.env.OPEN_AI_KEY,
		});

		const { documentData, question } = await c.req.json();

		if (!documentData || !question) {
			return c.json({ err: 'Invald payload' }, 400);
		}

		const documentText = typeof documentData === 'string' ? documentData : JSON.stringify(documentData, null, 2);

		const res = await openai.responses.create({
			model: 'gpt-4o',
			input: [
				{
					role: 'system',
					content:
						'You are an AI assistant that answers questions strictly based on the provided document.' +
						'If the answer is not present in the document, say "The document does not contain this information."',
				},
				{
					role: 'system',
					content: `Document Content: \n${documentText}`,
				},
				{
					role: 'user',
					content: question,
				},
			],
			temperature: 0.5,
		});
		return c.json({
			mes: res.output_text,
		});
	} catch (err: any) {
		console.error('chatToDocument error: ', err);
		return c.json({ err: err?.mes ?? 'Internal Server Error' }, 500);
	}
});

export default app;
