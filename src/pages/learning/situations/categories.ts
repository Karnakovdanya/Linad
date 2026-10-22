import { assets } from '../../../config/assets';
import type { LearningLanguage } from '../../../domain/types';
import type { Messages } from '../../../i18n/messages';

interface CategoryDefinition {
  id: string;
  titleKey: keyof Messages;
  descriptionKey: keyof Messages;
  altKey: keyof Messages;
  image: string;
  width: number;
  height: number;
  position: string;
}

export const situationCategories = [
  { id: 'job-interview', titleKey: 'categoryJobTitle', descriptionKey: 'categoryJobDescription', altKey: 'categoryJobAlt', image: assets.situations.jobInterview, width: 1672, height: 941, position: 'center' },
  { id: 'doctor', titleKey: 'categoryDoctorTitle', descriptionKey: 'categoryDoctorDescription', altKey: 'categoryDoctorAlt', image: assets.situations.doctor, width: 1672, height: 941, position: 'center' },
  { id: 'travel', titleKey: 'categoryTravelTitle', descriptionKey: 'categoryTravelDescription', altKey: 'categoryTravelAlt', image: assets.situations.travel, width: 1536, height: 1024, position: 'center 40%' },
  { id: 'documents', titleKey: 'categoryDocumentsTitle', descriptionKey: 'categoryDocumentsDescription', altKey: 'categoryDocumentsAlt', image: assets.situations.documents, width: 1672, height: 941, position: 'center' },
  { id: 'everyday-communication', titleKey: 'categoryEverydayTitle', descriptionKey: 'categoryEverydayDescription', altKey: 'categoryEverydayAlt', image: assets.situations.everydayCommunication, width: 1672, height: 941, position: 'center' },
  { id: 'shopping', titleKey: 'categoryShoppingTitle', descriptionKey: 'categoryShoppingDescription', altKey: 'categoryShoppingAlt', image: assets.situations.shopping, width: 1536, height: 1024, position: 'center 25%' },
  { id: 'housing', titleKey: 'categoryHousingTitle', descriptionKey: 'categoryHousingDescription', altKey: 'categoryHousingAlt', image: assets.situations.housing, width: 1672, height: 941, position: 'center' },
  { id: 'banking-finance', titleKey: 'categoryBankingTitle', descriptionKey: 'categoryBankingDescription', altKey: 'categoryBankingAlt', image: assets.situations.bankingFinance, width: 1672, height: 941, position: 'center' },
  { id: 'education-learning', titleKey: 'categoryEducationTitle', descriptionKey: 'categoryEducationDescription', altKey: 'categoryEducationAlt', image: assets.situations.educationLearning, width: 1672, height: 941, position: 'center' },
  { id: 'sport-fitness', titleKey: 'categorySportTitle', descriptionKey: 'categorySportDescription', altKey: 'categorySportAlt', image: assets.situations.sportFitness, width: 1536, height: 1024, position: 'center 35%' },
] as const satisfies readonly CategoryDefinition[];

export type SituationCategory = typeof situationCategories[number];

export function situationCategoryPath(language: LearningLanguage, category: SituationCategory) {
  return `/learn/${language}/situations/${category.id}`;
}
