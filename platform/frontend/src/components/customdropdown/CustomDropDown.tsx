import React from "react";

type DropDownOption = {
    value: string;
    label: string;
};

type CustomDropDownProps = {
    label: string;
    name: string;
    changeHandler: (event: React.ChangeEvent<HTMLSelectElement>) => void;
    values: DropDownOption[];
    currentValue: string;
    className?: string;
};

const CustomDropDown: React.FC<CustomDropDownProps> = (props) => {
    return (
        <div className={`custom-dropdown ${props.className || ""}`}>
            <label htmlFor={props.name}>{props.label}</label>
            <select
                id={props.name}
                name={props.name}
                onChange={props.changeHandler}
                value={props.currentValue}
            >
                {props.values.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default CustomDropDown;