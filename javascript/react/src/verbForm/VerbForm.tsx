/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Step } from '@datashaper/core'
import type { IComboBoxOption, IDropdownOption } from '@fluentui/react'
import {
	Checkbox,
	ComboBox,
	Dropdown,
	Position,
	SpinButton,
	TextField,
} from '@fluentui/react'
import merge from 'lodash-es/merge.js'
import noop from 'lodash-es/noop.js'
import { Fragment, memo, useMemo } from 'react'
import { Case, Switch, When } from 'react-if'

import { Expando } from '../controls/Expando.js'
import {
	useCheckboxChangeHandler,
	useComboBoxChangeHandler,
	useComboBoxInputValueChangeHandler,
	useDropdownChangeHandler,
	useSpinButtonChangeHandler,
	useTextFieldChangeHandler,
} from '../hooks/index.js'
import { checkboxStyles, dropdownStyles } from '../styles.js'
import type { StepChangeFunction } from '../types.js'
import { useSortedInputs } from './VerbForm.hooks.js'
import { Container, InputsBlock, Row } from './VerbForm.styles.js'

export interface FormInputBase<
	T,
	OnChangeHandler = (step: Step<T>, optionKey: unknown | undefined) => void,
> {
	/**
	 * The user-friendly form label
	 */
	label: string

	/**
	 * The placeholder text to show
	 */
	placeholder?: string

	/**
	 * Whether this input is required
	 */
	required?: boolean

	/**
	 * Whether this input is presented
	 */
	if?: boolean

	/**
	 * Whether this input is disabled
	 */
	disabled?: boolean

	/**
	 * Whether this input should be sorted into a collapsible advanced section
	 */
	advanced?: boolean

	/**
	 * An optional React component to wrap the input with
	 */
	wrapper?: React.ComponentType

	styles?: any

	onChange: OnChangeHandler
}

export interface SingleChoiceFormInput<T> extends FormInputBase<T> {
	type: FormInputType.SingleChoice

	/**
	 * The form input options (required if type is enum)
	 */
	options?: IDropdownOption[]

	/**
	 * The form input value or selected key (if enum)
	 */
	current: number | string | undefined
}

export interface ComboBoxFormInput<T>
	extends FormInputBase<
		T,
		(
			step: Step<T>,
			option: string | number | undefined,
			value: string | undefined,
		) => void
	> {
	type: FormInputType.ComboBox

	/**
	 * The form input options (required if type is enum)
	 */
	options?: IComboBoxOption[]

	/**
	 * The form input value or selected key (if enum)
	 */
	current: string | undefined

	onInputValueChange?: (step: Step<T>, value: string | undefined) => void
}

export interface TextFormInput<T> extends FormInputBase<T> {
	type: FormInputType.Text

	/**
	 * The form input options (required if type is enum)
	 */
	options?: IDropdownOption[]

	/**
	 * The form input value or selected key (if enum)
	 */
	current: string | undefined
}

export interface MultiChoiceFormInput<T> extends FormInputBase<T> {
	type: FormInputType.MultiChoice

	/**
	 * The form input options (required if type is enum)
	 */
	options?: IDropdownOption[]

	/**
	 * The form input value or selected key (if enum)
	 */
	current?: string[] | undefined
}

export interface CheckboxFormInput<T> extends FormInputBase<T> {
	type: FormInputType.Checkbox

	/**
	 * The form input value or selected key (if enum)
	 */
	current: boolean | undefined
}

export interface NumberSpinnerFormInput<T> extends FormInputBase<T> {
	type: FormInputType.NumberSpinner
	min?: number
	max?: number
	step?: number
	/**
	 * The form input value or selected key (if enum)
	 */
	current: number | undefined
}

export type FormInput<T> =
	| SingleChoiceFormInput<T>
	| MultiChoiceFormInput<T>
	| NumberSpinnerFormInput<T>
	| CheckboxFormInput<T>
	| TextFormInput<T>
	| ComboBoxFormInput<T>

