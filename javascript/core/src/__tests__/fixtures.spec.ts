/* eslint-disable jest/expect-expect, jest/valid-title */
import arquero from 'arquero'
import type ColumnTable from 'arquero/dist/types/table/column-table'
import fs from 'fs'
import fsp from 'fs/promises'
import path, { dirname } from 'path'
import { fileURLToPath } from 'url'

import { createGraph } from '../engine/graph.js'
import { step } from '../steps/step.js'
import { createTableStore } from '../store/createTableStore.js'
import { container } from '../tables/container.js'
import type { TableContainer } from '../tables/types.js'

// Static data paths.
const __dirname = dirname(fileURLToPath(import.meta.url))
const FIXTURES_PATH = path.join(__dirname, '../../../../schema/fixtures')
const CATEGORIES_PATH = path.join(FIXTURES_PATH, 'cases')

/**
 * Create top-level describes for each test category (top-level folders)
 */
const inputTables = await readInputTables()
doDescribe(CATEGORIES_PATH)

function doDescribe(targetPath: string) {
	const entries = fs.readdirSync(targetPath)
	for (const entry of entries) {
		describe(entry, () => {
			const entryPath = path.join(targetPath, entry)
			if (fs.existsSync(path.join(entryPath, 'workflow.json'))) {
				// If a workflow file exists, define a test case for it
				defineTestCase(targetPath, entry)
			} else {
				// Otherwise; keep describing down until we find test cases
				doDescribe(entryPath)
			}
		})
	}
}

function defineTestCase(parentPath: string, test: string) {
	const casePath = path.join(parentPath, test)
	const testName = test.split('_').join(' ')
	const expectedOutputTables = fs
		.readdirSync(casePath)
		.filter(f => f.endsWith('.csv'))
		.map(f => f.replace('.csv', ''))

	it(testName, async () => {
		// execute the dataflow
		const tableStore = createTableStore(inputTables)
		const workflowJson = await readJson(path.join(casePath, 'workflow.json'))
		createGraph(workflowJson.steps.map(step), tableStore)

		// check the output tables
		await Promise.all(
			expectedOutputTables.map(async o => {
				const expected = await readCsv(path.join(casePath, `${o}.csv`))
				await new Promise<void>(resolve => {
					const result = tableStore.get(o)
					if (result?.table) {
						compareTables(expected, result.table, o)
						resolve()
					} else {
						tableStore.onItemChange(o, actual => {
							if (actual?.table) {
								compareTables(expected, actual?.table, o)
								resolve()
							}
						})
					}
				})
			}),
		)
	})
}

async function readInputTables(): Promise<TableContainer[]> {
	const inputsPaths = path.join(FIXTURES_PATH, 'inputs')
	const entries = fs.readdirSync(inputsPaths)
	return Promise.all(
		entries.map(async entry => {
			const tableName = entry.replace('.csv', '')
			const dataPath = path.join(inputsPaths, entry)
			return container(tableName, await readCsv(dataPath))
		}),
	)
}

function readJson(dataPath: string): Promise<any> {
	return import(dataPath).then(res => res.default)
}

function readText(dataPath: string): Promise<string> {
	return fsp.readFile(dataPath, 'utf8')
}

function readCsv(dataPath: string): Promise<ColumnTable> {
	return readText(dataPath).then(txt => arquero.fromCSV(txt))
}

function compareTables(
	expected: ColumnTable,
	actual: ColumnTable | undefined,
	name: string,
) {
	if (!actual) {
		throw new Error(`expected output table "${name}" to exist`)
	}

	try {
		expect(actual.numRows()).toEqual(expected.numRows())
		expect(actual.numCols()).toEqual(expected.numCols())
		expect(actual.columnNames()).toEqual(expected.columnNames())

		for (let i = 0; i < actual.numRows(); ++i) {
			for (const column of expected.columnNames()) {
				const actualValue = actual.get(column, i)
				const expectedValue = expected.get(column, i)
				compareValue(expectedValue, actualValue)
			}
		}
	} catch (e) {
		console.log(
			`data mismatch; \n-----EXPECTED-----\n${expected.toCSV()}\n\n-----ACTUAL-----\n${actual.toCSV()}`,
		)
		throw e
	}
}

function compareValue(expected: any, actual: any): void {
	if (
		(typeof expected === 'string' && castable[typeof actual]) ||
		(typeof actual === 'string' && castable[typeof expected])
	) {
		// string-cast values to account for mixed-type column data (e.g. fold)
		expect('' + actual).toEqual('' + expected)
	} else if (typeof expected === 'string' && Array.isArray(actual)) {
		// Handle array output in actual table
		const parsedArray = expected.split(',')
		expect(parsedArray).toHaveLength(actual.length)
		for (let i = 0; i < parsedArray.length; ++i) {
			compareValue(parsedArray[i], actual[i])
		}
	} else if (expected == null && actual == undefined) {
		// don't sweat null vs undefined
	} else if (expected === false && actual == null) {
		// don't sweat nullish values for false
	} else if (expected.getTime != null) {
		const actualDate = new Date(actual)
		expect(expected.getTime()).toEqual(actualDate.getTime())
	} else {
		expect(actual).toEqual(expected)
	}
}

const castable: Record<string, boolean> = {
	boolean: true,
	number: true,
}
