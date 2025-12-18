import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { ArrowLeft, Award, Download, Medal, Trophy } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface CertificateData {
  participantName: string;
  eventName: string;
  position: number;
  score?: number;
  time?: string;
  date: string;
  schoolName: string;
  certificateId: string;
}

export const CertificateView: React.FC = () => {
  const { resultId } = useParams<{ resultId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const certificateRef = useRef<HTMLDivElement>(null);
  
  const [certificateData, setCertificateData] = useState<CertificateData | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const fetchCertificateData = async () => {
      if (!resultId) return;
      
      try {
        // Mock certificate data - in real app, this would come from the API
        await new Promise(resolve => setTimeout(resolve, 800)); // Simulate API call
        
        const mockData: CertificateData = {
          participantName: 'John Doe',
          eventName: 'Mathematics Competition',
          position: 1,
          score: 95,
          date: '2025-01-15',
          schoolName: user?.schoolName || 'Springfield High Entity',
          certificateId: `CERT-${resultId}-2025`
        };
        
        setCertificateData(mockData);
      } catch (error) {
        console.error('Error fetching certificate data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCertificateData();
  }, [resultId, user]);

  const getPositionText = (position: number) => {
    switch (position) {
      case 1: return { text: 'FIRST PLACE', emoji: '🥇', color: 'text-yellow-600' };
      case 2: return { text: 'SECOND PLACE', emoji: '🥈', color: 'text-gray-600' };
      case 3: return { text: 'THIRD PLACE', emoji: '🥉', color: 'text-orange-600' };
      default: return { text: `${position}TH PLACE`, emoji: '🏅', color: 'text-blue-600' };
    }
  };

  const downloadCertificate = async () => {
    if (!certificateRef.current || !certificateData) return;
    
    setDownloading(true);
    
    try {
      const canvas = await html2canvas(certificateRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff'
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('landscape', 'mm', 'a4');
      
      const imgWidth = 297; // A4 landscape width
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`${certificateData.participantName}_${certificateData.eventName}_Certificate.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading certificate...</p>
        </div>
      </div>
    );
  }

  if (!certificateData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Certificate Not Found</h2>
          <p className="text-gray-600 mb-4">The requested certificate could not be found.</p>
          <button
            onClick={() => navigate(-1)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const positionInfo = getPositionText(certificateData.position);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Results
          </button>
          
          <div className="flex gap-3">
            <button
              onClick={downloadCertificate}
              disabled={downloading}
              className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              <Download className="w-5 h-5" />
              {downloading ? 'Generating PDF...' : 'Download Certificate'}
            </button>
          </div>
        </div>

        {/* Certificate */}
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
          <div
            ref={certificateRef}
            className="relative bg-gradient-to-br from-blue-50 via-white to-purple-50 p-16"
            style={{ aspectRatio: '297/210' }} // A4 landscape ratio
          >
            {/* Decorative Border */}
            <div className="absolute inset-4 border-4 border-double border-blue-600 rounded-lg"></div>
            <div className="absolute inset-8 border-2 border-blue-300 rounded-lg"></div>
            
            {/* Header */}
            <div className="text-center mb-12">
              <div className="flex justify-center items-center gap-4 mb-6">
                <Trophy className="w-16 h-16 text-yellow-600" />
                <div>
                  <h1 className="text-4xl font-bold text-gray-900 mb-2">CERTIFICATE OF ACHIEVEMENT</h1>
                  <p className="text-lg text-gray-600">Saudi Arabia Olympics System for Entity</p>
                </div>
                <Medal className="w-16 h-16 text-blue-600" />
              </div>
            </div>

            {/* Main Content */}
            <div className="text-center space-y-8">
              <div>
                <p className="text-xl text-gray-700 mb-4">This is to certify that</p>
                <h2 className="text-5xl font-bold text-blue-900 mb-4 border-b-2 border-blue-300 pb-2 inline-block">
                  {certificateData.participantName}
                </h2>
                <p className="text-lg text-gray-600">from {certificateData.schoolName}</p>
              </div>

              <div>
                <p className="text-xl text-gray-700 mb-2">has achieved</p>
                <div className="flex items-center justify-center gap-4 mb-4">
                  <span className="text-6xl">{positionInfo.emoji}</span>
                  <h3 className={`text-4xl font-bold ${positionInfo.color}`}>
                    {positionInfo.text}
                  </h3>
                </div>
                <p className="text-xl text-gray-700 mb-2">in the</p>
                <h4 className="text-3xl font-bold text-purple-900 mb-6">
                  {certificateData.eventName}
                </h4>
              </div>

              {/* Performance Details */}
              <div className="bg-white bg-opacity-70 rounded-lg p-6 mx-auto max-w-md">
                {certificateData.score && (
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-700 font-medium">Score:</span>
                    <span className="text-2xl font-bold text-green-600">{certificateData.score}/100</span>
                  </div>
                )}
                {certificateData.time && (
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-700 font-medium">Time:</span>
                    <span className="text-2xl font-bold text-blue-600">{certificateData.time}</span>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 font-medium">Date:</span>
                  <span className="text-lg font-semibold text-gray-900">
                    {new Date(certificateData.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="absolute bottom-16 left-16 right-16">
              <div className="flex justify-between items-end">
                <div className="text-center">
                  <div className="w-48 border-b-2 border-gray-400 mb-2"></div>
                  <p className="text-sm text-gray-600 font-medium">Compition Coordinator</p>
                </div>
                
                <div className="text-center">
                  <Award className="w-12 h-12 text-yellow-600 mx-auto mb-2" />
                  <p className="text-xs text-gray-500">Certificate ID: {certificateData.certificateId}</p>
                </div>
                
                <div className="text-center">
                  <div className="w-48 border-b-2 border-gray-400 mb-2"></div>
                  <p className="text-sm text-gray-600 font-medium">Entity Principal</p>
                </div>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute top-12 left-12 w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full opacity-20"></div>
            <div className="absolute top-12 right-12 w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full opacity-20"></div>
            <div className="absolute bottom-12 left-12 w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full opacity-20"></div>
            <div className="absolute bottom-12 right-12 w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-full opacity-20"></div>
          </div>
        </div>

        {/* Certificate Info */}
        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Certificate Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-700">Participant:</span>
              <span className="ml-2 text-gray-900">{certificateData.participantName}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Entity:</span>
              <span className="ml-2 text-gray-900">{certificateData.schoolName}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Compition:</span>
              <span className="ml-2 text-gray-900">{certificateData.eventName}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Achievement:</span>
              <span className="ml-2 text-gray-900">{positionInfo.text}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Date Issued:</span>
              <span className="ml-2 text-gray-900">{new Date().toLocaleDateString()}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Certificate ID:</span>
              <span className="ml-2 text-gray-900 font-mono">{certificateData.certificateId}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};