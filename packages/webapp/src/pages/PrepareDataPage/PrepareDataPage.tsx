/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { PrepareDataFull } from '@data-wrangling-components/react'
import React, { memo } from 'react'
import { useBusinessLogic } from './hooks'

export const PrepareDataPage: React.FC = memo(function PrepareDataPage() {
	const { setSteps, steps, tables } = useBusinessLogic()

	//fix: what if we have other components on the same page
	return (
		<PrepareDataFull tables={tables} steps={steps} onUpdateSteps={setSteps} />
	)
})
