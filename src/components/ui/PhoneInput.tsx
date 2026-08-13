"use client";
import * as React from "react";
import * as RPNInput from "react-phone-number-input";
import flags from "react-phone-number-input/flags";

type Props = {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  invalid?: boolean;
  defaultCountry?: RPNInput.Country;
};

export function PhoneInput({
  value,
  onChange,
  disabled,
  invalid,
  defaultCountry = "BJ",
}: Props) {
  return (
    <RPNInput.default
      className={`phone-input${invalid ? " phone-input--invalid" : ""}`}
      value={value as RPNInput.Value}
      onChange={(val) => onChange(val ?? "")}
      defaultCountry={defaultCountry}
      disabled={disabled}
      limitMaxLength
      countryCallingCodeEditable={false}
      smartCaret
      flagComponent={FlagComponent}
      countrySelectComponent={CountrySelect}
      inputComponent={NumberInput}
    />
  );
}

const NumberInput = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  (props, ref) => (
    <input {...props} ref={ref} className="phone-input__number" />
  )
);
NumberInput.displayName = "NumberInput";

function FlagComponent({ country, countryName }: RPNInput.FlagProps) {
  const Flag = country ? flags[country] : undefined;
  return (
    <span className="phone-input__flag" aria-hidden>
      {Flag ? <Flag title={countryName} /> : <span style={{ fontSize: "1rem" }}>🌐</span>}
    </span>
  );
}

type CountrySelectProps = {
  value: RPNInput.Country;
  onChange: (value: RPNInput.Country) => void;
  options: { value: RPNInput.Country; label: string }[];
  disabled?: boolean;
};

function CountrySelect({ value, onChange, options, disabled }: CountrySelectProps) {
  return (
    <div className="phone-input__country">
      <FlagComponent country={value} countryName={value} />
      <span className="phone-input__dial-code">
        +{value ? RPNInput.getCountryCallingCode(value) : "—"}
      </span>
      <select
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value as RPNInput.Country)}
        disabled={disabled}
        aria-label="Pays"
        className="phone-input__select"
      >
        {options
          .filter((o) => o.value)
          .map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
      </select>
    </div>
  );
}
