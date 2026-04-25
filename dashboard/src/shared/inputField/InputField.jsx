const InputField = ({
  label,
  type,
  placeholder,
  name,
  register,
  validation,
  errors,
}) => {
  return (
    <div className="space-y-1">
      {label && (
        <label className="text-sm font-medium text-gray-700">{label}</label>
      )}
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 transition ${
          errors?.[name]
            ? "border-red-500 focus:ring-red-200"
            : "focus:ring-blue-500 border-gray-300"
        }`}
        // Main form theke register function ekhane use hobe
        {...register(name, validation)}
      />
      {errors?.[name] && (
        <p className="text-red-500 text-xs mt-1">{errors[name]?.message}</p>
      )}
    </div>
  );
};

export default InputField;
