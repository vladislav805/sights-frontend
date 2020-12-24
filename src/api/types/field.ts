export type FieldType = 'string' | 'number' | 'date' | 'boolean';

export interface IField {
    name: string;
    type: FieldType;
    title_ru: string;
    pattern: string;
}

export interface ISightField {
    fieldId: number;
    name: string;
    value: string;
    type: FieldType;
    title_ru: string;
}
