/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { table } from 'arquero'
import type ColumnTable from 'arquero/dist/types/table/column-table'
import { from } from 'rxjs'

import { DefaultStore } from '../../store/DefaultStore.js'
import type { TableContainer } from '../../tables/types.js'

/**
 * This is a store implementation pre-loaded with test tables to ease setup.
 */
export class TestStore extends DefaultStore<TableContainer> {
	constructor(private _defaultTableName: string = 'table1') {
		super(c => c.table?.print())
		const table1 = table({
			ID: [1, 2, 3, 4, 5],
			name: ['A', 'B', 'C', 'D', 'E'],
			count: [10, 20, 30, 40, 50],
		})
		const table2 = table({
			ID: [6],
			name: ['F'],
			count: [60],
		})
		const table3 = table({
			ID: [1, 1, 2, 4, 4, 4],
			item: ['bed', 'pillow', 'sofa', 'sofa', 'chair', 'stool'],
		})
		const table4 = table({
			ID: [1, 1, 2, 4, 4, 4],
			item: ['bed', 'pillow', 'sofa', 'sofa', 'chair', 'stool'],
			quantity: [45, 78, 100, 89, 50, 45],
		})

		const table5 = table({
			ID: [1, 1, 2, 4, 4, 4],
			item: ['bed', null, 'sofa', 'sofa', 'chair', null],
			quantity: [45, 78, 100, 89, 50, 45],
		})

		const table6 = table({
			ID: [1, 2, 3, 4, 5, 6],
			FY20: [10000, 56000, 45000, 5000, 8900, 90000],
			FY21: [5000, 4000, 45000, 6000, 9000, 78000],
		})

		const table7 = table({
			ID: [1, 2, 3, 4, 5],
			item: ['bed', 'pillow', 'sofa', 'chair', 'stool'],
			quantity: [45, 78, 100, 89, 50],
			totalSale: [54000, 7800, 230000, 20470, 5000],
		})

		const table8 = table({
			ID: [4, 5, 6, 7, 8],
			name: ['D', 'E', 'F', 'G', 'H'],
			count: [80, 90, 100, 110, 120],
		})

		const table9 = table({
			count: [
				10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160,
				170, 180, 190, 200,
			],
		})

		const table10 = table({
			x: ['A', 'B', 'A'],
			y: [1, 2, 1],
			z: [4, 5, 4],
		})

		const table11 = table({
			x: ['A', 'B', 'A'],
			y: [1, undefined, 1],
			z: [4, 5, 4],
		})

		const table12 = table({
			ID: [1, 2, 3, 4, 5],
			item: ['bed', 'pillow', null, 'chair', 'stool'],
			quantity: [45, undefined, 100, 89, 50],
			totalSale: [54000, 7800, 230000, 20470, 5000],
		})

		const table13 = table({
			ID: [1, 2, 3, 4, 5],
			name: ['A', 'B', 'C', 'D', 'E'],
			description: ['XX', 'XT', 'QW', 'RE', 'FG'],
		})

		const table14 = table({
			x: ['A', 'B', 'A'],
			y: [1, undefined, 1],
			z: [true, false, false],
		})

		const table15 = table({
			x: ['A', 'B', 'A'],
			y: [null, true, false],
			z: [true, false, true],
		})

		const table16 = table({
			key: ['A', 'B', 'C'],
			value: [1, 2, 3],
		})

		const table17 = table({
			type: [1, 1, 1, 2, 2],
			name: ['A', 'A', 'B', 'A', 'B'],
			count: [1, 2, 3, 4, 5],
		})

		const table18 = table({
			A: [1, 3, 10],
			B: [2, 4, 20],
			C: [3, 5, 30],
		})

		const table19 = table({
			int: ['1', '-12', '40098', 'F98'],
			int_hex: ['0x000000', '0xffffff', '0x0000ff', '0xkl0922'],
			date: [
				'2021-04-13',
				'2001-08-18T00:00:00Z',
				'1998-01-12T04:38:00Z',
				'date',
			],
			decimal: ['1.232', '39488.45', '0.9989', 'g19.2'],
			boolean: ['true', 'false', 'hi', ''],
		})

		// matrix of binary combinations for testing boolean logic
		const table20 = table({
			A: [1, 1, 1, 0],
			B: [1, 1, 0, 0],
			C: [1, 0, 0, 0],
			D: [1, 0, 0, 0],
		})

		this.set('table1', from([{ id: 'table1', table: table1 }]))
		this.set('table2', from([{ id: 'table2', table: table2 }]))
		this.set('table3', from([{ id: 'table3', table: table3 }]))
		this.set('table4', from([{ id: 'table4', table: table4 }]))
		this.set('table5', from([{ id: 'table5', table: table5 }]))
		this.set('table6', from([{ id: 'table6', table: table6 }]))
		this.set('table7', from([{ id: 'table7', table: table7 }]))
		this.set('table8', from([{ id: 'table8', table: table8 }]))
		this.set('table9', from([{ id: 'table9', table: table9 }]))
		this.set('table10', from([{ id: 'table10', table: table10 }]))
		this.set('table11', from([{ id: 'table11', table: table11 }]))
		this.set('table12', from([{ id: 'table12', table: table12 }]))
		this.set('table13', from([{ id: 'table13', table: table13 }]))
		this.set('table14', from([{ id: 'table14', table: table14 }]))
		this.set('table15', from([{ id: 'table15', table: table15 }]))
		this.set('table16', from([{ id: 'table16', table: table16 }]))
		this.set('table17', from([{ id: 'table17', table: table17 }]))
		this.set('table18', from([{ id: 'table18', table: table18 }]))
		this.set('table19', from([{ id: 'table19', table: table19 }]))
		this.set('table20', from([{ id: 'table20', table: table20 }]))
	}

	public table(name: string = this._defaultTableName): ColumnTable {
		return this.get(name)!.table!
	}
}
