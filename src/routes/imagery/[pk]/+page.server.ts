import type { PageServerLoad } from "./$types";
import { redirect } from "@sveltejs/kit";

export const load: PageServerLoad = async ({ params, url }) => {
  const pk = params.pk;
  if (!pk) {
    throw redirect(308, "/areas-of-interest");
  }

  const search = url.search ?? "";
  throw redirect(308, `/areas-of-interest/${encodeURIComponent(pk)}${search}`);
};

