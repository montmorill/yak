import { Element, Fragment } from './jsx-runtime'

const COLORS = {
  black: 30,
  red: 31,
  green: 32,
  yellow: 33,
  blue: 34,
  magenta: 35,
  cyan: 36,
  white: 37,
} as const

interface FormatterOptions {
  print: (data: any) => void
  depth?: number
  indent?: string
  inline?: boolean
  color?: boolean
  compact?: boolean
}

export class Formatter {
  readonly print: (data: any) => void
  readonly depth: number
  readonly indent: string
  readonly inline: boolean
  readonly color: boolean
  readonly compact: boolean
  private needLine = false

  constructor({
    print,
    depth = 0,
    indent = '  ',
    inline = false,
    color = true,
    compact = true,
  }: FormatterOptions) {
    this.print = print
    this.depth = depth
    this.indent = indent
    this.inline = inline
    this.color = color
    this.compact = compact
  }

  nest() {
    return new Formatter({ ...this, depth: this.depth + 1 })
  }

  newLine() {
    if (this.inline)
      return
    this.print(`\n${this.indent.repeat(this.depth)}`)
    this.needLine = false
  }

  colored(color: keyof typeof COLORS, data: any) {
    return this.color ? `\x1B[${COLORS[color]}m${data}\x1B[0m` : data
  }

  attrs(attrs: Record<string, any>) {
    for (const [key, value] of Object.entries(attrs)) {
      this.print(` ${this.colored('red', key)}`)
      if (value === true)
        continue
      this.print('=')
      switch (typeof value) {
        case 'boolean':
          this.print(`{${this.colored('magenta', value)}}`)
          break
        case 'number':
          this.print(`{${this.colored('blue', value)}}`)
          break
        case 'string':
          this.print(`"${this.colored('green', value.replaceAll('"', '\\"'))}"`)
          break
        default:
          this.print(`{${JSON.stringify(value)}}`)
          break
      }
    }
  }

  element(element: Element) {
    const tag = this.colored('green', element.type === Fragment ? '' : element.type)
    if (this.needLine)
      this.newLine()
    this.print(`<${tag}`)
    this.attrs(element.attrs)
    if (element.children.length === 0) {
      this.print(' />')
    }
    else {
      this.print('>')
      if (element.children.length === 1
        && (this.compact || !(element.children[0] instanceof Element))) {
        this.node(element.children[0])
      }
      else {
        const nested = this.nest()
        nested.newLine()
        for (const child of element.children) {
          nested.node(child)
        }
        this.newLine()
      }
      this.print(`</${tag}>`)
    }
    this.needLine = true
  }

  node(node: Fragment) {
    if (node instanceof Element) {
      this.element(node)
    }
    else if (typeof node === 'string') {
      this.needLine = false
      const lines = node.split('\n')
      this.print(lines[0])
      if (lines.length > 1) {
        for (const line of lines.slice(1)) {
          this.newLine()
          this.print(line)
        }
      }
    }
    else {
      this.print(node)
    }
  }
}

export class BufferFormatter extends Formatter {
  buffer = ''
  constructor(options?: Omit<FormatterOptions, 'print'>) {
    super({ ...options, print: text => this.buffer += text })
  }
}
