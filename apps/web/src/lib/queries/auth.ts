import * as React from "react";
import { headers } from "next/headers";

import { auth } from "@/lib/auth";

export const getSession = React.cache(async () => {
  const session = await auth.api.getSession({
    headers: headers(),
  });

  return session;
});
