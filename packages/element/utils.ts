import type { Element, Fragment } from './jsx-runtime'
import h from './jsx-runtime'

export function pack(...children: Fragment[]): Fragment {
  return children.length === 1 ? children[0]! : h.template(...children)
}

export function raw(strings: TemplateStringsArray, ...values: Fragment[]): Element {
  return h.template(...strings.flatMap((s, i) => values[i] ? [s, values[i]] : [s]))
}
