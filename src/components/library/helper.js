// import { GET_PAIR_ADDRESS, GET_TOKEN_NAME } from './bitqueries'

const url = "https://graphql.bitquery.io/";

const opts = (query) => ({
    method: "POST",
    headers: {
        "Content-Type": "application/json",
        "X-API-KEY": "BQYvhnv04csZHaprIBZNwtpRiDIwEIW9"
    },
    body: JSON.stringify({
        query
    })
});


export const getData = async (symbolInfo, customFrom, customTo, resolution, latestBar) => {
    // console.log(resolution, "===", symbolInfo.name)
    // console.log((new Date(customFrom * 1000)).toISOString(), "===", (new Date(customTo * 1000)).toISOString())

    var query = `
        {
          ethereum(network: ethereum) {
            dexTrades(
              options: {asc: "timeInterval.minute"}
              date: {since: "${(new Date(customFrom * 1000)).toISOString()}", till: "${(new Date(customTo * 1000)).toISOString()}"}
              exchangeName: {in: ["Uniswap", "Uniswap v2"]}
              baseCurrency: {is: "0x0f8bf37e79930c100f3d93ac0ee87f0d3e7a7fb0"}
              quoteCurrency: {is: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"}
            ) {
              timeInterval {
                minute(count: ${resolution})
              }
              baseCurrency {
                symbol
                address
              }
              baseAmount
              quoteCurrency {
                symbol
                address
              }
              quoteAmount
              trades: count
              tradeAmount(in: USD)
              maximum_price: quotePrice(calculate: maximum)
              minimum_price: quotePrice(calculate: minimum)
              open_price: minimum(of: block, get: quote_price)
              close_price: maximum(of: block, get: quote_price)
            }
          }
        }


    `
    // var query = `
    //     query {
    //         ethereum {
    //           dexTrades(
    //             options: {asc: "timeInterval.minute"}
    //             exchangeName: {in: ["Uniswap", "Uniswap v2"]}
    //             date: {since: "${(new Date(customFrom * 1000)).toISOString()}", till: "${(new Date(customTo * 1000)).toISOString()}"}
    //             baseCurrency: {is: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"}
    //             quoteCurrency: {is: "0x0f8bf37e79930c100f3d93ac0ee87f0d3e7a7fb0"}
    //           ) {
    //             timeInterval {
    //               minute(count: ${resolution})
    //             }
    //             quoteAmount
    //             tradeAmount(in: USD)
    //             maximum_price: quotePrice(calculate: maximum)
    //             minimum_price: quotePrice(calculate: minimum)
    //             open_price: minimum(of: block, get: quote_price)
    //             close_price: maximum(of: block, get: quote_price)
    //           }
    //         }
    //       }
    // `;


    var res = await fetch(url, opts(query))
    var data = await res.json()

    var bars = [];

    // console.log("init", data.data.ethereum.dexTrades);
    // if (!first) {
    //     console.log('CryptoCompare API error:')
    // }
    

    if (data.data.ethereum.dexTrades.length !== 0) {
        // var elements = [...data.data.ethereum.dexTrades];
        var elements = data.data.ethereum.dexTrades.map((el, k) => {
            var offset = el.tradeAmount / el.quoteAmount;
            var element = {
                time: el.timeInterval.minute,
                minimum_price: parseFloat(el.minimum_price) * offset,
                maximum_price: parseFloat(el.maximum_price) * offset,
                open_price: parseFloat(el.open_price) * offset,
                close_price: parseFloat(el.close_price) * offset,
                quoteAmount: parseFloat(el.baseAmount)
            }
            return element;
        })
        // console.log(elements)
        bars = elements.map((el, k) => {
            // var offset = el.tradeAmount / el.quoteAmount;
            if (k == 0) {
                return {
                    time: new Date(elements[0].time), //TradingView requires bar time in ms
                    low: parseFloat(elements[0].minimum_price),
                    high: parseFloat(elements[0].maximum_price),
                    open: parseFloat(elements[0].open_price),
                    close: parseFloat(elements[0].close_price),
                    volume: parseFloat(elements[0].quoteAmount) 
                }
            } else {
                return {
                    time: new Date(el.time), //TradingView requires bar time in ms
                    low: parseFloat(elements[k - 1].close_price) > parseFloat(el.close_price) ? (parseFloat(el.minimum_price) < parseFloat(el.close_price) ? parseFloat(el.minimum_price): parseFloat(el.close_price)): (parseFloat(el.minimum_price) < parseFloat(elements[k - 1].close_price) ? parseFloat(el.minimum_price): parseFloat(elements[k - 1].close_price)) ,
                    high: parseFloat(elements[k - 1].close_price) < parseFloat(el.close_price) ? (parseFloat(el.maximum_price) > parseFloat(el.close_price) ? parseFloat(el.maximum_price): parseFloat(el.close_price)): (parseFloat(el.maximum_price) > parseFloat(elements[k - 1].close_price) ? parseFloat(el.maximum_price): parseFloat(elements[k - 1].close_price)) ,
                    open: parseFloat(elements[k - 1].close_price),
                    close: parseFloat(el.close_price),
                    volume: parseFloat(el.quoteAmount) 
                }
            }
        })
    }

    // console.log(bars)

    return bars;
}
    