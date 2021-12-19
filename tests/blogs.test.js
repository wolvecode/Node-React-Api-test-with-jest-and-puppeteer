const { get } = require('mongoose');
const Page = require('./helpers/page');

let page;

beforeEach( async () => {
    page = await Page.build()
     await page.goto('localhost:3000');
 })
 
 afterEach(async () => {
     // close browser(page) instance after each test
     await page.close()
 })

 describe('When logged in', async () => {
     beforeEach(async () => {
         await page.login();
         await page.click('a.btn-floating');
     })


    test('can see list of blogs and add more buttons', async () => {
        const label = await page.getContentsOf('form label');
        expect(label).toEqual('Blog Title');
    })

    describe('Using a valid inputs', async () => {
        beforeEach(async () => {
            await page.type('.title input', 'My Title');
            await page.type('.content input', 'My content string test');
            await page.click('form button');
        })

        test('Submitting takes user o review to review screen', async () => {
            const text = await page.getContentsOf('h5');
            expect(text).toEqual('Please confirm your entries')
        })

        test('Submitting then saving adds to blog to index page', async () => {
            await page.click('button.green');
            await page.waitFor('.card');

            const title = await page.getContentsOf('.card-title');
            const content = await page.getContentsOf('p');

            expect(title).toEqual('My Title');
            expect(content).toEqual('My content string test')
        })
    })

    describe('And using invalid inputs', async () => {
        beforeEach(async () => {
            await page.click('form button.teal');
        })

        test('the form shows an error messsage', async () => {
            const titleError = await page.getContentsOf('.title .red-text');
            const contentError = await page.getContentsOf('.content .red-text');

            expect(titleError).toEqual('You must provide a value');
            expect(contentError).toEqual('You must provide a value');
        })
    })
 })

 describe('When user is not logged in', async () => {
     const actions = [
         {
             method: 'post',
             path: '/api/blogs',
             data:  { title: 'My Contet', content: 'My Content' }
         },
         {
             method: 'get',
             path: '/api/blogs'
         }
     ]

     test('Blog related actions are prohibited', async () => {
         const results = await page.execRequests(actions);

         for(let result of results){
             expect(result).toEqual({ error: 'You must log in!' });
         }
     })

    //  test('User can not create a blog post', async () => {
    //     const result =  await page.post('/api/blogs', { title: 'My Contet', content: 'My Content' });

    //     expect(result).toEqual({ error: 'You must log in!' })
    //  })

    //  test('User can not get list of post', async () => {
    //      const result = await page.get('/api/blogs')
    //      expect(result).toEqual({ error: 'You must log in!' })
    //  })
 })