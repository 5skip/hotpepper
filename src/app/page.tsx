'use client'

import { useState } from 'react'
import Image from 'next/image'

interface Shop {
  id: string;
  name: string;
  address: string;
  access: string;
  photo: {
    pc: {
      l: string;
    };
  };
  urls: {
    pc: string;
  };
  catch: string;
  genre: {
    name: string;
  };
}

export default function Home() {
  const [keyword, setKeyword] = useState('')
  const [shops, setShops] = useState<Shop[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const searchShops = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await fetch(`/api/search?keyword=${encodeURIComponent(keyword)}`)
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      const data = await response.json()
      setShops(data)
    } catch (error) {
      console.error('Error fetching shops:', error)
      setError('店舗情報の取得に失敗しました。')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container min-h-screen h-full mx-auto p-4">
      <h1 className="text-4xl font-bold mb-6 text-center text-purple-700">ホットペッパーグルメ検索</h1>
      <div className="mb-6 flex justify-center items-center">
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className="border p-2 mr-2 w-64 rounded shadow"
          placeholder="キーワードを入力"
        />
        <button
          onClick={searchShops}
          className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 transition duration-200 shadow"
          disabled={loading}
        >
          {loading ? '検索中...' : '検索'}
        </button>
      </div>
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      {shops.length === 0 && !loading && (
        <p className="text-center text-gray-500">検索結果がありません。キーワードを入力して検索してください。</p>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {shops.map((shop) => (
          <div key={shop.id} className="border p-4 bg-white rounded shadow-md hover:shadow-lg transition duration-200">
            <Image
              src={shop.photo.pc.l}
              alt={shop.name}
              width={300}
              height={300}
              className="w-full h-48 object-cover mb-4 rounded"
            />
            <h2 className="text-xl font-semibold mb-2">{shop.name}</h2>
            <p className="text-sm text-gray-600 mb-2">{shop.catch}</p>
            <p className="text-sm text-gray-600 mb-2">{shop.genre.name}</p>
            <p className="text-sm text-gray-600 mb-1">{shop.address}</p>
            <p className="text-sm text-gray-600 mb-2">{shop.access}</p>
            <a 
              href={shop.urls.pc} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-purple-500 hover:underline"
            >
              詳細を見る
            </a>
          </div>
        ))}
      </div>
    </div>
  )
}
