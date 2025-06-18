import React from "react";

type CustomTextFieldProps = {
    label: string;
    name: string;
    changeHandler: (event: React.ChangeEvent<HTMLInputElement>) => void;
    value: string;
    className?: string;
};

const CustomTextField: React.FC<CustomTextFieldProps> = (props) => {
    return (
        <div className={`custom-text-field ${props.className || ""}`}>
            <label htmlFor={props.name}>{props.label}</label>
            <input
                type="text"
                id={props.name}
                name={props.name}
                onChange={props.changeHandler}
                value={props.value}
            />
        </div>
    );
};

export default CustomTextField;