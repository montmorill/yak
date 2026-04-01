export { h } from "./jsx-runtime"
import type { XOR } from "ts-xor"

globalThis.Fragment = Fragment

declare global {
  var Fragment: "Fragment"

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
