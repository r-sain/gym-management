import React from 'react';

const ImageModal = ({ isOpen, onClose, imageUrl, userName }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in zoom-in-95 duration-200" onClick={onClose}>
      <div className="relative bg-card border border-slate-700/50 p-2 rounded-2xl shadow-2xl max-w-3xl w-full" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center p-4 border-b border-slate-800">
          <h3 className="text-lg font-bold text-slate-200">Attachment: {userName}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
        <div className="p-4 flex items-center justify-center bg-slate-950/50 rounded-xl mt-2 overflow-hidden max-h-[75vh]">
          {imageUrl ? (
            <img src={imageUrl} alt="Attachment" className="max-w-full max-h-full object-contain rounded-lg shadow-md" />
          ) : (
            <p className="text-slate-500 py-10">No image attached to this member.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageModal;
