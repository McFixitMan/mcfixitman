// See this (https://stackoverflow.com/a/13542669/3253311) post
// Adapted to typescript by https://stackoverflow.com/a/73660199/3253311

type ColorObject = Record<'r' | 'g' | 'b' | 'a', number>;
const singleColorSpace = 16 * 16; // 256
const blueSpace = singleColorSpace;
const greenSpace = blueSpace * singleColorSpace; // 65536
const redSpace = greenSpace * singleColorSpace; // 16777216
export const toColorObject = (rgbOrHex: string): ColorObject | null => {
    const { length } = rgbOrHex;
    const outputColor = {} as ColorObject;
    if (length > 9) {
        const rgbaColor = rgbOrHex.split(',');
        const [rgbaAndRed, green, blue, alpha] = rgbaColor;

        if (rgbaAndRed?.slice(0, 3) !== 'rgb') {
            throw new Error('Invalid color format');
        }
        const red = rgbaAndRed[3] === 'a' ? rgbaAndRed.slice(5) : rgbaAndRed.slice(4);

        const rgbaLength = rgbaColor.length;
        if (rgbaLength < 3 || rgbaLength > 4) {
            return null;
        }
        outputColor.r = parseInt(red, 10);
        outputColor.g = parseInt(green ?? '', 10);
        outputColor.b = parseInt(blue ?? '', 10);
        outputColor.a = alpha ? parseFloat(alpha) : -1;
    } else {
        if (length === 8 || length === 6 || length < 4) {
            throw new Error('Invalid hex color format');
        }
        let HexColor = rgbOrHex;
        if (length < 6) {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            HexColor = `#${rgbOrHex[1]}${rgbOrHex[1]}${rgbOrHex[2]}${rgbOrHex[2]}${rgbOrHex[3]}${rgbOrHex[3]}${length > 4 ? rgbOrHex[4]! + rgbOrHex[4] : ''}`;
        }
        if (length === 9 || length === 5) {
            const hexRed = parseInt(HexColor.slice(1, 3), 16);
            outputColor.r = hexRed;

            const hexGreen = parseInt(HexColor.slice(3, 5), 16);
            outputColor.g = hexGreen;

            const hexBlue = parseInt(HexColor.slice(5, 7), 16);
            outputColor.b = hexBlue;

            const hexAlpha = parseInt(HexColor.slice(7, 9), 16);
            outputColor.a = Math.round((hexAlpha / 255) * 100) / 100;
        } else {
            const hexRed = parseInt(HexColor.slice(1, 3), 16);
            outputColor.r = hexRed;

            const hexGreen = parseInt(HexColor.slice(3, 5), 16);
            outputColor.g = hexGreen;

            const hexBlue = parseInt(HexColor.slice(5, 7), 16);
            outputColor.b = hexBlue;

            outputColor.a = -1;
        }
    }
    return outputColor;
};

