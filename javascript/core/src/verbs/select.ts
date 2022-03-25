/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { all } from 'arquero'
import type { TableStep } from './nodeFactories/index.js'
import type { InputColumnListArgs } from './types.js'
import { stepNodeFactory } from './nodeFactories/StepNode.js'

export type SelectArgs = InputColumnListArgs

export const selectStep: TableStep<SelectArgs> = (input, { columns = [] }) => {
	const expr = [columns] as any
	if (expr.length === 0) {
		expr.push(all())
	}
	return input.select(...expr)
}

export const select = stepNodeFactory(selectStep)
