export const countCommission = (num: number) => {
    const commission = num >= 100 ? (num * 5) / 100 : (num >= 50 ? (num * 7) / 100 : (num * 10) / 100);
    return commission.toFixed(2);
};