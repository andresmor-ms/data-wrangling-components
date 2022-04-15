/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { DetailsListFeatures } from '@data-wrangling-components/arquero'
import { StatsColumnType } from '@data-wrangling-components/arquero'
import type { Specification } from '@data-wrangling-components/core'
import type { FileWithPath } from '@data-wrangling-components/utilities'
import {
	FileCollection,
	FileExtensions,
	FileMimeType,
	FileType,
} from '@data-wrangling-components/utilities'
import type { IDropdownOption, IDropdownStyles } from '@fluentui/react'
import { Checkbox, Dropdown } from '@fluentui/react'
import type ColumnTable from 'arquero/dist/types/table/column-table'
import { memo, useCallback, useState } from 'react'
import styled from 'styled-components'

import { FileDrop } from '~components/FileDrop'

import { useLoadSpecFile, useLoadTableFiles } from './DebugPage.hooks'
import { ExamplesDropdown } from './ExamplesDropdown'

const options: IDropdownOption[] = Object.values(StatsColumnType).map(o => {
	return { key: o, text: o } as IDropdownOption
})

const dropdownStyles: Partial<IDropdownStyles> = {
	dropdown: { marginTop: '4px' },
}
export interface ControlBarProps {
	selected?: Specification
	onSelectSpecification?: (spec: Specification | undefined) => void
	onLoadFiles?: (files: Map<string, ColumnTable>) => void
	features: DetailsListFeatures
	onFeaturesChange?: (features: DetailsListFeatures) => void
	compact: boolean
	onCompactChange: (auto: boolean) => void
	autoType: boolean
	onAutoTypeChange: (autoType: boolean) => void
}

