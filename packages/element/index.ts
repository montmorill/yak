export { h } from "./jsx-runtime"
import type { XOR } from "ts-xor"

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
