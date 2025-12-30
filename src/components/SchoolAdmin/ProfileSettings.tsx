import React, { useState } from 'react';
import { School, User, Mail, Phone, MapPin, Camera, Lock, Save, Edit } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

export const ProfileSettings: React.FC = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const { t, isRTL } = useLanguage();

  const [formData, setFormData] = useState({
    schoolName: user?.schoolName || '',
    contactName: user?.name || '',
    email: user?.email || '',
    phone: '+1 (555) 123-4567',
    address: '123 Main Street, Springfield, IL 62701',
    website: 'www.springfieldhigh.edu',
    establishedYear: '1985',
    totalStudents: '1200',
    principalName: 'Dr. Sarah Johnson',
    description: 'Springfield High Entity is a premier educational institution committed to academic excellence and character development.'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    // In a real app, this would make an API call
    console.log('Saving profile data:', formData);
    setIsEditing(false);
  };

  const PasswordChangeModal = () => (
    <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 ${isRTL ? "rtl" : "ltr"}`}>
      <div className="bg-white rounded-xl p-8 max-w-md w-full">

        <div className={`flex items-center justify-between mb-6 ${isRTL ? "flex-row-reverse" : ""}`}>
          <h2 className="text-2xl font-bold text-gray-900">
            {t("changePassword")}
          </h2>
          <button
            onClick={() => setShowPasswordModal(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
        </div>

        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("currentPassword")}
            </label>
            <input
              type="password"
              placeholder={t("currentPasswordPlaceholder")}
              className={`w-full px-4 py-3 border border-gray-300 rounded-lg 
            focus:ring-2 focus:ring-blue-500 focus:border-transparent
            ${isRTL ? "text-right" : "text-left"}`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("newPassword")}
            </label>
            <input
              type="password"
              placeholder={t("newPasswordPlaceholder")}
              className={`w-full px-4 py-3 border border-gray-300 rounded-lg 
            focus:ring-2 focus:ring-blue-500 focus:border-transparent
            ${isRTL ? "text-right" : "text-left"}`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("confirmNewPassword")}
            </label>
            <input
              type="password"
              placeholder={t("confirmNewPasswordPlaceholder")}
              className={`w-full px-4 py-3 border border-gray-300 rounded-lg 
            focus:ring-2 focus:ring-blue-500 focus:border-transparent
            ${isRTL ? "text-right" : "text-left"}`}
            />
          </div>

          <div className={`flex gap-4 pt-4 ${isRTL ? "flex-row-reverse" : ""}`}>
            <button
              type="button"
              onClick={() => setShowPasswordModal(false)}
              className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg hover:bg-gray-200 transition-colors"
            >
              {t("cancel")}
            </button>

            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all"
            >
              {t("updatePassword")}
            </button>
          </div>
        </form>
      </div>
    </div>

  );

  return (
    <div className={`p-8 ${isRTL ? "text-right" : "ltr"}`}>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          {t("profileSettingsTitle")}
        </h1>
        <p className="text-gray-600 mt-2">
          {t("profileSettingsSubtitle")}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Picture & Basic Info */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="text-center mb-6">
              <div className="relative inline-block">
                <div className="w-32 h-32 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-4xl font-bold mx-auto mb-4">
                  {formData.schoolName.charAt(0)}
                </div>
                <button className="absolute bottom-2 right-2 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow">
                  <Camera className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              <h2 className="text-xl font-bold text-gray-900">
                {formData.schoolName}
              </h2>
              <p className="text-gray-600">{formData.contactName}</p>
            </div>

            <div className="space-y-4">
              <div className={`flex items-center text-gray-600 ${isRTL ? " space-x-reverse space-x-3" : "space-x-3"}`}>
                <Mail className="w-5 h-5" />
                <span className="text-sm">{formData.email}</span>
              </div>

              <div className={`flex items-center text-gray-600 ${isRTL ? " space-x-reverse space-x-3" : "space-x-3"}`}>
                <Phone className="w-5 h-5" />
                <span className="text-sm">{formData.phone}</span>
              </div>

              <div className={`flex items-start text-gray-600 ${isRTL ? " space-x-reverse space-x-3" : "space-x-3"}`}>
                <MapPin className="w-5 h-5 mt-1" />
                <span className="text-sm">{formData.address}</span>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t">
              <button
                onClick={() => setShowPasswordModal(true)}
                className="w-full flex items-center justify-center gap-2 bg-gray-100 text-gray-700 py-3 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <Lock className="w-5 h-5" />
                {t("changePassword")}
              </button>
            </div>
          </div>
        </div>

        {/* Detailed Information */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                {t("entityInformation")}
              </h2>

              <div className="flex gap-3">
                {isEditing ? (
                  <>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                    >
                      {t("cancel")}
                    </button>

                    <button
                      onClick={handleSave}
                      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg"
                    >
                      <Save className="w-4 h-4" />
                      {t("saveChanges")}
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg"
                  >
                    <Edit className="w-4 h-4" />
                    {t("editProfile")}
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                ["entityName", "schoolName"],
                ["contactPerson", "contactName"],
                ["emailAddress", "email"],
                ["phoneNumber", "phone"],
                ["website", "website"],
                ["establishedYear", "establishedYear"],
                ["totalParticipants", "totalStudents"],
                ["principalName", "principalName"],
              ].map(([labelKey, name]) => (
                <div key={name}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t(labelKey)}
                  </label>
                  <input
                    type="text"
                    name={name}
                    value={(formData as any)[name]}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={`w-full px-4 py-3 border border-gray-300 rounded-lg ${isEditing ? "focus:ring-2 focus:ring-blue-500" : "bg-gray-50"
                      }`}
                  />
                </div>
              ))}
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("entityAddress")}
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                disabled={!isEditing}
                rows={3}
                className={`w-full px-4 py-3 border border-gray-300 rounded-lg ${isEditing ? "focus:ring-2 focus:ring-blue-500" : "bg-gray-50"
                  }`}
              />
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("entityDescription")}
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                disabled={!isEditing}
                rows={4}
                className={`w-full px-4 py-3 border border-gray-300 rounded-lg ${isEditing ? "focus:ring-2 focus:ring-blue-500" : "bg-gray-50"
                  }`}
              />
            </div>
          </div>

          {/* Account Statistics */}
          <div className="bg-white rounded-xl shadow-lg p-6 mt-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              {t("accountStatistics")}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <School className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">8</p>
                <p className="text-sm text-gray-600">{t("competitionsJoined")}</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <User className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">45</p>
                <p className="text-sm text-gray-600">{t("participants")}</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <Mail className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">12</p>
                <p className="text-sm text-gray-600">{t("certificates")}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showPasswordModal && <PasswordChangeModal />}
    </div>

  );
};