/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { dropdownStyles } from '@data-wrangling-components/controls'
import type { ImputeStep } from '@data-wrangling-components/core'
import { TextField } from '@fluentui/react'
import { memo, useMemo } from 'react'
import styled from 'styled-components'

import {
	LeftAlignedColumn,
	useHandleTextfieldChange,
} from '../../common/index.js'
import type { StepComponentProps } from '../../types.js'
import { ColumnListInputs } from '../shared/index.js'

/**
 * Just the to/value inputs for an impute.
 * Input table is expected to be edited elsewhere and configured as the step input.
 */
export const Impute: React.FC<StepComponentProps> = memo(function Impute({
	step,
	store,
	onChange,
}) {
	const internal = useMemo(() => step as ImputeStep, [step])

	const handleValueChange = useHandleTextfieldChange(
		internal,
		'args.value',
		onChange,
	)

	return (
		<Container>
			<LeftAlignedColumn>
				<ColumnListInputs
					label={'Columns to impute'}
					step={step}
					store={store}
					onChange={onChange}
				/>
			</LeftAlignedColumn>
			<LeftAlignedColumn>
				<TextField
					required
					label={'Fill value'}
					value={internal.args.value && `${internal.args.value}`}
					placeholder={'text, number, or boolean'}
					styles={dropdownStyles}
					onChange={handleValueChange}
				/>
			</LeftAlignedColumn>
		</Container>
	)
})

const Container = styled.div`
	display: flex;
	justify-content: flex-start;
	flex-wrap: wrap;
	align-content: flex-start;
	flex-direction: column;
`
