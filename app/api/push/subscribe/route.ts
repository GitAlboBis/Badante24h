import { NextResponse } from 'next/server'

export async function POST(request: Request) {
    try {
        const body = await request.json()

        // TODO: Validate subscription and save to push_subscriptions table

        return NextResponse.json({ success: true })
    } catch {
        return NextResponse.json(
            { error: 'Failed to register push subscription' },
            { status: 500 }
        )
    }
}
