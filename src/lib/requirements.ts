import type { Requirement, Service, ServiceCase } from '../types';
import { OFFICIAL_FORMS } from '../data/forms';
import type { OfficialForm } from '../types';

/** Dynamic requirement engine: resolves case-specific requirements, notes, and forms. */

export function getServiceCase(service: Service, caseId?: string | null): ServiceCase {
  return service.cases.find((c) => c.id === caseId) ?? service.cases[0];
}

export function splitRequirements(reqs: Requirement[]) {
  return {
    required: reqs.filter((r) => r.condition === 'required'),
    conditional: reqs.filter((r) => r.condition !== 'required'),
  };
}

export function getCaseForms(serviceCase: ServiceCase): OfficialForm[] {
  return serviceCase.formIds
    .map((id) => OFFICIAL_FORMS[id])
    .filter((f): f is OfficialForm => Boolean(f));
}

export function canSubmitOnline(service: Service): boolean {
  return service.serviceMode === 'demo_submission' && service.active;
}

export function searchServices(
  services: Service[],
  query: string,
  category: 'semua' | Service['category'],
): Service[] {
  const q = query.trim().toLowerCase();
  return services.filter((s) => {
    if (!s.active) return false;
    if (category !== 'semua' && s.category !== category) return false;
    if (!q) return true;
    const haystack = [s.title, s.shortTitle, s.description, s.group ?? '', ...s.cases.map((c) => c.label)]
      .join(' ')
      .toLowerCase();
    return haystack.includes(q);
  });
}
