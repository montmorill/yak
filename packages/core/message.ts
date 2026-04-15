import type { Fragment } from '@yak/element'
import type { Channel, Message, SendOptions } from '@yak/protocol'
import type { Context } from 'cordis'
import type { Bot } from './bot'
import { h } from '@yak/core'

class AggregateError extends Error {
  constructor(public errors: Error[], message = '') {
    super(message)
  }
}

export abstract class MessageEncoder<C extends Context = Context, B extends Bot<C> = Bot<C>> {
  public errors: Error[] = []
  public results: Message[] = []
  public session!: C[typeof Context.session]

  constructor(public bot: B, public channelId: string, public referrer?: any, public options: SendOptions = {}) {}

  async prepare(): Promise<void> {}

  abstract flush(): Promise<void>
  abstract visit(element: JSX.Element): Promise<void>

  async render(...contents: Fragment[]): Promise<void> {
    for (let content of contents) {
      if (typeof content === 'string')
        content = h.text({ content })
      await this.visit(content as JSX.Element)
    }
  }

  async send(): Promise<Message[]> {
    this.session = this.bot.session({
      type: 'send',
      channel: { id: this.channelId, ...this.options.session?.event.channel } as Channel,
      guild: this.options.session?.event.guild,
    })
    for (const key in this.options.session || {}) {
      if (key === 'id' || key === 'event')
        continue
      // @ts-ignore
      this.session[key] = this.options.session[key]
    }
    await this.prepare()
    if (await this.session.app.serial(this.session, 'before-send', this.session, this.options))
      return []
    await this.flush()
    if (this.errors.length) {
      throw new AggregateError(this.errors)
    }
    else {
      return this.results
    }
  }
}
