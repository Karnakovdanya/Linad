import { useState } from 'react';
import { Navigate, Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom';
import { Catalog } from './Catalog';
import { Profile } from './Profile';
import { LessonRequestForm, TeacherForm } from './Forms';
import { SubmissionResult } from './Prepared';
import { EmptyTutor } from './TutorUI';
import { tutors } from './data';
import type { SubmissionReceipt } from './model';
import '../../styles/tutors.css';

function TutorRoute({ request = false, onSubmitted }: { request?: boolean; onSubmitted: (receipt: SubmissionReceipt) => void }) {
  const { tutorId } = useParams(); const { search } = useLocation();
  if (tutorId === 'daniel-wilson') return <Navigate to={`/tutors/daniil-karnakov${request ? '/request' : ''}${search}`} replace />;
  const tutor = tutors.find(tutor => tutor.id === tutorId);
  if (!tutor) return <EmptyTutor />;
  return request ? <LessonRequestForm key={tutor.id} tutor={tutor} onSubmitted={onSubmitted} /> : <Profile tutor={tutor} />;
}
export default function Tutors() {
  // Keep only the service receipt in memory, never the applicant's personal data.
  const [receipt, setReceipt] = useState<SubmissionReceipt | null>(null);
  const navigate = useNavigate(); const { search } = useLocation();
  function submitted(next: SubmissionReceipt) { setReceipt(next); navigate(`/tutors/result${search}`); }
  return <div className="container tutors-page"><Routes>
    <Route index element={<Catalog />} />
    <Route path="become" element={<TeacherForm onSubmitted={submitted} />} />
    <Route path="result" element={<SubmissionResult receipt={receipt} />} />
    <Route path="prepared" element={<Navigate to="/tutors/result" replace />} />
    <Route path=":tutorId" element={<TutorRoute onSubmitted={submitted} />} />
    <Route path=":tutorId/request" element={<TutorRoute request onSubmitted={submitted} />} />
    <Route path="*" element={<EmptyTutor />} />
  </Routes></div>;
}
