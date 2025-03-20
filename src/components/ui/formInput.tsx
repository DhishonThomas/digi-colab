import { Controller, FieldError } from "react-hook-form";

interface Props {
  label?: string;  // Add label as an optional prop
  name: string;
  type: string;
  placeholder: string;
  control?: any;
  rules?: Record<string, any>;
  defaultValue?: string;
  error?: FieldError | undefined;
  disabled?: boolean;
}

function FormInput({
  label,  // Accept label
  name,
  type,
  placeholder,
  control,
  rules,
  defaultValue = "",
  error,
  disabled,
}: Props) {
  return (
    <div className="flex flex-col gap-2">
      {/* Label */}
      {label && (
        <label htmlFor={name} className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      {/* Input Field */}
      {control && name ? (
        <Controller
          control={control}
          name={name}
          defaultValue={defaultValue}
          rules={rules}
          render={({ field }) => (
            <input
              id={name}
              {...field}
              type={type}
              disabled={disabled}
              placeholder={placeholder}
              className="text-[14px] rounded-[10px] border placeholder:text-gray-500 border-gray-300 w-full py-2 px-4"
            />
          )}
        />
      ) : (
        <input
          id={name}
          type={type}
          placeholder={placeholder}
          className="text-[14px] rounded-[10px] border placeholder:text-gray-500 border-gray-300 w-full py-2 px-4"
          defaultValue={defaultValue}
        />
      )}

      {/* Error Message */}
      {error && error.message && (
        <span className="text-red-500 text-sm">{error.message}</span>
      )}
    </div>
  );
}

export default FormInput;
