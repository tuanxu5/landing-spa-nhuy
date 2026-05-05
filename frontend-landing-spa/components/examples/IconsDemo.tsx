/**
 * Icons Demo Component
 * 
 * This component demonstrates how to use Lucide React icons
 * throughout the Spa Booking application.
 */

import {
  Calendar,
  Clock,
  User,
  Mail,
  Phone,
  MapPin,
  CheckCircle,
  XCircle,
  AlertCircle,
  Edit,
  Trash2,
  Plus,
  Search,
  Filter,
  Loader2,
  Facebook,
  Instagram,
  Twitter,
  Menu,
  X,
  Settings,
  LogOut,
  Home,
} from 'lucide-react';

export default function IconsDemo() {
  return (
    <div className="p-8 space-y-8">
      <h1 className="text-3xl font-bold">Lucide Icons Demo</h1>

      {/* Navigation Icons */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Navigation Icons</h2>
        <div className="flex gap-4 items-center">
          <Home className="w-6 h-6 text-gray-700" />
          <Menu className="w-6 h-6 text-gray-700" />
          <X className="w-6 h-6 text-gray-700" />
          <Settings className="w-6 h-6 text-gray-700" />
          <LogOut className="w-6 h-6 text-gray-700" />
        </div>
      </section>

      {/* Booking Icons */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Booking Icons</h2>
        <div className="flex gap-4 items-center">
          <Calendar className="w-6 h-6 text-blue-600" />
          <Clock className="w-6 h-6 text-blue-600" />
          <User className="w-6 h-6 text-blue-600" />
        </div>
      </section>

      {/* Status Icons */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Status Icons</h2>
        <div className="flex gap-4 items-center">
          <CheckCircle className="w-6 h-6 text-green-600" />
          <XCircle className="w-6 h-6 text-red-600" />
          <AlertCircle className="w-6 h-6 text-yellow-600" />
        </div>
      </section>

      {/* Contact Icons */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Contact Icons</h2>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-gray-500" />
            <span>contact@spa.com</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="w-5 h-5 text-gray-500" />
            <span>+1 234 567 890</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-gray-500" />
            <span>123 Wellness Street</span>
          </div>
        </div>
      </section>

      {/* Action Icons */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Action Icons</h2>
        <div className="flex gap-4 items-center">
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Plus className="w-5 h-5" />
            Add New
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">
            <Edit className="w-5 h-5" />
            Edit
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
            <Trash2 className="w-5 h-5" />
            Delete
          </button>
        </div>
      </section>

      {/* Search & Filter */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Search & Filter</h2>
        <div className="flex gap-4">
          <div className="flex items-center gap-2 px-4 py-2 border rounded-lg">
            <Search className="w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="outline-none"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50">
            <Filter className="w-5 h-5" />
            Filter
          </button>
        </div>
      </section>

      {/* Loading Spinner */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Loading Spinner</h2>
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </section>

      {/* Social Media Icons */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Social Media Icons</h2>
        <div className="flex gap-4">
          <a href="#" className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700">
            <Facebook className="w-5 h-5" />
          </a>
          <a href="#" className="w-10 h-10 bg-pink-600 rounded-full flex items-center justify-center text-white hover:bg-pink-700">
            <Instagram className="w-5 h-5" />
          </a>
          <a href="#" className="w-10 h-10 bg-sky-500 rounded-full flex items-center justify-center text-white hover:bg-sky-600">
            <Twitter className="w-5 h-5" />
          </a>
        </div>
      </section>

      {/* Different Sizes */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Icon Sizes</h2>
        <div className="flex gap-4 items-end">
          <Calendar className="w-3 h-3 text-blue-600" />
          <Calendar className="w-4 h-4 text-blue-600" />
          <Calendar className="w-5 h-5 text-blue-600" />
          <Calendar className="w-6 h-6 text-blue-600" />
          <Calendar className="w-8 h-8 text-blue-600" />
          <Calendar className="w-10 h-10 text-blue-600" />
        </div>
      </section>

      {/* Stroke Width */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Stroke Width</h2>
        <div className="flex gap-4 items-center">
          <Calendar className="w-8 h-8 text-blue-600" strokeWidth={1} />
          <Calendar className="w-8 h-8 text-blue-600" strokeWidth={2} />
          <Calendar className="w-8 h-8 text-blue-600" strokeWidth={3} />
        </div>
      </section>
    </div>
  );
}
