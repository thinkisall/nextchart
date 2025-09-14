import { BithumbTickerResponse, BithumbTickerData, CryptoPrice } from "../types";
import { getCryptoInfo } from "../crypto";
import { getExchangeInfo } from "../exchanges";

/**
 * 빗썸 API 서비스
 * 빗썸 데이터 패칭과 가공을 담당
 */
export class BithumbApiService {
  private static readonly API_URL = "https://api.bithumb.com/public/ticker/ALL_KRW";
  
  /**
   * 빗썸 API에서 데이터를 직접 패칭
   */
  static async fetchRawData(): Promise<BithumbTickerResponse | null> {
    try {
      const response = await fetch(this.API_URL, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: BithumbTickerResponse = await response.json();

      if (data.status !== "0000") {
        throw new Error(`API Error: ${data.error || "Unknown error"}`);
      }

      return data;
    } catch (error) {
      console.error("❌ Bithumb API fetch error:", error);
      return null;
    }
  }

  /**
   * 빗썸 원시 데이터를 CryptoPrice 배열로 변환
   */
  static processRawData(data: BithumbTickerResponse): CryptoPrice[] {
    return Object.entries(data.data)
      .filter(
        ([symbol, ticker]) => symbol !== "date" && typeof ticker === "object"
      )
      .map(([symbol, ticker]) => {
        const tickerData = ticker as BithumbTickerData;
        let currentPrice = parseFloat(tickerData.closing_price);
        const prevPrice = parseFloat(tickerData.prev_closing_price);

        if (!currentPrice || currentPrice === 0) {
          currentPrice = prevPrice;
        }

        if (!currentPrice || currentPrice <= 0) {
          return null;
        }

        const changeAmount = currentPrice - prevPrice;
        const changeRate = prevPrice !== 0 ? (changeAmount / prevPrice) * 100 : 0;

        // 코인 기본 정보 가져오기
        const cryptoInfo = getCryptoInfo(symbol);
        
        // 거래소 정보 가져오기
        const exchangeInfo = getExchangeInfo(symbol);

        return {
          symbol,
          korean_name: cryptoInfo.koreanName,
          english_name: symbol,
          current_price: currentPrice,
          change_rate: changeRate,
          change_amount: changeAmount,
          high_price: parseFloat(tickerData.max_price) || currentPrice,
          low_price: parseFloat(tickerData.min_price) || currentPrice,
          volume: parseFloat(tickerData.acc_trade_value_24H) || 0,
          is_positive: changeAmount >= 0,
          sector: cryptoInfo.sector,
          
          // 거래소 정보
          isOnBinance: exchangeInfo.isOnBinance,
          binanceSymbol: exchangeInfo.binanceSymbol,
          isBinanceAlpha: exchangeInfo.isBinanceAlpha,
          isOnUpbit: exchangeInfo.isOnUpbit,
          upbitSymbol: exchangeInfo.upbitSymbol,
        };
      })
      .filter((crypto) => crypto !== null && crypto!.current_price > 0)
      .sort((a, b) => b!.change_rate - a!.change_rate) as CryptoPrice[];
  }

  /**
   * 가공된 빗썸 데이터를 가져오기 (메인 API)
   */
  static async fetchProcessedData(): Promise<CryptoPrice[]> {
    const rawData = await this.fetchRawData();
    if (!rawData) {
      return [];
    }
    
    return this.processRawData(rawData);
  }
}
