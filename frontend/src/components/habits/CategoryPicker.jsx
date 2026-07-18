import { CATEGORIES } from "../../constants/habitOptions";

const CategoryPicker = ({ value, onChange }) => (
  <div>
    <label className="mb-1 block text-sm font-medium">Category</label>
    <div className="grid grid-cols-5 gap-1.5">
      {CATEGORIES.map(({ value: catValue, icon: Icon, color }) => (
        <button
          key={catValue}
          type="button"
          onClick={() => onChange(catValue)}
          title={catValue}
          aria-label={catValue}
          className={`flex flex-col items-center gap-1 rounded-lg border px-1 py-2 transition ${
            value === catValue
              ? "border-accent-violet bg-accent-violet/15"
              : "border-border hover:border-border-hover"
          }`}
        >
          <Icon size={16} className={value === catValue ? "text-accent-violet" : color} />
          <span className="truncate text-[10px] leading-tight text-ink-muted">{catValue}</span>
        </button>
      ))}
    </div>
  </div>
);

export default CategoryPicker;
