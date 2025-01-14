/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { TableContainer } from '@datashaper/arquero'
import type { GraphManager, Step, Workflow } from '@datashaper/core'
import { createGraphManager, readStep } from '@datashaper/core'
import isArray from 'lodash-es/isArray.js'
import { useCallback, useEffect, useMemo } from 'react'

export function useGraphManager(
	workflow?: Workflow | undefined,
	inputs?: TableContainer[],
): GraphManager {
	const manager = useMemo(
		() => createGraphManager(undefined, workflow),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[
			/* only create on first pass */
		],
	)

	// this effect should fire when a new workflow json is uploaded
	useEffect(
		function resetWorkflowWhenWorkflowChanges() {
			manager.reset(workflow)
		},
		[manager, workflow],
	)

	useEffect(
		function syncInputs() {
			inputs?.forEach(i => manager.addInput(i))
		},
		[manager, inputs],
	)
	return manager
}

/**
 * Returns a hook to generate a new table name based on the given input e.g.
 * "join" could result in "join 1" or "join 2" depending on how many collisions
 *  occur.
 * @param graph - the graph manager
 * @returns a safe output name to use
 */
export function useCreateTableName(
	graph: GraphManager,
): (name: string) => string {
	return useCallback(
		(name: string): string => graph.suggestOutputName(name),
		[graph],
	)
}

export function useFormattedColumnArg(): (
	stepArgs: unknown,
	newName?: string,
) => object {
	return useCallback((stepArgs: unknown, newName = 'New column') => {
		const args = stepArgs as Record<string, unknown>
		Object.keys(args).forEach(key => {
			if (key === 'to' && !isArray(args[key])) {
				args[key] = newName
			}
		})
		return args
	}, [])
}

export function useResetArgs(): (step: Step) => Step {
	return useCallback((step: Step) => {
		const template = readStep(step).args as Record<string, unknown>
		const args = step.args as Record<string, unknown>
		// rewrite through the proxy for each arg entry
		Object.keys(args).forEach(key => {
			args[key] = template[key]
		})
		return step
	}, [])
}
