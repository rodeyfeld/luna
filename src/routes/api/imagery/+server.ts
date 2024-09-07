import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import SwaggerClient from 'swagger-client';

const url = "http://localhost:8000/api/openapi.json"

export const POST: RequestHandler = async ({ request }) => {
	const { msg} = await request.json();
	return json(msg + 1);
};



// const url = 'https://httpbin.org/post';
const request = {
  url, // notice the url must always be part of Request object
  mode: 'cors',
  method: 'POST',
  body: { data: 3 },
  headers: {
    'Content-Type': 'application/json',
  },
};

const test = await SwaggerClient.http(url, request); // => Promise(Response)
console.log(test)