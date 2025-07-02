// components/Footer.js
import Link from 'next/link';
import Image from 'next/image';
import { FacebookIcon, LinkedinIcon, Mail, MapPin, Phone, YoutubeIcon, MessageCircle } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 mx-auto border-t border-gray-100 text-white">
      <div className="container max-w-7xl mx-auto py-12 px-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-10">
        {/* Left Column: Logo, Description, Social Media Links */}
        <div className="col-span-1 sm:col-span-2 md:col-span-2">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-amber-500 rounded-lg flex items-center justify-center">
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Insilicology</h3>
              <p className="text-sm text-amber-400">Computational Biology Solutions</p>
            </div>
          </div>
          <p className="text-gray-400 mb-4 md:pr-24">
            Leading computational biology services for drug discovery, molecular modeling, and bioinformatics. 
            Accelerating scientific breakthroughs through innovative computational approaches.
          </p>
          <div className="flex space-x-4 mt-4">
            <Link href="https://facebook.com/insilicology" passHref>
              <FacebookIcon className='text-gray-400 hover:text-amber-500 transition-colors' width={20} height={20}/>
            </Link>
            <Link href="https://linkedin.com/company/insilicology" passHref>
              <LinkedinIcon className='text-gray-400 hover:text-amber-500 transition-colors' width={20} height={20}/>
            </Link>
            <Link href="https://youtube.com/@insilicology" passHref>
              <YoutubeIcon className='text-gray-400 hover:text-amber-500 transition-colors' width={20} height={20}/>
            </Link>
          </div>
        </div>

        {/* Services Links */}
        <div>
          <h4 className="font-semibold mb-4 text-amber-400">Our Services</h4>
          <ul className='space-y-2'>
            <li>
              <Link href="/services#molecular-docking" passHref>
                <span className="text-gray-400 hover:text-white transition-colors">Molecular Docking</span>
              </Link>
            </li>
            <li>
              <Link href="/services#molecular-dynamics" passHref>
                <span className="text-gray-400 hover:text-white transition-colors">Molecular Dynamics</span>
              </Link>
            </li>
            <li>
              <Link href="/services#drug-discovery" passHref>
                <span className="text-gray-400 hover:text-white transition-colors">Drug Discovery</span>
              </Link>
            </li>
            <li>
              <Link href="/services#bioinformatics" passHref>
                <span className="text-gray-400 hover:text-white transition-colors">Bioinformatics</span>
              </Link>
            </li>
            <li>
              <Link href="/services#vaccine-design" passHref>
                <span className="text-gray-400 hover:text-white transition-colors">Vaccine Design</span>
              </Link>
            </li>
          </ul>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-semibold mb-4 text-amber-400">Quick Links</h4>
          <ul className='space-y-2'>
            <li>
              <Link href="/" passHref>
                <span className="text-gray-400 hover:text-white transition-colors">Home</span>
              </Link>
            </li>
            <li>
              <Link href="/services" passHref>
                <span className="text-gray-400 hover:text-white transition-colors">Services</span>
              </Link>
            </li>
            <li>
              <Link href="/contact" passHref>
                <span className="text-gray-400 hover:text-white transition-colors">Contact</span>
              </Link>
            </li>
            <li>
              <Link href="/about" passHref>
                <span className="text-gray-400 hover:text-white transition-colors">About Us</span>
              </Link>
            </li>
            <li>
              <Link href="/blog" passHref>
                <span className="text-gray-400 hover:text-white transition-colors">Blog</span>
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact Details */}
        <div>
          <h4 className="font-semibold mb-4 text-amber-400">Contact Info</h4>
          <ul className='space-y-3'>
            <li className="flex items-start space-x-3 text-gray-400">
              <MapPin size={16} className='mt-1 flex-shrink-0' />
              <span>Savar, Dhaka 1340, Bangladesh</span>
            </li>
            <li className="flex items-start space-x-3 text-gray-400">
              <Mail size={16} className='mt-1 flex-shrink-0' />
              <span>insilicology@gmail.com</span>
            </li>
            <li className="flex items-start space-x-3 text-gray-400">
              <Phone size={16} className='mt-1 flex-shrink-0' />
              <span>+880 1617 082936</span>
            </li>
          </ul>
        </div>
      </div>
      
      {/* Bottom Section */}
      <div className="text-center max-w-7xl mx-auto py-8 px-3 mt-6 border-t border-gray-700 flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0">
        <div className="text-gray-400">
          <p>&copy; {new Date().getFullYear()} <strong>Insilicology</strong>, All rights reserved. Website developed by <Link href="https://agency.oimi.io" className="font-bold hover:text-amber-400 transition-colors">Oimi Web Agency</Link>.</p>
        </div>
        <div className="text-center sm:text-right">
          <p className="text-gray-400">
            <Link href="/privacy-policy" className="hover:text-amber-400 transition-colors">Privacy Policy</Link> |{' '}
            <Link href="/terms" className="hover:text-amber-400 transition-colors">Terms & Conditions</Link> |{' '}
            <Link href="/refund-policy" className="hover:text-amber-400 transition-colors">Refund Policy</Link>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
