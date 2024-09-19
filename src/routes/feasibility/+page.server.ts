import type { PageServerLoad } from './$types';
import type { Actions } from './$types';

function blankOrDate(input: FormDataEntryValue | null): string{
	if(input == null){
		return ''
	}
	return input.toString()
}

function convertDateString(input: string): string {
    // Parse the input string to create a Date object
    const date = new Date(input);

    // Adjust the time if necessary (e.g., subtracting 3 minutes for this example)
    // You can change this logic as needed
    date.setMinutes(date.getMinutes() - 3); // Adjust based on your requirement

    // Format the date to ISO string format with milliseconds and Z timezone
    const formattedDate = date.toISOString();

    return formattedDate;

}

export const load: PageServerLoad = async ({ fetch }) => {
	let response = await fetch('/api/imagery', {
		method: 'POST',
		body: JSON.stringify({ "user": "user_id" }),
		headers: {
			'content-type': 'application/json',
		},
	});
	let data = await response.json();
	let { images = [] } = await data;
	response = await fetch('/api/feasibility', {
		method: 'POST',
		body: JSON.stringify({ "user": "user_id" }),
		headers: {
			'content-type': 'application/json',
		},
	});
	data = await response.json();
	let { finders = [] } = await data;
	return {
		images: images,
		finders: finders
	}
};

export const actions = {
	submit: async ({ request, fetch }) => {
		const formData = await request.formData();
		
		let response = await fetch(`/api/imagery/${formData.get("imageId")}`, {
			method: 'GET',
			headers: {
				'content-type': 'application/json',
			},
		});

		let data = await response.json();
		console.log(data)
		const geometry = await data['image']['geometry'];
		const startDate =  blankOrDate(formData.get("startDate"))
		const endDate =  blankOrDate(formData.get("endDate"))
		const finderName =  formData.get("finderName")

		const finderCreateData = {
			 	'geometry': geometry,
			 	'start_date': convertDateString(startDate),
			 	'end_date': convertDateString(endDate),			
			 	'name': finderName,			
		};


		response = await fetch('/api/feasibility/finder_create', {
			method: 'POST',
			body: JSON.stringify(finderCreateData),
			headers: {
				'content-type': 'application/json',
			},
		});
		return {
			success: true
		}


	},
} satisfies Actions;