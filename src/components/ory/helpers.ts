// Copyright © 2023 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { NextRouter } from "next/router";

export const SetUriFlow = (
  router: NextRouter,
  id: string,
  returnTo?: string
) => {
  // Check that current query flow id does not match requested one - pushing will trigger useEffect if router bound
  if (router.query.flow === id) {
    return;
  }

  router.push(
    `${router.pathname}`,
    {
      query: {
        return_to: returnTo ? decodeURI(returnTo) : undefined,
        flow: id
      }
    },
    { shallow: true }
  );
};
