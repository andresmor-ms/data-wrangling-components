/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { SampleArgs } from '@data-wrangling-components/core'
import { Position, SpinButton } from '@fluentui/react'
import { format } from 'd3-format'
import { memo } from 'react'
import styled from 'styled-components'

import {
	LeftAlignedRow,
	useHandleSpinButtonChange,
} from '../../common/index.js'
import type { StepComponentProps } from '../../types.js'

const whole = format('d')

/**
 * Provides inputs for a Sample step.
 */
export const Sample: React.FC<StepComponentProps<SampleArgs>> = memo(
	function Sample({ step, onChange }) {
		const handleSizeChange = useHandleSpinButtonChange(
			step,
			'args.size',
			onChange,
		)

		const handlePercentChange = useHandleSpinButtonChange(
			step,
			'args.proportion',
			onChange,
			(val: string | undefined) => {
				if (val != null) {
					return +val / 100
				}
			},
		)

		return (
			<Container>
				<LeftAlignedRow>
					<SpinButton
						label={'Number of rows'}
						labelPosition={Position.top}
						min={0}
						step={1}
						disabled={!!step.args.proportion}
						value={step.args.size ? `${step.args.size}` : ''}
						styles={spinStyles}
						onChange={handleSizeChange}
					/>
					<Or>or</Or>
					<SpinButton
						label={'Row percentage'}
						labelPosition={Position.top}
						min={0}
						max={100}
						step={1}
						disabled={!!step.args.size}
						value={
							step.args.proportion ? `${whole(step.args.proportion * 100)}` : ''
						}
						styles={spinStyles}
						onChange={handlePercentChange}
					/>
				</LeftAlignedRow>
			</Container>
		)
	},
)

const Container = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
`

const Or = styled.div`
	margin-left: 8px;
	margin-right: 8px;
	height: 100%;
	display: flex;
	align-items: center;
	color: ${({ theme }) => theme.application().midContrast().hex()};
`

const spinStyles = {
	root: {
		width: 120,
	},
}