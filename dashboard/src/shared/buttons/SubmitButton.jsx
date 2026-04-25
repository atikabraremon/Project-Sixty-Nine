

const SubmitButton = ({
  type = "submit",
  loading = false,
  text = "Submit",
  loadingText = "Processing...",
  variant = "blue",
  className = "",
}) => {
  // Design variants
  const variants = {
    blue: "bg-blue-600 hover:bg-blue-700",
    green: "bg-green-600 hover:bg-green-700",
    red: "bg-red-600 hover:bg-red-700",
    outline: "border-2 border-blue-600 text-blue-600 hover:bg-blue-50",
  };

  return (
    <button
      disabled={loading}
      type={type}
      className={`w-full py-2 rounded-md font-semibold transition duration-200 active:scale-95 flex items-center justify-center ${
        loading
          ? "bg-gray-400 cursor-not-allowed text-white"
          : `${variants[variant]} text-white`
      } ${variant === "outline" && !loading ? "text-blue-600" : ""} ${className}`}
    >
      {loading ? (
        <>
          <svg
            className="animate-spin h-5 w-5 mr-3 border-t-2 border-current rounded-full"
            viewBox="0 0 24 24"
          ></svg>
          {loadingText}
        </>
      ) : (
        text
      )}
    </button>
  );
};

export default SubmitButton;
