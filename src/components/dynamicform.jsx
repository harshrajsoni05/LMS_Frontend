import { useState, useEffect } from 'react';
import CustomButton from '../components/button';

const Dynamicform = ({ fields, onSubmit, heading, defaultValues }) => {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    setFormData(defaultValues || {});
  }, [defaultValues]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
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
              {field.type === 'select' ? (
                <select
                  name={field.name}
                  value={formData[field.name] || ""}
                  onChange={handleInputChange}
                  required={field.required}
                >
                  <option value="" disabled>{field.placeholder}</option>
                  {field.options.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={field.type}
                  placeholder={field.placeholder}
                  name={field.name}
                  value={formData[field.name] || ""}
                  onChange={handleInputChange}
                  required={field.required}
                />
              )}
            </div>
          ))}
          <div className="modal-form-btn-div">
          <CustomButton
            name="Save"
            type="submit"
            className="add"
          />
        </div>
        </div>

        
      </form>
    </div>
  );
};

export default Dynamicform;
