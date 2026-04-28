const InputField = ({
  label,
  type,
  placeholder,
  name,
  register,
  validation,
  errors,
  autoComplete, // এখানে 'C' বড় হাতের করে দিন (Consistency-র জন্য)
}) => {
  return (
    <div className="space-y-1">
      {label && (
        <label className="text-sm font-medium rounded-sm text-gray-700">
          {label}
        </label>
      )}
      <input
        // ১. আগে রেজিস্টার স্প্রেড করুন
        {...register(name, validation)}
        // ২. তারপর বাকি কাস্টম প্রপসগুলো দিন (যাতে এগুলো প্রায়োরিটি পায়)
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete} // 'C' বড় হাতের
        className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 transition ${
          errors?.[name]
            ? "border-red-500 focus:ring-red-200"
            : "focus:ring-blue-500 border-gray-300"
        }`}
      />
      {errors?.[name] && (
        <p className="text-red-500 text-xs mt-1">{errors[name]?.message}</p>
      )}
    </div>
  );
};

export default InputField;
