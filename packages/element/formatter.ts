import { Element, type ElementNode, Fragment } from "./jsx-runtime"

export class Formatter {
  private needLine = false

  constructor(
    readonly indent: string = "  ",
    readonly depth: number = 0,
    private print: (text: string) => void
  ) { }

  nest() {
    return new Formatter(this.indent, this.depth + 1, this.print)
  }

  newLine() {
    this.print("\n" + this.indent.repeat(this.depth))
    this.needLine = false
  }

  props(props: Record<string, unknown>) {
    for (const [key, value] of Object.entries(props)) {
      this.print(" ")
      switch (typeof value) {
        case "boolean":
          this.print(value ? key : `${key}="false"`)
          break
        case "number":
          this.print(`${key}={${value}}`)
          break
        case "string":
          this.print(`${key}="${value}"`)
          break
        default:
          this.print(`"${key}"={${JSON.stringify(value)}}}`)
          break
      }
    }
  }

  children(children: ElementNode[]) {
    const nested = this.nest()
    nested.newLine()
    for (const child of children) {
      nested.node(child)
    }
  }

  element(element: Element) {
    const tag = element.type == Fragment ? "" : element.type
    if (this.needLine)
      this.newLine()
    this.print(`<${tag}`)
    this.props(element.props)
    if (element.children.length) {
      this.print(">")
      this.children(element.children)
      this.newLine()
      this.print(`</${tag}>`)
    } else {
      this.print("/>")
    }
    this.needLine = true
  }

  node(node: ElementNode) {
    if (node instanceof Element) {
      this.element(node)
    } else {
      this.print(String(node))
    }
  }
}

export class BufferFormatter extends Formatter {
  buffer = ""
  constructor(indent?: string, depth?: number) {
    super(indent, depth, (text) => this.buffer += text)
  }
}
