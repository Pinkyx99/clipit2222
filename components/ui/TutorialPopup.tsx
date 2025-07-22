
import React from 'react';

interface TutorialPopupProps {
    step: number;
    content: string;
    onClose: () => void;
}

const TutorialPopup: React.FC<TutorialPopupProps> = ({ step, content, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-lg shadow-xl p-6 max-w-sm w-full text-center border border-gray-600">
                <h3 className="text-xl font-bold text-yellow-400 mb-2">Tutorial Step {step + 1}</h3>
                <p className="text-gray-300 mb-6">{content}</p>
                <button
                    onClick={onClose}
                    className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold py-2 px-6 rounded-lg transition-colors duration-300"
                >
                    Got it!
                </button>
            </div>
        </div>
    );
};

export default TutorialPopup;