export enum FormInputType {
	SingleChoice = 'single_choice',
	MultiChoice = 'multi_choice',
	ComboBox = 'combobox',
	NumberSpinner = 'number_spinner',
	Checkbox = 'checkbox',
	Text = 'text',
}

/**
 * Generates a component for editing verbs based on declarative config.
 */
export const VerbForm: React.FC<{
	inputs: FormInput<any>[]
	step: Step<any>
	onChange?: StepChangeFunction<any>
}> = memo(function VerbInput({ inputs, step, onChange }) {
	// split the inputs into visible and expando based on the advanced flag
	const { regular, advanced, showAdvanced } = useSortedInputs(inputs)

	const regularRows = useMemo(
		() => mapInputs(regular, step, onChange),
		[regular, onChange, step],
	)
	const advancedRows = useMemo(
		() => mapInputs(advanced, step, onChange),
		[advanced, onChange, step],
	)

	return (
		<Container>
			<InputsBlock>{regularRows}</InputsBlock>
			<When condition={showAdvanced}>
				<Expando label={'Advanced'}>
					<InputsBlock>{advancedRows}</InputsBlock>
				</Expando>
			</When>
		</Container>
	)
})

function mapInputs(
	inputs: FormInput<any>[],
	step: Step<any>,
	onChange?: StepChangeFunction<any>,
) {
	return inputs.map((input, index) => (
		<Input
			input={input}
			step={step}
			onChange={onChange}
			key={`verb-${input.label}-${index}`}
		/>
	))
}

const Input: React.FC<{
	input: FormInput<unknown>
	step: Step<unknown>
	onChange?: StepChangeFunction<unknown>
}> = memo(function Input({ input, step, onChange }) {
	const condition = input.if ?? true
	const inputType: FormInputType = input.type

	return !condition ? null : (
		<Row>
			<Switch>
				<Case condition={inputType === FormInputType.SingleChoice}>
					<SingleChoiceInput
						input={input as SingleChoiceFormInput<unknown>}
						step={step}
						onChange={onChange}
					/>
				</Case>
				<Case condition={inputType === FormInputType.MultiChoice}>
					<MultiChoiceInput
						input={input as MultiChoiceFormInput<unknown>}
						step={step}
						onChange={onChange}
					/>
				</Case>
				<Case condition={inputType === FormInputType.NumberSpinner}>
					<NumberSpinnerInput
						input={input as NumberSpinnerFormInput<unknown>}
						step={step}
						onChange={onChange}
					/>
				</Case>
				<Case condition={inputType === FormInputType.Checkbox}>
					<CheckboxInput
						input={input as CheckboxFormInput<unknown>}
						step={step}
						onChange={onChange}
					/>
				</Case>
				<Case condition={inputType === FormInputType.Text}>
					<TextInput
						input={input as TextFormInput<unknown>}
						step={step}
						onChange={onChange}
					/>
				</Case>
				<Case condition={inputType === FormInputType.ComboBox}>
					<ComboBoxInput
						input={input as ComboBoxFormInput<unknown>}
						step={step}
						onChange={onChange}
					/>
				</Case>
			</Switch>
		</Row>
	)
})

const SingleChoiceInput: React.FC<{
	input: SingleChoiceFormInput<unknown>
	step: Step<unknown>
	onChange?: StepChangeFunction<unknown>
}> = memo(function SingleChoiceInput({
	step,
	input: {
		label,
		placeholder,
		current,
		required,
		options,
		disabled,
		wrapper: Wrapper = Fragment,
		onChange: updater,
	},
	onChange,
}) {
	const dropdownChangeHandler = useDropdownChangeHandler(
		step,
		updater,
		onChange,
	)
	return (
		<Wrapper>
			<Dropdown
				required={required}
				label={label}
				disabled={disabled}
				placeholder={placeholder}
				styles={dropdownStyles}
				selectedKey={current as number | string}
				options={options!}
				onChange={dropdownChangeHandler}
			/>
		</Wrapper>
	)
})

