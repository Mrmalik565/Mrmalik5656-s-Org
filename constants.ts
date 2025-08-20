import { ButtonType } from './types';
import type { CalculatorButton, ConversionConfig } from './types';

export const SECRET_CODE = '7777';

export const basicCalculatorButtons: CalculatorButton[] = [
  { label: 'C', type: ButtonType.FUNCTION },
  { label: '+/-', type: ButtonType.FUNCTION },
  { label: '%', type: ButtonType.FUNCTION },
  { label: '÷', type: ButtonType.OPERATOR },
  { label: '7', type: ButtonType.NUMBER },
  { label: '8', type: ButtonType.NUMBER },
  { label: '9', type: ButtonType.NUMBER },
  { label: '×', type: ButtonType.OPERATOR },
  { label: '4', type: ButtonType.NUMBER },
  { label: '5', type: ButtonType.NUMBER },
  { label: '6', type: ButtonType.NUMBER },
  { label: '-', type: ButtonType.OPERATOR },
  { label: '1', type: ButtonType.NUMBER },
  { label: '2', type: ButtonType.NUMBER },
  { label: '3', type: ButtonType.NUMBER },
  { label: '+', type: ButtonType.OPERATOR },
  { label: '0', type: ButtonType.NUMBER, gridClass: 'col-span-2' },
  { label: '.', type: ButtonType.NUMBER },
  { label: '=', type: ButtonType.EQUALS },
];

export const scientificCalculatorButtons: CalculatorButton[] = [
  { label: 'Rad', type: ButtonType.SCIENTIFIC },
  { label: '√', type: ButtonType.SCIENTIFIC },
  { label: 'xʸ', type: ButtonType.SCIENTIFIC },
  { label: '(', type: ButtonType.SCIENTIFIC },
  { label: ')', type: ButtonType.SCIENTIFIC },
  { label: 'sin', type: ButtonType.SCIENTIFIC },
  { label: 'cos', type: ButtonType.SCIENTIFIC },
  { label: 'tan', type: ButtonType.SCIENTIFIC },
  { label: 'log', type: ButtonType.SCIENTIFIC },
  { label: 'ln', type: ButtonType.SCIENTIFIC },
  { label: 'π', type: ButtonType.NUMBER },
  { label: 'e', type: ButtonType.NUMBER },
  { label: 'C', type: ButtonType.FUNCTION },
  { label: '+/-', type: ButtonType.FUNCTION },
  { label: '%', type: ButtonType.FUNCTION },
  { label: '7', type: ButtonType.NUMBER },
  { label: '8', type: ButtonType.NUMBER },
  { label: '9', type: ButtonType.NUMBER },
  { label: '÷', type: ButtonType.OPERATOR },
  { label: '×', type: ButtonType.OPERATOR },
  { label: '4', type: ButtonType.NUMBER },
  { label: '5', type: ButtonType.NUMBER },
  { label: '6', type: ButtonType.NUMBER },
  { label: '-', type: ButtonType.OPERATOR },
  { label: '+', type: ButtonType.OPERATOR },
  { label: '1', type: ButtonType.NUMBER },
  { label: '2', type: ButtonType.NUMBER },
  { label: '3', type: ButtonType.NUMBER },
  { label: '0', type: ButtonType.NUMBER, gridClass: 'col-span-2' },
  { label: '.', type: ButtonType.NUMBER },
  { label: '=', type: ButtonType.EQUALS, gridClass: 'col-span-2' },
];

