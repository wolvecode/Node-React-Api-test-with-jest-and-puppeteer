const Page = require('./helpers/page')

let page;

beforeEach( async () => {
   page = await Page.build()
    await page.goto('localhost:3000');
})


afterEach(async () => {
    // close browser(page) instance after each test
    await page.close()
})

test('Header has the correct text', async () => {
    const text = await page.getContentsOf('a.brand-logo');
    expect(text).toEqual('Blogster')
})

test('Clicking login btn oauth flow', async () => {
    await page.click('.right a');

    const url = await page.url()
    // to check if the url match accounts.google.com
    expect(url).toMatch(/accounts\.google\.com/);
})

test('when signed in, show a log out btn',async () => {
    //Login user from the custom login function we have in the proxy
    await page.login();

    const text = await page.getContentsOf('a[href="/auth/logout"]');
    expect(text).toEqual('Logout');
})