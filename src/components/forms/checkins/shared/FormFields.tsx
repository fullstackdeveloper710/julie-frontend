import React from 'react';
import { Input } from '@/components/ui';
import {
    FIELD_ERROR_CLASS,
    FIELD_HELP_CLASS,
    FIELD_INPUT_CLASS,
    FIELD_LABEL_CLASS,
} from './styles';
import { NumberFieldOptions, SelectOption } from './types';

type CommonProps = {
    name: string;
    label: string;
    helpText?: string;
    error?: string;
    value: string;
    onChange: (e: React.ChangeEvent<any>) => void;
    onBlur: (e: React.FocusEvent<any>) => void;
};

type NumberFieldProps = CommonProps & {
    placeholder?: string;
    options?: NumberFieldOptions;
};

export function NumberField({
    name,
    label,
    placeholder,
    helpText,
    error,
    value,
    onChange,
    onBlur,
    options,
}: NumberFieldProps) {
    return (
        <Input
            type="number"
            name={name}
            label={label}
            placeholder={placeholder}
            helpText={helpText}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            error={error}
            min={options?.min}
            max={options?.max}
            step={options?.step}
            containerClassName="flex flex-col gap-1"
            labelClassName={FIELD_LABEL_CLASS}
            inputClassName={FIELD_INPUT_CLASS}
            errorClassName={FIELD_ERROR_CLASS}
            helpTextClassName={FIELD_HELP_CLASS}
        />
    );
}

type TextFieldProps = CommonProps & {
    placeholder?: string;
};

export function TextField({
    name,
    label,
    placeholder,
    helpText,
    error,
    value,
    onChange,
    onBlur,
}: TextFieldProps) {
    return (
        <Input
            type="text"
            name={name}
            label={label}
            placeholder={placeholder}
            helpText={helpText}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            error={error}
            containerClassName="flex flex-col gap-1"
            labelClassName={FIELD_LABEL_CLASS}
            inputClassName={FIELD_INPUT_CLASS}
            errorClassName={FIELD_ERROR_CLASS}
            helpTextClassName={FIELD_HELP_CLASS}
        />
    );
}

type SelectFieldProps = CommonProps & {
    options: SelectOption[];
    placeholder?: string;
};

export function SelectField({
    name,
    label,
    helpText,
    error,
    value,
    onChange,
    onBlur,
    options,
    placeholder = 'Select...',
}: SelectFieldProps) {
    return (
        <div className="flex flex-col gap-1">
            <label className={FIELD_LABEL_CLASS}>{label}</label>
            <select
                name={name}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                className={`${FIELD_INPUT_CLASS} transition-colors ${
                    error
                        ? 'border-red-500 focus:border-red-500'
                        : 'border-slate-700 focus:border-(--accent)'
                }`}
            >
                <option value="">{placeholder}</option>
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            {error && <p className={FIELD_ERROR_CLASS}>{error}</p>}
            {helpText && <p className={FIELD_HELP_CLASS}>{helpText}</p>}
        </div>
    );
}

type TextareaFieldProps = CommonProps & {
    placeholder?: string;
    rows?: number;
};

export function TextareaField({
    name,
    label,
    placeholder,
    helpText,
    error,
    value,
    onChange,
    onBlur,
    rows = 4,
}: TextareaFieldProps) {
    return (
        <div className="flex flex-col gap-1">
            <label className={FIELD_LABEL_CLASS}>{label}</label>
            <textarea
                name={name}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                rows={rows}
                placeholder={placeholder}
                className={`${FIELD_INPUT_CLASS} resize-none transition-colors ${
                    error
                        ? 'border-red-500 focus:border-red-500'
                        : 'border-slate-700 focus:border-(--accent)'
                }`}
            />
            {error && <p className={FIELD_ERROR_CLASS}>{error}</p>}
            {helpText && <p className={FIELD_HELP_CLASS}>{helpText}</p>}
        </div>
    );
}
