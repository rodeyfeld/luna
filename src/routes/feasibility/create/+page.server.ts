import type { Actions, PageServerLoad } from './$types';


function blankOrDate(input: FormDataEntryValue | null): string{
	if(input == null){
		return ''
	}
	return input.toString()
}



function convertDateString(input: string): string {
    // Parse the input string to create a Date object
    const date = new Date(input);
    // Format the date to ISO string format with milliseconds and Z timezone
    const formattedDate = date.toISOString();

    return formattedDate;

}


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

		response = await fetch('/api/feasibility_finder/finder_create', {
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