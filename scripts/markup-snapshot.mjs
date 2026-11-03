// Canonicalize this site's trusted static markup: compiler whitespace and attribute
// order may change during an Astro component refactor; content/structure must not.
export function markupSnapshot(html) {
  const decode=value=>value.replace(/&#(x[\da-f]+|\d+);/gi,(_all,n)=>String.fromCodePoint(parseInt(n.replace(/^x/i,''),/^x/i.test(n)?16:10)))
    .replaceAll('&amp;','&').replaceAll('&quot;','"').replaceAll('&#39;',"'").replaceAll('&apos;',"'").replaceAll('&lt;','<').replaceAll('&gt;','>');
  const tokens=[];
  for(const token of html.match(/<!--[\s\S]*?-->|<[^>]+>|[^<]+/g)||[]){
    if(token.startsWith('<!--'))continue;
    if(!token.startsWith('<')){const text=decode(token).replace(/\s+/g,' ').trim();if(text)tokens.push(['text',text]);continue;}
    const tag=token.match(/^<(\/?)([\w:-]+)([\s\S]*?)\/?\s*>$/);
    if(!tag)throw Error('Unexpected snapshot markup');
    const [,closing,name,rest]=tag;
    if(closing){tokens.push(['close',name.toLowerCase()]);continue;}
    const attrs=[...rest.matchAll(/([^\s=/'"<>]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g)].map(([,key,a,b,c])=>[key.toLowerCase(),decode(a??b??c??'').replace(/\s+/g,' ').trim()]).sort(([a],[b])=>a.localeCompare(b));
    tokens.push(['open',name.toLowerCase(),attrs]);
  }
  return JSON.stringify(tokens);
}
