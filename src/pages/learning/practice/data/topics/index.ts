import type { PracticeSituation } from '../categories';
import { workMaterials as work } from './work';
import { travelMaterials as travel } from './travel';
import { documentMaterials as documents } from './documents';
import { everydayMaterials as everyday } from './everyday';
import { shoppingMaterials as shopping } from './shopping';
import { housingMaterials as housing } from './housing';
import { bankingMaterials as banking } from './banking';
import { sportMaterials as sport } from './sport';
import { educationMaterials as education } from './education';

export const topicSituations: Record<string, readonly PracticeSituation[]> = {
  'job-interview': [
    { id: 'job-search', titleKey: 'topicJobSearch', material: work['job-search'] },
    { id: 'interview-preparation', titleKey: 'topicJobPreparation', material: work['interview-preparation'] },
    { id: 'employer-interview', titleKey: 'topicJobInterview', material: work['employer-interview'] },
    { id: 'first-working-day', titleKey: 'topicJobFirstDay', material: work['first-working-day'] },
    { id: 'workplace-communication', titleKey: 'topicJobCommunication', material: work['workplace-communication'] },
    { id: 'schedule-leave-sickness', titleKey: 'topicJobSchedule', material: work['schedule-leave-sickness'] },
  ],
  travel: [
    { id: 'buying-tickets', titleKey: 'topicTravelTickets', material: travel['buying-tickets'] },
    { id: 'station-train', titleKey: 'topicTravelTrain', material: travel['station-train'] },
    { id: 'airport-check-in', titleKey: 'topicTravelAirport', material: travel['airport-check-in'] },
    { id: 'hotel-check-in', titleKey: 'topicTravelHotel', material: travel['hotel-check-in'] },
    { id: 'asking-directions', titleKey: 'topicTravelDirections', material: travel['asking-directions'] },
    { id: 'travel-problems', titleKey: 'topicTravelProblems', material: travel['travel-problems'] },
  ],
  documents: [
    { id: 'residence-registration', titleKey: 'topicDocumentsResidence', material: documents['residence-registration'] },
    { id: 'authority-visit', titleKey: 'topicDocumentsAuthority', material: documents['authority-visit'] },
    { id: 'forms-applications', titleKey: 'topicDocumentsForms', material: documents['forms-applications'] },
    { id: 'visa-residence-permit', titleKey: 'topicDocumentsVisa', material: documents['visa-residence-permit'] },
    { id: 'official-correspondence', titleKey: 'topicDocumentsLetters', material: documents['official-correspondence'] },
    { id: 'document-collection-renewal', titleKey: 'topicDocumentsRenewal', material: documents['document-collection-renewal'] },
  ],
  'everyday-communication': [
    { id: 'introductions', titleKey: 'topicEverydayIntroduction', material: everyday.introductions },
    { id: 'about-yourself-interests', titleKey: 'topicEverydayInterests', material: everyday['about-yourself-interests'] },
    { id: 'talking-with-friends', titleKey: 'topicEverydayFriends', material: everyday['talking-with-friends'] },
    { id: 'invitations-meetings', titleKey: 'topicEverydayInvitations', material: everyday['invitations-meetings'] },
    { id: 'opinions-emotions', titleKey: 'topicEverydayOpinions', material: everyday['opinions-emotions'] },
    { id: 'misunderstandings-conflicts', titleKey: 'topicEverydayConflicts', material: everyday['misunderstandings-conflicts'] },
  ],
  shopping: [
    { id: 'supermarket', titleKey: 'topicShoppingSupermarket', material: shopping.supermarket },
    { id: 'clothes-fitting', titleKey: 'topicShoppingClothes', material: shopping['clothes-fitting'] },
    { id: 'prices-discounts', titleKey: 'topicShoppingPrices', material: shopping['prices-discounts'] },
    { id: 'checkout-payment', titleKey: 'topicShoppingCheckout', material: shopping['checkout-payment'] },
    { id: 'returns-exchanges', titleKey: 'topicShoppingReturns', material: shopping['returns-exchanges'] },
    { id: 'online-orders', titleKey: 'topicShoppingOnline', material: shopping['online-orders'] },
  ],
  housing: [
    { id: 'apartment-search', titleKey: 'topicHousingSearch', material: housing['apartment-search'] },
    { id: 'apartment-viewing', titleKey: 'topicHousingViewing', material: housing['apartment-viewing'] },
    { id: 'landlord-communication', titleKey: 'topicHousingLandlord', material: housing['landlord-communication'] },
    { id: 'lease-costs', titleKey: 'topicHousingLease', material: housing['lease-costs'] },
    { id: 'repairs-problems', titleKey: 'topicHousingRepairs', material: housing['repairs-problems'] },
    { id: 'moving-address-change', titleKey: 'topicHousingMoving', material: housing['moving-address-change'] },
  ],
  'banking-finance': [
    { id: 'open-account', titleKey: 'topicBankAccount', material: banking['open-account'] },
    { id: 'cards-atms', titleKey: 'topicBankCards', material: banking['cards-atms'] },
    { id: 'transfers-payments', titleKey: 'topicBankTransfers', material: banking['transfers-payments'] },
    { id: 'bills-debts', titleKey: 'topicBankBills', material: banking['bills-debts'] },
    { id: 'insurance-claims', titleKey: 'topicBankInsurance', material: banking['insurance-claims'] },
    { id: 'account-problems', titleKey: 'topicBankProblems', material: banking['account-problems'] },
  ],
  'sport-fitness': [
    { id: 'gym-membership', titleKey: 'topicSportMembership', material: sport['gym-membership'] },
    { id: 'workouts-exercises', titleKey: 'topicSportWorkouts', material: sport['workouts-exercises'] },
    { id: 'trainer-communication', titleKey: 'topicSportTrainer', material: sport['trainer-communication'] },
    { id: 'competitions', titleKey: 'topicSportCompetitions', material: sport.competitions },
    { id: 'injuries-recovery', titleKey: 'topicSportInjuries', material: sport['injuries-recovery'] },
    { id: 'nutrition-goals', titleKey: 'topicSportNutrition', material: sport['nutrition-goals'] },
  ],
  'education-learning': [
    { id: 'choosing-programme', titleKey: 'topicEducationProgramme', material: education['choosing-programme'] },
    { id: 'admission-registration', titleKey: 'topicEducationAdmission', material: education['admission-registration'] },
    { id: 'teacher-communication', titleKey: 'topicEducationTeacher', material: education['teacher-communication'] },
    { id: 'classes-homework', titleKey: 'topicEducationHomework', material: education['classes-homework'] },
    { id: 'exams-grades', titleKey: 'topicEducationExams', material: education['exams-grades'] },
    { id: 'certificates-completion', titleKey: 'topicEducationCertificates', material: education['certificates-completion'] },
  ],
};
