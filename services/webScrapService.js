const cheerio = require('cheerio');
const axios = require('axios');
const dollarRate = require('./../models/dollarRateModel');
const vatModel = require('./../models/vatModel');
const moment = require("moment");
const  scrapeVatData = async (html)=> {
    const $ = await cheerio.load(html);

    // Find the table containing VAT information (this may vary based on Wikipedia's structure)
    const vatTable = $('.wikitable');

    // Extract data from the table
    let vatData = [];

    vatTable.find('tr').slice(1).each((index, row) => {
        const data = {}
        const columns = $(row).find('td, th');
        data['country'] = columns.eq(0).text().split('[')[0].trim();
        data['vat'] = parseFloat(`${columns.eq(1).text().split('[')[0].trim()}`.split('%')[0].trim()) || null;
        
        vatData.push(data);
    });
    const results = JSON.stringify(vatData);
    console.log({ vatData: results });


   vatData.map(async(e,i)=>{
        const curr = await dollarRate.findOne({country:e.country});
        const vatItem = await vatModel.findOneAndReplace({country:e.country},{...e});
        if(curr != null){
            curr.vat = e.vatRate || null;
            curr.save();

            const { vat,op_rate,country,currency,code  } = curr;

            const vatItem = await vatModel.findOneAndReplace({country:e.country},{vat,op_rate,country,currency,code});

        }else{
            const vatItem = await vatModel.create(e);
        }
        if(i <= 10){
        console.log({curr})

        }


   });

    return vatData;
}
const webScrapData = {
    getForex: async () => {

        const url = 'https://treasury.un.org/operationalrates/xsqlExRates.php';

        const response = await axios.get(url);
        const html = response.data;

        const $ = cheerio.load(html);

        const tableData = [];

        $('table tr').each((index, element) => {
            const columns = $(element).find('td');
            const rowData = {
                country: $(columns[0]).text().trim(""),
                code: $(columns[1]).text().trim(""),
                currency: $(columns[2]).text().trim(""),
                op_rate: parseFloat(`${$(columns[3]).text().trim("")}`),
                effective_date: $(columns[4]).text().trim(""),

            }

            tableData.push(rowData);
        });
        // await dollarRate.deleteMany({});
        tableData.map(async (e, i) => {
            let filter = await dollarRate.findOne({ country: e.country }).then(async (docs) => {
                if (docs === null) {


                    if (e.currency != "" && e.country != "") {
                        e.createdAt = moment(Date.now()).format();
                        e.updatedAt = moment(Date.now()).format();
                        // console.log("Result found",docs,"e",e);
                        await dollarRate.create(e);

                    }
                } else {
                    e.updatedAt = moment(Date.now()).format();
                    if (i <= 5) {
                        console.log("docs.id", docs.id, "e", e);
                    }

                    await dollarRate.findByIdAndUpdate(docs.id, { ...e });

                }
            }).catch((err) => console.error(err));



        })

        return await dollarRate.find();


    },
    computeForex: async (fromCode, toCode, amt) => {
        const froRate = await dollarRate.findOne({ code: fromCode });
        const toRate = await dollarRate.findOne({ code: toCode });

        console.log({ fromCode, toCode, amt, froRate, toRate });

        let rst = NaN;
        if (froRate.op_rate != null && froRate.op_rate != 0 && froRate != null && toRate != null) {
            rst = (amt / froRate.op_rate) * toRate.op_rate
        }
        return rst;

    },
    getWorldVat: async () => {
        const url = 'https://en.wikipedia.org/wiki/Value-added_tax';
        let vatData = null;
        await axios.get(url)
            .then(response => {
                if (response.status === 200) {
                    vatData = scrapeVatData(response.data);
                    console.log(vatData);
                } else {
                    console.error(`Error: Unable to retrieve data. Status Code: ${response.status}`);
                }
            })
            .catch(error => {
                console.error(`Error: ${error.message}`);
            });

            return vatData;

      
    }
}

module.exports = webScrapData;