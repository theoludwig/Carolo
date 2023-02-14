import tap from 'tap'

import { Observer } from '../Observer.js'

export interface ExampleObserverState {
  value: number
}

class ExampleObserver extends Observer<ExampleObserverState> {
  public constructor() {
    super({ value: 0 })
  }
}

await tap.test('Observer', async (t) => {
  await t.test('Initialization', async (t) => {
    const observer = new ExampleObserver()
    t.equal(observer.state.value, 0)
  })

  await t.test('setState', async (t) => {
    const observer = new ExampleObserver()
    observer.setState((state) => {
      state.value = 1
    })
    t.equal(observer.state.value, 1)
    t.equal(observer.initialState.value, 0)
  })

  await t.test('subscribe', async (t) => {
    let valueSubscribed = 0
    const observer = new ExampleObserver()
    observer.subscribe((state) => {
      valueSubscribed = state.value
    })
    observer.setState((state) => {
      state.value = 1
    })
    t.equal(valueSubscribed, 1)
    t.equal(observer.initialState.value, 0)
  })

  await t.test('unsubscribe', async (t) => {
    let valueSubscribed = 0
    const observer = new ExampleObserver()
    const unsubscribe = observer.subscribe((state) => {
      valueSubscribed = state.value
    })
    observer.setState((state) => {
      state.value = 1
    })
    t.equal(valueSubscribed, 1)
    unsubscribe()
    observer.setState((state) => {
      state.value = 2
    })
    t.equal(valueSubscribed, 1)
    t.equal(observer.initialState.value, 0)
  })
})
