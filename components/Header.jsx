import Link from 'next/link';


export default function Header(){
return (
<header className="bg-white/80 backdrop-blur-sm sticky top-0 z-50 border-b">
<div className="max-w-7xl mx-auto px-6 lg:px-8">
<div className="flex items-center justify-between h-16">
<Link href="/" className="flex items-center gap-3">
<div className="h-10 w-10 rounded-lg bg-gradient-to-tr from-red-500 to-orange-300 flex items-center justify-center text-white font-bold">A</div>
<div className="hidden sm:block">
<div className="font-extrabold">Aamir</div>
<div className="text-xs text-gray-500">Real Estate Video Editor</div>
</div>
</Link>


<nav className="hidden md:flex items-center gap-6">
<Link href="#services" className="text-gray-700 hover:text-gray-900">Services</Link>
<Link href="#showcase" className="text-gray-700 hover:text-gray-900">Showcase</Link>
<Link href="#why" className="text-gray-700 hover:text-gray-900">Why Choose Me</Link>
<a href="https://wa.me/1555" className="ml-2 inline-flex items-center px-4 py-2 rounded-full bg-accent text-white font-semibold">Contact</a>
</nav>
</div>
</div>
</header>
)
}