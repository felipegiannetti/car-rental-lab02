import { AlertTriangle } from 'lucide-react'

const TONE_META = {
  danger: {
    iconBg: 'bg-red-100',
    iconColor: 'text-red-600',
    buttonClass: 'btn-danger disabled:opacity-50',
  },
  primary: {
    iconBg: 'bg-[#f2fde0]',
    iconColor: 'text-[#004521]',
    buttonClass: 'btn-primary disabled:opacity-50',
  },
  secondary: {
    iconBg: 'bg-slate-100',
    iconColor: 'text-slate-600',
    buttonClass: 'btn-secondary disabled:opacity-50',
  },
}

export default function ConfirmModal({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  loading,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  loadingLabel = 'Processando...',
  tone = 'danger',
}) {
  if (!isOpen) return null

  const meta = TONE_META[tone] || TONE_META.danger

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onCancel}
      />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 p-6 animate-in">
        <div className="flex items-start gap-4">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${meta.iconBg}`}>
            <AlertTriangle className={`w-5 h-5 ${meta.iconColor}`} />
          </div>
          <div className="flex-1">
            <h3 className="text-base font-semibold text-slate-900">{title}</h3>
            <p className="mt-1 text-sm text-slate-500">{message}</p>
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onCancel}
            disabled={loading}
            className="btn-secondary disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={meta.buttonClass}
          >
            {loading ? loadingLabel : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
