/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Step } from '@data-wrangling-components/core'
import { DialogConfirm } from '@essex-js-toolkit/themed-components'
import React, { memo } from 'react'
import styled from 'styled-components'
import {
	ColumnTransformModal,
	ColumnTransformModalProps,
	TableTransformModal,
	TableTransformModalProps,
	useDeleteConfirm,
} from '../../index.js'
import { StepsType } from '../../types.js'
import { StepsList } from '../index.js'
import { useManageSteps } from './hooks/index.js'

interface ManageStepsProps
	extends TableTransformModalProps,
		ColumnTransformModalProps {
	onDelete: ((args: any) => void) | undefined
	onSave: (step: Step<unknown>, index?: number | undefined) => void
	type?: StepsType
	onSelect?: (name: string) => void
	steps?: Step[]
}

export const ManageSteps: React.FC<ManageStepsProps> = memo(
	function ManageSteps(props) {
		const {
			onDelete,
			onSave,
			onSelect,
			store,
			steps,
			type = StepsType.Table,
			table,
			...rest
		} = props

		const {
			onDeleteClicked,
			toggleDeleteModalOpen,
			isDeleteModalOpen,
			onConfirmDelete,
		} = useDeleteConfirm(onDelete)

		const {
			step,
			onDuplicateClicked,
			onEditClicked,
			onCreate,
			onDismissTransformModal,
			showTransformModal,
			isTansformModalOpen,
		} = useManageSteps(store, type, onSave)

		return (
			<Container>
				<StepsList
					onDeleteClicked={onDeleteClicked}
					onSelect={onSelect}
					onEditClicked={onEditClicked}
					steps={steps}
					onDuplicateClicked={onDuplicateClicked}
					showModal={showTransformModal}
				/>

				{type === StepsType.Table && (
					<TableTransformModal
						step={step}
						onTransformRequested={onCreate}
						isOpen={isTansformModalOpen}
						store={store}
						onDismiss={onDismissTransformModal}
						{...rest}
					/>
				)}

				{type === StepsType.Column && table && (
					<ColumnTransformModal
						step={step}
						table={table}
						onTransformRequested={onCreate}
						isOpen={isTansformModalOpen}
						onDismiss={onDismissTransformModal}
						{...rest}
					/>
				)}

				{onDelete && (
					<DialogConfirm
						toggle={toggleDeleteModalOpen}
						title="Are you sure you want to delete this step?"
						subText={
							type === StepsType.Table
								? 'You will also lose any table transformations made after this step.'
								: ''
						}
						show={isDeleteModalOpen}
						onConfirm={onConfirmDelete}
					/>
				)}
			</Container>
		)
	},
)

const Container = styled.div``