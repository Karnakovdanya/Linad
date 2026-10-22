import { appointmentMaterial } from './appointment';
import { symptomsMaterial } from './symptoms';
import { doctorVisitMaterial } from './doctor-visit';
import { treatmentMaterial } from './treatment-medicine';
import { testResultsMaterial } from './test-results';
import { emergencyMaterial } from './emergency-help';

export const doctorMaterials = {
  appointment: appointmentMaterial,
  'describe-symptoms': symptomsMaterial,
  'doctor-visit': doctorVisitMaterial,
  'treatment-medicine': treatmentMaterial,
  'test-results': testResultsMaterial,
  'emergency-help': emergencyMaterial,
} as const;
