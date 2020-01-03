import React, { useState, useEffect, useRef, Dispatch } from "react"

// export * from "./state-container"

export interface ContainerProviderProps<State = void> {
	initialState?: State
	children: React.ReactNode
}

export interface Container<Value, State = void> {
	Provider: React.ComponentType<ContainerProviderProps<State>>
	useContainer: () => Value
}

export function createContainer<Value, State = void>(
	useHook: (initialState?: State) => Value,
): Container<Value, State> {
	let Context = React.createContext<Value | null>(null)

	function Provider(props: ContainerProviderProps<State>) {
		let value = useHook(props.initialState)
		return <Context.Provider value={value}>{props.children}</Context.Provider>
	}

	function useContainer(): Value {
		let value = React.useContext(Context)
		if (value === null) {
			throw new Error("Component must be wrapped with <Container.Provider>")
		}
		return value
	}

	return { Provider, useContainer }
}

export function useContainer<Value, State = void>(
	container: Container<Value, State>,
): Value {
	return container.useContainer()
}

// export * from "./use-action-effect"

export function useActionEffect<T extends (...args: any[]) => void>(
	action: T,
	onInit = false,
): T {
	const [count, setCount] = useState(onInit ? 1 : 0)
	const actionArgsRef = useRef([] as any[])

	useEffect(() => {
		if (count > 0) {
			action(...actionArgsRef.current)
		}
	}, [count])

	const res = (...args: any[]) => {
		actionArgsRef.current = args
		setCount(prevCount => prevCount + 1)
	}

	return res as T
}

// export * from "./use-object-state"

export type SetPartialStateAction<S> =
	| Partial<S>
	| ((prevState: S) => Partial<S>)

export function useObjectState<S extends object>(
	initState: S,
): [S, Dispatch<SetPartialStateAction<S>>] {
	const [state, setState] = useState(initState || {})

	const setObjectState = (newState: SetPartialStateAction<S>) => {
		setState(prev => ({
			...prev,
			...(typeof newState == "function"
				? (newState as (prevState: S) => Partial<S>)(prev)
				: (newState as Partial<S>)),
		}))
	}

	return [state, setObjectState]
}
