import { Controller, FieldError } from "react-hook-form";

interface Props {
  label?: string;
  name: string;
  type: string;
  placeholder: string;
  control?: any;
  rules?: Record<string, any>;
  defaultValue?: string;
  error?: FieldError | undefined;
  disabled?: boolean;
  onChange?: (value: string) => void;  // ✅ Add onChange prop
}

function FormInput({
  label,
  name,
  type,
  placeholder,
  control,
  rules,
  defaultValue = "",
  error,
  disabled,
  onChange,  // ✅ Accept onChange
}: Props) {
  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label htmlFor={name} className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

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
              onChange={(e) => {
                field.onChange(e);              // react-hook-form internal change
                onChange?.(e.target.value);     // ✅ notify parent
              }}
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
          disabled={disabled}
          onChange={(e) => onChange?.(e.target.value)}  // ✅ notify parent
        />
      )}

      {error && error.message && (
        <span className="text-red-500 text-sm">{error.message}</span>
      )}
    </div>
  );
}

export default FormInput;
