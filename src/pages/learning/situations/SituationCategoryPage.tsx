import type { LearningLanguage } from '../../../domain/types';
import type { SituationCategory } from './categories';
import { PracticeWorkspace } from '../practice/PracticeWorkspace';

export function SituationCategoryPage({ language, category, situationId }: { language: LearningLanguage; category: SituationCategory; situationId?: string }) {
  return <PracticeWorkspace language={language} categoryId={category.id} situationId={situationId} />;
}
