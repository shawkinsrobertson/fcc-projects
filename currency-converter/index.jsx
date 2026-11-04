const { useState, useMemo } = React;

export function CurrencyConverter() {
const [amount, setAmount] = useState(0);
const [fromCur, setFromCur] = useState('USD');
const [toCur, setToCur] = useState('GBP');

const currencies = {
  "USD": 1,
  "EUR": 0.89,
  "GBP": 0.74,
  "JPY": 159.4,
  }

 const convertedCurrencies = useMemo(() => {
    const exchangeRate = currencies[fromCur];
    const amtUSD = amount / exchangeRate;
    
    return Object.keys(currencies).reduce((acc, curCode) => {
      acc[curCode] = amtUSD * currencies[curCode];
      return acc;
    }, {});
    }, [amount, fromCur]);


return (
  <div id="converter-card">
  <h2>Currency Converter</h2>
  <div className="inputs">
    <label id="amount">Amount
    <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)}/></label>
    <div className="currencies">
    <label>From
    <select value={fromCur} onChange={(e) => setFromCur(e.target.value)}>
    <option name="usd" value="USD">USD</option>
    <option name="eur" value="EUR">EUR</option>
    <option name="gbp" value="GBP">GBP</option>
    <option name="jpy" value="JPY">JPY</option>
    </select>
    </label>
    <label>To
    <select value={toCur} onChange={(e) => setToCur(e.target.value)}>
    <option name="usd" value="USD">USD</option>
    <option name="eur" value="EUR">EUR</option>
    <option name="gbp" value="GBP">GBP</option>
    <option name="jpy" value="JPY">JPY</option>
    </select></label>
    </div>
    </div>
    <div className="converted-amt">
    <p>{`${convertedCurrencies[toCur].toFixed(2)} ${toCur}`}</p>
    </div>
  </div>
)
}