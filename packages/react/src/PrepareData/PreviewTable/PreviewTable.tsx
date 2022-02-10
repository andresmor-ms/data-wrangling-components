/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { TableContainer, TableMetadata } from '@data-wrangling-components/core'
import ColumnTable from 'arquero/dist/types/table/column-table'
import React, { memo } from 'react'
import styled from 'styled-components'
import { ArqueroDetailsList, ArqueroTableHeader, StatsColumnType } from '../../'

const statsColumnTypes = [
	StatsColumnType.Type,
	StatsColumnType.Min,
	StatsColumnType.Max,
	StatsColumnType.Distinct,
	StatsColumnType.Invalid,
]

export const PreviewTable: React.FC<{
	table?: TableContainer
	selectedMetadata?: TableMetadata
}> = memo(function PreviewTable({ table, selectedMetadata }) {
	return (
		<>
			{table?.table ? (
				<Container>
					<ArqueroTableHeader
						name={table?.name}
						table={table?.table as ColumnTable}
					/>
					<ArqueroDetailsList
						isSortable
						compact
						showColumnBorders
						isHeadersFixed
						metadata={selectedMetadata}
						features={{
							smartHeaders: true,
							statsColumnTypes: statsColumnTypes,
						}}
						table={table?.table}
					/>
				</Container>
			) : (
				<PreviewText>Select a table to preview here</PreviewText>
			)}
		</>
	)
})

const Container = styled.div`
	height: 95%;
	overflow: auto;
	display: flex;
	flex-direction: column;
`

const PreviewText = styled.div`
	flex: 1;
	display: flex;
	justify-content: center;
	height: 24%;
	align-items: center;
	color: ${({ theme }) => theme.application().border().hex()};
`
