import { Building, Calendar, CheckCircle, CreditCard, DollarSign, Download, Smartphone } from 'lucide-react';
import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';

export const PaymentScreen: React.FC = () => {
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'bank' | 'mobile'>('card');
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'processing' | 'completed'>('pending');
  const { t, isRTL } = useLanguage();

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
      <div className={`p-8 ${isRTL ? "rtl text-right" : "ltr"}`}>
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {t("paymentSuccessTitle")}
            </h1>

            <p className="text-gray-600 mb-8">
              {t("paymentSuccessDescription").replace("{amount}", `$${total}`)}
            </p>

            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <div className="grid grid-cols-2 gap-4 text-left">
                <div>
                  <p className="text-sm text-gray-500">
                    {t("transactionId")}
                  </p>
                  <p className="font-semibold">
                    TXN-{Date.now()}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    {t("paymentMethod")}
                  </p>
                  <p className="font-semibold capitalize">
                    {paymentMethod} {t("payment")}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    {t("paymentDate")}
                  </p>
                  <p className="font-semibold">
                    {new Date().toLocaleDateString()}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    {t("paymentStatus")}
                  </p>
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                    {t("paymentCompleted")}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-4 justify-center">
              <button className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                <Download className="w-5 h-5" />
                {t("downloadInvoice")}
              </button>

              <button className="flex items-center gap-2 bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors">
                <Calendar className="w-5 h-5" />
                {t("addParticipants")}
              </button>
            </div>
          </div>
        </div>
      </div>

    );
  }

  if (paymentStatus === 'processing') {
    return (
      <div className={`p-8 ${isRTL ? "rtl text-right" : "ltr text-center"}`}>
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="w-20 h-20 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>

            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {t("processingPayment")}
            </h1>

            <p className="text-gray-600">
              {t("processingPaymentDescription")}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`p-8 ${isRTL ? "rtl text-right" : "ltr text-left"}`}>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          {t("payment")}
        </h1>
        <p className="text-gray-600 mt-2">
          {t("paymentDescription")}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-lg p-6 sticky top-8">
            <h2 className="text-xl font-bold mb-6">
              {t("orderSummary")}
            </h2>

            <div className="space-y-4 mb-6">
              {selectedEvents.map((event) => (
                <div
                  key={event.id}
                  className="flex justify-between"
                >
                  <span className="text-gray-600">{event.name}</span>
                  <span className="font-semibold">${event.fee}</span>
                </div>
              ))}
            </div>

            <hr className="my-4" />

            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span className="text-gray-600">{t("subtotal")}</span>
                <span className="font-semibold">${subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">{t("processingFee")}</span>
                <span className="font-semibold">${processingFee}</span>
              </div>
            </div>

            <hr className="my-4" />

            <div className="flex justify-between text-xl font-bold">
              <span>{t("total")}</span>
              <span>${total}</span>
            </div>
          </div>
        </div>

        {/* Payment Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold mb-6">
              {t("paymentMethod")}
            </h2>

            {/* Payment Method Selector */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              {[
                { key: "card", icon: CreditCard, label: t("card") },
                { key: "bank", icon: Building, label: t("bankTransfer") },
                { key: "mobile", icon: Smartphone, label: t("mobilePayment") },
              ].map(({ key, icon: Icon, label }) => (
                <button
                  key={key}
                  onClick={() => setPaymentMethod(key)}
                  className={`p-4 border-2 rounded-lg transition-all ${paymentMethod === key
                    ? "border-blue-600 bg-blue-50 text-blue-600"
                    : "border-gray-300 hover:border-gray-400"
                    }`}
                >
                  <Icon className="w-8 h-8 mx-auto mb-2" />
                  <p className="font-medium">{label}</p>
                </button>
              ))}
            </div>

            {/* Forms */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handlePayment();
              }}
            >

              {/* Card */}
              {paymentMethod === "card" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {t("cardNumber")}
                    </label>
                    <input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        {t("expiryDate")}
                      </label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        {t("cvv")}
                      </label>
                      <input
                        type="text"
                        placeholder="123"
                        className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {t("cardholderName")}
                    </label>
                    <input
                      type="text"
                      placeholder="John Doe"
                      className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              )}

              {/* Bank */}
              {paymentMethod === "bank" && (
                <div className="bg-blue-50 p-6 rounded-lg">
                  <h3 className="font-semibold mb-4">
                    {t("bankDetails")}
                  </h3>
                  <div className="space-y-2 text-sm">
                    <p><strong>{t("bankName")}:</strong> Saudi Arabia Olympics Bank</p>
                    <p><strong>{t("accountNumber")}:</strong> 1234567890123456</p>
                    <p><strong>{t("routingNumber")}:</strong> 987654321</p>
                    <p><strong>{t("reference")}:</strong> PAY-{Date.now()}</p>
                  </div>
                  <p className="text-sm mt-4">
                    {t("bankNote")}
                  </p>
                </div>
              )}

              {/* Mobile */}
              {paymentMethod === "mobile" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {t("mobileNumber")}
                    </label>
                    <input
                      type="tel"
                      placeholder="+1 (555) 123-4567"
                      className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {t("mobileProvider")}
                    </label>
                    <select className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500">
                      <option>Apple Pay</option>
                      <option>Google Pay</option>
                      <option>Samsung Pay</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Pay Button */}
              <div className="mt-8">
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-lg text-lg font-medium hover:scale-[1.02] transition flex items-center justify-center gap-2"
                >
                  <DollarSign className="w-6 h-6" />
                  {t("pay")} ${total}
                </button>
              </div>

            </form>
          </div>
        </div>
      </div>
    </div>

  );
};