import React, { useState } from 'react';
import { CreditCard, Building, Smartphone, CheckCircle, DollarSign, Download, Calendar } from 'lucide-react';

export const PaymentScreen: React.FC = () => {
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'bank' | 'mobile'>('card');
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'processing' | 'completed'>('pending');

  const selectedEvents = [
    { id: '1', name: 'Mathematics Competition', fee: 50 },
    { id: '3', name: 'Science Fair', fee: 75 },
    { id: '5', name: 'Debate Championship', fee: 100 },
  ];

  const subtotal = selectedEvents.reduce((sum, event) => sum + event.fee, 0);
  const processingFee = Math.round(subtotal * 0.025);
  const total = subtotal + processingFee;

  const handlePayment = async () => {
    setPaymentStatus('processing');
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 3000));
    setPaymentStatus('completed');
  };

  if (paymentStatus === 'completed') {
    return (
      <div className="p-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Payment Successful!</h1>
            <p className="text-gray-600 mb-8">Your payment of ${total} has been processed successfully.</p>
            
            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <div className="grid grid-cols-2 gap-4 text-left">
                <div>
                  <p className="text-sm text-gray-500">Transaction ID</p>
                  <p className="font-semibold">TXN-{Date.now()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Payment Method</p>
                  <p className="font-semibold capitalize">{paymentMethod} Payment</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Date</p>
                  <p className="font-semibold">{new Date().toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                    Completed
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-4 justify-center">
              <button className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                <Download className="w-5 h-5" />
                Download Invoice
              </button>
              <button className="flex items-center gap-2 bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors">
                <Calendar className="w-5 h-5" />
                Add Participants
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (paymentStatus === 'processing') {
    return (
      <div className="p-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="w-20 h-20 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Processing Payment</h1>
            <p className="text-gray-600">Please wait while we process your payment...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Payment</h1>
        <p className="text-gray-600 mt-2">Complete your payment for selected events</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Payment Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-lg p-6 sticky top-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
            
            <div className="space-y-4 mb-6">
              {selectedEvents.map((event) => (
                <div key={event.id} className="flex justify-between">
                  <span className="text-gray-600">{event.name}</span>
                  <span className="font-semibold">${event.fee}</span>
                </div>
              ))}
            </div>

            <hr className="my-4" />
            
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-semibold">${subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Processing Fee</span>
                <span className="font-semibold">${processingFee}</span>
              </div>
            </div>

            <hr className="my-4" />
            
            <div className="flex justify-between text-xl font-bold text-gray-900">
              <span>Total</span>
              <span>${total}</span>
            </div>
          </div>
        </div>

        {/* Payment Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Payment Method</h2>
            
            {/* Payment Method Selection */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <button
                onClick={() => setPaymentMethod('card')}
                className={`p-4 border-2 rounded-lg transition-all duration-200 ${
                  paymentMethod === 'card'
                    ? 'border-blue-600 bg-blue-50 text-blue-600'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <CreditCard className="w-8 h-8 mx-auto mb-2" />
                <p className="font-medium">Credit/Debit Card</p>
              </button>
              
              <button
                onClick={() => setPaymentMethod('bank')}
                className={`p-4 border-2 rounded-lg transition-all duration-200 ${
                  paymentMethod === 'bank'
                    ? 'border-blue-600 bg-blue-50 text-blue-600'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <Building className="w-8 h-8 mx-auto mb-2" />
                <p className="font-medium">Bank Transfer</p>
              </button>
              
              <button
                onClick={() => setPaymentMethod('mobile')}
                className={`p-4 border-2 rounded-lg transition-all duration-200 ${
                  paymentMethod === 'mobile'
                    ? 'border-blue-600 bg-blue-50 text-blue-600'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <Smartphone className="w-8 h-8 mx-auto mb-2" />
                <p className="font-medium">Mobile Payment</p>
              </button>
            </div>

            {/* Payment Form Fields */}
            <form onSubmit={(e) => { e.preventDefault(); handlePayment(); }}>
              {paymentMethod === 'card' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Card Number
                    </label>
                    <input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        CVV
                      </label>
                      <input
                        type="text"
                        placeholder="123"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cardholder Name
                    </label>
                    <input
                      type="text"
                      placeholder="John Doe"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              )}

              {paymentMethod === 'bank' && (
                <div className="bg-blue-50 p-6 rounded-lg">
                  <h3 className="font-semibold text-blue-900 mb-4">Bank Transfer Details</h3>
                  <div className="space-y-2 text-sm text-blue-800">
                    <p><strong>Bank Name:</strong> Olympics Bank</p>
                    <p><strong>Account Number:</strong> 1234567890123456</p>
                    <p><strong>Routing Number:</strong> 987654321</p>
                    <p><strong>Reference:</strong> {`PAY-${Date.now()}`}</p>
                  </div>
                  <p className="text-sm text-blue-700 mt-4">
                    Please include the reference number in your transfer description.
                  </p>
                </div>
              )}

              {paymentMethod === 'mobile' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mobile Number
                    </label>
                    <input
                      type="tel"
                      placeholder="+1 (555) 123-4567"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mobile Payment Provider
                    </label>
                    <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option value="apple">Apple Pay</option>
                      <option value="google">Google Pay</option>
                      <option value="samsung">Samsung Pay</option>
                    </select>
                  </div>
                </div>
              )}

              <div className="mt-8">
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-lg font-medium text-lg hover:from-blue-700 hover:to-purple-700 transform transition-all duration-200 hover:scale-[1.02] flex items-center justify-center gap-2"
                >
                  <DollarSign className="w-6 h-6" />
                  Pay ${total}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};