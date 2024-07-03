import { NextResponse } from 'next/server'
import axios from 'axios'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const keyword = searchParams.get('keyword')

  if (!keyword) {
    return NextResponse.json({ error: 'Keyword is required' }, { status: 400 })
  }

  try {
    const response = await axios.get('https://webservice.recruit.co.jp/hotpepper/gourmet/v1/', {
      params: {
        key: process.env.HOTPEPPER_API_KEY,
        keyword: keyword,
        format: 'json',
        count: 20, // 取得する店舗数を増やす
      }
    })

    return NextResponse.json(response.data.results.shop)
  } catch (error) {
    console.error('Error fetching shops:', error)
    return NextResponse.json({ error: 'Error fetching shops' }, { status: 500 })
  }
}