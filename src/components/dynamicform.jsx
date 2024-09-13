import { useState, useEffect } from 'react';
import "../styles/Dynamicform.css";
import CustomButton from '../components/button';
import { formatDateTime, validateEmail, validateMobile } from './utils';

const Dynamicform = ({ fields, onSubmit, heading, defaultValues }) => {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setFormData(defaultValues || {});
  }, [defaultValues]);

  const getCurrentDateTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;

    if (type === 'number') {
      if (value.includes('.') || value < 0) {
        setErrors({ ...errors, [name]: "Only positive integers are allowed" });
        return;
      }
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
        newErrors[field.name] = `${field.label} cannot be empty`;
      }

      if ((field.type === 'time' || field.type === 'datetime-local') && !value) {
        newErrors[field.name] = `${field.placeholder} cannot be empty`;
      }

      if (field.name === 'email' && value && !validateEmail(value)) {
        newErrors[field.name] = `Enter a valid Email Address`;
      }

      if (field.placeholder === 'Enter Phone Number' && value) {
        if (!validateMobile(value)) {
          newErrors[field.name] = `Phone number must be a valid 10 digits`;
        }
      }

       if (field.placeholder === 'Category Name' || field.placeholder === 'Book Title') {
      if (value && !/^[a-zA-Z0-9\s'.,-]*$/.test(value)) {
        newErrors[field.name] = `Enter a valid ${field.placeholder}`;
      }
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
                  min={field.type === 'datetime-local' ? getCurrentDateTime() : undefined}
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
