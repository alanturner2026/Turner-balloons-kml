const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const tile=Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jWZkAAAAASUVORK5CYII=','base64');
const xml=`<kml xmlns="http://www.opengis.net/kml/2.2"><Document>
<Style id="s"><IconStyle><Icon><href>https://example.invalid/private-icon.png</href></Icon></IconStyle></Style>
<Placemark id="pin"><name>&lt;img src="https://example.invalid/private-name.png"&gt;</name><description>[1]: Synthetic entry</description><styleUrl>#s</styleUrl><Point><coordinates>0.02,51,123</coordinates></Point></Placemark>
<Placemark id="pair"><description>[1]: Paired synthetic polygon</description><Polygon><outerBoundaryIs><LinearRing><coordinates>2,53 2.1,53 2.1,53.1 2,53.1 2,53</coordinates></LinearRing></outerBoundaryIs></Polygon></Placemark>
<Placemark id="holes"><name>Synthetic polygon with hole</name><Polygon><outerBoundaryIs><LinearRing><coordinates>-0.1,50.9 0.1,50.9 0.1,51.1 -0.1,51.1 -0.1,50.9</coordinates></LinearRing></outerBoundaryIs><innerBoundaryIs><LinearRing><coordinates>-0.02,50.98 0.02,50.98 0.02,51.02 -0.02,51.02 -0.02,50.98</coordinates></LinearRing></innerBoundaryIs></Polygon><ExtendedData><Data name="synthetic"><value>Preserve this</value></Data></ExtendedData></Placemark>
<Placemark id="line"><LineString><coordinates>-1,51 1,51</coordinates></LineString></Placemark>
<Placemark id="multi"><MultiGeometry><Point><coordinates>-0.02,51</coordinates></Point><Polygon><outerBoundaryIs><LinearRing><coordinates>0.01,51.01 0.03,51.01 0.03,51.03 0.01,51.01</coordinates></LinearRing></outerBoundaryIs></Polygon></MultiGeometry></Placemark>
<Placemark id="unsupported"><description>[1]: No supported map geometry</description></Placemark>
<Placemark id="far"><Point><coordinates>10,60</coordinates></Point></Placemark>
</Document></kml>`;
(async()=>{
 const browser=await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox']});
 try{
 const page=await browser.newPage(),errors=[],external=[],tileRequests=[];
 page.on('pageerror',error=>errors.push(error.message));
 page.on('request',request=>{
  const url=new URL(request.url());
  if(url.hostname==='tile.openstreetmap.org')tileRequests.push(request.url());
  if(url.hostname==='example.invalid')external.push(request.url());
  assert.equal(request.method(),'GET','KML preview must not upload source data');
 });
 await page.route('https://tile.openstreetmap.org/**',route=>route.fulfill({status:200,contentType:'image/png',body:tile}));
 await page.goto(process.env.PLANNER_TEST_URL||'http://127.0.0.1:8000');
 assert.equal(tileRequests.length,0,'No map requests before preview');
 await page.getByText('Advanced: use coordinates instead',{exact:true}).click();
 await page.locator('#lat').fill('51');await page.locator('#lon').fill('0');
 await page.locator('#radius').fill('10');
 await page.locator('#previewArea').click();
 await page.waitForFunction(()=>document.querySelector('#previewStatus').textContent.startsWith('Chosen boundary shown'));
 await page.waitForFunction(()=>document.querySelector('#tileStatus').textContent.startsWith('Background map loaded'));
 assert(tileRequests.length>0);
 const circle=await page.evaluate(()=>{
  const points=selectionBoundary({lat:51,lon:0},{circle:true,r:10});
  return {count:points.length,radii:points.map(p=>Math.hypot(...xy(p[1],p[0],{lat:51,lon:0})))};
 });
 assert.equal(circle.count,128);assert(circle.radii.every(radius=>Math.abs(radius-10)<1e-8));
 await page.locator('#sourceFile').setInputFiles({name:'synthetic-preview.kml',mimeType:'application/xml',buffer:Buffer.from(xml)});
 await page.waitForFunction(()=>document.querySelector('#sourceLabel').textContent.includes('7 placemarks'));
 assert(await page.locator('#mapPanel').evaluate(e=>e.classList.contains('hidden')));
 await page.locator('#previewArea').click();
 await page.waitForFunction(()=>document.querySelector('#previewStatus').textContent.includes('6 of 7 placemarks retained; 5 shown'));
 assert.match(await page.locator('#previewStatus').textContent(),/unsupported or missing/);
 const geometry=await page.evaluate(()=>{
  const layers=placemarkPreview(original.querySelector('[id="holes"]'));
  return {rings:layers[0].getLatLngs().length,multi:placemarkPreview(original.querySelector('[id="multi"]')).length};
 });
 assert.deepEqual(geometry,{rings:2,multi:2});
 const popup=await page.evaluate(()=>{
  const layer=placemarkPreview(original.querySelector('[id="pin"]'))[0];
  return {text:layer.getPopup().getContent().textContent,images:layer.getPopup().getContent().querySelectorAll('img').length};
 });
 assert.match(popup.text,/<img src=/);assert.equal(popup.images,0);
 await page.locator('#generate').click();
 await page.waitForFunction(()=>document.querySelector('#status').textContent.includes('6 of 7'));
 const output=await page.evaluate(async()=>{
  const doc=new DOMParser().parseFromString(await(await fetch(document.querySelector('#downloadLink').href)).text(),'application/xml');
  return {ids:all(doc,'Placemark').map(pm=>pm.id),identical:all(doc,'Placemark').every(pm=>new XMLSerializer().serializeToString(pm)===new XMLSerializer().serializeToString(original.querySelector('[id="'+pm.id+'"]'))),styles:all(doc,'Style').length};
 });
 assert.deepEqual(output,{ids:['pin','pair','holes','line','multi','unsupported'],identical:true,styles:1});
 for(const width of [375,820,1200]){
  await page.setViewportSize({width,height:900});
  await page.evaluate(()=>previewMap.invalidateSize());
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 }
 await page.screenshot({path:'/tmp/turner-map-desktop.png',fullPage:true});
 await page.locator('[name=mode][value=rect]').check();
 assert(await page.locator('#mapPanel').evaluate(e=>e.classList.contains('hidden')));
 assert(await page.locator('#downloadArea').evaluate(e=>e.classList.contains('hidden')));
 await page.locator('#previewArea').click();
 await page.waitForFunction(()=>document.querySelector('#previewStatus').textContent.startsWith('Preview:'));
 const rectangle=await page.evaluate(()=>selectionBoundary({lat:51,lon:0},{circle:false,n:20,e:50,s:10,w:10}).map(p=>xy(p[1],p[0],{lat:51,lon:0}).map(n=>Math.round(n))));
 assert.deepEqual(rectangle,[[-10,-10],[-10,20],[50,20],[50,-10]]);
 await page.setViewportSize({width:375,height:812});await page.evaluate(()=>previewMap.invalidateSize());
 await page.locator('#mapPanel').screenshot({path:'/tmp/turner-map-mobile.png'});
 // Background failure remains independent of KML export.
 await page.unroute('https://tile.openstreetmap.org/**');
 await page.route('https://tile.openstreetmap.org/**',route=>route.abort());
 await page.evaluate(()=>previewTiles.redraw());
 await page.waitForFunction(()=>document.querySelector('#tileStatus').textContent.includes('unavailable'));
 await page.locator('#generate').click();await page.waitForFunction(()=>document.querySelector('#status').textContent.includes('6 of 7'));
 assert(!(await page.locator('#downloadArea').evaluate(e=>e.classList.contains('hidden'))));
 await page.locator('#north').fill('21');
 assert(await page.locator('#mapPanel').evaluate(e=>e.classList.contains('hidden')));
 // Old asynchronous lookup results cannot redraw a stale selection.
 await page.locator('#lat').fill('');await page.locator('#lon').fill('');await page.locator('#postcode').fill('SYNTHETIC');
 let respond;const responseReady=new Promise(resolve=>respond=resolve);
 await page.route('https://api.postcodes.io/postcodes/**',async route=>{await responseReady;await route.fulfill({status:200,contentType:'application/json',body:'{"result":{"latitude":51,"longitude":0}}'});});
 const lookup=page.waitForRequest('https://api.postcodes.io/postcodes/SYNTHETIC');
 await page.locator('#previewArea').click();await lookup;
 await page.locator('#north').fill('25');respond();
 await page.waitForFunction(()=>document.querySelector('#previewStatus').textContent==='Settings changed. Preview again.');
 assert(await page.locator('#mapPanel').evaluate(e=>e.classList.contains('hidden')));
 assert.deepEqual(external,[]);assert.deepEqual(errors,[]);
 console.log('PASS: opt-in map, matching circle/rectangle boundary, retained pairs/points/lines/polygons/holes/multigeometry, safe labels, identical exported XML, unsupported-geometry notice, responsive map, tile failure fallback, stale selection/lookup protection, no source uploads or external KML URLs. Tiles mocked.');
 }finally{await browser.close()}
})().catch(error=>{console.error(error);process.exitCode=1});
