/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { BooleanArgs } from '@data-wrangling-components/core'
import { BooleanOperator } from '@data-wrangling-components/core'
import { toggleListItem } from '@data-wrangling-components/primitives'
import {
	dropdownStyles,
	getEnumDropdownOptions,
} from '@data-wrangling-components/react-controls'
import { memo, useMemo } from 'react'
import type { StepComponentBaseProps } from '../../types.js'
import { FormInput, FormInputType, VerbInput } from '../../common/VerbInput.js'
import type { IDropdownOption } from '@fluentui/react'

/**
 * Inputs to combine column using boolean logic.
 */
export const BooleanLogicBase: React.FC<
	StepComponentBaseProps<BooleanArgs> & {
		options: IDropdownOption[]
	}
> = memo(function BooleanLogicBase({ step, onChange, options }) {
	const inputs = useMemo<FormInput<BooleanArgs>[]>(
		() => [
			{
				label: 'Columns',
				type: FormInputType.MultiChoice,
				styles: dropdownStyles,
				options,
				current: step.args.columns,
				condition: options.length > 0,
				onChange: (s, opt) =>
					(s.args.columns = toggleListItem(s.args.columns, opt as string)),
			},
			{
				label: 'Logical operator',
				type: FormInputType.SingleChoice,
				options: getEnumDropdownOptions(BooleanOperator),
				current: step.args.operator,
				onChange: (s, opt) => (s.args.operator = opt as BooleanOperator),
			},
		],
		[stop, options],
	)

	return <VerbInput step={step} onChange={onChange} inputs={inputs} />
})
