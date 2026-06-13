import { Input } from "../../../../components/ui/input";
import { Label } from "../../../../components/ui/label";
import { CheckCircle2, AlertCircle } from "lucide-react";

export function FormField({
  label,
  name,
  value,
  placeholder,
  error,
  handleChange,
  handleBlur,
  inputStyle,
  fieldError,
  fieldValid,
}: any) {
  const getMaxLength = () => {
    switch (name) {
      case "phone":
        return 15;

      case "address":
        return 50;

      case "city":
      case "state":
        return 20;

      case "zipCode":
        return 5;

      case "cardNumber":
        return 19;

      case "expiryDate":
        return 5;

      case "cvv":
        return 3;

      case "cardName":
        return 50;

      default:
        return 50;
    }
  };

  return (
    <div className="space-y-1 relative">
      {/* Label + Counter */}
      <div className="flex justify-between items-center">
        <Label className="text-sm font-medium text-gray-700">
          {label} *
        </Label>

        <span
          className={`text-xs ${
            (value?.length || 0) > getMaxLength()
              ? "text-red-500"
              : "text-gray-400"
          }`}
        >
          {value?.length || 0}/{getMaxLength()}
        </span>
      </div>

      <div className="relative">
        <Input
          value={value}
          placeholder={placeholder}
          maxLength={getMaxLength()}
          onChange={(e) => handleChange(name, e.target.value)}
          onBlur={() => handleBlur(name)}
          className={`${inputStyle(name)} pr-10`}
        />

        {fieldValid(name) && (
          <div className="absolute right-2 top-1/2 -translate-y-1/2 bg-emerald-100 text-emerald-600 w-5 h-5 flex items-center justify-center rounded-full">
            <CheckCircle2 size={14} strokeWidth={3} />
          </div>
        )}

        {fieldError(name) && (
          <div className="absolute right-2 top-1/2 -translate-y-1/2 bg-red-100 text-red-600 w-5 h-5 flex items-center justify-center rounded-full">
            <AlertCircle size={14} strokeWidth={3} />
          </div>
        )}
      </div>

      {fieldError(name) && (
        <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
          <AlertCircle size={12} />
          {error}
        </p>
      )}
    </div>
  );
}