const MultiChoiceInput: React.FC<{
	input: MultiChoiceFormInput<unknown>
	step: Step<unknown>
	onChange?: StepChangeFunction<unknown>
}> = memo(function MultiChoiceInput({
	step,
	input: {
		label,
		placeholder,
		current,
		required,
		options,
		disabled,
		wrapper: Wrapper = Fragment,
		onChange: updater,
	},
	onChange,
}) {
	const dropdownChangeHandler = useDropdownChangeHandler(
		step,
		updater,
		onChange,
	)
	return (
		<Wrapper>
			<Dropdown
				required={required}
				label={label}
				placeholder={placeholder}
				styles={dropdownStyles}
				selectedKeys={current}
				options={options!}
				disabled={disabled}
				onChange={dropdownChangeHandler}
				multiSelect
			/>
		</Wrapper>
	)
})

const ComboBoxInput: React.FC<{
	input: ComboBoxFormInput<unknown>
	step: Step<unknown>
	onChange?: StepChangeFunction<unknown>
}> = memo(function ComboBoxInput({
	step,
	input: {
		label,
		placeholder,
		current,
		required,
		options,
		disabled,
		wrapper: Wrapper = Fragment,
		onChange: updater,
		onInputValueChange,
	},
	onChange,
}) {
	const changeHandler = useComboBoxChangeHandler(step, updater, onChange)
	const valueChangeHandler = useComboBoxInputValueChangeHandler(
		step,
		onInputValueChange || noop,
		onChange,
	)
	return (
		<Wrapper>
			<ComboBox
				required={required}
				label={label}
				placeholder={placeholder}
				styles={dropdownStyles}
				selectedKey={current as number | string}
				options={options!}
				disabled={disabled}
				onChange={changeHandler}
				onInputValueChange={valueChangeHandler}
			/>
		</Wrapper>
	)
})

const NumberSpinnerInput: React.FC<{
	input: NumberSpinnerFormInput<unknown>
	step: Step<unknown>
	onChange?: StepChangeFunction<unknown>
}> = memo(function NumberSpinnerInput({
	step,
	input: {
		label,
		placeholder,
		current,
		min,
		max,
		step: spinStep,
		disabled,
		wrapper: Wrapper = Fragment,
		onChange: updater,
		styles,
	},
	onChange,
}) {
	const changeHandler = useSpinButtonChangeHandler(step, updater, onChange)
	return (
		<Wrapper>
			<SpinButton
				label={label}
				labelPosition={Position.top}
				placeholder={placeholder}
				min={min}
				max={max}
				step={spinStep}
				value={current ? `${current}` : ''}
				onChange={changeHandler}
				disabled={disabled}
				styles={merge({}, dropdownStyles, styles)}
			/>
		</Wrapper>
	)
})

const CheckboxInput: React.FC<{
	input: CheckboxFormInput<unknown>
	step: Step<unknown>
	onChange?: StepChangeFunction<unknown>
}> = memo(function CheckboxInput({
	step,
	input: {
		label,
		required,
		current,
		wrapper: Wrapper = Fragment,
		onChange: updater,
		disabled,
		styles,
	},
	onChange,
}) {
	const changeHandler = useCheckboxChangeHandler(step, updater, onChange)
	return (
		<Wrapper>
			<Checkbox
				label={label}
				required={required}
				checked={current}
				onChange={changeHandler}
				disabled={disabled}
				styles={merge({}, checkboxStyles, styles)}
			/>
		</Wrapper>
	)
})

const TextInput: React.FC<{
	input: TextFormInput<unknown>
	step: Step<unknown>
	onChange?: StepChangeFunction<unknown>
}> = memo(function TextInput({
	step,
	input: {
		label,
		placeholder,
		required,
		current,
		wrapper: Wrapper = Fragment,
		onChange: updater,
		disabled,
		styles,
	},
	onChange,
}) {
	const changeHandler = useTextFieldChangeHandler(step, updater, onChange)
	return (
		<Wrapper>
			<TextField
				label={label}
				placeholder={placeholder}
				required={required}
				value={current}
				onChange={changeHandler}
				disabled={disabled}
				styles={merge({}, dropdownStyles, styles)}
			/>
		</Wrapper>
	)
})
