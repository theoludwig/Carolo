import produce from 'immer'

type Listener<S> = (state: S) => void

type SetStateAction<S> = (state: S) => void

export abstract class Observer<S> {
  private _state: S
  private readonly _initialState: S
  private readonly _listeners: Array<Listener<S>>

  public constructor(initialState: S) {
    this._state = initialState
    this._initialState = initialState
    this._listeners = []
  }

  public get initialState(): S {
    return this._initialState
  }

  public get state(): S {
    return this._state
  }

  /**
   * @description Set the state of the observer.
   * @param action A function that receives the current state and can update it by mutating it.
   * @returns The new state.
   */
  public setState(action: SetStateAction<S>): S {
    this._state = produce(this._state, action)
    this.notifyListeners()
    return this._state
  }

  /**
   * Subscribe to the state changes.
   * @param listener A function that receives the current state.
   * @returns A function that can be called to unsubscribe.
   */
  public subscribe(listener: Listener<S>): () => void {
    this._listeners.push(listener)
    return () => {
      return this.unsubscribe(listener)
    }
  }

  public unsubscribe(listener: Listener<S>): void {
    const listenerIndex = this._listeners.indexOf(listener)
    const listenerFound = listenerIndex !== -1
    if (listenerFound) {
      this._listeners.splice(listenerIndex, 1)
    }
  }

  private notifyListeners(): void {
    for (const listener of this._listeners) {
      listener(this._state)
    }
  }
}
