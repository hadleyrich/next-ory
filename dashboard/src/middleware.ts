import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getFrontendApi } from '@/ory/sdk/server';

export async function middleware() {

    const api = await getFrontendApi();
    const cookie = await cookies();

    const session = await api
        .toSession({ cookie: 'ory_kratos_session=' + cookie.get('ory_kratos_session')?.value })
        .then((response) => response.data)
        .catch(() => null);

    if (!session) {

        console.log('NO SESSION');

        const url = process.env.NEXT_PUBLIC_AUTHENTICATION_NODE_URL +
            '/flow/login?return_to=' +
            process.env.NEXT_PUBLIC_DASHBOARD_NODE_URL;

        console.log('REDIRECT TO', url);

        return NextResponse.redirect(url);
    }

    return NextResponse.next();
}

export const config = {
    matcher: '/((?!api|_next/static|_next/image|favicon.png|sitemap.xml|robots.txt).*)',
};
