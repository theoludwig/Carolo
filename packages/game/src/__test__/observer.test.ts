import test from 'node:test'
import assert from 'node:assert/strict'

import { Observer } from '../Observer.js'

export interface ExampleObserverState {
  value: number
}

class ExampleObserver extends Observer<ExampleObserverState> {
  public constructor() {
    super({ value: 0 })
  }
}

await test('Observer', async (t) => {
  await t.test('Initialization', async () => {
    const observer = new ExampleObserver()
    assert.strictEqual(observer.state.value, 0)
  })

  await t.test('setState', async () => {
    const observer = new ExampleObserver()
    observer.setState((state) => {
      state.value = 1
    })
    assert.strictEqual(observer.state.value, 1)
    assert.strictEqual(observer.initialState.value, 0)
  })

  await t.test('subscribe', async () => {
    let valueSubscribed = 0
    const observer = new ExampleObserver()
    observer.subscribe((state) => {
      valueSubscribed = state.value
    })
    observer.setState((state) => {
      state.value = 1
    })
    assert.strictEqual(valueSubscribed, 1)
    assert.strictEqual(observer.initialState.value, 0)
  })

  await t.test('unsubscribe', async () => {
    let valueSubscribed = 0
    const observer = new ExampleObserver()
    const unsubscribe = observer.subscribe((state) => {
      valueSubscribed = state.value
    })
    observer.setState((state) => {
      state.value = 1
    })
    assert.strictEqual(valueSubscribed, 1)
    unsubscribe()
    observer.setState((state) => {
      state.value = 2
    })
    assert.strictEqual(valueSubscribed, 1)
    assert.strictEqual(observer.initialState.value, 0)
  })
})
