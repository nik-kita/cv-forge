import {describe, expect, it} from 'vitest'
import {createActor, setup, waitFor} from 'xstate'

const machine = setup({
  types: {
    output: {} as string,
  },
}).createMachine({
  initial: 'Init',
  output: ({event}) => {
    console.log(event.output)
    return event.output as string
  },
  states: {
    Init: {
      always: {
        target: 'Processing',
      },
    },
    Processing: {
      onDone: {
        target: 'Complete',
        actions: ({event}) => {
          console.log('Processing: onDone', event)
        },
      },
      initial: 'Processing_Init',
      states: {
        Processing_Init: {
          always: {
            target: 'Step1',
          },
        },
        Step1: {
          type: 'final',
          output: 'hello world',
        },
      },
    },
    Complete: {
      type: 'final',
      output({event}) {
        console.log('Complete: ouput', event)
        return (event as any).output
      },
    },
  },
})

describe("_0: explore actor's output in xstate", () => {
  it('should return output', async () => {
    const actor = createActor(machine)
    actor.start()
    await waitFor(actor, s => {
      if (s.status === 'active') return false

      console.log(s.status)
      console.log(s.output)
      console.log(s.value)

      expect(s.output).toBe('hello world')

      return true
    })
  })
})
