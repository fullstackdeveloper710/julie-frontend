import { useState } from 'react';

export default function DynamicModal({
  isOpen,
  onClose,
  title,
  questions,
  apiError,
  apiSuccess,
  onSubmit,
}: any) {
  const [formData, setFormData] = useState<any>({});
  const [errors, setErrors] = useState<any>({});

  if (!isOpen) return null;

  const handleChange = (id: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [id]: value }));

    setErrors((prev: any) => ({ ...prev, [id]: '' }));
  };

  const validate = () => {
    const newErrors: any = {};

    questions.forEach((q: any) => {
      const value = formData[q.id];

      if (!value || value.toString().trim() === '') {
        newErrors[q.id] = `${q.label} is required`;
      }

      if (q.type === 'number' && value && isNaN(Number(value))) {
        newErrors[q.id] = `${q.label} must be a valid number`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 flex items-start justify-center bg-black/70 pt-16 width-full z-50 mt-5 overflow-auto">
      <div className="bg-slate-900 p-4 rounded-xl w-full max-w-lg">
        <h2 className="text-white text-xl mb-4">{title}</h2>
        {apiError && (
          <div className="mb-4 p-3 rounded bg-red-500/10 border border-red-500 text-red-400 text-sm">
            {apiError}
          </div>
        )}

        {apiSuccess && (
          <div className="mb-4 p-3 rounded bg-green-500/10 border border-green-500 text-green-400 text-sm">
            {apiSuccess}
          </div>
        )}
        {questions.map((q: any) => (
          <div key={q.id} className="mb-4">
            <label className="text-white text-sm">{q.label}</label>

            {/* TEXT */}
            {q.type === 'text' && (
              <>
                <input
                  value={formData[q.id] || ''}
                  className={`w-full mt-1 p-2 bg-slate-800 text-white border ${
                    errors[q.id] ? 'border-red-500' : 'border-slate-700'
                  }`}
                  onChange={(e) => handleChange(q.id, e.target.value)}
                />
                {errors[q.id] && <p className="text-red-400 text-xs mt-1">{errors[q.id]}</p>}
              </>
            )}

            {/* NUMBER */}
            {q.type === 'number' && (
              <>
                <input
                  type="number"
                  value={formData[q.id] || ''}
                  className={`w-full mt-1 p-2 bg-slate-800 text-white border ${
                    errors[q.id] ? 'border-red-500' : 'border-slate-700'
                  }`}
                  onChange={(e) => handleChange(q.id, e.target.value)}
                />
                {errors[q.id] && <p className="text-red-400 text-xs mt-1">{errors[q.id]}</p>}
              </>
            )}

            {/* SELECT */}
            {q.type === 'select' && (
              <>
                <select
                  value={formData[q.id] || ''}
                  className={`w-full mt-1 p-2 bg-slate-800 text-white border ${
                    errors[q.id] ? 'border-red-500' : 'border-slate-700'
                  }`}
                  onChange={(e) => handleChange(q.id, e.target.value)}
                >
                  <option value="">Select</option>
                  {q.options?.map((opt: any) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                {errors[q.id] && <p className="text-red-400 text-xs mt-1">{errors[q.id]}</p>}
              </>
            )}
          </div>
        ))}

        {/* BUTTONS */}
        <div className="grid  gap-3 mt-4">
          <button
            onClick={onClose}
            className="w-full py-2 rounded border border-slate-600 text-white"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="w-full py-2 rounded bg-(--accent) text-black font-semibold"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
