/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { JoinStep, Step } from '@data-wrangling-components/core'
import ColumnTable from 'arquero/dist/types/table/column-table'

import React, { memo, useCallback, useMemo, useState } from 'react'
import styled from 'styled-components'
import { TableColumnDropdown, TableDropdown } from '..'
import {
	useHandleDropdownChange,
	useLoadTable,
	LeftAlignedRow,
} from '../../common'
import { StepComponentProps } from '../../types'

/**
 * Core inputs for join operations. This includes join and lookup.
 * Note that the left column is expected to be the regular step input,
 * and provided elsewhere.
 */
export const JoinInputs: React.FC<StepComponentProps> = memo(
	function JoinInputs({ step, store, onChange, input }) {
		const internal = useMemo(() => step as JoinStep, [step])

		const [leftTable, setLeftTable] = useState<ColumnTable | undefined>()
		useLoadTable(input || internal.input, store, setLeftTable)

		const [rightTable, setRightTable] = useState<ColumnTable | undefined>()
		useLoadTable(internal.args?.other, store, setRightTable)

		const leftColumn = useLeftColumn(internal)
		const rightColumn = useRightColumn(internal)

		const handleRightTableChange = useHandleDropdownChange(
			internal,
			'args.other',
			onChange,
		)

		// TODO: if only one column is chosen, arquero will use it for both tables
		// however, if that column doesn't exist in both, it will throw an error
		// provide some validation here for the user?
		const handleLeftColumnChange = useHandleLeftColumnChange(internal, onChange)
		const handleRightColumnChange = useHandleRightColumnChange(
			internal,
			onChange,
		)

		return (
			<Container>
				<LeftAlignedRow>
					<TableDropdown
						store={store}
						label={'Join table'}
						selectedKey={internal.args.other}
						onChange={handleRightTableChange}
					/>
				</LeftAlignedRow>
				<LeftAlignedRow>
					<TableColumnDropdown
						table={leftTable}
						required
						label={'Input join key'}
						selectedKey={leftColumn}
						onChange={handleLeftColumnChange}
					/>
					<TableColumnDropdown
						table={rightTable}
						label={'Join table key'}
						selectedKey={rightColumn}
						onChange={handleRightColumnChange}
					/>
				</LeftAlignedRow>
			</Container>
		)
	},
)

function useLeftColumn(step: JoinStep) {
	return useMemo(
		() =>
			step.args.on && step.args.on.length > 0 ? step.args.on[0] : undefined,
		[step],
	)
}

function useRightColumn(step: JoinStep) {
	return useMemo(
		() =>
			step.args.on && step.args.on.length > 1 ? step.args.on[1] : undefined,
		[step],
	)
}

function useHandleLeftColumnChange(
	step: JoinStep,
	onChange?: (step: Step) => void,
) {
	return useCallback(
		(e, opt) => {
			const on = step.args.on || []
			on[0] = opt.key
			onChange &&
				onChange({
					...step,
					args: {
						...step.args,
						on,
					},
				})
		},
		[step, onChange],
	)
}

function useHandleRightColumnChange(
	step: JoinStep,
	onChange?: (step: Step) => void,
) {
	return useCallback(
		(e, opt) => {
			const on = step.args.on
			if (on) {
				on[1] = opt.key
			}
			onChange &&
				onChange({
					...step,
					args: {
						...step.args,
						on,
					},
				})
		},
		[step, onChange],
	)
}
const Container = styled.div`
	display: flex;
	justify-content: flex-start;
	flex-wrap: wrap;
	align-content: flex-start;
`