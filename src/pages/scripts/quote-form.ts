import {
  buildQuoteMessage,
  buildWhatsAppUrl,
  isPlacement,
  isUnit,
  validateQuote,
  type QuoteData,
  type QuoteErrors,
} from '../../lib/quote';

const PLACEHOLDER = 'Completa el formulario y aquí verás el mensaje que enviaremos.';
const FIELD_ORDER = ['service', 'name', 'quantity', 'size'] as const;

function text(fd: FormData, key: string): string {
  const v = fd.get(key);
  return typeof v === 'string' ? v : '';
}

function collect(form: HTMLFormElement): QuoteData {
  const fd = new FormData(form);
  const select = form.elements.namedItem('service');
  let serviceTitle = '';
  if (select instanceof HTMLSelectElement) {
    serviceTitle = select.selectedOptions[0]?.dataset.title ?? '';
  }
  const unit = text(fd, 'unit');
  const placement = text(fd, 'placement');
  return {
    name: text(fd, 'name'),
    service: serviceTitle,
    width: text(fd, 'width'),
    height: text(fd, 'height'),
    unit: isUnit(unit) ? unit : 'cm',
    quantity: Number(text(fd, 'quantity')),
    placement: isPlacement(placement) ? placement : 'no-se',
    hasDesign: text(fd, 'design') !== 'no',
    needsInstall: fd.get('install') !== null,
    notes: text(fd, 'notes'),
  };
}

function setStatus(el: HTMLElement | null, message: string, kind: 'ok' | 'error' | '' = ''): void {
  if (!el) return;
  el.textContent = message;
  el.dataset.kind = kind;
}

function showErrors(form: HTMLFormElement, errors: QuoteErrors): void {
  const id = form.id;
  (['name', 'service', 'quantity', 'size'] as const).forEach((key) => {
    const box = form.querySelector<HTMLElement>(`#${id}-${key}-err`);
    const message = errors[key];
    if (box) { box.textContent = message ?? ''; box.hidden = !message; }
    const fields: Record<typeof key, string[]> = {
      name: ['name'], service: ['service'], quantity: ['quantity'], size: ['width', 'height'],
    };
    fields[key].forEach((fieldName) => {
      const field = form.elements.namedItem(fieldName);
      if (field instanceof HTMLElement) {
        if (message) field.setAttribute('aria-invalid', 'true'); else field.removeAttribute('aria-invalid');
      }
    });
  });
  const firstKey = FIELD_ORDER.find((k) => errors[k]);
  if (firstKey) {
    const target = form.querySelector<HTMLElement>(firstKey === 'size' ? '[name="width"]' : `[name="${firstKey}"]`);
    target?.focus();
  }
}

function openWhatsApp(url: string): void {
  const a = document.createElement('a');
  a.href = url;
  a.target = '_blank';
  a.rel = 'noopener noreferrer';
  document.body.appendChild(a);
  a.click();
  a.remove();
}

function init(form: HTMLFormElement): void {
  const preview = form.querySelector<HTMLElement>('[data-preview]');
  const status = form.querySelector<HTMLElement>('[data-status]');
  const submit = form.querySelector<HTMLButtonElement>('[data-submit]');
  const copyBtn = form.querySelector<HTMLButtonElement>('[data-copy]');
  const fallback = form.querySelector<HTMLElement>('[data-fallback]');
  const fallbackLink = form.querySelector<HTMLAnchorElement>('[data-fallback-link]');

  const current = (): { data: QuoteData; errors: QuoteErrors; message: string } => {
    const data = collect(form);
    return { data, errors: validateQuote(data), message: buildQuoteMessage(data) };
  };

  const updatePreview = (): void => {
    if (!preview) return;
    const { data, errors } = current();
    preview.textContent = errors.name || errors.service ? PLACEHOLDER : buildQuoteMessage(data);
  };

  // Servicio preseleccionado por URL: /cotizar/?servicio=sandblast
  const wanted = new URLSearchParams(window.location.search).get('servicio');
  const select = form.elements.namedItem('service');
  if (wanted && select instanceof HTMLSelectElement && [...select.options].some((o) => o.value === wanted)) {
    select.value = wanted;
  }
  updatePreview();
  form.addEventListener('input', updatePreview);
  form.addEventListener('change', updatePreview);

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const { errors, message } = current();
    showErrors(form, errors);
    if (Object.keys(errors).length > 0) {
      setStatus(status, 'Revisa los campos marcados para continuar.', 'error');
      return;
    }
    const url = buildWhatsAppUrl(message);
    submit?.classList.add('is-loading');
    submit?.setAttribute('aria-busy', 'true');
    if (submit) submit.disabled = true;
    setStatus(status, 'Abriendo WhatsApp…');
    if (fallbackLink) fallbackLink.href = url;
    openWhatsApp(url);
    window.setTimeout(() => {
      submit?.classList.remove('is-loading');
      submit?.removeAttribute('aria-busy');
      if (submit) submit.disabled = false;
      if (fallback) fallback.hidden = false;
      setStatus(status, 'Listo: te llevamos a WhatsApp con tu mensaje.', 'ok');
    }, 1800);
  });

  copyBtn?.addEventListener('click', async () => {
    const { errors, message } = current();
    showErrors(form, errors);
    if (Object.keys(errors).length > 0) {
      setStatus(status, 'Completa los campos marcados para copiar el mensaje.', 'error');
      return;
    }
    try {
      await navigator.clipboard.writeText(message);
      setStatus(status, 'Mensaje copiado. Pégalo en WhatsApp o donde prefieras.', 'ok');
    } catch {
      setStatus(status, 'No pudimos copiarlo automáticamente: selecciona el texto de la vista previa.', 'error');
    }
  });
}

document.querySelectorAll<HTMLFormElement>('form[data-quote-form]').forEach(init);
