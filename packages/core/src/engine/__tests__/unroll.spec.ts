/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Step, StepType, Verb } from '../../types'
import { unroll } from '../verbs/unroll'
import { TestStore } from './TestStore'

describe('test for unroll verb', () => {
	test('unroll test', () => {
		const step: Step = {
			type: StepType.Verb,
			verb: Verb.Unroll,
			input: 'table1',
			output: 'output',
			args: {
				columns: ['ID'],
			},
		}

		const store = new TestStore()

		return unroll(step, store).then(result => {
			expect(result.numCols()).toBe(3)
			expect(result.numRows()).toBe(5)
		})
	})
})