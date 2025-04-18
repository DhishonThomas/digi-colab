// ConfirmationModal.tsx
import React from 'react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  actionType: 'block' | 'unblock'; // dynamic type for block/unblock actions
  regNumber: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  actionType,
  regNumber,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <div className="text-center space-y-4">
          <div className="text-red-600 text-4xl">⚠️</div>
          <h3 className="text-lg font-semibold">
            Are you sure you want to{' '}
            <span className={actionType === 'block' ? 'text-red-600' : 'text-green-600'}>
              {actionType === 'block' ? 'Block' : 'Unblock'}
            </span>{' '}
            this user with Registration Number: <strong>{regNumber}</strong>?
          </h3>
          <div className="flex justify-center gap-4 mt-4">
            <button
              onClick={onConfirm}
              className={`px-4 py-2 rounded-md text-white font-semibold ${
                actionType === 'block' ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              {actionType === 'block' ? 'Yes, Block' : 'Yes, Unblock'}
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-100"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
