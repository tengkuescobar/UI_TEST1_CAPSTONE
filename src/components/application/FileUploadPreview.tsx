import { useId, useRef, useState } from 'react';
import { FileText, ImageIcon, Trash2, Upload } from 'lucide-react';
import type { Requirement } from '../../types';
import { CONDITION_LABEL } from '../../data/services';
import { formatBytes, cx } from '../../lib/format';
import { StatusBadge } from '../ui/StatusBadge';

export interface LocalFile {
  name: string;
  size: number;
  type: string;
  /** Object URL for in-session image preview only. Never uploaded. */
  previewUrl?: string;
}

const ACCEPT = ['application/pdf', 'image/jpeg', 'image/png'];
const MAX_BYTES = 2 * 1024 * 1024;

interface Props {
  requirement: Requirement;
  value?: LocalFile;
  error?: string;
  onChange: (file: LocalFile | undefined) => void;
}

/** Simulated upload: the file stays in the browser; only metadata is kept in demo state. */
export function FileUploadPreview({ requirement, value, error, onChange }: Props) {
  const id = useId();
  const inputId = `upload-${requirement.id}`;
  const inputRef = useRef<HTMLInputElement>(null);
  const [localError, setLocalError] = useState('');

  const handle = (file: File | undefined) => {
    setLocalError('');
    if (!file) return;
    if (!ACCEPT.includes(file.type)) {
      setLocalError('Format tidak didukung. Gunakan PDF, JPG, atau PNG.');
      return;
    }
    if (file.size > MAX_BYTES) {
      setLocalError(`Ukuran berkas ${formatBytes(file.size)} melebihi batas 2 MB.`);
      return;
    }
    onChange({
      name: file.name,
      size: file.size,
      type: file.type,
      previewUrl: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
    });
  };

  const shownError = localError || error;
  const isOptional = requirement.condition !== 'required';

  return (
    <div className={cx('rounded-[var(--radius-ui)] border p-4', shownError ? 'border-danger/60 bg-[#fdf6f5]' : 'border-line bg-surface')}>
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          <label htmlFor={inputId} className="text-sm font-semibold text-ink">
            {requirement.label}
            {!isOptional && <span className="ml-1 text-danger" aria-hidden="true">*</span>}
          </label>
          {requirement.detail && <p className="text-xs text-muted">{requirement.detail}</p>}
        </div>
        {isOptional && <StatusBadge label={CONDITION_LABEL[requirement.condition]} tone="neutral" />}
      </div>

      {value ? (
        <div className="mt-3 flex items-center gap-3 rounded-[var(--radius-ui)] bg-[#f4f6f7] p-3">
          {value.previewUrl ? (
            <img src={value.previewUrl} alt={`Pratinjau ${value.name}`} className="size-12 shrink-0 rounded object-cover" />
          ) : (
            <span className="flex size-12 shrink-0 items-center justify-center rounded bg-surface text-primary" aria-hidden="true">
              {value.type === 'application/pdf' ? <FileText className="size-6" /> : <ImageIcon className="size-6" />}
            </span>
          )}
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-ink">{value.name}</p>
            <p className="text-xs text-muted">{formatBytes(value.size)} · tersimpan lokal (simulasi)</p>
          </div>
          <button
            type="button"
            onClick={() => {
              if (value.previewUrl) URL.revokeObjectURL(value.previewUrl);
              onChange(undefined);
              if (inputRef.current) inputRef.current.value = '';
            }}
            className="flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-md text-danger hover:bg-[#fbecea]"
            aria-label={`Hapus berkas ${value.name}`}
          >
            <Trash2 className="size-4" aria-hidden="true" />
          </button>
        </div>
      ) : (
        <div className="mt-3">
          <input
            ref={inputRef}
            id={inputId}
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            className="peer sr-only"
            aria-describedby={`${id}-help${shownError ? ` ${id}-err` : ''}`}
            aria-invalid={shownError ? true : undefined}
            onChange={(e) => handle(e.target.files?.[0])}
          />
          <label
            htmlFor={inputId}
            className="flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-[var(--radius-ui)] border border-dashed border-[#b9c5ca] px-4 py-3 text-sm font-semibold text-primary transition-colors hover:border-primary hover:bg-[#f2f5f6] peer-focus-visible:outline-3 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-terracotta"
          >
            <Upload className="size-4" aria-hidden="true" />
            Pilih berkas
          </label>
        </div>
      )}
      <p id={`${id}-help`} className="mt-2 text-xs text-muted">
        PDF, JPG, atau PNG · maksimal 2 MB. Gunakan dokumen contoh, bukan dokumen asli.
      </p>
      {shownError && (
        <p id={`${id}-err`} className="mt-1 text-sm font-medium text-danger" role="alert">
          {shownError}
        </p>
      )}
    </div>
  );
}
