import { autoRetry, page, run, urlBase } from '../../libframe/test/setup'

export { testRun }

function testRun(npmScript: 'npm run dev' | 'npm run prod' | 'npm run prod:static') {
  run(npmScript)

  test(`Counter succesfully imported [${npmScript}]`, async () => {
    page.goto(`${urlBase}/`)
    expect(await page.textContent('body')).toContain('Counter 0')
    // `autoRetry` because browser-side code may not be loaded yet
    await autoRetry(async () => {
      await page.click('button')
      expect(await page.textContent('body')).toContain('Counter 1')
    })
  })
}
