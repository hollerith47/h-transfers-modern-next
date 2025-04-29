export function formatAmount(amount:  number, currency: string){
    // console.log(currency)
    const locale = currency === "USD"
        ? "en-US"
        : currency === "EUR"
            ? "de-DE"
            : "ru-RU";

    return new Intl.NumberFormat(locale, {
        style: "currency",       // use currency style
        currency,                // USD, EUR or RUB
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    }).format(amount);
}