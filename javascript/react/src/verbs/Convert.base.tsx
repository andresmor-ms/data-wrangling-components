/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { DataType } from '@datashaper/arquero'
import type { ConvertArgs } from '@datashaper/core'
import { ParseType } from '@datashaper/core'
import { num } from '@datashaper/utilities'
import { memo, useMemo } from 'react'

import { getDateFormatPatternOptions } from '../dateFormats.js'
import { getEnumDropdownOptions } from '../enums.js'
import type { ColumnMetadata } from '../hooks/useColumnsMetadata.js'
import type { StepComponentBaseProps } from '../types.js'
import type { FormInput } from '../verbForm/VerbForm.js'
import { FormInputType, VerbForm } from '../verbForm/VerbForm.js'
import { inputColumnList } from '../verbForm/VerbFormFactories.js'

/**
 * Provides inputs for a Convert step.
 */
export const ConvertBase: React.FC<
	StepComponentBaseProps<ConvertArgs> & {
		columns: string[]
		columnsMetadata: ColumnMetadata[]
	}
> = memo(function ConvertBase({ step, onChange, columns, columnsMetadata }) {
	const inputs = useMemo<FormInput<ConvertArgs>[]>(
		() => [
			inputColumnList(step, columns, 'Columns to convert'),
			{
				label: 'Data type',
				placeholder: 'Choose type',
				required: true,
				type: FormInputType.SingleChoice,
				current: step.args.type,
				options: getEnumDropdownOptions(ParseType),
				onChange: (s, opt) => (s.args.type = opt as ParseType),
			},
			{
				label: 'Base (radix)',
				if: step.args.type === ParseType.Integer,
				type: FormInputType.Text,
				current: step.args.radix ? `${step.args.radix}` : '',
				onChange: (s, opt) => (s.args.radix = num(opt as string)),
			},
			{
				label: 'Delimiter',
				if:
					step.args.type === ParseType.Array ||
					isInputColumnArray(columnsMetadata, step.args.columns),
				type: FormInputType.Text,
				current: step.args.delimiter ? `${step.args.delimiter}` : '',
				onChange: (s, opt) => (s.args.delimiter = opt as string),
			},
			{
				label: 'Date format pattern',
				if: step.args.type === ParseType.Date,
				type: FormInputType.ComboBox,
				options: getDateFormatPatternOptions(),
				placeholder: 'pattern',
				current: step.args.formatPattern
					? `${step.args.formatPattern}`
					: undefined,
				onChange: (s, opt, value) =>
					(s.args.formatPattern = opt ? (opt as string) : value),
				onInputValueChange: (s, value) =>
					(s.args.formatPattern = value ? value : '%Y-%m-%d'),
			},
		],
		[step, columns, columnsMetadata],
	)

	return <VerbForm inputs={inputs} step={step} onChange={onChange} />
})

function isInputColumnArray(
	columnsMetadata: ColumnMetadata[],
	columns: string[],
) {
	return columns.some(column => {
		const meta = columnsMetadata.find(meta => meta.columnName === column)
		return meta?.type === DataType.Array
	})
}
