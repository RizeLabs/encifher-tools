const DECIMALS = 6;

export const parseAmount = (amount: string): number => {
    const subUnit = Number(amount) * (10 ** DECIMALS);
    return subUnit;
}