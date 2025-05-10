export const countCommission = (num: number): string => {
    // Nombre de blocs complets de 105 $
    const blocks = Math.floor(num / 105);
    // Reste après découpes
    const remainder = num % 105;

    // Si c'est un multiple exact de 105, on ne fait que 5 $ par bloc
    if (remainder === 0 && blocks > 0) {
        const commissionFromBlocks = blocks * 5;
        return commissionFromBlocks.toFixed(2);
    }

    // Sinon on calcule la commission sur la totalité du montant, selon paliers
    let rate = 0;
    if (num >= 100) {
        rate = 0.05;
    } else if (num >= 50) {
        rate = 0.07;
    } else if (num >= 20) {
        rate = 0.10;
    }
    const commission = num * rate;
    return commission.toFixed(2);
};



export const fixeAmount = (num: number) => {
    const  fixed = num.toFixed(3);
    return parseFloat(fixed);
};