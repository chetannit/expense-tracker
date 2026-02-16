import React from "react";
import "./FilterControls.css";

const CATEGORIES = [
  "Food",
  "Transportation",
  "Entertainment",
  "Healthcare",
  "Shopping",
  "Bills",
  "Education",
  "Other",
];

const FilterControls = ({
  category,
  sortOrder,
  onCategoryChange,
  onSortChange,
}) => {
  return (
    <div className="card filter-controls">
      <div className="controls-grid">
        <div className="control-group">
          <label htmlFor="filter-category" className="control-label">
            🔍 Filter
          </label>
          <select
            id="filter-category"
            value={category}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="control-select"
          >
            <option value="">All Categories</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="control-group">
          <label htmlFor="sort-order" className="control-label">
            📊 Sort
          </label>
          <select
            id="sort-order"
            value={sortOrder}
            onChange={(e) => onSortChange(e.target.value)}
            className="control-select"
          >
            <option value="date_desc">Newest First</option>
            <option value="">Oldest First</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default FilterControls;
