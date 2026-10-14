const { chromium } = require('playwright');
const assert = require('node:assert/strict');
(async () => {
 const browser = await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox']});
 try {
 const page = await browser.newPage(); const errors=[]; page.on('pageerror', e=>errors.push(e.message));
 await page.goto(process.env.PLANNER_TEST_URL || 'http://127.0.0.1:8000');
 assert.equal(await page.title(),'Sensitive-area KML for Hot Air | Turner Balloons');
 assert.equal(await page.locator('h1').textContent(),'Create your own sensitive-area KML for Hot Air');
 await page.locator('.balloon-logo').evaluate(img=>img.decode());
 assert.equal(await page.locator('.balloon-logo').evaluate(img=>img.naturalWidth),216);
 assert.match(await page.locator('.balloon-logo').getAttribute('alt'),/Jester/);
 assert.equal(await page.locator('#postcode').inputValue(),'');
 assert.equal(await page.locator('header small').textContent(),'Alan Turner, Turner Balloons Limited');
 assert.equal(await page.locator('#plannerHelp').getAttribute('open'),null);
 await page.getByRole('link',{name:'Help / How to use',exact:true}).click();
 assert.notEqual(await page.locator('#plannerHelp').getAttribute('open'),null);
 assert.equal(await page.getByRole('link',{name:'Read the full Pilot User Guide'}).getAttribute('href'),'USER_GUIDE.md');
 assert(!/KMZ/i.test(await page.locator('body').innerText()));
 const guide=await page.request.get(new URL('USER_GUIDE.md',page.url()).href);assert.equal(guide.status(),200);
 assert.match(await guide.text(),/Alan Turner, Turner Balloons Limited/);
 for (const width of [375,820,1200]) {
 await page.setViewportSize({width,height:1000});
 assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`Horizontal overflow at ${width}px`);
 }
 await page.locator('#radius').fill('45');
 assert.equal(await page.locator('#radiusOut').textContent(),'45 miles');
 await page.locator('#generate').click(); await page.waitForFunction(()=>document.querySelector('#status').textContent==='Error: Load source KML first.');
 const xml='<kml xmlns="http://www.opengis.net/kml/2.2"><Document><Style id="test"><IconStyle><scale>1</scale></IconStyle></Style><Placemark id="near"><name>Synthetic near</name><styleUrl>#test</styleUrl><Point><coordinates>0,0,0</coordinates></Point></Placemark><Placemark id="far"><name>Synthetic far</name><Point><coordinates>10,10,0</coordinates></Point></Placemark></Document></kml>';
 await page.locator('#sourceFile').setInputFiles({name:'synthetic.kml',mimeType:'application/vnd.google-earth.kml+xml',buffer:Buffer.from(xml)});
 await page.waitForFunction(()=>document.querySelector('#sourceLabel').textContent.includes('2 placemarks'));
 await page.locator('details').nth(1).locator('summary').click();
 await page.locator('#lat').fill('0'); await page.locator('#lon').fill('0');
 for(const mode of ['circle','rect']) {
 await page.locator(`[name=mode][value=${mode}]`).check();
 await page.locator('#generate').click();
 await page.waitForFunction(()=>document.querySelector('#status').textContent.includes('1 of 2'));
 const result=await page.evaluate(async()=>{
 const text=await (await fetch(document.querySelector('#downloadLink').href)).text();
 const doc=new DOMParser().parseFromString(text,'application/xml');
 return {ids:[...doc.getElementsByTagName('Placemark')].map(e=>e.id),styles:doc.getElementsByTagName('Style').length,errors:doc.getElementsByTagName('parsererror').length};
 });
 assert.deepEqual(result,{ids:['near'],styles:1,errors:0});
 const downloadPromise=page.waitForEvent('download');await page.locator('#downloadLink').click();const download=await downloadPromise;assert.match(download.suggestedFilename(),/\.kml$/);
 }
 await page.locator('#presetName').fill('Synthetic area');await page.locator('#savePreset').click();await page.reload();assert.equal(await page.locator('#presets option').count(),2);
 await page.locator('#presets').selectOption('Synthetic area');await page.locator('#loadPreset').click();
 assert.equal(await page.locator('#lat').inputValue(),'0');
 assert(await page.locator('[name=mode][value=rect]').isChecked());
 await page.locator('#deletePreset').click();assert.equal(await page.locator('#presets option').count(),1);
 // Exercise postcode lookup without exposing a real or personal postcode.
 await page.route('https://api.postcodes.io/postcodes/**',route=>route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({status:200,result:{latitude:0,longitude:0}})}));
 await page.locator('#postcode').fill('SYNTHETIC');
 await page.getByText('Advanced: use coordinates instead',{exact:true}).click();
 await page.locator('#lat').fill('');await page.locator('#lon').fill('');
 await page.locator('#sourceFile').setInputFiles({name:'synthetic.kml',mimeType:'application/vnd.google-earth.kml+xml',buffer:Buffer.from(xml)});
 await page.waitForFunction(()=>document.querySelector('#sourceLabel').textContent.includes('2 placemarks'));
 await page.locator('[name=mode][value=circle]').check();
 await page.locator('#generate').click();await page.waitForFunction(()=>document.querySelector('#status').textContent.includes('1 of 2'));
 await page.unroute('https://api.postcodes.io/postcodes/**');
 await page.route('https://api.postcodes.io/postcodes/**',route=>route.fulfill({status:404,contentType:'application/json',body:'{"status":404}'}));
 await page.locator('#generate').click();await page.waitForFunction(()=>document.querySelector('#status').textContent==='Error: Postcode lookup failed.');
 assert(await page.locator('#downloadArea').evaluate(el=>el.classList.contains('hidden')));
 await page.locator('#sourceFile').setInputFiles({name:'malformed.kml',mimeType:'application/xml',buffer:Buffer.from('<kml><broken>')});
 await page.waitForFunction(()=>document.querySelector('#status').textContent.startsWith('File error:'));
 await page.reload();
 await page.screenshot({path:'/tmp/turner-planner-desktop.png',fullPage:true});
 await page.setViewportSize({width:375,height:812});await page.screenshot({path:'/tmp/turner-planner-mobile.png',fullPage:true});
 assert.deepEqual(errors,[]);
 console.log('PASS: original balloon photo, introduction/credit/help/guide, responsive widths 375/820/1200, slider, blank postcode, missing/malformed file errors, circle/rectangle KML filtering and download, style preservation, preset save/load/delete, mocked postcode success/failure; no browser errors.');
 } finally {await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
