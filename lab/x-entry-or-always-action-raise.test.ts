import {assertEquals} from 'https://deno.land/std@0.224.0/assert/mod.ts'
import {createActor, setup} from 'xstate'

Deno.test('x-entry-or-always-action-raise', () => {
  const machine = setup({
    actions: {
      entry_action(_, box: string[]) {
        box.push('entry_action')
      },
      always_action(_, box: string[]) {
        box.push('always_action')
      },
    },
  }).createMachine({
    context: {
      box: [] as string[],
    },
    initial: 'Start',
    output: ({context: {box}}) => box,
    states: {
      Start: {
        always: {
          actions: {
            type: 'always_action',
            params: ({context: {box}}) => box,
          },
        },
        entry: {
          type: 'entry_action',
          params: ({context: {box}}) => box,
        },
      },
      Finish: {
        type: 'final',
      },
    },
  })
  const actor = createActor(machine)
  actor.start()
  const snapshot = actor.getSnapshot()
  assertEquals(snapshot.context.box, [
    'entry_action',
    'always_action',
  ])
})
