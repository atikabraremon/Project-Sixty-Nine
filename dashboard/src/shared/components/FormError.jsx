const FormError = ({ message, onClose }) => {
  if (!message) return <div className="h-0"></div>; // Height dhore rakhar jonno empty div

  return (
    <div className="relative h-12 mb-2">
      {" "}
      {/* Fixed height jate layout jump na kore */}
      <div className="absolute inset-x-0 top-0 p-3 bg-red-100 border-l-4 border-red-500 text-red-700 text-sm flex justify-between items-center rounded shadow-sm animate-in fade-in slide-in-from-top-1 duration-300 z-10">
        <div className="flex items-center">
          <svg className="w-4 h-4 mr-2 fill-current" viewBox="0 0 20 20">
            <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" />
          </svg>
          <span className="truncate">{message}</span>
        </div>
        <button
          onClick={onClose}
          className="font-bold text-lg leading-none hover:text-red-900 ml-2"
        >
          &times;
        </button>
      </div>
    </div>
  );
};

export default FormError;
