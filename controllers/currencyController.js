const responseUtil = require('../utils/response');
const webScrapService = require('../services/webScrapService');


const currencyController = {
    getCurrencyRates: async (req,res,next)=>{
        try {
            const results = await webScrapService.getForex();
            return responseUtil.sendSuccess(res,{results})
        } catch (error) {
            next(error)
        }
    },

    // getCurrencyRates: async (req,res,next)=>{
    //     try {
    //         const results = await webScrapService.getForex();
    //         return responseUtil.sendSuccess(res,{results})
    //     } catch (error) {
    //         next(error)
    //     }
    // },

    computeRates: async (req,res,next)=>{
        try {
            const {fromCurr,toCurr, amount} = req.body;
            const results = await webScrapService.computeForex(fromCurr,toCurr, amount);
            return responseUtil.sendSuccess(res,{results})
        } catch (error) {
            next(error);
        }
    },
    getVat: async (req,res,next)=>{
        try {
            const results = await webScrapService.getWorldVat();
            return responseUtil.sendSuccess(res,{results})
        } catch (error) {
            next(error)
        }
    }
}

module.exports = currencyController;