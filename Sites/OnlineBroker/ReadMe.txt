CREATE TABLE crypto_data (
    id INT AUTO_INCREMENT PRIMARY KEY, -- Unique identifier for each row
    currency_id VARCHAR(50) NOT NULL,  -- Cryptocurrency identifier (e.g., 'bitcoin', 'ethereum')
    timestamp DATETIME NOT NULL,       -- Time of the data
    price DECIMAL(18, 8) NOT NULL      -- Price of the cryptocurrency
);

DELETE FROM crypto_data;
ALTER TABLE crypto_data AUTO_INCREMENT = 1;

async function initializeDatabase(currencyName) {
    
    // Calculate the timestamps for one year back from today
    const now = Math.floor(Date.now() / 1000); // Current timestamp in seconds
    const oneYearAgo = now - (365 * 24 * 60 * 60); // One year back in seconds

    // Fetch Data
    const url = `https://api.coingecko.com/api/v3/coins/${currencyName}/market_chart/range?vs_currency=usd&from=${oneYearAgo}&to=${now}`;

    const response = await fetch(url);
    const data = await response.json();

    // Build the query
    let baseQuery = "INSERT INTO crypto_data (name, timestamp, price) VALUES ";
    data.prices.forEach((priceData, index) => {
        const timestamp = new Date(priceData[0]).toISOString().slice(0, 19).replace('T', ' ');
        const price = priceData[1].toFixed(2);
        baseQuery += `('${currencyName}', '${timestamp}', ${price})`;
        if (index < data.prices.length - 1) baseQuery += ", ";
    });

    // Send Insert Query
    console.log("Final Query:\n", baseQuery);
    await fetch('https://sawusdomain.com/Sites/OnlineBroker/key.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: baseQuery }),
    });
}

let coinsArray = ["bitcoin", "ethereum", "dogecoin"];

async function initializeAllDatabases() {

    for (let i = 0; i < coinsArray.length; i++) {

        await initializeDatabase(coinsArray[i]);

        console.log(`Initialized database for ${coinsArray[i]}. Waiting 1 minute...`);

        await new Promise(resolve => setTimeout(resolve, 60000)); // Wait 60,000ms = 1 minute
    }
}

initializeAllDatabases();
