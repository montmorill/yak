import { h } from "@masaka/element"

const satori = <a href="https://satori.chat/">Satori</a>
const koishi = <a href="https://koishi.chat/">Koishi</a>

console.log(h.markdown`
# Hello, ${<mention everyone />}!
${<img src="https://masaka.dev/avatar.png" />}

- I'm the \`masaka\` protocol,
- created by ${<mention user="montmorill" />},
- inspired by ${satori} & ${koishi}.
`)
