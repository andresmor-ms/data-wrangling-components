/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { all, not as arqueroNot } from 'arquero'
import ColumnTable from 'arquero/dist/types/table/column-table'
import { TableStore } from '../..'
import { SelectArgs, Step } from '../../types'

/**
 * Executes an arquero select.
 * @param step
 * @param store
 * @returns
 */
export async function select(
	step: Step,
	store: TableStore,
): Promise<ColumnTable> {
	const { input, args } = step
	const { columns = {}, not } = args as SelectArgs
	const inputTable = await store.get(input)
	const expr = Object.keys(columns) as any
	if (not) {
		expr.push(arqueroNot(not))
	}
	if (expr.length === 0) {
		expr.push(all())
	}
	return inputTable.select(...expr)
}