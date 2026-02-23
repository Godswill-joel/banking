"use client";

import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  TrendingDown,
  Bitcoin,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Activity,
  BarChart3,
  Zap,
  Star,
  Search,
  Filter,
} from "lucide-react";

interface Asset {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  volume24h: number;
  marketCap: number;
  high24h: number;
  low24h: number;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  favorite: boolean;
}

export default function MarketPricePage() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<"all" | "favorites" | "gainers" | "losers">("all");
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);

  const [assets, setAssets] = useState<Asset[]>([
    {
      id: "1",
      symbol: "BTC",
      name: "Bitcoin",
      price: 43750.25,
      change24h: 2.5,
      volume24h: 28500000000,
      marketCap: 856000000000,
      high24h: 44200.50,
      low24h: 42800.00,
      icon: Bitcoin,
      favorite: true,
    },
    {
      id: "2",
      symbol: "ETH",
      name: "Ethereum",
      price: 2340.80,
      change24h: -1.2,
      volume24h: 15200000000,
      marketCap: 281000000000,
      high24h: 2398.90,
      low24h: 2310.50,
      icon: TrendingUp,
      favorite: true,
    },
    {
      id: "3",
      symbol: "USDT",
      name: "Tether",
      price: 1.00,
      change24h: 0.01,
      volume24h: 52000000000,
      marketCap: 95000000000,
      high24h: 1.001,
      low24h: 0.999,
      icon: DollarSign,
      favorite: false,
    },
    {
      id: "4",
      symbol: "BNB",
      name: "Binance Coin",
      price: 312.45,
      change24h: 3.8,
      volume24h: 1200000000,
      marketCap: 48000000000,
      high24h: 318.90,
      low24h: 305.20,
      icon: Activity,
      favorite: false,
    },
    {
      id: "5",
      symbol: "SOL",
      name: "Solana",
      price: 98.76,
      change24h: 5.6,
      volume24h: 2800000000,
      marketCap: 42000000000,
      high24h: 102.30,
      low24h: 93.50,
      icon: Zap,
      favorite: true,
    },
    {
      id: "6",
      symbol: "XRP",
      name: "Ripple",
      price: 0.5234,
      change24h: -2.3,
      volume24h: 1500000000,
      marketCap: 28000000000,
      high24h: 0.5456,
      low24h: 0.5120,
      icon: TrendingDown,
      favorite: false,
    },
    {
      id: "7",
      symbol: "ADA",
      name: "Cardano",
      price: 0.4567,
      change24h: 1.8,
      volume24h: 680000000,
      marketCap: 16000000000,
      high24h: 0.4689,
      low24h: 0.4432,
      icon: BarChart3,
      favorite: false,
    },
    {
      id: "8",
      symbol: "DOGE",
      name: "Dogecoin",
      price: 0.0789,
      change24h: -4.2,
      volume24h: 890000000,
      marketCap: 11000000000,
      high24h: 0.0834,
      low24h: 0.0756,
      icon: TrendingUp,
      favorite: false,
    },
  ]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    const priceUpdate = setInterval(() => {
      setAssets((prev) =>
        prev.map((asset) => ({
          ...asset,
          price: asset.price * (1 + (Math.random() - 0.5) * 0.002),
          change24h: asset.change24h + (Math.random() - 0.5) * 0.2,
        }))
      );
    }, 3000);

    return () => {
      clearInterval(timer);
      clearInterval(priceUpdate);
    };
  }, []);

  const toggleFavorite = (id: string) => {
    setAssets((prev) =>
      prev.map((asset) =>
        asset.id === id ? { ...asset, favorite: !asset.favorite } : asset
      )
    );
  };

  const formatLargeNumber = (num: number) => {
    if (num >= 1000000000) return `$${(num / 1000000000).toFixed(2)}B`;
    if (num >= 1000000) return `$${(num / 1000000).toFixed(2)}M`;
    return `$${num.toLocaleString()}`;
  };

  const filteredAssets = assets.filter((asset) => {
    const matchesSearch =
      asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.symbol.toLowerCase().includes(searchQuery.toLowerCase());

    if (activeFilter === "all") return matchesSearch;
    if (activeFilter === "favorites") return asset.favorite && matchesSearch;
    if (activeFilter === "gainers") return asset.change24h > 0 && matchesSearch;
    if (activeFilter === "losers") return asset.change24h < 0 && matchesSearch;
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="backdrop-blur-xl bg-gradient-to-r from-black/80 to-gray-900/80 border border-[#B4925B]/20 rounded-2xl shadow-2xl p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#B4925B] to-[#8B7355] flex items-center justify-center shadow-lg">
                <Activity className="text-black" size={28} />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#B4925B] to-white bg-clip-text text-transparent">
                  Live Market Prices
                </h1>
                <p className="text-gray-400 text-sm md:text-base">
                  Real-time cryptocurrency and asset prices
                </p>
              </div>
            </div>
          
          </div>
        </div>

        {/* Search and Filters */}
        <div className="backdrop-blur-xl bg-black/60 border border-[#B4925B]/20 rounded-2xl shadow-lg p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search assets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-[#B4925B]/50 transition-all"
              />
            </div>

            <div className="flex gap-2 overflow-x-auto pb-2 lg:pb-0">
              {[
                { key: "all", label: "All Assets" },
                { key: "favorites", label: "Favorites" },
                { key: "gainers", label: "Top Gainers" },
                { key: "losers", label: "Top Losers" },
              ].map((filter) => (
                <button
                  key={filter.key}
                  onClick={() => setActiveFilter(filter.key as any)}
                  className={`px-4 py-3 rounded-xl font-semibold transition-all whitespace-nowrap ${
                    activeFilter === filter.key
                      ? "bg-gradient-to-r from-[#B4925B] to-[#8B7355] text-black"
                      : "bg-white/5 text-gray-400 hover:bg-white/10"
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Market Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="backdrop-blur-xl bg-black/60 border border-[#B4925B]/20 rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-gray-400 text-sm font-semibold">Total Market Cap</h3>
              <BarChart3 className="text-[#B4925B]" size={20} />
            </div>
            <p className="text-3xl font-bold text-white">$1.24T</p>
            <div className="flex items-center gap-1 text-green-500 text-sm mt-2">
              <ArrowUpRight size={16} />
              <span>+2.3% (24h)</span>
            </div>
          </div>

          <div className="backdrop-blur-xl bg-black/60 border border-[#B4925B]/20 rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-gray-400 text-sm font-semibold">24h Volume</h3>
              <Activity className="text-[#B4925B]" size={20} />
            </div>
            <p className="text-3xl font-bold text-white">$98.5B</p>
            <div className="flex items-center gap-1 text-red-500 text-sm mt-2">
              <ArrowDownRight size={16} />
              <span>-1.2% (24h)</span>
            </div>
          </div>

          <div className="backdrop-blur-xl bg-black/60 border border-[#B4925B]/20 rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-gray-400 text-sm font-semibold">BTC Dominance</h3>
              <Bitcoin className="text-[#B4925B]" size={20} />
            </div>
            <p className="text-3xl font-bold text-white">51.2%</p>
            <div className="flex items-center gap-1 text-gray-400 text-sm mt-2">
              <span>+0.5% (24h)</span>
            </div>
          </div>
        </div>

        {/* Asset List */}
        <div className="backdrop-blur-xl bg-black/60 border border-[#B4925B]/20 rounded-2xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#B4925B]/20">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">
                    Asset
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-400">
                    Price
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-400">
                    24h Change
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-400 hidden md:table-cell">
                    24h High
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-400 hidden md:table-cell">
                    24h Low
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-400 hidden lg:table-cell">
                    Market Cap
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-400 hidden lg:table-cell">
                    Volume
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-400">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredAssets.map((asset) => {
                  const Icon = asset.icon;
                  return (
                    <tr
                      key={asset.id}
                      onClick={() => setSelectedAsset(asset)}
                      className="border-b border-white/5 hover:bg-white/5 transition-all cursor-pointer"
                    >
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#B4925B] to-[#8B7355] flex items-center justify-center">
                            <Icon className="text-black" size={20} />
                          </div>
                          <div>
                            <p className="font-bold text-white">{asset.symbol}</p>
                            <p className="text-sm text-gray-400">{asset.name}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <p className="font-bold text-white text-lg">
                          ${asset.price.toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: asset.price < 1 ? 4 : 2,
                          })}
                        </p>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <div
                          className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg ${
                            asset.change24h >= 0
                              ? "bg-green-500/20 text-green-500"
                              : "bg-red-500/20 text-red-500"
                          }`}
                        >
                          {asset.change24h >= 0 ? (
                            <ArrowUpRight size={16} />
                          ) : (
                            <ArrowDownRight size={16} />
                          )}
                          <span className="font-semibold">
                            {Math.abs(asset.change24h).toFixed(2)}%
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-right text-gray-300 hidden md:table-cell">
                        ${asset.high24h.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: asset.high24h < 1 ? 4 : 2,
                        })}
                      </td>
                      <td className="px-6 py-5 text-right text-gray-300 hidden md:table-cell">
                        ${asset.low24h.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: asset.low24h < 1 ? 4 : 2,
                        })}
                      </td>
                      <td className="px-6 py-5 text-right text-gray-300 hidden lg:table-cell">
                        {formatLargeNumber(asset.marketCap)}
                      </td>
                      <td className="px-6 py-5 text-right text-gray-300 hidden lg:table-cell">
                        {formatLargeNumber(asset.volume24h)}
                      </td>
                      <td className="px-6 py-5 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(asset.id);
                          }}
                          className="p-2 hover:bg-white/10 rounded-lg transition-all"
                        >
                          <Star
                            className={
                              asset.favorite
                                ? "text-[#B4925B] fill-[#B4925B]"
                                : "text-gray-400"
                            }
                            size={20}
                          />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Asset Detail Modal */}
        {selectedAsset && (
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedAsset(null)}
          >
            <div
              className="backdrop-blur-xl bg-black/90 border border-[#B4925B]/30 rounded-2xl shadow-2xl max-w-2xl w-full p-8"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#B4925B] to-[#8B7355] flex items-center justify-center">
                    <selectedAsset.icon className="text-black" size={32} />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-white">
                      {selectedAsset.name}
                    </h2>
                    <p className="text-gray-400">{selectedAsset.symbol}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedAsset(null)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-all"
                >
                  <span className="text-gray-400 text-2xl">×</span>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-white/5 rounded-xl p-4">
                  <p className="text-gray-400 text-sm mb-1">Current Price</p>
                  <p className="text-2xl font-bold text-white">
                    ${selectedAsset.price.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: selectedAsset.price < 1 ? 4 : 2,
                    })}
                  </p>
                </div>
                <div className="bg-white/5 rounded-xl p-4">
                  <p className="text-gray-400 text-sm mb-1">24h Change</p>
                  <div
                    className={`text-2xl font-bold ${
                      selectedAsset.change24h >= 0
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    {selectedAsset.change24h >= 0 ? "+" : ""}
                    {selectedAsset.change24h.toFixed(2)}%
                  </div>
                </div>
                <div className="bg-white/5 rounded-xl p-4">
                  <p className="text-gray-400 text-sm mb-1">24h High</p>
                  <p className="text-xl font-bold text-white">
                    ${selectedAsset.high24h.toLocaleString()}
                  </p>
                </div>
                <div className="bg-white/5 rounded-xl p-4">
                  <p className="text-gray-400 text-sm mb-1">24h Low</p>
                  <p className="text-xl font-bold text-white">
                    ${selectedAsset.low24h.toLocaleString()}
                  </p>
                </div>
                <div className="bg-white/5 rounded-xl p-4">
                  <p className="text-gray-400 text-sm mb-1">Market Cap</p>
                  <p className="text-xl font-bold text-white">
                    {formatLargeNumber(selectedAsset.marketCap)}
                  </p>
                </div>
                <div className="bg-white/5 rounded-xl p-4">
                  <p className="text-gray-400 text-sm mb-1">24h Volume</p>
                  <p className="text-xl font-bold text-white">
                    {formatLargeNumber(selectedAsset.volume24h)}
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <button className="flex-1 py-4 bg-gradient-to-r from-[#B4925B] to-[#8B7355] hover:from-[#8B7355] hover:to-[#B4925B] text-black font-bold rounded-xl transition-all hover:scale-105">
                  Buy {selectedAsset.symbol}
                </button>
                <button className="flex-1 py-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl transition-all">
                  Trade
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}