export const ControlBar: React.FC<ControlBarProps> = memo(function ControlBar({
	selected,
	onSelectSpecification,
	onLoadFiles,
	features,
	onFeaturesChange,
	compact,
	onCompactChange,
	autoType,
	onAutoTypeChange,
}) {
	const loadFiles = useLoadTableFiles()
	const loadSpec = useLoadSpecFile()
	const [fileCollection, setFileCollection] = useState<FileCollection>(
		new FileCollection(),
	)

	const updateFileCollection = useCallback(
		async (files: FileWithPath[]) => {
			await fileCollection.add(files)
			setFileCollection(fileCollection)
		},
		[fileCollection, setFileCollection],
	)

	const handleDropCSV = useCallback(
		async (fc: FileCollection) => {
			const files = fc.list(FileType.csv)
			if (!files.length) return
			updateFileCollection(files)
			const loaded = await loadFiles(files)
			onLoadFiles && onLoadFiles(loaded)
		},
		[onLoadFiles, loadFiles, updateFileCollection],
	)
	const handleDropJSON = useCallback(
		async (fc: FileCollection) => {
			// ignore any after the first. I suppose we could auto-link the steps, but that's dangerous
			const files = fc.list(FileType.json)
			const first = files[0]
			if (!first) return
			updateFileCollection([first])
			const spec = await loadSpec(first)
			onSelectSpecification && onSelectSpecification(spec as any)
		},
		[onSelectSpecification, loadSpec, updateFileCollection],
	)
	const handleDropZip = useCallback(
		(fileCollection: FileCollection) => {
			setFileCollection(fileCollection)
			handleDropCSV(fileCollection)
			handleDropJSON(fileCollection)
		},
		[handleDropCSV, handleDropJSON, setFileCollection],
	)

	const handleSmartHeadersChange = useCallback(
		(e: any, checked?: boolean) =>
			onFeaturesChange &&
			onFeaturesChange({ ...features, smartHeaders: checked }),
		[features, onFeaturesChange],
	)

	const handleFeaturesChange = useCallback(
		(propName: string, checked?: boolean) =>
			onFeaturesChange &&
			onFeaturesChange({ ...features, [propName]: checked }),
		[features, onFeaturesChange],
	)

	const handleStatsColumnTypeChange = useCallback(
		(e: any, option: IDropdownOption | undefined) => {
			const selectedKeys = features.statsColumnTypes || []
			const selectedTypes = option?.selected
				? [...selectedKeys, option.key as StatsColumnType]
				: selectedKeys.filter(key => key !== option?.key)

			onFeaturesChange &&
				option &&
				onFeaturesChange({
					...features,
					statsColumnTypes: selectedTypes,
				})
		},
		[features, onFeaturesChange],
	)
	const handleArrayFeaturesChange = useCallback(
		(propName: string, checked?: boolean) => {
			onFeaturesChange &&
				onFeaturesChange({
					...features,
					[propName]: checked,
				})
		},

		[features, onFeaturesChange],
	)

	const handleCompactChange = useCallback(
		(_e: any, checked: boolean | undefined) =>
			onCompactChange(checked ?? false),
		[onCompactChange],
	)

	const handleAutoTypeChange = useCallback(
		(_e: any, checked: boolean | undefined) =>
			onAutoTypeChange(checked ?? false),
		[onAutoTypeChange],
	)
	return (
		<Container>
			<ExamplesContainer>
				<Examples>
					<ExamplesDropdown onChange={onSelectSpecification} />
				</Examples>
				<Description>
					<p>
						{selected
							? selected.description
							: 'Description for the selected example will show here'}
					</p>
				</Description>
			</ExamplesContainer>
			<ControlBlock>
				<Control>
					<Checkbox
						label={'Auto-type columns'}
						checked={autoType}
						onChange={handleAutoTypeChange}
					/>
				</Control>
				<Control>
					<Checkbox
						label={'Smart headers'}
						checked={features.smartHeaders}
						onChange={handleSmartHeadersChange}
					/>
				</Control>
				<Control>
					<Checkbox
						label={'Column header stats'}
						checked={features.statsColumnHeaders}
						disabled={features.smartHeaders}
						onChange={(e: any, checked) =>
							handleFeaturesChange('statsColumnHeaders', checked)
						}
					/>
					<Dropdown
						disabled={!features.statsColumnHeaders && !features.smartHeaders}
						onChange={handleStatsColumnTypeChange}
						multiSelect
						options={options}
						selectedKeys={features.statsColumnTypes}
						styles={dropdownStyles}
					/>
				</Control>
				<Control>
					<Checkbox
						label={'Column header histograms'}
						checked={features.histogramColumnHeaders}
						disabled={features.smartHeaders}
						onChange={(e: any, checked) =>
							handleFeaturesChange('histogramColumnHeaders', checked)
						}
					/>
				</Control>
			</ControlBlock>
			<ControlBlock>
				<Control>
					<Checkbox
						label={'Smart cells'}
						checked={features.smartCells}
						onChange={(e: any, checked) =>
							handleFeaturesChange('smartCells', checked)
						}
					/>
				</Control>
				<Control>
					<Checkbox
						label={'Number magnitude'}
						checked={features.showNumberMagnitude}
						disabled={features.smartCells}
						onChange={(e: any, checked) =>
							handleFeaturesChange('showNumberMagnitude', checked)
						}
					/>
				</Control>
				<Control>
					<Checkbox
						label={'Boolean symbol'}
						checked={features.showBooleanSymbol}
						disabled={features.smartCells}
						onChange={(e: any, checked) =>
							handleFeaturesChange('showBooleanSymbol', checked)
						}
					/>
				</Control>
				<Control>
					<Checkbox
						label={'Format date'}
						checked={features.showDateFormatted}
						disabled={features.smartCells}
						onChange={(e: any, checked) =>
							handleFeaturesChange('showDateFormatted', checked)
						}
					/>
				</Control>
			</ControlBlock>
			<ControlBlock>
				<Control>
					<Checkbox
						label={'Sparkbar'}
						checked={!!features.showSparkbar}
						disabled={features.smartCells}
						onChange={(e: any, checked) =>
							handleArrayFeaturesChange('showSparkbar', checked)
						}
					/>
				</Control>
				<Control>
					<Checkbox
						label={'Sparkline'}
						checked={!!features.showSparkline}
						disabled={features.smartCells}
						onChange={(e: any, checked) =>
							handleArrayFeaturesChange('showSparkline', checked)
						}
					/>
				</Control>
				<Control>
					<Checkbox
						label={'Categorical bar'}
						checked={!!features.showCategoricalBar}
						disabled={features.smartCells}
						onChange={(e: any, checked) =>
							handleArrayFeaturesChange('showCategoricalBar', checked)
						}
					/>
				</Control>
				<Control>
					<Checkbox
						label={'Multivalues on dropdown'}
						checked={!!features.showDropdown}
						disabled={features.smartCells}
						onChange={(e: any, checked) =>
							handleArrayFeaturesChange('showDropdown', checked)
						}
					/>
				</Control>
				<Control>
					<Checkbox
						label={'Compact rows'}
						checked={compact}
						onChange={handleCompactChange}
					/>
				</Control>
			</ControlBlock>
			<DropBlock>
				<Drop>
					<FileDrop onDrop={handleDropCSV} />
				</Drop>
				<Drop>
					<FileDrop
						onDrop={handleDropJSON}
						extensions={[FileExtensions.json]}
					/>
				</Drop>
				<Drop>
					<FileDrop onDrop={handleDropZip} extensions={[FileMimeType.zip]} />
				</Drop>
			</DropBlock>
		</Container>
	)
})

const Container = styled.div`
	display: flex;
	padding: 0 12px 12px;
	display: flex;
	justify-content: space-between;
	align-items: center;
	height: 170px;
	margin-bottom: 2rem;
`

const Examples = styled.div``
const ExamplesContainer = styled.div``

const Description = styled.div`
	width: 400px;
	flex-direction: column;
	justify-content: center;
`

const ControlBlock = styled.div`
	display: flex;
	flex-direction: column;
	gap: 8px;
`

const Control = styled.div`
	width: 200px;
`

const DropBlock = styled.div`
	display: flex;
	flex-direction: column;
	height: 100%;
	gap: 10px;
`

const Drop = styled.div`
	width: 160px;
	height: 50px;
`
