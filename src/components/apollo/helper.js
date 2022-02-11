import { client } from './client'
import {
  USER_HISTORY,
  ETH_PRICE,
  USER_POSITIONS
} from './queries'

export async function useUserSnapshots(account) {
  try {
    let skip = 0
    let allResults = []
    let found = false
    while (!found) {
      let result = await client.query({
        query: USER_HISTORY,
        variables: {
          skip: skip,
          user: account,
        },
        fetchPolicy: 'cache-first',
      })
      allResults = allResults.concat(result.data.liquidityPositionSnapshots)
      if (result.data.liquidityPositionSnapshots.length < 1000) {
        found = true
      } else {
        skip += 1000
      }
    }
    return allResults;
  } catch (e) {
    console.log(e)
  }
}


export function getMetricsForPositionWindow(positionT0, positionT1) {
  // positionT0 = formatPricesForEarlyTimestamps(positionT0)
  // positionT1 = formatPricesForEarlyTimestamps(positionT1)

  // calculate ownership at ends of window, for end of window we need original LP token balance / new total supply
  const t0Ownership = positionT0.liquidityTokenBalance / positionT0.liquidityTokenTotalSupply
  const t1Ownership = positionT0.liquidityTokenBalance / positionT1.liquidityTokenTotalSupply

  // get starting amounts of token0 and token1 deposited by LP
  const token0_amount_t0 = t0Ownership * positionT0.reserve0
  const token1_amount_t0 = t0Ownership * positionT0.reserve1

  // get current token values
  const token0_amount_t1 = t1Ownership * positionT1.reserve0
  const token1_amount_t1 = t1Ownership * positionT1.reserve1

  // calculate squares to find imp loss and fee differences
  const sqrK_t0 = Math.sqrt(token0_amount_t0 * token1_amount_t0)
  // eslint-disable-next-line eqeqeq
  const priceRatioT1 = positionT1.token0PriceUSD != 0 ? positionT1.token1PriceUSD / positionT1.token0PriceUSD : 0

  const token0_amount_no_fees = positionT1.token1PriceUSD && priceRatioT1 ? sqrK_t0 * Math.sqrt(priceRatioT1) : 0
  const token1_amount_no_fees =
    Number(positionT1.token1PriceUSD) && priceRatioT1 ? sqrK_t0 / Math.sqrt(priceRatioT1) : 0
  const no_fees_usd =
    token0_amount_no_fees * positionT1.token0PriceUSD + token1_amount_no_fees * positionT1.token1PriceUSD

  const difference_fees_token0 = token0_amount_t1 - token0_amount_no_fees
  const difference_fees_token1 = token1_amount_t1 - token1_amount_no_fees
  const difference_fees_usd =
    difference_fees_token0 * positionT1.token0PriceUSD + difference_fees_token1 * positionT1.token1PriceUSD

  // calculate USD value at t0 and t1 using initial token deposit amounts for asset return
  const assetValueT0 = token0_amount_t0 * positionT0.token0PriceUSD + token1_amount_t0 * positionT0.token1PriceUSD
  const assetValueT1 = token0_amount_t0 * positionT1.token0PriceUSD + token1_amount_t0 * positionT1.token1PriceUSD

  const imp_loss_usd = no_fees_usd - assetValueT1
  const uniswap_return = difference_fees_usd + imp_loss_usd

  // get net value change for combined data
  const netValueT0 = t0Ownership * positionT0.reserveUSD
  const netValueT1 = t1Ownership * positionT1.reserveUSD

  return {
    hodleReturn: assetValueT1 - assetValueT0,
    netReturn: netValueT1 - netValueT0,
    uniswapReturn: uniswap_return,
    impLoss: imp_loss_usd,
    fees: difference_fees_usd,
  }
}



export async function getETHPrice() {
  let result = await client.query({
    query: ETH_PRICE,
    fetchPolicy: 'cache-first',
  })
  return result;
}



export async function getLPReturnsOnPair(user, pair, ethPrice, snapshots) {
  // initialize values
  let hodlReturn = 0
  let netReturn = 0
  let uniswapReturn = 0
  let fees = 0

  // get data about the current position
  const currentPosition = {
    pair,
    liquidityTokenBalance: snapshots[snapshots.length - 1].liquidityTokenBalance,
    liquidityTokenTotalSupply: pair.totalSupply,
    reserve0: pair.reserve0,
    reserve1: pair.reserve1,
    reserveUSD: pair.reserveUSD,
    token0PriceUSD: pair.token0.derivedETH * ethPrice,
    token1PriceUSD: pair.token1.derivedETH * ethPrice,
  }

  for (const index in snapshots) {
    // get positions at both bounds of the window
    const positionT0 = snapshots[index]
    const positionT1 = parseInt(index) === snapshots.length - 1 ? currentPosition : snapshots[parseInt(index) + 1]

    const results = getMetricsForPositionWindow(positionT0, positionT1)
    hodlReturn = hodlReturn + results.hodleReturn
    netReturn = netReturn + results.netReturn
    uniswapReturn = uniswapReturn + results.uniswapReturn
    fees = fees + results.fees
  }

  return {
    hodl: {
      return: hodlReturn,
    },
    net: {
      return: netReturn,
    },
    uniswap: {
      return: uniswapReturn,
    },
    fees: {
      sum: fees,
    },
  }
}


export async function useUserPositions(account) {
  try {
    let ethPrice = (await getETHPrice()).data.bundles[0].ethPrice;
    let snapshots = await useUserSnapshots(account);
    // console.log("[returnData***]=>", ethPrice, snapshots)
    let result = await client.query({
      query: USER_POSITIONS,
      variables: {
        user: account,
        pair: "0xcc888f701a6f7a9100dd71064aff002f7ef898ae"
      },
      fetchPolicy: 'no-cache',
    })
    if (result.data.liquidityPositions && snapshots.length !== 0) {
      let position = result.data.liquidityPositions[0];
      let positionValue = (parseFloat(position.liquidityTokenBalance) / parseFloat(position.pair.totalSupply)) *
                position.pair.reserveUSD;
      let positionToken0 = (parseFloat(position.liquidityTokenBalance) / parseFloat(position.pair.totalSupply)) *
                position.pair.reserve0;
      let positionToken1 = (parseFloat(position.liquidityTokenBalance) / parseFloat(position.pair.totalSupply)) *
                position.pair.reserve1;
      let positionPercent = (parseFloat(position.liquidityTokenBalance) / parseFloat(position.pair.totalSupply)) * 100;
      const returnData = await getLPReturnsOnPair(account, position.pair, ethPrice, snapshots)
      return {
        fees: returnData.fees.sum,
        positionValue: positionValue,
        positionPercent: positionPercent,
        positionToken0: positionToken0,
        positionToken1: positionToken1
      }
    } else {
      return {
        fees: 0,
        positionValue: 0,
        positionPercent: 0,
        positionToken0: 0,
        positionToken1: 0
      }
    }
  } catch (e) {
    console.log(e)
  }
}