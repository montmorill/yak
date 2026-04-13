import type { XOR } from 'ts-xor'
import h, { Fragment } from './jsx-runtime'
import { markdown } from './markdown'

declare global {
  namespace JSX {
    interface IntrinsicElements {
      mention: XOR<
        { everyone: true },
        { user: string },
        { channel: string }
      >
    }
  }
}

export function raw(strings: TemplateStringsArray, ...values: Fragment[]) {
  return h.template(strings.flatMap((s, i) => values[i] ? [s, values[i]] : [s]).flat())
}

export default Object.assign(h, { Fragment, raw, markdown })
