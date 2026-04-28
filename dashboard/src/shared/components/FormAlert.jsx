const FormAlert = ({ message, type = "error", onClose }) => {
  if (!message) return <div className="h-0"></div>;

  // Type onujayi colors set kora
  const config = {
    error: {
      bg: "bg-red-100",
      border: "border-red-500",
      text: "text-red-700",
      icon: (
        <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" />
      ),
    },
    success: {
      bg: "bg-green-100",
      border: "border-green-500",
      text: "text-green-700",
      icon: (
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
          clipRule="evenodd"
        />
      ),
    },
  };

  const { bg, border, text, icon } = config[type] || config.error;

  return (
    <div className="relative h-12 mb-2">
      <div
        className={`absolute inset-x-0 top-0 p-3 ${bg} border-l-4 ${border} ${text} text-sm flex justify-between items-center rounded shadow-sm animate-in fade-in slide-in-from-top-1 duration-300 z-10`}
      >
        <div className="flex items-center overflow-hidden">
          <svg
            className="w-4 h-4 mr-2 fill-current shrink-0"
            viewBox="0 0 20 20"
          >
            {icon}
          </svg>
          <span className="truncate font-medium">{message}</span>
        </div>
        <button
          onClick={onClose}
          className={`font-bold text-lg leading-none ${text} opacity-70 hover:opacity-100 ml-2 transition-opacity`}
        >
          &times;
        </button>
      </div>
    </div>
  );
};

export default FormAlert;
