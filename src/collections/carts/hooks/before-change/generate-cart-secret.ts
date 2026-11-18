import crypto from 'crypto'
import { CollectionBeforeChangeHook, PayloadRequest } from 'payload'

export const generateCartSecret: CollectionBeforeChangeHook = ({
  data,
  req,
}: {
  data: Partial<any>
  req: PayloadRequest
}) => {
  const secret = crypto.randomBytes(20).toString('hex')
  data.secret = secret

  if (!req.context) {
    req.context = {}
  }

  req.context.newCartSecret = secret
}
