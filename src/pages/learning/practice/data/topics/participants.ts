import { translation as tr } from '../types';
import type { ParticipantPair } from './authoring';

export const participants = {
  applicant: [tr('Соискатель', 'Bewerber/in', 'Applicant'), tr('Работодатель', 'Arbeitgeber/in', 'Employer')],
  careers: [tr('Соискатель', 'Bewerber/in', 'Applicant'), tr('Консультант', 'Beratung', 'Adviser')],
  colleague: [tr('Сотрудник', 'Mitarbeiter/in', 'Employee'), tr('Коллега', 'Kollegin / Kollege', 'Colleague')],
  manager: [tr('Сотрудник', 'Mitarbeiter/in', 'Employee'), tr('Руководитель', 'Vorgesetzte/r', 'Manager')],
  traveller: [tr('Путешественник', 'Reisende/r', 'Traveller'), tr('Сотрудник', 'Mitarbeiter/in', 'Staff member')],
  hotel: [tr('Гость', 'Gast', 'Guest'), tr('Администратор', 'Rezeption', 'Receptionist')],
  directions: [tr('Путешественник', 'Reisende/r', 'Traveller'), tr('Прохожий', 'Passant/in', 'Passer-by')],
  official: [tr('Посетитель', 'Besucher/in', 'Visitor'), tr('Сотрудник учреждения', 'Sachbearbeitung', 'Official')],
  friends: [tr('Собеседник 1', 'Person 1', 'Person 1'), tr('Собеседник 2', 'Person 2', 'Person 2')],
  shop: [tr('Покупатель', 'Kundin / Kunde', 'Customer'), tr('Продавец', 'Verkäufer/in', 'Shop assistant')],
  support: [tr('Клиент', 'Kundin / Kunde', 'Customer'), tr('Служба поддержки', 'Kundendienst', 'Customer support')],
  housing: [tr('Жилец', 'Mieter/in', 'Tenant'), tr('Арендодатель', 'Vermieter/in', 'Landlord')],
  bank: [tr('Клиент', 'Kundin / Kunde', 'Customer'), tr('Сотрудник банка', 'Bankmitarbeiter/in', 'Bank employee')],
  insurance: [tr('Клиент', 'Kundin / Kunde', 'Customer'), tr('Страховой консультант', 'Versicherungsberatung', 'Insurance adviser')],
  trainer: [tr('Посетитель', 'Teilnehmer/in', 'Participant'), tr('Тренер', 'Trainer/in', 'Trainer')],
  club: [tr('Посетитель', 'Interessent/in', 'Visitor'), tr('Сотрудник клуба', 'Clubmitarbeiter/in', 'Club staff')],
  medical: [tr('Спортсмен', 'Sportler/in', 'Athlete'), tr('Врач', 'Ärztin / Arzt', 'Doctor')],
  school: [tr('Учащийся', 'Lernende/r', 'Student'), tr('Учебный отдел', 'Schulsekretariat', 'School office')],
  teacher: [tr('Учащийся', 'Lernende/r', 'Student'), tr('Преподаватель', 'Lehrperson', 'Teacher')],
} as const satisfies Record<string, ParticipantPair>;
