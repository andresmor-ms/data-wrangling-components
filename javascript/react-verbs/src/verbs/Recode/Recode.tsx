/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Step, RecodeArgs } from '@data-wrangling-components/core'
import { ColumnValueDropdown } from '@data-wrangling-components/react-controls'
import type { DataType, Value } from '@essex/arquero'
import { coerce } from '@essex/arquero'
import { NodeInput } from '@essex/dataflow'
import type { IDropdownOption } from '@fluentui/react'
import { ActionButton, Icon, IconButton, TextField } from '@fluentui/react'
import type ColumnTable from 'arquero/dist/types/table/column-table'
import { memo, useMemo } from 'react'
import styled from 'styled-components'

import { useColumnType, useLoadTable } from '../../common/index.js'
import type { StepComponentProps } from '../../types.js'
import {
	useColumnValues,
	useDisabled,
	useHandleAddButtonClick,
	useHandleRecodeChange,
	useRecodeDelete,
} from './hooks.js'

/**
 * Provides inputs for a RecodeStep.
 */
export const Recode: React.FC<StepComponentProps<RecodeArgs>> = memo(
	function Recode({ step, store, table, onChange, input }) {
		const tbl = useLoadTable(
			input || step.input[NodeInput.Source]?.node,
			table,
			store,
		)

		const values = useColumnValues(step, tbl)
		const dataType = useColumnType(tbl, step.args.column)

		const handleRecodeChange = useHandleRecodeChange(step, onChange)
		const handleRecodeDelete = useRecodeDelete(step, onChange)
		const handleButtonClick = useHandleAddButtonClick(step, values, onChange)

		const columnPairs = useRecodePairs(
			tbl,
			step,
			values,
			dataType,
			handleRecodeChange,
			handleRecodeDelete,
		)

		const disabled = useDisabled(step, values)

		return (
			<Container>
				{columnPairs}
				<ActionButton
					onClick={handleButtonClick}
					iconProps={{ iconName: 'Add' }}
					disabled={disabled}
				>
					Add mapping
				</ActionButton>
			</Container>
		)
	},
)

function useRecodePairs(
	table: ColumnTable | undefined,
	step: Step<RecodeArgs>,
	values: Value[],
	dataType: DataType,
	onChange: (previous: Value, oldvalue: Value, newvalue: Value) => void,
	onDelete: (value: Value) => void,
) {
	return useMemo(() => {
		const { map } = step.args
		return Object.entries(map || {}).map((valuePair, index) => {
			// the old value will always come off the map as a string key
			// coerce it to the column type for proper comparison
			const [o, newvalue] = valuePair
			const oldvalue = coerce(o, dataType)
			const valueFilter = (value: Value) => {
				if (value === oldvalue) {
					return true
				}
				if (step.args.map && step.args.map[value]) {
					return false
				}
				return true
			}
			const handleSourceChange = (
				_e: React.FormEvent<HTMLDivElement>,
				opt?: IDropdownOption<any> | undefined,
			) => onChange(oldvalue, opt?.key || oldvalue, newvalue)
			const handleTextChange = (
				_e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
				newValue?: string,
			) => {
				// this does force the new value to match the old type, preventing mappings like 0 -> false
				const val = coerce(newValue, dataType)
				onChange(oldvalue, oldvalue, val)
			}
			const handleDeleteClick = () => onDelete(oldvalue)
			return (
				<ColumnPair key={`column-Recode-${oldvalue}-${index}`}>
					<ColumnValueDropdown
						column={step.args.column}
						table={table}
						values={values}
						filter={valueFilter}
						label={undefined}
						selectedKey={oldvalue}
						onChange={handleSourceChange}
						styles={{
							root: {
								width: 130,
							},
						}}
					/>
					<Icon
						iconName={'Forward'}
						styles={{ root: { marginLeft: 4, marginRight: 4 } }}
					/>
					<TextField
						placeholder={'New value'}
						value={newvalue}
						onChange={handleTextChange}
						styles={{ root: { width: 130 } }}
					/>
					<IconButton
						title={'Remove this Recode'}
						iconProps={{ iconName: 'Delete' }}
						onClick={handleDeleteClick}
					/>
				</ColumnPair>
			)
		})
	}, [table, step, values, dataType, onChange, onDelete])
}

const Container = styled.div`
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	gap: 12px;
`

const ColumnPair = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
`
