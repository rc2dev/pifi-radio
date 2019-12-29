import React from 'react';

const Select = ({ id, label, row, data, ...rest }) => (
  <div className={row ? 'form-group row' : 'form-group'}>
    <label htmlFor={id} className="col-sm-2 col-form-label">
      {label}
    </label>
    <div className="col-sm-10">
      <select id={id} className="form-control" {...rest}>
        {data.map(d => (
          <option key={d.id || d} value={d.id || d}>
            {d.name || d}
          </option>
        ))}
      </select>
    </div>
  </div>
);

export default Select;
