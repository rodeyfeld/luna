import type { PageServerLoad } from "./$types";
import { redirect } from "@sveltejs/kit";

export const load: PageServerLoad = async ({ url }) => {
  const search = url.search ?? "";
  throw redirect(308, `/areas-of-interest${search}`);
};

