import React, { useState, useEffect } from 'react';
import { formatDate } from '../utils/date';
import WebcamModal from './WebcamModal';
import PaymentHistoryTooltip from './PaymentHistoryTooltip';
import { updateUser, getPaymentHistory } from '../services/api';

const InfoRow = React.memo(
  ({
    label,
    value,
    icon,
    field,
    editable = false,
    type = 'text',
    options = [],
    editData,
    setEditData,
    isEditing,
  }) => (
    <div className="flex flex-col gap-1 p-3 bg-slate-900/40 rounded-xl border border-slate-800/50">
      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
        {icon}
        {label}
      </span>
      {isEditing && editable && field ? (
        type === 'select' ? (
          <select
            value={editData[field] || ''}
            onChange={e =>
              setEditData(prev => ({ ...prev, [field]: e.target.value }))
            }
            className="text-sm font-medium text-slate-200 bg-slate-800/50 border border-slate-700 rounded px-2 py-1 focus:outline-none focus:border-primary"
          >
            <option value="">Select {label.toLowerCase()}</option>
            {options.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        ) : (
          <input
            type={type}
            value={editData[field] || ''}
            onChange={e =>
              setEditData(prev => ({ ...prev, [field]: e.target.value }))
            }
            className="text-sm font-medium text-slate-200 bg-slate-800/50 border border-slate-700 rounded px-2 py-1 focus:outline-none focus:border-primary"
          />
        )
      ) : (
        <span className="text-sm font-medium text-slate-200">
          {value || 'Not provided'}
        </span>
      )}
    </div>
  ),
);

const UserDetailsModal = ({
  isOpen,
  onClose,
  user,
  onPhotoSaved,
  onUserUpdated,
}) => {
  const [showWebcam, setShowWebcam] = useState(false);
  const [showPhoto, setShowPhoto] = useState(false);
  const [localPhoto, setLocalPhoto] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [editData, setEditData] = useState({
    phone: '',
    address: '',
    alternatePhone: '',
    guardianName: '',
    bloodGroup: '',
    birthdate: '',
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user && user._id) {
      let birthdateValue = '';
      try {
        if (user.birthdate) {
          const date = new Date(user.birthdate);
          if (!isNaN(date.getTime())) {
            birthdateValue = date.toISOString().split('T')[0];
          }
        }
      } catch (error) {
        console.warn('Invalid birthdate format:', user.birthdate);
      }

      setEditData({
        phone: user.phone || '',
        address: user.address || '',
        alternatePhone: user.alternatePhone || '',
        guardianName: user.guardianName || '',
        bloodGroup: user.bloodGroup || '',
        birthdate: birthdateValue,
      });

      // Fetch payment history
      const fetchPaymentHistory = async () => {
        try {
          const paymentHistoryData = await getPaymentHistory(user._id);
          setPaymentHistory(paymentHistoryData || []);
        } catch (error) {
          console.error('Failed to fetch payment history:', error);
          setPaymentHistory([]);
        }
      };
      fetchPaymentHistory();
    }
  }, [user]);

  // Reset editing state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setIsEditing(false);
      setIsSaving(false);
    }
  }, [isOpen]);

  // Don't render if modal is closed or user is not available
  if (!isOpen || !user || !user._id) {
    return null;
  }

  const photo = localPhoto || user.photo;

  const bloodGroupOptions = [
    { value: 'A+', label: 'A+' },
    { value: 'A-', label: 'A-' },
    { value: 'B+', label: 'B+' },
    { value: 'B-', label: 'B-' },
    { value: 'AB+', label: 'AB+' },
    { value: 'AB-', label: 'AB-' },
    { value: 'O+', label: 'O+' },
    { value: 'O-', label: 'O-' },
  ];

  const handlePhotoCaptured = async base64 => {
    setLocalPhoto(base64);
    if (onPhotoSaved) await onPhotoSaved(user._id, base64);
  };

  const handleSave = async () => {
    if (!user || !user._id) {
      console.error('No user data available for saving');
      return;
    }

    setIsSaving(true);
    try {
      const result = await updateUser(user._id, editData);
      if (result.success && onUserUpdated) {
        onUserUpdated(result.data);
      }
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update user:', error);
      // You might want to show an error message to the user here
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (user && user._id) {
      let birthdateValue = '';
      try {
        if (user.birthdate) {
          const date = new Date(user.birthdate);
          if (!isNaN(date.getTime())) {
            birthdateValue = date.toISOString().split('T')[0];
          }
        }
      } catch (error) {
        console.warn('Invalid birthdate format:', user.birthdate);
      }

      setEditData({
        phone: user.phone || '',
        address: user.address || '',
        alternatePhone: user.alternatePhone || '',
        guardianName: user.guardianName || '',
        bloodGroup: user.bloodGroup || '',
        birthdate: birthdateValue,
      });
    }
    setIsEditing(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md">
      <div className="bg-card border border-slate-700/50 rounded-[2rem] shadow-2xl w-full max-w-2xl max-h-[95vh] flex flex-col relative overflow-hidden animate-in fade-in zoom-in duration-300">
        {/* Background Decor */}
        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-primary/10 to-transparent"></div>
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/10 blur-3xl rounded-full"></div>

        {/* Fixed Header */}
        <div className="p-6 sm:p-8 relative z-10 border-b border-slate-800/50 flex justify-between items-center">
          <div className="flex gap-4 items-center">
            {/* Avatar with camera overlay */}
            <div className="relative group">
              <div
                className={`w-14 h-14 bg-gradient-to-br from-primary to-blue-600 rounded-2xl flex items-center justify-center text-xl font-black text-white shadow-lg shadow-primary/20 overflow-hidden ${photo ? 'cursor-pointer' : ''}`}
                onClick={() => photo && setShowPhoto(true)}
                title={photo ? 'Click to view photo' : ''}
              >
                {photo ? (
                  <img
                    src={photo}
                    alt={user.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span>{user.name.charAt(0)}</span>
                )}
              </div>
              {/* Camera button overlay */}
              <button
                onClick={() => setShowWebcam(true)}
                className="absolute -bottom-1.5 -right-1.5 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center shadow-md hover:bg-blue-500 transition-all opacity-0 group-hover:opacity-100"
                title="Update photo"
              >
                <svg
                  className="w-3 h-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </button>
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                {user.name}
              </h2>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold uppercase tracking-widest">
                  {user.plan?.type} Member
                </span>
                <span className="text-slate-500 text-[10px] font-bold tracking-wider">
                  BILL NO: {user.billNumber || 'N/A'}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-700 rounded-xl transition-all border border-slate-700/50"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.5"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <InfoRow
              label="WhatsApp Number"
              value={user.phone}
              field="phone"
              editable={true}
              editData={editData}
              setEditData={setEditData}
              isEditing={isEditing}
            />
            <InfoRow
              label="Alternate Phone"
              value={user.alternatePhone}
              field="alternatePhone"
              editable={true}
              editData={editData}
              setEditData={setEditData}
              isEditing={isEditing}
            />
            <InfoRow
              label="Guardian Name"
              value={user.guardianName}
              field="guardianName"
              editable={true}
              editData={editData}
              setEditData={setEditData}
              isEditing={isEditing}
            />
            <InfoRow
              label="Blood Group"
              value={user.bloodGroup}
              field="bloodGroup"
              editable={true}
              type="select"
              options={bloodGroupOptions}
              editData={editData}
              setEditData={setEditData}
              isEditing={isEditing}
            />
            <InfoRow
              label="Birthdate"
              value={user.birthdate ? formatDate(user.birthdate) : 'N/A'}
              field="birthdate"
              editable={true}
              type="date"
              editData={editData}
              setEditData={setEditData}
              isEditing={isEditing}
            />
            <InfoRow
              label="Enrollment Date"
              value={
                user.enrollmentDate ? formatDate(user.enrollmentDate) : 'N/A'
              }
            />
            <InfoRow
              label="Address"
              value={user.address}
              field="address"
              editable={true}
              editData={editData}
              setEditData={setEditData}
              isEditing={isEditing}
            />
          </div>

          <div className="mt-6 pt-6 border-t border-slate-800">
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">
              Billing & Plan Info
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
              <div className="flex flex-col">
                <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider mb-1">
                  Plan Started
                </span>
                <span className="text-sm font-semibold text-slate-200">
                  {formatDate(user.plan?.startDate)}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider mb-1">
                  Plan Expiry
                </span>
                <span className="text-sm font-semibold text-slate-200">
                  {formatDate(user.plan?.endDate)}
                </span>
              </div>
              <div className="flex flex-col text-right sm:text-left">
                <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider mb-1">
                  Paid Lifetime
                </span>
                <PaymentHistoryTooltip paymentHistory={paymentHistory}>
                  <span className="text-sm font-black text-primary cursor-help hover:text-blue-400 transition-colors">
                    ₹{user.price?.toLocaleString()}
                  </span>
                </PaymentHistoryTooltip>
              </div>
              {user.enrollmentFees > 0 && (
                <div className="flex flex-col">
                  <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider mb-1">
                    Enrollment Fee
                  </span>
                  <span className="text-sm font-semibold text-slate-200">
                    ₹{user.enrollmentFees}
                  </span>
                </div>
              )}
            </div>

            {user.discountReason && (
              <div className="mt-6 p-4 bg-primary/5 border border-primary/10 rounded-2xl">
                <span className="text-[10px] text-primary/60 font-black uppercase tracking-widest block mb-2">
                  Discount Reason / Note
                </span>
                <p className="text-xs text-slate-300 italic leading-relaxed">
                  "{user.discountReason}"
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Fixed Footer */}
        <div className="p-4 sm:p-6 border-t border-slate-800/50 bg-slate-900/40 flex justify-between">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-xl border border-primary/50 hover:bg-blue-500 transition-all active:scale-95"
            disabled={isSaving}
          >
            {isEditing ? 'Cancel Edit' : 'Edit Profile'}
          </button>
          <div className="flex gap-2">
            {isEditing && (
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="px-6 py-2 bg-green-600 text-white text-xs font-bold rounded-xl border border-green-500/50 hover:bg-green-500 transition-all active:scale-95 disabled:opacity-50"
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            )}
            <button
              onClick={onClose}
              className="px-8 py-2 bg-slate-800 text-slate-300 text-xs font-bold rounded-xl border border-slate-700/50 hover:bg-slate-700 transition-all active:scale-95"
              disabled={isSaving}
            >
              Close Profile
            </button>
          </div>
        </div>
      </div>

      {/* Webcam Modal */}
      <WebcamModal
        isOpen={showWebcam}
        onClose={() => setShowWebcam(false)}
        onCapture={handlePhotoCaptured}
      />

      {/* Compact Photo Viewer */}
      {showPhoto && photo && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/90 backdrop-blur-md p-4"
          onClick={() => setShowPhoto(false)}
        >
          <div
            className="relative bg-slate-900 border border-slate-700/50 rounded-3xl overflow-hidden shadow-2xl"
            style={{ width: 320, maxWidth: '90vw' }}
            onClick={e => e.stopPropagation()}
          >
            <img
              src={photo}
              alt={user.name}
              style={{
                width: 320,
                height: 320,
                maxWidth: '90vw',
                maxHeight: '90vw',
              }}
              className="object-cover block"
            />
            <div className="p-3 flex items-center justify-between">
              <span className="text-sm font-bold text-slate-200">
                {user.name}
              </span>
              <button
                onClick={() => setShowPhoto(false)}
                className="text-xs text-slate-500 hover:text-white bg-slate-800 px-3 py-1 rounded-lg transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDetailsModal;
