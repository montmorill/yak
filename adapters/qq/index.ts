import * as QQ from './types'
// import { QQBot } from './bot'
import { GroupInternal, GuildInternal } from './internal'

import type { Context, ParamCase } from "@yak/core";

// export { QQ }

// export * from './bot'
// export * from './message'
// export * from './utils'
// export * from './ws'

// export default QQBot

type QQEvents = {
  [T in keyof QQ.GatewayEvents as `qq/${ParamCase<T>}`]: (input: QQ.GatewayEvents[T]) => void
}

declare module '@yak/core' {
  interface Session {
    qq?: QQ.Payload & GroupInternal
    qqguild?: QQ.Payload & GuildInternal
  }
}

export function apply(ctx: Context) {
  ctx.http.get('/api/getAppAccessToken')
}
