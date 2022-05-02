/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { InputColumnListArgs } from '@data-wrangling-components/core'
import { memo, useMemo } from 'react'
import { FormInput, VerbForm } from '../../common/VerbForm.jsx'
import { inputColumnList } from '../../common/VerbFormFactories.js'
import type { StepComponentBaseProps } from '../../types.js'

/**
 * Provides inputs for a ColumnListOperation step.
 */
export const ColumnListOperationBase: React.FC<
	StepComponentBaseProps<InputColumnListArgs> & {
		columns: string[]
	}
> = memo(function ColumnListOperationBase({ columns, step, onChange }) {
	const inputs = useMemo<FormInput<InputColumnListArgs>[]>(
		() => [inputColumnList(step, columns)],
		[],
	)
	return <VerbForm inputs={inputs} step={step} onChange={onChange} />
})
