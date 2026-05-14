import fetch from 'node-fetch';

async function testJudgeme() {
    const shopDomain = 'blacmelo.myshopify.com';
    const handle = 'blue-hoodie';

    try {
        const url = `https://judge.me/reviews/reviews_for_widget?shop_domain=${shopDomain}&handle=${handle}`;
        console.log('Fetching:', url);
        const response = await fetch(url);
        if (!response.ok) {
            console.error('HTTP Error:', response.status, response.statusText);
            return;
        }
        const html = await response.text();
        console.log('Response Length:', html.length);
        console.log('Response Preview:', html.substring(0, 500));
    } catch (error) {
        console.error('Error:', error);
    }
}

testJudgeme();