const black: ColorObject = { r: 0, g: 0, b: 0, a: -1 };
const white: ColorObject = { r: 255, g: 255, b: 255, a: -1 };
export const tint = (
    ratio: number,
    inputColor: string,
    { toColor, useLinear, reformat }: { toColor?: string; useLinear?: boolean; reformat?: boolean } = {}
): string => {
    const { round } = Math;
    const clampedRatio = Math.min(Math.max(ratio, -1), 1);
    if (ratio < -1 || ratio > 1) {
        // eslint-disable-next-line no-console
        console.info(`Ratio should be between -1 and 1 and it is ${ratio}. It will be clamped to ${clampedRatio}`);
    }
    let baseColor = inputColor;
    if (inputColor[0] !== 'r' && inputColor[0] !== '#') {
        baseColor = '#000';
        // eslint-disable-next-line no-console
        console.info(
            `Invalid input color format. "${inputColor}" should be rgb(a) or hex. It will fallback to "${baseColor}"`
        );
    }
    let isRGBformat = baseColor.length > 9 || baseColor.includes('rgb(');
    isRGBformat = reformat ? !isRGBformat : isRGBformat;

    if (toColor) {
        const isToColorRgbFormat = (toColor && toColor?.length > 9) || toColor?.includes('rgb(');
        isRGBformat = reformat ? !isToColorRgbFormat : isToColorRgbFormat;
    }
    const formattedBaseColor = toColorObject(baseColor);



    const isNegativeRatio = clampedRatio < 0;
    const toColorDefault = isNegativeRatio ? black : white;
    const formattedToColor = toColor && !reformat ? toColorObject(toColor) : toColorDefault;
    const toColorRatio = Math.abs(clampedRatio);
    const baseRatio = 1 - toColorRatio;

    if (!formattedBaseColor || !formattedToColor) {
        return inputColor;
    }

    const outputColor = {} as ColorObject;
    if (useLinear) {
        outputColor.r = round(baseRatio * formattedBaseColor.r + toColorRatio * formattedToColor.r);
        outputColor.g = round(baseRatio * formattedBaseColor.g + toColorRatio * formattedToColor.g);
        outputColor.b = round(baseRatio * formattedBaseColor.b + toColorRatio * formattedToColor.b);
    } else {
        outputColor.r = round((baseRatio * formattedBaseColor.r ** 2 + toColorRatio * formattedToColor.r ** 2) ** 0.5);
        outputColor.g = round((baseRatio * formattedBaseColor.g ** 2 + toColorRatio * formattedToColor.g ** 2) ** 0.5);
        outputColor.b = round((baseRatio * formattedBaseColor.b ** 2 + toColorRatio * formattedToColor.b ** 2) ** 0.5);
    }

    const blendedAlpha = formattedBaseColor.a * baseRatio + formattedToColor.a * toColorRatio;

    outputColor.a = formattedToColor.a < 0 ? formattedBaseColor.a : blendedAlpha;

    const hasAlpha = formattedBaseColor.a >= 0 || formattedToColor.a >= 0;
    if (isRGBformat) {
        return `rgb${hasAlpha ? 'a' : ''}(${outputColor.r},${outputColor.g},${outputColor.b}${hasAlpha ? `,${round(outputColor.a * 1000) / 1000}` : ''})`;
    }
    return `#${(
        outputColor.r * redSpace +
        outputColor.g * greenSpace +
        outputColor.b * blueSpace +
        (hasAlpha ? round(outputColor.a * 255) : 0)
    )
        .toString(16)
        // If no Alpha, we remove the last 2 hex digits
        .slice(0, hasAlpha ? undefined : -2)}`;
};

export const HexTransparency = {
    100: 'FF',
    99: 'FC',
    98: 'FA',
    97: 'F7',
    96: 'F5',
    95: 'F2',
    94: 'F0',
    93: 'ED',
    92: 'EB',
    91: 'E8',
    90: 'E6',
    89: 'E3',
    88: 'E0',
    87: 'DE',
    86: 'DB',
    85: 'D9',
    84: 'D6',
    83: 'D4',
    82: 'D1',
    81: 'CF',
    80: 'CC',
    79: 'C9',
    78: 'C7',
    77: 'C4',
    76: 'C2',
    75: 'BF',
    74: 'BD',
    73: 'BA',
    72: 'B8',
    71: 'B5',
    70: 'B3',
    69: 'B0',
    68: 'AD',
    67: 'AB',
    66: 'A8',
    65: 'A6',
    64: 'A3',
    63: 'A1',
    62: '9E',
    61: '9C',
    60: '99',
    59: '96',
    58: '94',
    57: '91',
    56: '8F',
    55: '8C',
    54: '8A',
    53: '87',
    52: '85',
    51: '82',
    50: '80',
    49: '7D',
    48: '7A',
    47: '78',
    46: '75',
    45: '73',
    44: '70',
    43: '6E',
    42: '6B',
    41: '69',
    40: '66',
    39: '63',
    38: '61',
    37: '5E',
    36: '5C',
    35: '59',
    34: '57',
    33: '54',
    32: '52',
    31: '4F',
    30: '4D',
    29: '4A',
    28: '47',
    27: '45',
    26: '42',
    25: '40',
    24: '3D',
    23: '3B',
    22: '38',
    21: '36',
    20: '33',
    19: '30',
    18: '2E',
    17: '2B',
    16: '29',
    15: '26',
    14: '24',
    13: '21',
    12: '1F',
    11: '1C',
    10: '1A',
    9: '17',
    8: '14',
    7: '12',
    6: '0F',
    5: '0D',
    4: '0A',
    3: '08',
    2: '05',
    1: '03',
    0: '00',
};