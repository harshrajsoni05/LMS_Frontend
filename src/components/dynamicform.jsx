import { useState, useEffect } from 'react';
import "../styles/Dynamicform.css";
import CustomButton from '../components/button';

const Dynamicform = ({ fields, onSubmit, heading, defaultValues }) => {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setFormData(defaultValues || {});
  }, [defaultValues]);

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;

    if (type === 'number' && value < 0) {
      setErrors({ ...errors, [name]: "Cannot be negative" });
      return;
    }

    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let newErrors = {};

    fields.forEach((field) => {
      const value = formData[field.name];

      if (!value && field.required && field.name !== 'password' && field.name !== 'confirmPassword') {
        newErrors[field.name] = `${field.placeholder} cannot be empty`;
      }

      if ((field.type === 'time' || field.type === 'datetime-local') && !value) {
        newErrors[field.name] = `${field.placeholder} cannot be empty`;
      }
    });

    if (formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit(formData);
    setFormData({});
};


  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="modal-form-heading">
          <h2>{heading}</h2>
        </div>

        <div className="modal-form-input-div">
          {fields.map((field) => (
            <div key={field.name} className="modal-form-input">
              {field.label && <label htmlFor={field.name}>{field.label}</label>}
              {field.type === 'select' ? (
                <select
                  id={field.name}
                  name={field.name}
                  value={formData[field.name] || ""}
                  onChange={handleInputChange}
                >
                  <option value="" disabled>{field.placeholder}</option>
                  {field.options.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              ) : field.type === 'text-area' ? (
                <textarea
                  id={field.name}
                  placeholder={field.placeholder}
                  name={field.name}
                  value={formData[field.name] || ""}
                  onChange={handleInputChange}
                />
              ) : (
                <input
                  id={field.name}
                  type={field.type}
                  placeholder={field.placeholder}
                  name={field.name}
                  value={formData[field.name] || ""}
                  onChange={handleInputChange}
                />
              )}

              {errors[field.name] && <p className="error-message">{errors[field.name]}</p>}
            </div>
          ))}
          <div className="modal-form-btn-div">
            <CustomButton name="Save" type="submit" className="add" />
          </div>
        </div>
      </form>
    </div>
  );
};

export default Dynamicform;
