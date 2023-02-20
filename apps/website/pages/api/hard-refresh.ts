import type { NextApiRequest, NextApiResponse } from 'next'

const handler = async (
  _request: NextApiRequest,
  response: NextApiResponse
): Promise<void> => {
  // TODO: Usage of mutations API once Next.js supports it (ref: <https://beta.nextjs.org/docs/api-reference/cookies>)
  response.redirect('/')
}

export default handler
