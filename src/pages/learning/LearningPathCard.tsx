import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '../../components/Icon';

interface LearningPathCardProps {
  id: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  icon: 'globe' | 'book';
  to: string;
  action: string;
  children: ReactNode;
}

export function LearningPathCard({ id, title, description, image, imageAlt, icon, to, action, children }: LearningPathCardProps) {
  return <article className="learning-path-card" aria-labelledby={id}>
    <img className="learning-path-photo" src={image} alt={imageAlt} width="1683" height="935" />
    <div className="learning-path-body">
      <div className="learning-path-heading"><span className="learning-path-icon"><Icon name={icon} /></span><h3 id={id}>{title}</h3></div>
      <p className="learning-path-description">{description}</p>
      {children}
      <Link className="button button-primary learning-path-cta" to={to}>{action}<Icon name="arrow" /></Link>
    </div>
  </article>;
}
