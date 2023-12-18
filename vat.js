const axios = require('axios');
const cheerio = require('cheerio');

const url = 'https://en.wikipedia.org/wiki/Value-added_tax';

axios.get(url)
  .then(response => {
    if (response.status === 200) {
      const vatData = scrapeVatData(response.data);
      console.log(vatData);
    } else {
      console.error(`Error: Unable to retrieve data. Status Code: ${response.status}`);
    }
  })
  .catch(error => {
    console.error(`Error: ${error.message}`);
  });

function scrapeVatData(html) {
  const $ = cheerio.load(html);

  // Find the table containing VAT information (this may vary based on Wikipedia's structure)
  const vatTable = $('.wikitable');

  // Extract data from the table
  let vatData = [];

  vatTable.find('tr').slice(1).each((index, row) => {
    const data = {}
    const columns = $(row).find('td, th');
    data['country'] = columns.eq(0).text().trim();
    data['vatRate'] = columns.eq(1).text().trim();
    vatData.push(data);
  });
  const results = JSON.stringify(vatData);
  console.log({vatData:results});

  return vatData;
}
