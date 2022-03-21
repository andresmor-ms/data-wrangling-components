/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { loadCSV, loadJSON } from 'arquero'

import { container } from '../../container.js'
import type { FetchArgs } from '../../index.js'
import { makeInputFunction, makeInputNode } from '../factories.js'

export const fetch = makeInputFunction(doFetch)
export const fetchNode = makeInputNode(doFetch)

async function doFetch(id: string, { url, delimiter, autoMax }: FetchArgs) {
	if (url.toLowerCase().endsWith('.json')) {
		const tableFromJSON = await loadJSON(url, {
			autoType: autoMax === undefined || autoMax <= 0 ? false : true,
		})
		return container(id, tableFromJSON)
	} else {
		const tableFromCSV = await loadCSV(url, {
			delimiter,
			autoMax: autoMax !== undefined ? autoMax : 0,
			autoType: autoMax === undefined || autoMax <= 0 ? false : true,
		})
		return container(id, tableFromCSV)
	}
}
