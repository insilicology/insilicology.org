'use client';

import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { DFTRegistration } from '@/types/dft.type';
import { 
  Search, 
  Download, 
  Eye, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  GraduationCap,
  FileText,
  CreditCard,
  ExternalLink
} from 'lucide-react';

export default function DFTSubmissionsPage() {
  const supabase = createClientComponentClient();
  const [submissions, setSubmissions] = useState<DFTRegistration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [countryFilter, setCountryFilter] = useState('');
  const [selectedSubmission, setSelectedSubmission] = useState<DFTRegistration | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('dft_reg')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSubmissions(data || []);
    } catch (err) {
      setError('Failed to fetch submissions');
      console.error('Error fetching submissions:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredSubmissions = submissions.filter(submission => {
    const matchesSearch = 
      submission.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      submission.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      submission.country.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = !statusFilter || submission.status === statusFilter;
    const matchesCountry = !countryFilter || submission.country === countryFilter;

    return matchesSearch && matchesStatus && matchesCountry;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PhD': return 'bg-purple-100 text-purple-800';
      case 'MSc': return 'bg-blue-100 text-blue-800';
      case 'BSc': return 'bg-green-100 text-green-800';
      case 'Researcher': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getExperienceColor = (experience: string) => {
    return experience === 'Yes' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-yellow-100 text-yellow-800';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const exportToCSV = () => {
    const headers = [
      'ID', 'Full Name', 'Email', 'Phone', 'Country', 'State', 'City',
      'Status', 'Experience', 'Payment Method', 'Comments', 'Created At'
    ];
    
    const csvData = filteredSubmissions.map(sub => [
      sub.id,
      sub.full_name,
      sub.email,
      sub.phone || '',
      sub.country,
      sub.state || '',
      sub.city || '',
      sub.status,
      sub.experience,
      sub.payment_method,
      sub.comments,
      formatDate(sub.created_at)
    ]);

    const csvContent = [headers, ...csvData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dft-submissions-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="p-4">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">DFT Course Submissions</h1>
          <p className="text-gray-600 mt-1">
            {filteredSubmissions.length} of {submissions.length} submissions
          </p>
        </div>
        <button
          onClick={exportToCSV}
          className="mt-4 md:mt-0 inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <Download className="w-4 h-4 mr-2" />
          Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by name, email, or country..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          >
            <option value="">All Status</option>
            <option value="PhD">PhD</option>
            <option value="MSc">MSc</option>
            <option value="BSc">BSc</option>
            <option value="Researcher">Researcher</option>
            <option value="Other">Other</option>
          </select>

          {/* Country Filter */}
          <select
            value={countryFilter}
            onChange={(e) => setCountryFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          >
            <option value="">All Countries</option>
            {Array.from(new Set(submissions.map(s => s.country))).sort().map(country => (
              <option key={country} value={country}>{country}</option>
            ))}
          </select>

          {/* Clear Filters */}
          <button
            onClick={() => {
              setSearchTerm('');
              setStatusFilter('');
              setCountryFilter('');
            }}
            className="px-4 py-2 text-gray-600 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {/* Submissions List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {filteredSubmissions.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No submissions found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <div className="min-w-full inline-block align-middle">
              <div className="overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[200px]">
                        Applicant
                      </th>
                      <th scope="col" className="hidden md:table-cell px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[150px]">
                        Contact
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px]">
                        Location
                      </th>
                      <th scope="col" className="hidden md:table-cell px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[140px]">
                        Status
                      </th>
                      <th scope="col" className="hidden md:table-cell px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px]">
                        Payment
                      </th>
                      <th scope="col" className="hidden md:table-cell px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[140px]">
                        Date
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[100px]">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredSubmissions.map((submission) => (
                      <tr key={submission.id} className="hover:bg-gray-50">
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900 truncate max-w-[180px]">
                              {submission.full_name}
                            </div>
                            <div className="flex items-center text-sm text-gray-500 truncate max-w-[180px]">
                              <Mail className="w-3 h-3 mr-1 text-gray-400 flex-shrink-0" />
                              {submission.email.substring(0, 16)}...
                            </div>
                          </div>
                        </td>
                        <td className="hidden md:table-cell px-4 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {submission.phone && (
                              <div className="flex items-center mb-1">
                                <Phone className="w-3 h-3 mr-1 text-gray-400 flex-shrink-0" />
                                <span className="truncate max-w-[120px]">{submission.phone}</span>
                              </div>
                            )}
                            {submission.messenger && (
                              <div className="text-xs text-gray-500 truncate max-w-[120px]">
                                M: {submission.messenger}
                              </div>
                            )}
                            {submission.telegram && (
                              <div className="text-xs text-gray-500 truncate max-w-[120px]">
                                T: {submission.telegram}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            <div className="flex items-center">
                              <MapPin className="w-3 h-3 mr-1 text-gray-400 flex-shrink-0" />
                              <span className="truncate max-w-[100px]">{submission.country}</span>
                            </div>
                            {submission.state && (
                              <div className="text-xs text-gray-500 truncate max-w-[100px]">
                                {submission.state}{submission.city && `, ${submission.city}`}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="hidden md:table-cell px-4 py-4 whitespace-nowrap">
                          <div className="flex flex-col gap-1">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(submission.status)}`}>
                              <GraduationCap className="w-3 h-3 mr-1 flex-shrink-0" />
                              <span className="truncate">{submission.status}</span>
                            </span>
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getExperienceColor(submission.experience)}`}>
                              <span className="truncate">{submission.experience}</span>
                            </span>
                          </div>
                        </td>
                        <td className="hidden md:table-cell px-4 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            <div className="flex items-center">
                              <CreditCard className="w-3 h-3 mr-1 text-gray-400 flex-shrink-0" />
                              <span className="truncate max-w-[100px]">{submission.payment_method}</span>
                            </div>
                            {submission.payment_screenshot_url && (
                              <a
                                href={submission.payment_screenshot_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-amber-600 hover:text-amber-800 flex items-center"
                              >
                                <ExternalLink className="w-3 h-3 mr-1 flex-shrink-0" />
                                <span className="truncate">View</span>
                              </a>
                            )}
                          </div>
                        </td>
                        <td className="hidden md:table-cell px-4 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            <div className="flex items-center">
                              <Calendar className="w-3 h-3 mr-1 text-gray-400 flex-shrink-0" />
                              <span className="truncate max-w-[120px]">{formatDate(submission.created_at)}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => {
                              setSelectedSubmission(submission);
                              setShowModal(true);
                            }}
                            className="text-amber-600 hover:text-amber-900 flex items-center"
                          >
                            <Eye className="w-4 h-4 mr-1 flex-shrink-0" />
                            <span className="truncate">View</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {showModal && selectedSubmission && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Submission Details</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                {/* Personal Information */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Personal Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Full Name</label>
                      <p className="text-sm text-gray-900">{selectedSubmission.full_name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Email</label>
                      <p className="text-sm text-gray-900">{selectedSubmission.email}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Phone</label>
                      <p className="text-sm text-gray-900">{selectedSubmission.phone || 'Not provided'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Status</label>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedSubmission.status)}`}>
                        {selectedSubmission.status}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                {(selectedSubmission.messenger || selectedSubmission.telegram) && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Additional Contact</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedSubmission.messenger && (
                        <div>
                          <label className="text-sm font-medium text-gray-500">Messenger</label>
                          <p className="text-sm text-gray-900">{selectedSubmission.messenger}</p>
                        </div>
                      )}
                      {selectedSubmission.telegram && (
                        <div>
                          <label className="text-sm font-medium text-gray-500">Telegram</label>
                          <p className="text-sm text-gray-900">{selectedSubmission.telegram}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Location */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Location</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Country</label>
                      <p className="text-sm text-gray-900">{selectedSubmission.country}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">State</label>
                      <p className="text-sm text-gray-900">{selectedSubmission.state || 'Not provided'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">City</label>
                      <p className="text-sm text-gray-900">{selectedSubmission.city || 'Not provided'}</p>
                    </div>
                  </div>
                </div>

                {/* Experience & Comments */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Course Information</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">DFT Experience</label>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getExperienceColor(selectedSubmission.experience)}`}>
                        {selectedSubmission.experience}
                      </span>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Course Expectations</label>
                      <p className="text-sm text-gray-900 mt-1">{selectedSubmission.comments}</p>
                    </div>
                  </div>
                </div>

                {/* Payment Information */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Payment Information</h3>
                  <div className="space-y-2">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Payment Method</label>
                      <p className="text-sm text-gray-900">{selectedSubmission.payment_method}</p>
                    </div>
                    {selectedSubmission.payment_screenshot_url && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">Payment Screenshot</label>
                        <div className="mt-1">
                          <a
                            href={selectedSubmission.payment_screenshot_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-amber-600 hover:text-amber-800"
                          >
                            <ExternalLink className="w-4 h-4 mr-1" />
                            View Screenshot
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Timestamps */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Timestamps</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Submitted</label>
                      <p className="text-sm text-gray-900">{formatDate(selectedSubmission.created_at)}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Last Updated</label>
                      <p className="text-sm text-gray-900">{formatDate(selectedSubmission.updated_at)}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 