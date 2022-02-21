/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { TableContainer } from '@data-wrangling-components/core'
import type { BaseFile } from '@data-wrangling-components/utilities'
import type ColumnTable from 'arquero/dist/types/table/column-table'
import { useMemo } from 'react'

export function useTables(
	files: BaseFile[],
	outputs: Map<string, ColumnTable>,
): TableContainer[] {
	return useMemo(() => {
		return files.map(f => {
			return {
				name: f.name,
				table: outputs.get(f.name),
			}
		})
	}, [files, outputs])
}