export const unitConversionConfig: ConversionConfig = [
    {
        name: "Length",
        baseUnit: "meter",
        units: [
            { name: "Meter", symbol: "m", toBase: v => v, fromBase: v => v },
            { name: "Kilometer", symbol: "km", toBase: v => v * 1000, fromBase: v => v / 1000 },
            { name: "Centimeter", symbol: "cm", toBase: v => v / 100, fromBase: v => v * 100 },
            { name: "Millimeter", symbol: "mm", toBase: v => v / 1000, fromBase: v => v * 1000 },
            { name: "Mile", symbol: "mi", toBase: v => v * 1609.34, fromBase: v => v / 1609.34 },
            { name: "Yard", symbol: "yd", toBase: v => v * 0.9144, fromBase: v => v / 0.9144 },
            { name: "Foot", symbol: "ft", toBase: v => v * 0.3048, fromBase: v => v / 0.3048 },
            { name: "Inch", symbol: "in", toBase: v => v * 0.0254, fromBase: v => v / 0.0254 },
        ]
    },
    {
        name: "Area",
        baseUnit: "square meter",
        units: [
            { name: "Square Meter", symbol: "m²", toBase: v => v, fromBase: v => v },
            { name: "Square Km", symbol: "km²", toBase: v => v * 1e6, fromBase: v => v / 1e6 },
            { name: "Hectare", symbol: "ha", toBase: v => v * 10000, fromBase: v => v / 10000 },
            { name: "Acre", symbol: "ac", toBase: v => v * 4046.86, fromBase: v => v / 4046.86 },
            { name: "Square Foot", symbol: "ft²", toBase: v => v * 0.092903, fromBase: v => v / 0.092903 },
        ]
    },
    {
        name: "Volume",
        baseUnit: "liter",
        units: [
            { name: "Liter", symbol: "L", toBase: v => v, fromBase: v => v },
            { name: "Milliliter", symbol: "mL", toBase: v => v / 1000, fromBase: v => v * 1000 },
            { name: "Cubic Meter", symbol: "m³", toBase: v => v * 1000, fromBase: v => v / 1000 },
            { name: "Gallon (US)", symbol: "gal", toBase: v => v * 3.78541, fromBase: v => v / 3.78541 },
            { name: "Pint (US)", symbol: "pt", toBase: v => v * 0.473176, fromBase: v => v / 0.473176 },
        ]
    },
    {
        name: "Temperature",
        baseUnit: "celsius",
        units: [
            { name: "Celsius", symbol: "°C", toBase: v => v, fromBase: v => v },
            { name: "Fahrenheit", symbol: "°F", toBase: v => (v - 32) * 5/9, fromBase: v => (v * 9/5) + 32 },
            { name: "Kelvin", symbol: "K", toBase: v => v - 273.15, fromBase: v => v + 273.15 },
        ]
    },
    {
        name: "Weight",
        baseUnit: "kilogram",
        units: [
            { name: "Kilogram", symbol: "kg", toBase: v => v, fromBase: v => v },
            { name: "Gram", symbol: "g", toBase: v => v / 1000, fromBase: v => v * 1000 },
            { name: "Milligram", symbol: "mg", toBase: v => v / 1e+6, fromBase: v => v * 1e+6 },
            { name: "Pound", symbol: "lb", toBase: v => v * 0.453592, fromBase: v => v / 0.453592 },
            { name: "Ounce", symbol: "oz", toBase: v => v * 0.0283495, fromBase: v => v / 0.0283495 },
        ]
    },
    {
        name: "Speed",
        baseUnit: "m/s",
        units: [
            { name: "Meter/sec", symbol: "m/s", toBase: v => v, fromBase: v => v },
            { name: "Km/hour", symbol: "km/h", toBase: v => v / 3.6, fromBase: v => v * 3.6 },
            { name: "Mile/hour", symbol: "mph", toBase: v => v / 2.237, fromBase: v => v * 2.237 },
            { name: "Knot", symbol: "kn", toBase: v => v / 1.944, fromBase: v => v * 1.944 },
        ]
    },
    {
        name: "Time",
        baseUnit: "second",
        units: [
            { name: "Second", symbol: "s", toBase: v => v, fromBase: v => v },
            { name: "Minute", symbol: "min", toBase: v => v * 60, fromBase: v => v / 60 },
            { name: "Hour", symbol: "hr", toBase: v => v * 3600, fromBase: v => v / 3600 },
            { name: "Day", symbol: "d", toBase: v => v * 86400, fromBase: v => v / 86400 },
            { name: "Week", symbol: "wk", toBase: v => v * 604800, fromBase: v => v / 604800 },
        ]
    },
    {
        name: "Data Storage",
        baseUnit: "byte",
        units: [
            { name: "Byte", symbol: "B", toBase: v => v, fromBase: v => v },
            { name: "Kilobyte", symbol: "KB", toBase: v => v * 1024, fromBase: v => v / 1024 },
            { name: "Megabyte", symbol: "MB", toBase: v => v * 1024**2, fromBase: v => v / 1024**2 },
            { name: "Gigabyte", symbol: "GB", toBase: v => v * 1024**3, fromBase: v => v / 1024**3 },
            { name: "Terabyte", symbol: "TB", toBase: v => v * 1024**4, fromBase: v => v / 1024**4 },
        ]
    }
];