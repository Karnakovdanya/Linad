import { situationCategories } from '../../situations/categories';
import type { LearningLanguage } from '../../../../domain/types';
import type { Messages } from '../../../../i18n/messages';
import type { PracticeMaterial } from './types';
import { doctorMaterials } from './doctor-materials';
import { topicSituations } from './topics';

export interface PracticeSituation { id: string; titleKey: keyof Messages; introKey?: keyof Messages; material?: PracticeMaterial }
export interface PracticeCategory {
  id: string; titleKey: keyof Messages; icon: 'work' | 'health' | 'plane' | 'file' | 'chat' | 'cart' | 'home' | 'bank' | 'sport' | 'graduation';
  image: string; altKey: keyof Messages; position: string; situations: readonly PracticeSituation[]; defaultSituation?: string;
}
const doctorSituations: readonly PracticeSituation[] = [
  { id: 'appointment', titleKey: 'practiceAppointment', introKey: 'practiceAppointmentIntro', material: doctorMaterials.appointment },
  { id: 'describe-symptoms', titleKey: 'practiceSymptoms', introKey: 'practiceSymptomsIntro', material: doctorMaterials['describe-symptoms'] },
  { id: 'doctor-visit', titleKey: 'practiceVisit', introKey: 'practiceVisitIntro', material: doctorMaterials['doctor-visit'] },
  { id: 'treatment-medicine', titleKey: 'practiceTreatment', introKey: 'practiceTreatmentIntro', material: doctorMaterials['treatment-medicine'] },
  { id: 'test-results', titleKey: 'practiceResults', introKey: 'practiceResultsIntro', material: doctorMaterials['test-results'] },
  { id: 'emergency-help', titleKey: 'practiceEmergency', introKey: 'practiceEmergencyIntro', material: doctorMaterials['emergency-help'] },
];
const definitions = [
  ['job-interview', 'practiceJob', 'work'], ['doctor', 'practiceDoctor', 'health'],
  ['travel', 'practiceTravel', 'plane'], ['documents', 'practiceDocuments', 'file'],
  ['everyday-communication', 'practiceEveryday', 'chat'], ['shopping', 'practiceShopping', 'cart'],
  ['housing', 'practiceHousing', 'home'], ['banking-finance', 'practiceBanking', 'bank'],
  ['sport-fitness', 'practiceSport', 'sport'], ['education-learning', 'practiceEducation', 'graduation'],
] as const;

export const practiceCategories: readonly PracticeCategory[] = definitions.map(([id, titleKey, icon]) => {
  const photo = situationCategories.find(category => category.id === id)!;
  const situations = id === 'doctor' ? doctorSituations : topicSituations[id] ?? [];
  return { id, titleKey, icon, image: photo.image, altKey: photo.altKey, position: photo.position,
    situations, defaultSituation: id === 'doctor' ? 'describe-symptoms' : situations[0]?.id };
});

export function practicePath(language: LearningLanguage, category: PracticeCategory, situation?: PracticeSituation) {
  return `/learn/${language}/situations/${category.id}${situation ? `/${situation.id}` : ''}`;
}

export function findPracticeRoute(pathname: string) {
  const match = /^\/learn\/(de|en)\/situations\/([^/]+)(?:\/([^/]+))?$/.exec(pathname);
  if (!match) return undefined;
  const category = practiceCategories.find(category => category.id === match[2]);
  if (!category) return undefined;
  const situation = category.situations.find(situation => situation.id === (match[3] ?? category.defaultSituation));
  if (match[3] && !situation) return undefined;
  return { category, situation };
}
