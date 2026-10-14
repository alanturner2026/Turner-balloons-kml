'use strict';
let previewMap=null,previewLayers=null,previewTiles=null;
let previewRequest=0,tileFailed=false,previewBounds=null;
function fitPreview(){if(previewMap&&previewBounds)previewMap.fitBounds(previewBounds,{padding:[20,20],maxZoom:12,animate:false})}
$('fitPreview').addEventListener('click',fitPreview);

window.invalidateMapPreview=()=>{
  previewRequest++;
  if(!$('mapPanel').classList.contains('hidden')){
    $('mapPanel').classList.add('hidden');
    $('previewStatus').textContent='Settings or source changed. Preview again to see the current selection.';
  }
};

function mapCoordinates(element){
  const coordinates=all(element,'coordinates')[0];
  if(!coordinates)return[];
  return coordinates.textContent.trim().split(/\s+/).map(value=>value.split(',').map(Number))
    .filter(point=>point.length>=2&&Number.isFinite(point[0])&&Number.isFinite(point[1])&&Math.abs(point[0])<=180&&Math.abs(point[1])<=85)
    .map(point=>[point[1],point[0]]);
}

function selectionBoundary(c,a){
  if(Math.abs(c.lat)>85)throw Error('Map preview supports latitudes between 85° south and 85° north. KML generation is still available.');
  const longitudeMiles=69.172*Math.cos(c.lat*Math.PI/180);
  const coordinate=([x,y])=>[c.lat+y/69,c.lon+x/longitudeMiles];
  // Use the same local miles projection as filtering, rather than a different geodesic circle.
  const points=a.circle?Array.from({length:128},(_,i)=>{
    const angle=i*2*Math.PI/128;return[a.r*Math.cos(angle),a.r*Math.sin(angle)];
  }):[[-a.w,-a.s],[-a.w,a.n],[a.e,a.n],[a.e,-a.s]];
  const boundary=points.map(coordinate);
  if(boundary.some(p=>Math.abs(p[0])>85||Math.abs(p[1])>180))throw Error('This selection extends beyond the supported map bounds. KML generation is still available.');
  return boundary;
}

function initialisePreviewMap(){
  if(previewMap)return;
  if(!window.L)throw Error('The map could not load. You can still generate and download your KML.');
  previewMap=L.map('areaMap',{preferCanvas:true,scrollWheelZoom:false});
  previewTiles=L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{
    maxZoom:19,updateWhenIdle:true,keepBuffer:0,
    attribution:'&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors'
  });
  previewTiles.on('tileerror',()=>{
    tileFailed=true;
    $('tileStatus').textContent='Background map tiles are unavailable. The boundary and sensitive-area overlay still work; KML generation is unaffected.';
  });
  previewTiles.on('loading',()=>{
    tileFailed=false;
    $('tileStatus').textContent='Loading background map…';
  });
  previewTiles.on('load',()=>{
    if(!tileFailed)$('tileStatus').textContent='Background map loaded. Use + and − to zoom, or drag to move.';
  });
  previewTiles.addTo(previewMap);
  previewLayers=L.featureGroup().addTo(previewMap);
  previewMap.on('resize',fitPreview);
  L.control.scale({imperial:true,metric:false}).addTo(previewMap);
}

function placemarkPreview(pm){
  const layers=[],style={color:'#b92b43',weight:2,fillColor:'#b92b43',fillOpacity:.16};
  for(const point of all(pm,'Point')){
    const coordinates=mapCoordinates(point);
    if(coordinates.length)layers.push(L.circleMarker(coordinates[0],{...style,radius:5,fillOpacity:.8}));
  }
  for(const line of all(pm,'LineString')){
    const coordinates=mapCoordinates(line);
    if(coordinates.length>=2)layers.push(L.polyline(coordinates,style));
  }
  for(const polygon of all(pm,'Polygon')){
    const outer=all(polygon,'outerBoundaryIs')[0];
    if(!outer)continue;
    const shell=mapCoordinates(outer);
    if(shell.length<3)continue;
    const holes=all(polygon,'innerBoundaryIs').map(mapCoordinates).filter(ring=>ring.length>=3);
    layers.push(L.polygon([shell,...holes],style));
  }
  const name=all(pm,'name')[0]?.textContent.trim()||'Unnamed sensitive-area feature';
  for(const layer of layers){
    // Never insert source HTML or fetch source icon/style URLs while displaying a private KML.
    const label=document.createElement('span');label.textContent=name;
    layer.bindPopup(label);
  }
  return layers;
}

function renderMapPreview(c,a,pms,keep,hasSource){
  const boundary=selectionBoundary(c,a);
  $('mapPanel').classList.remove('hidden');
  initialisePreviewMap();
  previewMap.invalidateSize();
  previewLayers.clearLayers();
  const outline=L.polygon(boundary,{color:'#1671b8',weight:3,fillOpacity:.05,interactive:false}).addTo(previewLayers);
  let shown=0;
  for(const index of keep){
    const layers=placemarkPreview(pms[index]);
    if(layers.length)shown++;
    layers.forEach(layer=>layer.addTo(previewLayers));
  }
  L.circleMarker([c.lat,c.lon],{color:'#fff',weight:2,fillColor:'#17384a',fillOpacity:1,radius:6}).bindTooltip('Your selection centre').addTo(previewLayers);
  previewBounds=outline.getBounds();
  fitPreview();
  $('previewStatus').textContent=hasSource?
    'Preview: '+keep.size+' of '+pms.length+' placemarks retained; '+shown+' shown on the map.'+(shown<keep.size?' Some retained placemarks have unsupported or missing map geometry; they remain in the KML.':''):
    'Chosen boundary shown. Load your KML and preview again to see the retained sensitive areas.';
}

window.refreshOpenMapPreview=(c,a,pms,keep)=>{
  if($('mapPanel').classList.contains('hidden'))return;
  try{renderMapPreview(c,a,pms,keep,true)}catch(err){$('previewStatus').textContent='Map preview: '+err.message}
};

$('previewArea').addEventListener('click',async()=>{
  const button=$('previewArea'),request=++previewRequest,revision=selectionRevision;
  button.disabled=true;$('previewStatus').textContent='Preparing map preview…';
  try{
    const a=area(),c=await centre();
    if(request!==previewRequest||revision!==selectionRevision){$('previewStatus').textContent='Settings changed. Preview again.';return}
    const {pms,keep}=original?selectPlacemarks(c,a):{pms:[],keep:new Set()};
    renderMapPreview(c,a,pms,keep,Boolean(original));
  }catch(err){
    $('mapPanel').classList.add('hidden');
    $('previewStatus').textContent='Preview error: '+err.message;
  }finally{button.disabled=false}
});
