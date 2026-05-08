import { Link } from 'react-router-dom'
import { Github, Twitter, Linkedin, Youtube } from 'lucide-react'

const footerLinks = {
  Product: [
    { label: 'Features', href: '#features' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'About', href: '#about' },
    { label: 'Testimonials', href: '#testimonials' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'Contact', href: '#contact' },
  ],
  Resources: [
    { label: 'Blog', href: '#' },
    { label: 'Guides', href: '#' },
    { label: 'Community', href: '#' },
    { label: 'Support', href: '#' },
  ],
  Company: [
    { label: 'About', href: '#' },
    { label: 'Careers', href: '#' },
    { label: 'Contact', href: '#' },
    { label: 'Terms', href: '#' },
  ],
}

export default function Footer() {
  return (
    <footer className="border-t border-[#059669]/50 bg-background dark:bg-[#090E0D]">
      <div className="absolute left-0 right-0 h-px bg-[#059669]/50" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
            <img className='h-6' src="logo.png" alt="LifeOS logo" />
              <span className="text-lg font-bold text-foreground dark:text-white">
                Life<span className='text-[#059669]'>OS</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Your personal life command center. Track, decide, and thrive.
            </p>
          </div>

          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-semibold mb-4">{category}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.label}>
                    {link.href.startsWith('#') ? (
                      <a
                        href={link.href}
                        className="text-sm text-[#8AA89A] hover:text-white transition-colors"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        to={link.href}
                        className="text-sm text-[#8AA89A] hover:text-white transition-colors"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-[#1E3028] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-[#8AA89A]">
            {new Date().getFullYear()} LifeOS. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a href="#" className="text-[#8AA89A] hover:text-white transition-colors">
              <Github className="w-5 h-5" />
            </a>
            <a href="#" className="text-[#8AA89A] hover:text-white transition-colors">
              <Twitter className="w-5 h-5" />
            </a>
            <a href="#" className="text-[#8AA89A] hover:text-white transition-colors">
              <Linkedin className="w-5 h-5" />
            </a>
            <a href="#" className="text-[#8AA89A] hover:text-white transition-colors">
              <Youtube className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
