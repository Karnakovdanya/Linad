import { Link, useLocation } from 'react-router-dom';
import { Icon } from '../../components/Icon';
import type { SubmissionReceipt } from './model';
import { tutors } from './data';
import { EmptyTutor, TutorHeading } from './TutorUI';
import { useTutorLocale } from './useTutorLocale';

export function SubmissionResult({ receipt }: { receipt: SubmissionReceipt | null }) {
  const { copy } = useTutorLocale(); const { search } = useLocation();
  if (!receipt) return <EmptyTutor prepared />;
  const tutor = tutors.find(tutor => tutor.id === receipt.tutorId); const teacher = receipt.kind === 'teacher';
  return <div className="tutors-prepared">
    <div className="tutors-prepared-symbol"><Icon name="check" /></div>
    <TutorHeading title={teacher ? copy.applicationReceived : copy.receivedTitle} centered>{teacher ? copy.applicationReceived : copy.receivedTitle}</TutorHeading>
    <p className="tutors-prepared-description">{teacher ? copy.applicationReceivedIntro : copy.receivedIntro}</p><p className="tutors-small">{copy.acceptedNote}</p>
    <div className="tutors-return-actions"><Link className="button button-primary" to={`/tutors${search}`}>{copy.backCatalog}</Link>{tutor && <Link className="button button-secondary" to={`/tutors/${tutor.id}${search}`}>{copy.backProfile}</Link>}</div>
  </div>;
}
