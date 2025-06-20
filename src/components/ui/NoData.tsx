// components/NoData.tsx
import React from 'react';

interface NoDataProps {
  message: string;
  description?: string;
  imageSrc?: string;
  actionText?: string;
  onActionClick?: () => void;
}

const NoData: React.FC<NoDataProps> = ({
  message,
  description,
  imageSrc = "/images/no_data.png", // Default image
  actionText,
  onActionClick,
}) => {
  return (
    <div className="flex mt-10 flex-col items-center justify-center h-64 bg-gray-50 border border-gray-300 rounded-lg shadow-sm">
      {imageSrc && (
        <img
          src={imageSrc}
          alt="No Data Found"
          className="w-32 h-32 mb-4"
        />
      )}
      <h2 className="text-lg font-semibold text-gray-600">{message}</h2>
      {description && (
        <p className="text-sm text-gray-500 text-center max-w-xs">
          {description}
        </p>
      )}
      {actionText && onActionClick && (
        <button
          onClick={onActionClick}
          className="mt-4 px-4 py-2 bg-[#B56365] text-white hover:bg-[#b56364f8] rounded-lg"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};

export default NoData;
