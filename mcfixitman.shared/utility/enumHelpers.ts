
// https://stackoverflow.com/a/68533063/3253311
export function getEnumKeyByEnumValue<
    TEnumKey extends string,
    TEnumVal extends string | number
>(myEnum: { [key in TEnumKey]: TEnumVal }, enumValue: TEnumVal): string {
    const keys = (Object.keys(myEnum) as Array<TEnumKey>).filter(
        (x) => myEnum[x] === enumValue,
    );
    return keys.length > 0 ? keys[0] : '';
}