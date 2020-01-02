import { useState, useEffect, useRef } from "react"

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
