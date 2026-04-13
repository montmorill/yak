import type { InspectOptions } from 'node:util'
import type { FormatterOptions } from './formatter'
import util from 'node:util'
import { BufferFormatter } from './formatter'

declare global {
  namespace JSX {
    type Element = InstanceType<{
      [T in keyof JSX.IntrinsicElements]: typeof Element<T>
    }[keyof JSX.IntrinsicElements]>

    interface IntrinsicElements {
      template: object
    }
  }
}

export const Fragment = 'template'

export type Fragment = Element | string | any

export class Element<T extends keyof JSX.IntrinsicElements = keyof JSX.IntrinsicElements> {
  constructor(
    readonly type: T,
    readonly attrs: JSX.IntrinsicElements[T],
    readonly children: Fragment[],
  ) {}

  toString(opts?: InspectOptions & Omit<FormatterOptions, 'print'>) {
    const formatter = new BufferFormatter(opts)
    formatter.element(this)
    return formatter.buffer
  }

  [util.inspect.custom](_depth: number | null | undefined, inspectOptions: InspectOptions) {
    return this.toString(inspectOptions)
  }
}

type IsNullSafeObject<T> = keyof T extends never ? true : T extends Partial<T> ? true : false

function h<T extends keyof JSX.IntrinsicElements>(
  type: T,
  ...args: IsNullSafeObject<JSX.IntrinsicElements[T]> extends true
    ? Fragment[] | [attrs: JSX.IntrinsicElements[T], ...children: Fragment[]]
    : [attrs: JSX.IntrinsicElements[T], ...children: Fragment[]]
): Element<T> {
  if (args[0] instanceof Element || typeof args[0] !== 'object')
    return new Element(type, {} as JSX.IntrinsicElements[T], args as Fragment[])
  return new Element(type, args[0] ?? {} as JSX.IntrinsicElements[T], args.slice(1) as Fragment[])
}

export default new Proxy(h, {
  get(target, prop, receiver) {
    if (Object.hasOwn(target, prop)) {
      return Reflect.get(target, prop, receiver)
    }
    return (...args: any[]) => target(prop as keyof JSX.IntrinsicElements, ...args)
  },
}) as typeof h & {
  [T in keyof JSX.IntrinsicElements]:
  Parameters<typeof h<T>> extends [infer _, ...infer R]
    ? (...args: R) => Element<T> : never
}
