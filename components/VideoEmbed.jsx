// Simple component: embeds watch?v= links, makes shorts open in new tab.
export default function VideoEmbed({ url, title = 'Showcase video' }){
if(!url) return null;
try{
const u = new URL(url);
const path = u.pathname;
if(u.hostname.includes('youtube.com')){
if(path.startsWith('/shorts/')){
return (
<a href={url} target="_blank" rel="noopener noreferrer" className="inline-block underline text-accent">Open Shorts</a>
)
}
const id = u.searchParams.get('v');
if(id){
return (
<div className="aspect-w-16 aspect-h-9">
<iframe src={`https://www.youtube.com/embed/${id}`} title={title} frameBorder="0" allowFullScreen className="w-full h-full rounded-lg" />
</div>
)
}
}
}catch(e){ /* fallback */ }
return <a href={url} target="_blank" rel="noopener noreferrer" className="inline-block underline text-accent">Open Video</a>
}